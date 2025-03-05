import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface StartupFormData {
  name: string;
  url: string;
  socialHandle: string;
  description: string;
  logo: FileList;
}

interface SubmittedStartup {
  name: string;
  url: string;
  socialHandle: string;
  description: string;
  logoUrl: string;
  submittedAt: Date;
  scheduledLaunchDate?: Date;
  status: string;
}

interface UserProfile {
  displayName: string;
  username: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileFormData {
  displayName: string;
  username: string;
  email: string;
  bio: string;
}

export function ProfilePage() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submittedStartup, setSubmittedStartup] = useState<SubmittedStartup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<StartupFormData>();
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors }, setValue, watch: watchProfile } = useForm<ProfileFormData>();

  // Watch username field for availability check
  const watchUsername = watchProfile('username');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const checkUsername = async (username: string) => {
      if (!username || username === userProfile?.username) {
        setUsernameAvailable(null);
        return;
      }

      if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameAvailable(false);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
        setUsernameAvailable(!usernameDoc.exists());
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    if (watchUsername && watchUsername !== userProfile?.username) {
      clearTimeout(timeout);
      timeout = setTimeout(() => checkUsername(watchUsername), 500);
    }

    return () => clearTimeout(timeout);
  }, [watchUsername, userProfile?.username]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data() as UserProfile;
          setUserProfile(profileData);
          
          // Set form values
          setValue('displayName', profileData.displayName);
          setValue('username', profileData.username);
          setValue('email', profileData.email);
          setValue('bio', profileData.bio || '');
        }

        // Fetch startup data
        const startupDoc = await getDoc(doc(db, 'startups', user.uid));
        if (startupDoc.exists()) {
          const data = startupDoc.data();
          setSubmittedStartup({
            name: data.name,
            url: data.url,
            socialHandle: data.socialHandle,
            description: data.description,
            logoUrl: data.logoUrl,
            submittedAt: data.createdAt.toDate(),
            scheduledLaunchDate: data.scheduledLaunchDate?.toDate(),
            status: data.status
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, toast, setValue]);

  const handleProfileUpdate = async (formData: ProfileFormData) => {
    if (!user || !userProfile) return;

    if (!usernameAvailable && formData.username !== userProfile.username) {
      toast({
        title: 'Error',
        description: 'Username is not available',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update username in the usernames collection if changed
      if (formData.username !== userProfile.username) {
        // Remove old username
        await setDoc(doc(db, 'usernames', userProfile.username.toLowerCase()), { uid: null });
        // Add new username
        await setDoc(doc(db, 'usernames', formData.username.toLowerCase()), { uid: user.uid });
      }

      // Update user profile
      const updatedProfile = {
        ...userProfile,
        displayName: formData.displayName,
        username: formData.username.toLowerCase(),
        email: formData.email,
        bio: formData.bio,
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile);
      setUserProfile(updatedProfile);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{userProfile?.displayName}</CardTitle>
                <CardDescription>@{userProfile?.username}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <form onSubmit={handleSubmitProfile(handleProfileUpdate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    {...registerProfile('displayName', { required: 'Display name is required' })}
                  />
                  {profileErrors.displayName && (
                    <p className="text-sm text-destructive">{profileErrors.displayName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      {...registerProfile('username', {
                        required: 'Username is required',
                        pattern: {
                          value: /^[a-zA-Z0-9_]{3,20}$/,
                          message: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
                        }
                      })}
                    />
                    {watchUsername && watchUsername !== userProfile?.username && (
                      <div className="absolute right-2 top-2">
                        {isCheckingUsername ? (
                          <Badge variant="secondary">Checking...</Badge>
                        ) : usernameAvailable === true ? (
                          <Badge variant="success">Available</Badge>
                        ) : usernameAvailable === false ? (
                          <Badge variant="destructive">Not available</Badge>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {profileErrors.username && (
                    <p className="text-sm text-destructive">{profileErrors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerProfile('email', { required: 'Email is required' })}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-destructive">{profileErrors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...registerProfile('bio')}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || (watchUsername !== userProfile?.username && !usernameAvailable)}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {userProfile?.bio ? (
                  <div>
                    <Label>Bio</Label>
                    <p className="text-muted-foreground">{userProfile.bio}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No bio provided</p>
                )}
                <div>
                  <Label>Member since</Label>
                  <p className="text-muted-foreground">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

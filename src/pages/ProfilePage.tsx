import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileFormData {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  avatar?: FileList;
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
  const [usernameError, setUsernameError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<StartupFormData>();
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors }, setValue } = useForm<ProfileFormData>();

  const validateUsername = async (username: string) => {
    if (username === userProfile?.username) return true;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
    }
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
    if (usernameDoc.exists()) {
      return 'Username is already taken';
    }
    return true;
  };

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

    setIsSubmitting(true);
    setUsernameError('');

    try {
      // Validate username
      const usernameValidation = await validateUsername(formData.username);
      if (typeof usernameValidation === 'string') {
        setUsernameError(usernameValidation);
        return;
      }

      let avatarUrl = userProfile.avatarUrl;

      // Handle avatar upload if a new file is selected
      if (formData.avatar?.length > 0) {
        const file = formData.avatar[0];
        if (file.size > 500 * 1024) {
          throw new Error('Avatar file size must be less than 500KB');
        }

        const fileExtension = file.name.split('.').pop();
        const fileName = `avatars/${user.uid}-${Date.now()}.${fileExtension}`;
        const avatarRef = ref(storage, fileName);
        await uploadBytes(avatarRef, file);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      // Update username in the usernames collection
      if (formData.username !== userProfile.username) {
        // Remove old username
        await setDoc(doc(db, 'usernames', userProfile.username), { uid: null }, { merge: true });
        // Add new username
        await setDoc(doc(db, 'usernames', formData.username), { uid: user.uid });
      }

      // Update user profile
      const updatedProfile = {
        ...userProfile,
        displayName: formData.displayName,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatarUrl,
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

  const calculateNextLaunchDate = () => {
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(0, 0, 0, 0);
    
    if (now.getDay() > 3) {
      nextSunday.setDate(nextSunday.getDate() + 7);
    }
    
    return nextSunday;
  };

  const onSubmit = async (data: StartupFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const file = data.logo[0];
      if (!file) {
        throw new Error('Please select a logo file');
      }

      if (file.size > 200 * 1024) {
        throw new Error('Logo file size must be less than 200KB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Logo must be an image file');
      }

      const fileExtension = file.name.split('.').pop();
      const fileName = `startup-logos/${user.uid}-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      const uploadResult = await uploadBytes(storageRef, file);
      const logoUrl = await getDownloadURL(uploadResult.ref);

      const scheduledLaunchDate = calculateNextLaunchDate();
      const startupRef = doc(db, 'startups', user.uid);
      const timestamp = serverTimestamp();
      const startupData = {
        name: data.name,
        url: data.url,
        socialHandle: data.socialHandle,
        description: data.description,
        logoUrl,
        userId: user.uid,
        createdAt: timestamp,
        scheduledLaunchDate,
        status: 'pending',
        updatedAt: timestamp
      };

      await setDoc(startupRef, startupData);

      setSubmittedStartup({
        ...startupData,
        submittedAt: new Date(),
        scheduledLaunchDate,
        status: 'pending'
      });

      toast({
        title: 'Success!',
        description: `Your startup has been submitted and scheduled to launch on ${scheduledLaunchDate.toLocaleDateString()}`,
      });

      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting startup:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit startup. Please try again.',
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
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {userProfile?.avatarUrl ? (
                    <AvatarImage src={userProfile.avatarUrl} alt={userProfile.displayName} />
                  ) : (
                    <AvatarFallback>
                      {userProfile?.displayName?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{userProfile?.displayName}</CardTitle>
                  <CardDescription>@{userProfile?.username}</CardDescription>
                </div>
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
                  {(profileErrors.username || usernameError) && (
                    <p className="text-sm text-destructive">
                      {profileErrors.username?.message || usernameError}
                    </p>
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

                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    {...registerProfile('avatar')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 500KB
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
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

        {submittedStartup && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Your Latest Submission</CardTitle>
              <CardDescription>
                Submitted on {submittedStartup.submittedAt.toLocaleString()}
                {submittedStartup.scheduledLaunchDate && (
                  <span className="block text-primary">
                    Scheduled to launch on {submittedStartup.scheduledLaunchDate.toLocaleDateString()}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img 
                  src={submittedStartup.logoUrl} 
                  alt={submittedStartup.name} 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{submittedStartup.name}</h3>
                  <a 
                    href={submittedStartup.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {submittedStartup.url}
                  </a>
                  <p className="text-muted-foreground mt-2">{submittedStartup.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Social Handle: {submittedStartup.socialHandle}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Status: <span className="font-medium text-primary capitalize">{submittedStartup.status}</span>
                </p>
                <p className="text-sm mt-2">
                  We'll review your submission and get back to you soon.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto">
              Submit Your Startup
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Your Startup</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit your startup for review.
                Your startup will be scheduled for the next available weekly launch.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Startup Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Startup name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  {...register('url', { 
                    required: 'Website URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL starting with http:// or https://'
                    }
                  })}
                />
                {errors.url && (
                  <p className="text-sm text-destructive">{errors.url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialHandle">Social Media Handle</Label>
                <Input
                  id="socialHandle"
                  {...register('socialHandle', { required: 'Social media handle is required' })}
                />
                {errors.socialHandle && (
                  <p className="text-sm text-destructive">{errors.socialHandle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  {...register('description', { 
                    required: 'Description is required',
                    maxLength: {
                      value: 200,
                      message: 'Description must be less than 200 characters'
                    }
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo (Max 200KB)</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  {...register('logo', { 
                    required: 'Logo is required',
                    validate: {
                      fileSize: (files) => 
                        !files[0] || files[0].size <= 200 * 1024 || 
                        'Logo must be less than 200KB',
                      fileType: (files) =>
                        !files[0] || files[0].type.startsWith('image/') ||
                        'Logo must be an image file'
                    }
                  })}
                />
                {errors.logo && (
                  <p className="text-sm text-destructive">{errors.logo.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

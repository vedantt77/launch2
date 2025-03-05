import { TwitterIcon, LinkedinIcon, GithubIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Startup } from '@/lib/types';

interface StartupContactProps {
  socialLinks: Startup['socialLinks'];
}

export function StartupContact({ socialLinks }: StartupContactProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">📱Socials</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {socialLinks.twitter && (
            <Button variant="outline" className="w-full" asChild>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="h-4 w-4 mr-2" />
                Twitter
              </a>
            </Button>
          )}
          {socialLinks.linkedin && (
            <Button variant="outline" className="w-full" asChild>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          )}
          {socialLinks.github && (
            <Button variant="outline" className="w-full" asChild>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {socialLinks.bluesky && (
            <Button variant="outline" className="w-full" asChild>
              <a href={socialLinks.bluesky} target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2l2.2 6.6h6.8l-5.5 4 2.1 6.7-5.5-4-5.5 4 2.1-6.7-5.5-4h6.8L12 2z"
                  />
                </svg>
                Bluesky
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

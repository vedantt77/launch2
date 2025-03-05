import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StartupNewsletter() {
  return (
    <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <h2 className="text-2xl font-bold mb-4">💌Join Our Newsletter</h2>
      <p className="text-muted-foreground mb-6">
        Get bi-weekly insights about successful startups, founder stories, and growth strategies.
      </p>
      <Button size="lg" asChild>
        <a 
          href="https://startupsad.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg"
        >
          🥳 Subscribe Now
        </a>
      </Button>
    </Card>
  );
}
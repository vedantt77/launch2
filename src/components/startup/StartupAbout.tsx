import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface StartupAboutProps {
  description: string;
}

export function StartupAbout({ description }: StartupAboutProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">📝About</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
import { Launch } from '@/lib/types/launch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface LaunchCardProps {
  launch: Launch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={launch.logo}
            alt={launch.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{launch.name}</h3>
            <Badge variant="secondary">{launch.category}</Badge>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{launch.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Launched on {new Date(launch.launchDate).toLocaleDateString()}
          </span>
          <Button size="sm" asChild>
            <a href={launch.website} target="_blank" rel="noopener noreferrer">
              Visit <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { formatMRR } from '@/lib/utils';
import { StartupName } from './StartupName';

interface StartupHeaderProps {
  name: string;
  logo: string;
  shortDescription: string;
  mrr: number;
  website: string;
  isVerified?: boolean;
}

export function StartupHeader({ name, logo, shortDescription, mrr, website, isVerified }: StartupHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
          src={logo}
          alt={name}
          className="w-16 h-16 rounded-lg object-cover"
          loading="eager"
          decoding="async"
          width="64"
          height="64"
        />
        <div className="flex-1">
          <StartupName 
            name={name}
            isVerified={isVerified}
            size="lg"
          />
          <p className="text-muted-foreground mt-1">{shortDescription}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge variant="success" className="text-base sm:text-lg font-bold whitespace-nowrap">
            {formatMRR(mrr)}
          </Badge>
          <Button size="sm" asChild>
            <a href={website} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

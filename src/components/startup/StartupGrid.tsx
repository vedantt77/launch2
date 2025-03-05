import { StartupCard } from '@/components/StartupCard';
import type { Startup } from '@/lib/types';

interface StartupGridProps {
  startups: Startup[];
}

export function StartupGrid({ startups }: StartupGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
}
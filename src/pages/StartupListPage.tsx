import { useEffect, useState } from 'react';
import { getStartups } from '@/lib/startup-store';
import { useStartupSearch } from '@/lib/hooks/useStartupSearch';
import { HomeHero } from '@/components/hero/HomeHero';
import { SearchBar } from '@/components/search/SearchBar';
import { StartupGrid } from '@/components/startup/StartupGrid';

import type { Startup } from '@/lib/types';

export function StartupListPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const { searchQuery, setSearchQuery, filteredStartups } = useStartupSearch(startups);

  useEffect(() => {
    setStartups(getStartups());
  }, []);

  return (
    <div>
      <HomeHero />
      
      <div className="container mx-auto px-4 py-12">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        <StartupGrid startups={filteredStartups} />
      </div>
    </div>
  );
}
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-xl mx-auto mb-12">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="search"
        placeholder="Search startups by name, description, or category..."
        className="pl-10 h-12"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
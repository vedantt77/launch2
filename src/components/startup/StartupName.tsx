import { VerifiedBadge } from "@/components/ui/verified-badge";

interface StartupNameProps {
  name: string;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StartupName({ name, isVerified, size = 'md', className }: StartupNameProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${textSizes[size]} font-bold ${className}`}>{name}</span>
      {isVerified && <VerifiedBadge size={size} className="flex-shrink-0" />}
    </div>
  );
}
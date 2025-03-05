import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StartupDetail } from '@/components/StartupDetail';
import { getStartupById } from '@/lib/startup-store';
import type { Startup } from '@/lib/types';

export function StartupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const data = getStartupById(id);
    if (!data) {
      navigate('/');
      return;
    }

    setStartup(data);
  }, [id, navigate]);

  useEffect(() => {
    if (startup) {
      const formattedMRR = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(startup.mrr);
      document.title = `How ${startup.name} earns ${formattedMRR} - startups.ad`;
    } else {
      document.title = 'Startup Details';
    }
  }, [startup]);

  if (!startup) {
    return null;
  }

  return <StartupDetail startup={startup} />;
}

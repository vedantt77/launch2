import { motion } from 'framer-motion';
import type { Startup } from '@/lib/types';
import { StartupHeader } from './startup/StartupHeader';
import { StartupAbout } from './startup/StartupAbout';
import { StartupMetrics } from './startup/StartupMetrics';
import { StartupContact } from './startup/StartupContact';
import { StartupNewsletter } from './startup/StartupNewsletter';

interface StartupDetailProps {
  startup: Startup;
}

export function StartupDetail({ startup }: StartupDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <StartupHeader
          name={startup.name}
          logo={startup.logo}
          shortDescription={startup.shortDescription}
          mrr={startup.metrics.mrr}
          website={startup.website}
          isVerified={startup.isVerified}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <StartupAbout description={startup.longDescription} />
            
            <StartupMetrics
              mrr={startup.metrics.mrr}
              launchedIn={startup.metrics.launchedIn}
              founder={startup.metrics.founders}
              funding={startup.metrics.funding}
              monetisation={startup.metrics.monetisation}
              commitment={startup.metrics.commitment}
            />
            
            <StartupContact
              socialLinks={startup.socialLinks}
            />
          </div>

          <div className="space-y-6">
            <StartupNewsletter />
          </div>
        </div>

        
      </motion.div>
    </div>
  );
}
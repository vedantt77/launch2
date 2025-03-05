import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Startup } from '@/lib/types';
import { formatMRR } from '@/lib/utils';
import { StartupName } from '@/components/startup/StartupName';

interface StartupCardProps {
  startup: Startup;
}

export function StartupCard({ startup }: StartupCardProps) {
  return (
    <Link to={`/startup/${startup.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-accent/5">
          <motion.div 
            className="relative"
            whileHover={{ filter: 'brightness(1.1)' }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={startup.cardImage}
              alt={startup.name}
              className="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
              width="100%"
              height="192"
            />
            <motion.div 
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Badge variant="success" className="text-sm font-bold shadow-lg">
                {formatMRR(startup.metrics.mrr)}
              </Badge>
            </motion.div>
          </motion.div>
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="mb-2 hover:bg-primary/20 transition-colors">{startup.category}</Badge>
            </motion.div>
            <motion.div 
              className="mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StartupName 
                name={startup.name}
                isVerified={startup.isVerified}
                size="sm"
              />
            </motion.div>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {startup.shortDescription}
            </motion.p>
            <motion.div 
              className="mt-4 flex items-center text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span>{startup.location}</span>
              <span className="mx-2">•</span>
              <span>Founded {startup.foundedDate}</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

import { motion } from 'framer-motion';

export function HomeHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      className="bg-background py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          variants={itemVariants}
        >
          Curated list of{' '}
          <motion.span 
            className="text-green-500"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            money making
          </motion.span>{' '}
          startups💸
        </motion.h1>
        
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          💌 Join our newsletter to receive free case studies, startup ideas, and insightful interviews with startup founders twice a week
        </motion.p>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="https://startupsad.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            🥳 Join our newsletter
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}

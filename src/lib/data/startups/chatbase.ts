import { Startup } from '@/lib/types';

export const chatbase: Startup = {
  id: 'chatbase',
  name: 'Chatbase',
  logo: '/images/chatbase_co_logo.jpg',
  cardImage: '/images/chatbase ss.jpeg', // Updated path with leading slash
  shortDescription: 'Chatbase is a platform that allows users to create, train, and deploy AI chatbots.',
  mrr: 250000,
  category: 'AI',
  foundedDate: '2023',
  location: 'Toronto, Ontario',
  website: 'https://www.chatbase.co/',
  isVerified: false,
  longDescription: 'Chatbase is a platform that allows users to create, train, and deploy AI chatbots powered by large language models. It offers tools to customize chatbot behavior, integrate with various applications, and analyze performance using advanced analytics. Chatbase is ideal for businesses and developers looking to streamline customer support, enhance user engagement, or build conversational AI experiences.',
 
  metrics: {
    mrr: 250000,
    launchedIn: '2023',
    founders: 'Yasser',
    funding: 'Bootstrapped',
    monetisation: 'Subscription',
    commitment: 'Full-time'
  },
  socialLinks: {
    twitter: 'https://x.com/yasser_elsaid_',
    linkedin: 'https://www.linkedin.com/in/yasserelsaid/',
    
  },
};
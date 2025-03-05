import { Startup } from '@/lib/types';

export const writeas: Startup = {
  id: 'writeas',
  name: 'Writeas',
  logo: '/images/write_as_logo.jpg',
  cardImage: '/images/writeas ss.jpeg', // Updated path with leading slash
  shortDescription: 'Write.as is a minimalist writing platform designed for distraction-free blogging and note-taking.',
  mrr: 10000,
  category: 'SaaS',
  foundedDate: '2015',
  location: 'Brooklyn, NY',
  website: 'https://write.as/',
  isVerified: false,
  longDescription: 'Write.as is a minimalist writing platform designed for distraction-free blogging and note-taking. It allows users to focus on their writing by offering a clean, uncluttered interface. Content can be published anonymously or under a user profile, making it ideal for those seeking privacy or simplicity. Write.as supports Markdown formatting and ensures a seamless writing and sharing experience without unnecessary bells and whistles.',
 
  metrics: {
    mrr: 10000,
    launchedIn: '2015',
    founders: 'Matt Bear',
    funding: 'Bootstrapped',
    monetisation: 'Subscription',
    commitment: 'Full-time'
  },
  socialLinks: {
    twitter: 'https://x.com/ilikebeans',
    linkedin: 'https://www.linkedin.com/in/thebaer/',
    
  },
};
import { Startup } from '@/lib/types';

export const legitcheck: Startup = {
  id: 'legitcheck',
  name: 'Legitcheck',
  logo: '/images/legit_check_logo.jpg',
  cardImage: 'images/legitcheck ss.jpeg', // Updated path with leading slash
  shortDescription: 'Platform dedicated to verifying the authenticity of luxury items',
  mrr: 20000,
  category: 'Service',
  foundedDate: '2021',
  location: 'London,Uk',
  website: 'https://legitcheck.app/',
  isVerified: false,
  longDescription: 'LegitCheck.app is a platform dedicated to verifying the authenticity of luxury items, sneakers, streetwear, and other collectibles. It offers detailed guides, authentication services, and resources to help users identify counterfeit products and ensure their purchases are genuine.',
 
  metrics: {
    mrr: 20000,
    launchedIn: '2021',
    founders: 'Ch Daniel & David Ch',
    funding: 'Bootstrapped',
    monetisation: 'One-time payment',
    commitment: 'Part-time'
  },
  socialLinks: {
    twitter: 'https://x.com/chddaniel?lang=en',
    linkedin: 'https://www.linkedin.com/in/chddaniel/',
    
  },
};
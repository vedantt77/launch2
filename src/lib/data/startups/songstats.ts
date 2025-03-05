import { Startup } from '@/lib/types';

export const songstats: Startup = {
  id: 'songstats',
  name: 'Songstats',
  logo: '/images/songstats_logo.jpg',
  cardImage: 'images/songstats ss.jpeg', // Updated path with leading slash
  shortDescription: 'A real-time music analytics platform designed for artists, labels, and industry professionals',
  mrr: 20000,
  category: 'SaaS',
  foundedDate: '2019',
  location: 'Bali, Indonesia',
  website: 'https://songstats.com/welcome',
  isVerified: false,
  longDescription: 'Songstats is a real-time music analytics platform designed for artists, labels, and industry professionals. It provides comprehensive insights into streaming performance, playlist placements, and audience engagement across platforms like Spotify, Apple Music, and YouTube. Songstats helps users track their musics impact, identify growth opportunities, and make data-driven decisions to enhance their reach and success.',
 
  metrics: {
    mrr: 20000,
    launchedIn: '2019',
    founders: 'Oskar Eichler',
    funding: 'Bootstrapped',
    monetisation: 'Subscription',
    commitment: 'Full-time'
  },
  socialLinks: {
    twitter: 'https://x.com/Styline',
    linkedin: 'https://www.linkedin.com/in/oskareichler/?originalSubdomain=id',
    
  },
};
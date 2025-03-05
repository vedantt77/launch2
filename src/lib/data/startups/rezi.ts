import { Startup } from '@/lib/types';

export const rezi: Startup = {
  id: 'rezi',
  name: 'Rezi',
  logo: '/images/reziresume_logo.jpg',
  cardImage: '/images/rezi ss.jpeg', // Updated path with leading slash
  shortDescription: 'AI-powered platform that helps users create optimized, job-specific resumes quickly and effectively.',
  mrr: 225000,
  category: 'AI',
  foundedDate: '2015',
  location: 'Seoul, South Korea',
  website: 'https://www.rezi.ai/',
  isVerified: false,
  longDescription: 'Rezi.ai is an AI-powered platform that helps users create optimized, job-specific resumes quickly and effectively. It uses advanced algorithms to tailor resumes to meet ATS (Applicant Tracking System) requirements, ensuring higher visibility and better chances of landing interviews.',
 
  metrics: {
    mrr: 225000,
    launchedIn: '2015',
    founders: 'Jacob Jacquet',
    funding: 'Bootstrapped',
    monetisation: 'Subscription',
    commitment: 'Full-time'
  },
  socialLinks: {
    twitter: 'https://x.com/jacob_jacquet',
    linkedin: 'https://www.linkedin.com/in/jacobjacquet/',
    
  },
};
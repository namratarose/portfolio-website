/**
 * OrbitOS Portfolio — Site Configuration
 */

import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: 'Namrata Kesarwani',
  title: 'Namrata Kesarwani — Backend Engineer',
  description:
    'Backend Software Engineer building distributed systems, AI data pipelines, and secure microservices.',
  url: 'https://namrata-kesarwani-portfolio.vercel.app',
  ogImage: 'https://namrata-kesarwani-portfolio.vercel.app/og.png',
  author: {
    name: 'Namrata Kesarwani',
    role: 'Backend Software Engineer',
    email: 'namrata.kesar10@gmail.com',
    location: 'Bangalore, India',
    phone: '+91 9140823891',
    bio: 'Backend engineer about a year into my career at KGeN, working on microservices, AI data pipelines, and OAuth security in Go, NestJS, and AWS. Still early in the journey and genuinely love learning — every project teaches me something new.',
    taglines: [
      'Backend Engineer',
      'Go · NestJS · AWS',
      'AI Data Pipelines',
      'Always Learning',
    ],
    education: {
      degree: 'B.Tech, Computer Science and Engineering',
      institution: 'Dr. APJ Abdul Kalam Technical University, Lucknow',
      period: '2021 – 2025',
      cgpa: '8.54 / 10',
    },
  },
  social: {
    github: 'https://github.com/namratakesarwani',
    linkedin: 'https://linkedin.com/in/namrata-kesarwani',
    email: 'mailto:namrata.kesar10@gmail.com',
  },
  keywords: [
    'Backend Engineer',
    'Go',
    'NestJS',
    'AWS',
    'DynamoDB',
    'Redis',
    'Microservices',
    'TypeScript',
    'Python',
  ],
  themeColor: '#7C5CFF',
};

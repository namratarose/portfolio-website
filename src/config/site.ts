/**
 * OrbitOS Portfolio — Site Configuration
 */

import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: 'Namrata Kesarwani',
  title: 'Namrata Kesarwani — Backend Engineer',
  description:
    'Backend Software Engineer building distributed systems, AI data pipelines, and secure microservices.',
  url: 'https://namrata.dev',
  ogImage: 'https://namrata.dev/og.png',
  author: {
    name: 'Namrata Kesarwani',
    role: 'Backend Software Engineer',
    email: 'namrata.kesar10@gmail.com',
    location: 'Bangalore, India',
    phone: '+91 9140823891',
    bio: 'Backend Software Engineer with 1+ years building distributed microservices, AI-powered data pipelines, and secure OAuth workflows at KGeN. I turn complex engineering problems into elegant systems.',
    taglines: [
      'Backend Engineer',
      'Systems Architect',
      'AWS Infrastructure',
      'Distributed Systems',
      'AI Pipeline Engineer',
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

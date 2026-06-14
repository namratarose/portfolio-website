/**
 * OrbitOS Portfolio — Personal Data Configuration
 */

import type {
  Experience,
  Skill,
  SkillCategory,
  Project,
  EducationEntry,
  SocialLink,
} from '../types';

// ─── Education ────────────────────────────────────────────────────────────────

export const education: EducationEntry = {
  degree: 'B.Tech, Computer Science and Engineering',
  institution: 'Dr. APJ Abdul Kalam Technical University, Lucknow',
  period: '2021 – 2025',
  cgpa: '8.54 / 10',
};

// ─── Social Links ─────────────────────────────────────────────────────────────

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/namratakesarwani',
    icon: 'github',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/namrata-kesarwani',
    icon: 'linkedin',
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:namrata.kesar10@gmail.com',
    icon: 'mail',
    external: false,
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
  {
    id: 'kgen-sde1',
    company: 'KGeN',
    role: 'SDE-1 Backend',
    startDate: '2025-06-01',
    endDate: 'Present',
    location: 'Bangalore, India',
    description:
      'Full-time backend engineer building AI-assisted data pipelines, microservices, and infrastructure tooling at KGeN.',
    techStack: ['Go', 'NestJS', 'AWS', 'DynamoDB', 'S3', 'Redis', 'PostgreSQL', 'OpenAI GPT-4o', 'Sarvam AI', 'AWS Glue'],
    companyUrl: 'https://kgen.io',
    achievements: [
      {
        id: 'sarvam-ai-integration',
        title: 'Sarvam AI Integration',
        description:
          'Integrated Sarvam AI into the annotation pipeline, automating audio transcription and labelling workflows across multiple Indian-language datasets.',
        metric: '40-60% reduction in manual annotation effort',
        type: 'integration',
        tags: ['Go', 'Sarvam AI', 'S3', 'AI'],
      },
      {
        id: 'poe-card-system',
        title: 'Proof of Expertise Card System',
        description:
          'Built a Proof-of-Expertise card system with 6 REST APIs using Go, S3, DynamoDB, and OpenAI GPT-4o for content enrichment.',
        metric: '6 production REST APIs',
        type: 'feature',
        tags: ['Go', 'DynamoDB', 'S3', 'OpenAI GPT-4o'],
      },
      {
        id: 'redis-distributed-locking',
        title: 'Redis Distributed Locking for OAuth',
        description:
          'Implemented Redis-based distributed locking to eliminate race conditions in concurrent OAuth flows (Google, Apple, Discord), protecting 100k+ user accounts.',
        metric: 'Eliminated race conditions for 100k+ users',
        type: 'security',
        tags: ['NestJS', 'Redis', 'OAuth', 'Google', 'Apple', 'Discord'],
      },
      {
        id: 'project-association-service',
        title: 'Project Association Service',
        description:
          'Built a multilingual project-association microservice in Go with PostgreSQL, supporting parallel annotation tracks in 5+ Indian languages.',
        metric: '5+ Indian languages supported',
        type: 'feature',
        tags: ['Go', 'PostgreSQL', 'Microservices', 'Localization'],
      },
      {
        id: 's3-audio-ingestion',
        title: 'S3 Audio Ingestion Pipeline',
        description:
          'Engineered an automated S3 audio ingestion pipeline that processes and catalogues datasets for downstream AI training.',
        metric: '100+ datasets automated',
        type: 'infrastructure',
        tags: ['Go', 'S3', 'AWS', 'Pipelines'],
      },
      {
        id: 'aws-glue-etl',
        title: 'AWS Glue ETL Pipeline',
        description:
          'Developed an AWS Glue ETL pipeline for daily batch processing of annotation records, enabling downstream analytics and model training.',
        metric: '1.5–2 lakh records processed per day',
        type: 'infrastructure',
        tags: ['AWS Glue', 'ETL', 'AWS', 'Data Engineering'],
      },
    ],
  },
  {
    id: 'kgen-intern',
    company: 'KGeN',
    role: 'Backend Developer Intern',
    startDate: '2024-07-01',
    endDate: '2025-05-31',
    location: 'Bangalore, India',
    description:
      'Backend engineering internship focused on microservice security, AI tooling migrations, concurrency optimisation, and platform localisation.',
    techStack: ['NestJS', 'Go', 'Python', 'Redis', 'DynamoDB', 'JWT', 'AWS Lambda', 'GCP'],
    companyUrl: 'https://kgen.io',
    achievements: [
      {
        id: 'llm-resume-parser-migration',
        title: 'LLM Resume Parser — GCP → AWS Lambda Migration',
        description:
          'Migrated an LLM-powered resume-parsing service from GCP to AWS Lambda, improving scalability, reducing cold-start latency, and aligning with the company-wide AWS strategy.',
        type: 'migration',
        tags: ['Python', 'AWS Lambda', 'OpenAI', 'GCP', 'Serverless'],
      },
      {
        id: 'proxy-auth-middleware',
        title: 'NestJS Proxy Auth Middleware',
        description:
          'Built a centralised proxy authentication middleware in NestJS acting as a gateway for 10+ microservices, enforcing JWT validation and DynamoDB device-whitelisting policies.',
        metric: '10+ microservices secured',
        type: 'security',
        tags: ['NestJS', 'JWT', 'DynamoDB', 'Microservices', 'API Gateway'],
      },
      {
        id: 'nft-concurrency',
        title: 'NFT Service Concurrency + Redis Caching',
        description:
          'Improved an NFT processing service with Go goroutine concurrency and Redis caching, reducing latency for minting and lookups.',
        metric: '30-50% performance improvement',
        type: 'performance',
        tags: ['Go', 'Redis', 'Concurrency', 'NFT', 'Caching'],
      },
      {
        id: 'localization-system',
        title: 'Localization System with Translation Interceptors',
        description:
          'Designed and implemented a runtime localisation system using NestJS interceptors to transparently translate API responses, enabling multi-language support across the platform.',
        type: 'feature',
        tags: ['NestJS', 'Localization', 'Interceptors', 'i18n'],
      },
    ],
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skills: Skill[] = [
  // Languages
  { id: 'go', name: 'Go', category: 'languages', proficiency: 5, icon: 'go' },
  { id: 'typescript', name: 'TypeScript', category: 'languages', proficiency: 5, icon: 'typescript' },
  { id: 'python', name: 'Python', category: 'languages', proficiency: 4, icon: 'python' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', proficiency: 4, icon: 'javascript' },
  { id: 'java', name: 'Java', category: 'languages', proficiency: 3, icon: 'java' },
  { id: 'cpp', name: 'C/C++', category: 'languages', proficiency: 3, icon: 'cplusplus' },

  // Frameworks & APIs
  { id: 'nestjs', name: 'NestJS', category: 'frameworks', proficiency: 5, icon: 'nestjs' },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', proficiency: 4, icon: 'nodejs' },
  { id: 'expressjs', name: 'Express.js', category: 'frameworks', proficiency: 4, icon: 'express' },
  { id: 'rest-apis', name: 'REST APIs', category: 'frameworks', proficiency: 5, icon: 'api' },
  { id: 'microservices', name: 'Microservices', category: 'frameworks', proficiency: 5, icon: 'microservices' },
  { id: 'celery', name: 'Celery', category: 'frameworks', proficiency: 3, icon: 'celery' },
  { id: 'fastapi', name: 'FastAPI', category: 'frameworks', proficiency: 3, icon: 'fastapi' },

  // Databases & Caching
  { id: 'dynamodb', name: 'DynamoDB', category: 'databases', proficiency: 5, icon: 'dynamodb' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', proficiency: 4, icon: 'postgresql' },
  { id: 'redis', name: 'Redis', category: 'databases', proficiency: 5, icon: 'redis' },
  { id: 'mongodb', name: 'MongoDB', category: 'databases', proficiency: 3, icon: 'mongodb' },
  { id: 'mysql', name: 'MySQL', category: 'databases', proficiency: 3, icon: 'mysql' },

  // Cloud & DevOps
  { id: 'aws-lambda', name: 'AWS Lambda', category: 'cloud', proficiency: 5, icon: 'aws-lambda' },
  { id: 'aws-s3', name: 'AWS S3', category: 'cloud', proficiency: 5, icon: 'aws-s3' },
  { id: 'aws-eks', name: 'AWS EKS', category: 'cloud', proficiency: 4, icon: 'aws-eks' },
  { id: 'aws-cognito', name: 'AWS Cognito', category: 'cloud', proficiency: 4, icon: 'aws-cognito' },
  { id: 'aws-glue', name: 'AWS Glue', category: 'cloud', proficiency: 4, icon: 'aws-glue' },
  { id: 'aws-sqs-sns', name: 'AWS SQS/SNS', category: 'cloud', proficiency: 4, icon: 'aws-sqs' },
  { id: 'docker', name: 'Docker', category: 'cloud', proficiency: 4, icon: 'docker' },
  { id: 'jenkins', name: 'Jenkins', category: 'cloud', proficiency: 3, icon: 'jenkins' },
  { id: 'argocd', name: 'ArgoCD', category: 'cloud', proficiency: 3, icon: 'argocd' },

  // AI & Data
  { id: 'openai-gpt4o', name: 'OpenAI GPT-4o', category: 'ai', proficiency: 4, icon: 'openai' },
  { id: 'sarvam-ai', name: 'Sarvam AI', category: 'ai', proficiency: 4, icon: 'sarvam' },
  { id: 'speaker-diarization', name: 'Speaker Diarization', category: 'ai', proficiency: 3, icon: 'audio' },
  { id: 'etl-pipelines', name: 'ETL Pipelines', category: 'ai', proficiency: 4, icon: 'pipeline' },

  // Architecture
  { id: 'system-design', name: 'System Design', category: 'architecture', proficiency: 5, icon: 'diagram' },
  { id: 'distributed-systems', name: 'Distributed Systems', category: 'architecture', proficiency: 5, icon: 'distributed' },
];

/** Skills grouped into display categories */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    color: '#7C5CFF',
    ringColor: '#9B7DFF',
    skills: skills.filter((s) => s.category === 'languages'),
  },
  {
    id: 'frameworks',
    label: 'Frameworks & APIs',
    color: '#00D4FF',
    ringColor: '#33DEFF',
    skills: skills.filter((s) => s.category === 'frameworks'),
  },
  {
    id: 'databases',
    label: 'Databases & Caching',
    color: '#FF6B6B',
    ringColor: '#FF8E8E',
    skills: skills.filter((s) => s.category === 'databases'),
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    color: '#FFD166',
    ringColor: '#FFE08A',
    skills: skills.filter((s) => s.category === 'cloud'),
  },
  {
    id: 'ai',
    label: 'AI & Data',
    color: '#06D6A0',
    ringColor: '#33DFBA',
    skills: skills.filter((s) => s.category === 'ai'),
  },
  {
    id: 'architecture',
    label: 'Architecture',
    color: '#F77F00',
    ringColor: '#FFA040',
    skills: skills.filter((s) => s.category === 'architecture'),
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'poe-card-system',
    title: 'Proof of Expertise Card System',
    description:
      'Proof-of-Expertise card system with 6 REST APIs. Generates enriched cards using OpenAI GPT-4o, stored on S3 and indexed in DynamoDB.',
    techStack: {
      primary: ['Go', 'OpenAI GPT-4o'],
      secondary: ['REST APIs'],
      infra: ['DynamoDB', 'AWS S3'],
    },
    links: [],
    metrics: ['6 production REST APIs', 'GPT-4o content enrichment'],
    featured: true,
    category: 'AI / Backend',
    status: 'production',
  },
  {
    id: 'redis-oauth-security',
    title: 'Redis OAuth Security Layer',
    description:
      'Distributed Redis locking layer integrated into the OAuth authentication flow (Google, Apple, Discord) to eliminate race conditions in concurrent login and token-refresh requests, protecting 100k+ user accounts.',
    techStack: {
      primary: ['NestJS', 'Redis'],
      secondary: ['OAuth 2.0', 'TypeScript'],
      infra: ['AWS EKS'],
    },
    links: [],
    metrics: ['100k+ users protected', 'Zero race-condition incidents post-deployment'],
    featured: true,
    category: 'Security / Infrastructure',
    status: 'production',
  },
  {
    id: 'sarvam-ai-pipeline',
    title: 'Sarvam AI Annotation Pipeline',
    description:
      'Automated audio transcription and labelling pipeline using Sarvam AI, ingesting audio from S3 and producing structured annotations for downstream AI model training. Reduced manual annotation workload by 40-60%.',
    techStack: {
      primary: ['Go', 'Sarvam AI'],
      secondary: ['REST APIs'],
      infra: ['AWS S3', 'DynamoDB'],
    },
    links: [],
    metrics: ['40-60% reduction in manual annotation'],
    featured: true,
    category: 'AI / Data',
    status: 'production',
  },
  {
    id: 'audio-qc-pipeline',
    title: 'Audio QC Pipeline',
    description:
      'Automated audio quality-control pipeline that validates recording quality, performs loudness normalisation, and flags defective samples across 100+ datasets using librosa for signal analysis.',
    techStack: {
      primary: ['Python', 'Celery', 'FastAPI'],
      secondary: ['librosa', 'numpy'],
      infra: ['AWS S3', 'Redis'],
    },
    links: [],
    metrics: ['100+ datasets automated', 'Async processing via Celery workers'],
    featured: false,
    category: 'AI / Data',
    status: 'production',
  },
  {
    id: 'llm-resume-parser',
    title: 'LLM Resume Parser',
    description:
      'Serverless LLM-powered resume parsing service migrated from GCP Cloud Functions to AWS Lambda. Extracts structured candidate data from unstructured resumes using OpenAI and stores results in DynamoDB.',
    techStack: {
      primary: ['Python', 'AWS Lambda', 'OpenAI'],
      secondary: ['Pydantic'],
      infra: ['DynamoDB', 'AWS S3'],
    },
    links: [],
    metrics: ['GCP → AWS migration', 'Fully serverless architecture'],
    featured: false,
    category: 'AI / Serverless',
    status: 'production',
  },
  {
    id: 'annotation-service',
    title: 'Multilingual Annotation Service',
    description:
      'Multilingual annotation orchestration service built in Go that manages parallel annotation tracks for 5+ Indian languages, coordinating task assignment, progress tracking, and result aggregation via PostgreSQL.',
    techStack: {
      primary: ['Go', 'PostgreSQL'],
      secondary: ['REST APIs'],
      infra: ['AWS EKS'],
    },
    links: [],
    metrics: ['5+ Indian languages', 'Parallel annotation tracks'],
    featured: false,
    category: 'Backend / Data',
    status: 'production',
  },
  {
    id: 'proxy-auth-middleware',
    title: 'Proxy Auth Middleware',
    description:
      'Centralised NestJS authentication gateway that proxies requests to 10+ downstream microservices. Enforces JWT token validation, device whitelisting via DynamoDB, and rate limiting.',
    techStack: {
      primary: ['NestJS', 'JWT'],
      secondary: ['TypeScript'],
      infra: ['DynamoDB', 'AWS EKS'],
    },
    links: [],
    metrics: ['10+ microservices secured', 'Device-level whitelisting'],
    featured: false,
    category: 'Security / Infrastructure',
    status: 'production',
  },
];

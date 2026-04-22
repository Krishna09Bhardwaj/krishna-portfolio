export const bio = {
  name: 'Krishna Bhardwaj',
  role: 'Data Engineer',
  education: 'Final Year CSE @ Chandigarh University',
  location: 'Chandigarh, Punjab, India',
  email: 'krishna09bhardwaj@gmail.com',
  phone: '+91 70730-70311',
  github: 'https://github.com/Krishna09Bhardwaj',
  linkedin: 'https://linkedin.com/in/krishna-bhardwaj-16306824a',
  summary: [
    'Final-year Computer Science engineer specialising in Big Data Analytics.',
    'Expert in real-time data pipelines, ETL workflows, and transforming',
    'large-scale datasets into actionable intelligence.',
    'Published IEEE researcher. Active industry experience in automation',
    'integrations and analytics-instrumented web platforms.',
  ],
};

export const skills = [
  {
    category: 'Languages',
    items: ['Python', 'SQL', 'Bash'],
    level: 90,
  },
  {
    category: 'Data Platforms',
    items: ['Apache Kafka', 'PySpark', 'Airflow', 'Hadoop', 'Snowflake'],
    level: 85,
  },
  {
    category: 'Infra & DevOps',
    items: ['PostgreSQL', 'Docker', 'Linux', 'Git'],
    level: 80,
  },
  {
    category: 'Visualization',
    items: ['Power BI', 'OpenCV'],
    level: 75,
  },
  {
    category: 'Web',
    items: ['Node.js', 'Express.js', 'Next.js'],
    level: 65,
  },
];

export const projects = [
  {
    id: 'pipeline',
    name: 'Real-Time Data Pipeline',
    date: 'Nov 2025',
    stack: ['Kafka', 'PySpark', 'Airflow', 'Snowflake', 'Docker'],
    description:
      'End-to-end streaming data pipeline handling massive throughput with full fault tolerance.',
    metrics: [
      '10,000+ events/minute throughput',
      '<2 second end-to-end latency',
      '50 GB+ data processed',
      '100% recoverability with checkpointing',
    ],
    github: 'https://github.com/Krishna09Bhardwaj',
  },
  {
    id: 'dashboard',
    name: 'Sales Insight Dashboard',
    date: 'Jun 2025',
    stack: ['Python', 'Power BI', 'SQL'],
    description:
      'Interactive analytics dashboard transforming raw sales data into strategic insights.',
    metrics: [
      '95% data quality improvement',
      '50% faster insight generation',
      'Identified 12% regional sales gap',
      'Automated ETL reducing manual work by 80%',
    ],
    github: 'https://github.com/Krishna09Bhardwaj',
  },
  {
    id: 'realive',
    name: 'Re-Alive – Real-Time Animation Tool',
    date: 'Dec 2024',
    stack: ['Python', 'OpenCV', 'Mediapipe', 'PyQt'],
    description:
      'Real-time motion capture and animation tool using computer vision.',
    metrics: [
      '30+ FPS real-time rendering',
      'Sub-50ms motion capture latency',
      '35% improvement in animation realism',
      'Desktop GUI with PyQt5',
    ],
    github: 'https://github.com/Krishna09Bhardwaj',
  },
];

export const experience = [
  {
    role: 'Software Developer Intern',
    company: 'JineeGreenCard',
    period: 'Feb 2026 – Present',
    location: 'Remote',
    highlights: [
      'Built real-time WhatsApp monitoring system across 500+ groups',
      "Built and QA'd meritmap.ai onboarding website end-to-end",
      'Configured Google Analytics for full-funnel conversion tracking',
    ],
  },
];

export const research = {
  title:
    'Predicting Network Condition Events Using Supervised Machine Learning',
  journal: 'IEEE',
  date: 'February 2025',
  doi: '10.1109/ACROSET66531.2025.11280883',
  conference: 'ACROSET 2025',
  abstract:
    'Research on applying supervised ML algorithms to predict network condition events, enabling proactive network management and reducing downtime in telecommunications infrastructure.',
};

export const certifications = [
  {
    name: 'Oracle Cloud Infrastructure 2024 Generative AI Certified Professional',
    issuer: 'Oracle',
    year: '2024',
  },
  {
    name: 'Python Data Analytics',
    issuer: 'Coursera',
    year: '2023',
  },
  {
    name: 'Data Science at Scale',
    issuer: 'Coursera',
    year: '2023',
  },
  {
    name: 'Meta Data Analyst',
    issuer: 'Meta / Coursera',
    year: '2023',
  },
];

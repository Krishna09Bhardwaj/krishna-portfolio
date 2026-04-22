import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Krishna Bhardwaj | Data Engineer Portfolio',
  description:
    'Final-year CSE @ Chandigarh University. Expert in Apache Kafka, PySpark, Airflow, Snowflake. Published IEEE researcher. Available for Data Engineering roles.',
  keywords: [
    'Krishna Bhardwaj',
    'Data Engineer',
    'Apache Kafka',
    'PySpark',
    'Airflow',
    'Snowflake',
    'portfolio',
    'Chandigarh University',
    'IEEE',
  ],
  authors: [{ name: 'Krishna Bhardwaj', url: 'https://github.com/Krishna09Bhardwaj' }],
  openGraph: {
    title: 'Krishna Bhardwaj | Data Engineer Portfolio',
    description:
      'Real-time data pipelines · ETL workflows · Published IEEE researcher · Available for opportunities',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Krishna Bhardwaj Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishna Bhardwaj | Data Engineer',
    description: 'Real-time pipelines · Kafka · PySpark · IEEE published researcher',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

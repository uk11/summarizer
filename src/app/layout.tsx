import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/common/Header/Header';
import Sidebar from '@/components/common/Sidebar/Sidebar';
import AuthProvider from '@/Providers/AuthProvier';
import QueryProvider from '@/Providers/QueryProvider';
import ClientLayout from '@/components/common/ClientLayout';
import localFont from 'next/font/local';
import DarkModeProvider from '@/Providers/DarkModeProvider';
import { BASE_URL, PRODUCTION_URL } from '@/lib';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Summarizer | AI 요약 도구',
  description: 'AI를 통해 문서 및 텍스트를 요약해보세요.',
  keywords: 'AI, 문서, 텍스트, 요약, 소프트웨어, 도구, IT',
  authors: [
    {
      name: 'uk',
      url: PRODUCTION_URL,
    },
  ],

  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Summarizer | AI 요약 도구',
    description: 'AI를 통해 문서 및 텍스트를 요약해보세요.',
    url: PRODUCTION_URL,
    siteName: 'Summarizer',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/og-image.png',
        alt: 'Summarizer 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summarizer | AI 요약 도구',
    description: 'AI를 통해 문서 및 텍스트를 요약해보세요.',
    images: [
      {
        url: '/og-image.png',
        alt: 'Summarizer 로고',
      },
    ],
  },
};

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '100 900',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={`${pretendard.variable} font-pretendard`}
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>
          <AuthProvider>
            <DarkModeProvider>
              <Sidebar />
              <ClientLayout>
                <Header />
                {children}
              </ClientLayout>
            </DarkModeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

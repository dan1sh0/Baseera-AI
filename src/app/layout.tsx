import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './globals.css';
import { Amiri } from 'next/font/google';

const amiri = Amiri({ 
  weight: '400',
  subsets: ['arabic'],
  variable: '--font-amiri',
});

export const metadata = {
  title: 'Sheikh AI',
  description: 'Ask questions about Islam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${amiri.variable}`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
} 
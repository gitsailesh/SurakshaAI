// frontend/src/app/layout.tsx
import { Providers } from './providers';
import "./globals.css";

export const metadata = {
  title: 'SurakshaAI - District Health Intelligence',
  description: 'AI-powered Health Centre Management for India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
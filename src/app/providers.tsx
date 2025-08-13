'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <SessionProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SessionProvider>
    </SettingsProvider>
  );
}
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface OAuthSettings {
  clientId: string;
  clientSecret: string;
  isConfigured: boolean;
}

interface SettingsContextType {
  oauthSettings: OAuthSettings;
  setOAuthSettings: (settings: OAuthSettings) => void;
  clearSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [oauthSettings, setOAuthSettingsState] = useState<OAuthSettings>({
    clientId: '',
    clientSecret: '',
    isConfigured: false,
  });

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem('github-oauth-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setOAuthSettingsState(parsed);
      } catch (error) {
        console.error('Failed to parse saved OAuth settings:', error);
      }
    }
  }, []);

  const setOAuthSettings = (settings: OAuthSettings) => {
    setOAuthSettingsState(settings);
    localStorage.setItem('github-oauth-settings', JSON.stringify(settings));
  };

  const clearSettings = () => {
    const emptySettings = {
      clientId: '',
      clientSecret: '',
      isConfigured: false,
    };
    setOAuthSettingsState(emptySettings);
    localStorage.removeItem('github-oauth-settings');
  };

  return (
    <SettingsContext.Provider value={{
      oauthSettings,
      setOAuthSettings,
      clearSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
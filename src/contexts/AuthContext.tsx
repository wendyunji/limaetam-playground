'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
}

interface AuthContextType {
  repositories: Repository[];
  selectedRepo: string;
  setSelectedRepo: (repo: string) => void;
  isLoading: boolean;
  fetchRepositories: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepositories = useCallback(async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/github/repositories', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (response.ok) {
        const repos = await response.json();
        setRepositories(repos);
        
        // 저장된 레포 설정 불러오기
        const savedRepo = localStorage.getItem('selectedRepository');
        if (savedRepo && repos.find((repo: Repository) => repo.full_name === savedRepo)) {
          setSelectedRepo(savedRepo);
        }
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchRepositories();
    }
  }, [session?.accessToken, fetchRepositories]);

  useEffect(() => {
    if (selectedRepo) {
      localStorage.setItem('selectedRepository', selectedRepo);
    }
  }, [selectedRepo]);

  return (
    <AuthContext.Provider value={{
      repositories,
      selectedRepo,
      setSelectedRepo,
      isLoading,
      fetchRepositories
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
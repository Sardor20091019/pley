'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { LoginModal } from '../../components/auth/LoginModal';

export interface AuthModalContextValue {
  isOpen: boolean;
  redirectPath: string;
  openLoginModal: (redirectPath?: string) => void;
  closeLoginModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string>('/discover');

  const openLoginModal = useCallback((path: string = '/discover'): void => {
    setRedirectPath(path);
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        redirectPath,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={closeLoginModal}
        redirectPath={redirectPath}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return ctx;
}


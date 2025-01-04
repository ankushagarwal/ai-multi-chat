'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

interface SidebarContextType {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('isSidebarVisible');
      return storedState ? JSON.parse(storedState) : false;
    }
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarVisible((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('isSidebarVisible', JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    // Update localStorage whenever isSidebarVisible changes
    localStorage.setItem('isSidebarVisible', JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

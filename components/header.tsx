'use client';

import SvgLogo from './svglogo';
import { Button } from '@/components/ui/button';
import { Settings, Menu } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky top-0 flex justify-between border-b h-[57px] z-40 bg-background-100">
      <div className="flex flex-row items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="ml-2"
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>
        <div className="text-zinc-800 dark:text-zinc-100">
          <SvgLogo />
        </div>
        <a href="/">
          <div className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            AI <span className="hidden min-[385px]:inline">Multi ChatBot</span>
          </div>
        </a>
      </div>
      <div className="flex items-center pr-2 gap-2">
        <a className="text-sm underline font-bold" href="/?modelSet=fast">
          Fast Mode
        </a>
        <a className="text-sm underline font-bold" href="/?modelSet=deep">
          Deep Mode
        </a>
        <Button size="icon" variant="ghost" asChild>
          <a href="/settings">
            <Settings />
          </a>
        </Button>
      </div>
    </div>
  );
}

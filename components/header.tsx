'use client';

import { Button } from '@/components/ui/button';
import { Settings, Menu, Zap, BrainCircuit, Sparkles } from 'lucide-react';
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
        <a
          href="/"
          className="text-md font-bold text-zinc-800 dark:text-zinc-100"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" />
            <span className="">AI Multi ChatBot</span>
          </div>
        </a>
      </div>
      <div className="flex items-center pr-2 gap-2">
        <a
          className="text-sm underline flex items-center"
          href="/?modelSet=fast"
        >
          <Zap className="size-4" />
          Fast Models
        </a>
        <a
          className="text-sm underline flex items-center"
          href="/?modelSet=deep"
        >
          <BrainCircuit className="size-4" />
          Deep Models
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

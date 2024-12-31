import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function LeftSidebar() {
  return (
    <div className="z-30 sticky top-[57px] shrink-0 border-r w-14 bg-background-100 px-4 md:flex flex-col items-center justify-between h-[calc(100dvh-57px)]">
      <div className="flex flex-col gap-3 sticky top-[57px] py-4">
        <Button size="icon" variant="ghost" asChild>
          <Link href="/settings">
            <Settings />
          </Link>
        </Button>
      </div>
    </div>
  );
}

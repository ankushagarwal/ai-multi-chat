'use client';

import Header from '@/components/header';
import LeftSidebar from '@/components/leftsidebar';
import V2Chat from '@/components/v2chat';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-row w-full">
        <LeftSidebar />
        <div className="w-[calc(100dvw-56px)]">
          <main className="flex overflow-hidden h-[calc(100svh-57px)]">
            <div className="flex flex-col flex-1 h-full overflow-x-auto bg-background-100">
              <div className="flex w-full h-full p-2 space-x-2 overflow-x-auto snap-x snap-mandatory md:snap-none md:overflow-y-hidden">
                <V2Chat />
                <V2Chat />
                <V2Chat />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

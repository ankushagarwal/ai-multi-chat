'use client';

import Header from '@/components/header';
import LeftSidebar from '@/components/leftsidebar';
import V2Chat from '@/components/v2chat';
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-row w-full">
        <LeftSidebar />
        <div className="w-[calc(100dvw-56px)]">
          <main className="flex overflow-hidden h-[calc(100svh-57px)]">
            <div className="flex flex-col flex-1 h-full overflow-x-auto bg-background-100">
              <div className="flex w-full h-full p-2 space-x-2 overflow-x-auto snap-x snap-mandatory md:snap-none md:overflow-y-hidden border-b border-gray-alpha-400">
                <V2Chat />
                <V2Chat />
                <V2Chat />
              </div>
              <footer className="flex bg-zinc-100 relative">
                {/* {' '} */}
                {/* Added relative positioning */}
                <TextareaAutosize
                  ref={textareaRef}
                  minRows={1}
                  maxRows={10}
                  className="bg-white mx-4 w-full p-2 my-4 focus:outline-none focus:border-zinc-500 border border-gray-alpha-400 rounded-md text-sm"
                  placeholder="Your message..."
                  // onKeyDown={handleKeyDown}
                  // value={inputValue}
                  // onChange={(e) => setInputValue(e.target.value)}
                />
                {/* <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pr-2">
                  {' '}
                  Cmd + Enter to submit{' '}
                </span> */}
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

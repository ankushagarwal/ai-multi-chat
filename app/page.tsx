'use client';

import Header from '@/components/header';
import LeftSidebar from '@/components/leftsidebar';
import V2Chat, { type ChatHandle } from '@/components/v2chat';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { initialModels } from '@/lib/models';
export default function Home() {
  const chatRefs = useRef<Map<number, ChatHandle>>(new Map());
  const [inputValue, setInputValue] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isSmallScreen = window.innerWidth <= 768; // Example breakpoint for small screens
    if (
      (isSmallScreen && event.key === 'Enter') ||
      (event.metaKey && event.key === 'Enter')
    ) {
      console.log('main submit called');
      chatRefs.current.forEach((ref, id) => {
        if (ref) {
          console.log('submit called for', id);
          ref.submit();
        }
      });
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-row w-full">
        <LeftSidebar />
        <div className="w-[calc(100dvw-56px)]">
          <main className="flex overflow-hidden h-[calc(100svh-57px)]">
            <div className="flex flex-col flex-1 h-full overflow-x-auto bg-background-100">
              <div className="flex size-full p-2 space-x-2 overflow-x-auto snap-x snap-mandatory md:snap-none md:overflow-y-hidden border-b border-gray-alpha-400">
                {initialModels.map((model, index) => (
                  <V2Chat
                    key={model}
                    inputValue={inputValue}
                    modelName={model}
                    ref={(el) => {
                      if (el) {
                        chatRefs.current.set(index, el);
                      } else {
                        chatRefs.current.delete(index);
                      }
                    }}
                  />
                ))}
              </div>
              <footer className="flex bg-zinc-100 relative">
                {/* {' '} */}
                {/* Added relative positioning */}
                <TextareaAutosize
                  ref={textareaRef}
                  minRows={1}
                  maxRows={10}
                  className="bg-white m-4 w-full p-2 focus:outline-none focus:border-zinc-500 border border-gray-alpha-400 rounded-md text-sm"
                  placeholder="Your message..."
                  onKeyDown={handleKeyDown}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pr-2">
                  {' '}
                  Cmd + Enter to submit{' '}
                </span>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

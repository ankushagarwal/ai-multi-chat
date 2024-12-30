'use client';

import Header from '@/components/header';
import LeftSidebar from '@/components/leftsidebar';
import V2Chat, { type ChatHandle } from '@/components/v2chat';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { initialModels } from '@/lib/models';
import { Button } from '@/components/ui/button';
export default function Home() {
  const chatRefs = useRef<Map<number, ChatHandle>>(new Map());
  const [inputValue, setInputValue] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const submit = () => {
    chatRefs.current.forEach((ref, id) => {
      if (ref) {
        ref.submit();
      }
    });
    setInputValue('');
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isSmallScreen = window.innerWidth <= 768; // Example breakpoint for small screens
    if (
      (isSmallScreen && event.key === 'Enter') ||
      (event.metaKey && event.key === 'Enter')
    ) {
      submit();
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
              <footer className="flex bg-zinc-100 ">
                {/* {' '} */}
                {/* Added relative positioning */}
                <div className="flex w-full m-4 items-center">
                  <TextareaAutosize
                    ref={textareaRef}
                    minRows={1}
                    maxRows={10}
                    className="bg-white grow p-2 focus:outline-none focus:border-zinc-500 border border-gray-alpha-400 rounded-md text-sm"
                    placeholder="Your message..."
                    onKeyDown={handleKeyDown}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button
                    className="text-xs h-8 ml-2"
                    variant="default"
                    onClick={submit}
                  >
                    Submit
                  </Button>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

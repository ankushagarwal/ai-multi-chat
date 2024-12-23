"use client";

import { Input } from "@/components/ui/input";
import Chat, { ChatHandle } from "@/components/chat";
import { useRef, useState } from "react";

export default function Home() {
  const submitRef1 = useRef<ChatHandle>(null);
  const submitRef2 = useRef<ChatHandle>(null);
  const submitRef3 = useRef<ChatHandle>(null);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Command (meta) key and Enter key are pressed
    if (event.metaKey && event.key === "Enter") {
      if (submitRef1.current) {
        console.log("Calling submit1 from parent");
        submitRef1.current.submit();
      }
      if (submitRef2.current) {
        console.log("Calling submit2 from parent");
        submitRef2.current.submit();
      }
      if (submitRef3.current) {
        console.log("Calling submit3 from parent");
        submitRef3.current.submit();
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-200">
      <header className="flex h-10 border-b-2 bg-slate-100 border-slate-300 items-center justify-center">
        <h1 className="text-2xl font-bold">AI Multi Chat</h1>
      </header>

      <div className="flex flex-1 overflow-auto ">
        <div className="flex-1  h-full rounded overflow-scroll m-1 p-2 bg-white">
          <Chat
            ref={submitRef1}
            inputValue={inputValue}
            modelName="anthropic/claude-3.5-sonnet:beta"
          />
        </div>
        <div className="flex-1  h-full rounded overflow-scroll m-1 p-2 bg-white">
          <Chat
            ref={submitRef2}
            inputValue={inputValue}
            modelName="openai/gpt-4o-mini"
          />
        </div>
        <div className="flex-1  h-full rounded overflow-scroll m-1 p-2 bg-white">
          <Chat
            ref={submitRef3}
            inputValue={inputValue}
            modelName="google/gemini-flash-1.5"
          />
        </div>
      </div>

      <footer className="flex h-10 border-t-2 border-gray-200 ">
        <Input
          className="bg-white mx-4"
          placeholder="Search"
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </footer>
    </div>
  );
}

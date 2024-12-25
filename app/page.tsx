"use client";

import Chat, { ChatHandle } from "@/components/chat";
import { useRef, useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

// Define your models in an array
const models = [
  { id: 1, name: "anthropic/claude-3.5-sonnet:beta" },
  { id: 2, name: "gpt-4o" },
  { id: 3, name: "gemini-1.5-pro" },
  { id: 4, name: "o1" },
  // Add more models here as needed
];

export default function Home() {
  const chatRefs = useRef<Map<number, ChatHandle>>(new Map());
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey && event.key === "Enter") {
      // Submit to all chat instances
      chatRefs.current.forEach((ref) => {
        if (ref) {
          ref.submit();
        }
      });
      setInputValue("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-200">
      <header className="flex h-10 border-b-2 bg-slate-100 border-slate-300 items-center justify-center">
        <h1 className="text-2xl font-bold">AI Multi Chat</h1>
      </header>

      <div className="flex flex-1 overflow-auto">
        {models.map((model) => (
          <div
            key={model.id}
            className="flex-1 h-full rounded overflow-scroll m-1 p-2 bg-white"
          >
            <Chat
              ref={(el) => {
                if (el) {
                  chatRefs.current.set(model.id, el);
                } else {
                  chatRefs.current.delete(model.id);
                }
              }}
              inputValue={inputValue}
              modelName={model.name}
            />
          </div>
        ))}
      </div>

      <footer className="flex border-t-2 border-gray-200 mb-4 mt-4 mx-4">
        <TextareaAutosize
          ref={textareaRef}
          minRows={2}
          maxRows={10}
          className="bg-white mx-4 w-full p-2 focus:outline-black"
          placeholder="Your message..."
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </footer>
    </div>
  );
}

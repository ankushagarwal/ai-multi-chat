'use client';

import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { useChat } from 'ai/react';
import { Markdown } from '@/components/markdown';
import { ModelSelector } from '@/components/modelselector';
import { LoaderCircle } from 'lucide-react';
export interface ChatHandle {
  submit: () => void;
}

const V2Chat = forwardRef<
  ChatHandle,
  {
    inputValue: string;
    modelName: string;
  }
>(({ inputValue, modelName }, ref) => {
  const [selectedModel, setSelectedModel] = useState(modelName);

  const { messages, handleSubmit, setInput, isLoading } = useChat({
    api: `/api/chat?modelName=${selectedModel}`,
  });

  // Update input value without triggering handleInputChange
  useEffect(() => {
    setInput(inputValue);
  }, [inputValue, setInput]);

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit();
    },
  }));

  return (
    <div
      className="@container shrink-0 md:shrink md:min-w-96 snap-center rounded-md min-h-[250px] bg-background-100 size-full"
      tabIndex={-1}
    >
      <div className="size-full rounded-md border border-gray-alpha-400">
        <div className="size-full overflow-hidden rounded-md">
          <div
            className="flex flex-col flex-no-wrap h-full overflow-y-auto overscroll-y-none"
            style={{ overflowAnchor: 'none' }}
          >
            <div className="sticky top-0 z-10 shrink-0 min-w-0 min-h-0 border-b">
              <div className="flex items-center bg-zinc-100 backdrop-blur justify-normal py-3 pl-3 pr-2">
                {/* <div className="flex items-center">{modelName}</div> */}
                <ModelSelector
                  initialValue={modelName}
                  onSelectAction={(value) => {
                    setSelectedModel(value);
                  }}
                />
                {isLoading && (
                  <LoaderCircle
                    className="animate-spin text-zinc-500 ml-4"
                    // size={64}
                  />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="scrolling-touch scrolling-gpu size-full relative overflow-auto overscroll-y-auto">
                <div className="h-full divide-y pb-12">
                  {messages.map((message) =>
                    message.role === 'user' ? (
                      <div
                        key={message.id}
                        className="px-3 @md:py-4 py-2.5 group transition-opacity message bg-zinc-100 dark:bg-zinc-900"
                      >
                        <Markdown>{message.content}</Markdown>
                      </div>
                    ) : (
                      <div
                        key={message.id}
                        className="px-3 @md:py-4 py-2.5 group transition-opacity message"
                      >
                        <Markdown>{message.content}</Markdown>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // old
  // return (
  //   <div className="chat-container">
  //     {messages.map((message) =>
  //       message.role !== "user" ? (
  //         <Markdown
  //           key={message.id}
  //           className="ai-message text-sm"
  //           rehypePlugins={[[rehypeHighlight, { detect: true }]]}
  //         >
  //           {message.content}
  //         </Markdown>
  //       ) : (
  //         <div
  //           key={message.id}
  //           className="user-message whitespace-pre-wrap text-sm"
  //         >
  //           {message.content}
  //         </div>
  //       )
  //     )}
  //   </div>
  // );
});

V2Chat.displayName = 'V2Chat';

export default V2Chat;

'use client';

import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useChat } from 'ai/react';
import { Markdown } from '@/components/markdown';
import { ModelSelector } from '@/components/modelselector';
import { LoaderCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setModelIndex } from '@/lib/localStorage';
// Types
export interface ChatHandle {
  submit: () => void;
}

interface ChatHeaderProps {
  modelName: string;
  isLoading: boolean;
  onModelSelect: (value: string) => void;
}

interface MessageProps {
  content: string;
  isUser: boolean;
}

const BUFFER_SIZE = 512;

// Sub-components
const ChatHeader = ({
  modelName,
  isLoading,
  onModelSelect,
}: ChatHeaderProps) => (
  <div className="sticky top-0 z-10 shrink-0 min-w-0 min-h-0 border-b">
    <div className="flex items-center bg-zinc-200 backdrop-blur py-3 pl-3 pr-2 justify-between">
      <ModelSelector initialValue={modelName} onSelectAction={onModelSelect} />
      {isLoading && (
        <LoaderCircle className="animate-spin text-zinc-500 ml-4" />
      )}
    </div>
  </div>
);

const Message = ({ content, isUser }: MessageProps) => (
  <div
    className={`px-3 @md:py-4 py-2.5 group transition-opacity message ${
      isUser ? 'bg-sky-100 dark:bg-zinc-900' : ''
    }`}
  >
    {isUser ? (
      <pre className="whitespace-pre-wrap">{content}</pre>
    ) : (
      <Markdown>{content}</Markdown>
    )}
  </div>
);

const MessageList = ({
  messages,
  bufferedLastAssistantMessage,
  isLoading,
}: {
  messages: any;
  bufferedLastAssistantMessage: string;
  isLoading: boolean;
}) => {
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  // use this to scroll to bottom when new message is added
  // useEffect(() => {
  //   if (isLoading) {
  //     const interval = setInterval(() => {
  //       if (scrollToBottomRef.current) {
  //         scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [isLoading]);

  return (
    <div className="flex-1 min-w-0">
      <div className="scrolling-touch scrolling-gpu size-full relative overflow-auto overscroll-y-auto">
        <div className="h-full divide-y pb-12 text-sm">
          {messages.map((message: any, index: number) => (
            <Message
              key={message.id}
              content={
                index === messages.length - 1 && message.role === 'assistant'
                  ? bufferedLastAssistantMessage
                  : message.content
              }
              isUser={message.role === 'user'}
            />
          ))}
          <div ref={scrollToBottomRef} />
        </div>
      </div>
    </div>
  );
};

// Custom Hook for message buffering
const useMessageBuffer = (messages: any, isLoading: boolean) => {
  const [bufferedLastAssistantMessage, setBufferedLastAssistantMessage] =
    useState<string>('');

  useEffect(() => {
    if (
      messages.length === 0 ||
      messages[messages.length - 1].role !== 'assistant'
    ) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage.content.length >=
        bufferedLastAssistantMessage.length + BUFFER_SIZE ||
      !isLoading
    ) {
      setBufferedLastAssistantMessage(lastMessage.content);
    } else if (
      lastMessage.content.length < bufferedLastAssistantMessage.length &&
      isLoading
    ) {
      setBufferedLastAssistantMessage('');
    }
  }, [messages, bufferedLastAssistantMessage.length, isLoading]);

  return bufferedLastAssistantMessage;
};

// Main Component
const V2Chat = forwardRef<
  ChatHandle,
  { inputValue: string; modelName: string; index: number }
>(({ inputValue, modelName, index }, ref) => {
  const [selectedModel, setSelectedModel] = useState(modelName);
  const { messages, handleSubmit, setInput, isLoading } = useChat({
    api: `/api/chat?modelName=${selectedModel}`,
  });

  const bufferedLastAssistantMessage = useMessageBuffer(messages, isLoading);

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
            <ChatHeader
              modelName={modelName}
              isLoading={isLoading}
              onModelSelect={(model) => {
                setSelectedModel(model);
                setModelIndex(index, model);
              }}
            />
            <MessageList
              messages={messages}
              bufferedLastAssistantMessage={bufferedLastAssistantMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

V2Chat.displayName = 'V2Chat';

export default V2Chat;

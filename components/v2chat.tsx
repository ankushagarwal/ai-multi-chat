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
import { LoaderCircle, Maximize2, Minimize2 } from 'lucide-react';
import {
  getConversation,
  setModelIndex,
  updateConversation,
} from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Types
export interface ChatHandle {
  submit: () => void;
}

interface ChatHeaderProps {
  modelName: string;
  isLoading: boolean;
  onModelSelect: (value: string) => void;
  isMaximized: boolean;
  setMaximizedChatIndex: (index: number | null) => void;
  index: number;
}

interface MessageProps {
  content: string;
  isUser: boolean;
}

const BUFFER_SIZE = 512;

const bgHeaderColors = [
  'bg-pink-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-red-200',
  'bg-indigo-200',
  'bg-orange-200',
  'bg-purple-200',
  'bg-teal-200',
];

// Sub-components
const ChatHeader = ({
  index,
  isMaximized,
  modelName,
  isLoading,
  onModelSelect,
  setMaximizedChatIndex,
}: ChatHeaderProps) => {
  const bgColor = bgHeaderColors[index % bgHeaderColors.length];
  return (
    <div className="sticky top-0 z-10 shrink-0 min-w-0 min-h-0 border-b text-sm ">
      <div
        className={`flex items-center ${bgColor} backdrop-blur py-1 pl-3 pr-2 justify-between`}
      >
        <div className="flex items-center">
          <ModelSelector
            initialValue={modelName}
            onSelectAction={onModelSelect}
          />
          {isLoading && (
            <LoaderCircle className="animate-spin text-zinc-500 ml-4" />
          )}
        </div>
        <div className="flex items-center">
          {isMaximized ? (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent"
              onClick={() => setMaximizedChatIndex(null)}
            >
              <Minimize2 className="size-4 text-zinc-700" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent size-7"
              onClick={() => setMaximizedChatIndex(index)}
            >
              <Maximize2 className="size-4 text-zinc-700" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

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
    <pre className="hidden debug-message">{content}</pre>
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
const useMessageBuffer = (
  messages: any,
  isLoading: boolean,
  index: number,
  conversationId: string,
  modelName: string,
) => {
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
      console.log('Completed last message for chat', index);
      updateConversation(
        conversationId,
        {
          chats: [
            {
              modelId: modelName,
              messages: messages,
            },
          ],
        },
        index,
      );
    } else if (
      lastMessage.content.length < bufferedLastAssistantMessage.length &&
      isLoading
    ) {
      setBufferedLastAssistantMessage('');
    }
  }, [
    messages,
    bufferedLastAssistantMessage.length,
    isLoading,
    conversationId,
    index,
    modelName,
  ]);

  return bufferedLastAssistantMessage;
};

// Main Component
const V2Chat = forwardRef<
  ChatHandle,
  {
    inputValue: string;
    modelName: string;
    index: number;
    isMaximized: boolean;
    className: string;
    conversationId: string;
    setMaximizedChatIndex: (index: number | null) => void;
  }
>(
  (
    {
      inputValue,
      modelName,
      index,
      isMaximized,
      className,
      setMaximizedChatIndex,
      conversationId,
    },
    ref,
  ) => {
    const conversation = getConversation(conversationId);
    let conversationMessages: any[] = [];

    if (conversation) {
      if (index >= 0 && index < conversation.chats.length) {
        conversationMessages = conversation.chats[index].messages ?? [];
      } else {
        // console.warn(
        //   `Chat index ${index} is out of bounds for conversation ${conversationId}`,
        // );
        conversationMessages = [];
      }
    }

    const [selectedModel, setSelectedModel] = useState(modelName);
    const { messages, handleSubmit, setInput, isLoading } = useChat({
      api: `/api/chat?modelName=${selectedModel}`,
      initialMessages: conversationMessages,
    });

    const bufferedLastAssistantMessage = useMessageBuffer(
      messages,
      isLoading,
      index,
      conversationId,
      modelName,
    );

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
        className={cn(
          '@container shrink-0 md:shrink md:min-w-96 snap-center rounded-md min-h-[250px] bg-background-100 size-full',
          className,
        )}
        tabIndex={-1}
      >
        <div className="size-full rounded-md border border-gray-alpha-400">
          <div className="size-full overflow-hidden rounded-md">
            <div
              className="flex flex-col flex-no-wrap h-full overflow-y-auto overscroll-y-none"
              style={{ overflowAnchor: 'none' }}
            >
              <ChatHeader
                index={index}
                setMaximizedChatIndex={setMaximizedChatIndex}
                modelName={modelName}
                isMaximized={isMaximized}
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
  },
);

V2Chat.displayName = 'V2Chat';

export default V2Chat;

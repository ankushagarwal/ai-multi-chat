'use client';

import {
  type Conversation,
  getAllConversationsSorted,
} from '@/lib/localStorage';

import { useEffect, useState } from 'react';

export default function LeftSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadedConversations = getAllConversationsSorted();
    setConversations(loadedConversations);
  }, []);

  return (
    <div className="z-30 sticky top-[57px] shrink-0 border-r w-52 bg-background-100 px-4 md:flex flex-col items-center justify-between h-[calc(100dvh-57px)]">
      <div className="flex flex-col top-[57px] size-full">
        <div className="flex flex-col gap-1 py-1 w-full">
          <div className="text-md font-bold">Conversations</div>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="text-sm truncate"
              title={conversation.title}
            >
              <a href={`/?conversationId=${conversation.id}`}>
                <div className="hover:bg-gray-200 p-1 rounded">
                  {conversation.title}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

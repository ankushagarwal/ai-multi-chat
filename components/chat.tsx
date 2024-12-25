"use client";

import React, { useImperativeHandle, forwardRef } from "react";
import { useChat } from "ai/react";
import { useEffect } from "react";
import Markdown from "react-markdown";

export interface ChatHandle {
  submit: () => void;
}

const Chat = forwardRef<ChatHandle, { inputValue: string; modelName: string }>(
  ({ inputValue, modelName }, ref) => {
    const { messages, handleSubmit, setInput } = useChat({
      api: `/api/chat?modelName=${modelName}`,
    });

    // Update input value without triggering handleInputChange
    // foo
    useEffect(() => {
      setInput(inputValue);
    }, [inputValue, setInput]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit();
      },
    }));

    return (
      <div className="chat-container">
        {messages.map((message) =>
          message.role !== "user" ? (
            <Markdown key={message.id} className="ai-message text-sm">
              {message.content}
            </Markdown>
          ) : (
            <div
              key={message.id}
              className="user-message whitespace-pre-wrap text-sm"
            >
              {message.content}
            </div>
          )
        )}
      </div>
    );
  }
);

Chat.displayName = "Chat";

export default Chat;
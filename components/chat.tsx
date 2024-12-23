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
    const { messages, handleInputChange, handleSubmit } = useChat({
      api: `/api/chat?modelName=${modelName}`,
    });

    useEffect(() => {
      const event = { target: { value: inputValue } };
      handleInputChange(event as React.ChangeEvent<HTMLInputElement>);
    }, [inputValue, handleInputChange]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit();
      },
    }));

    return (
      <div className="chat-container">
        <div className="text-sm text-gray-500 mb-2 flex items-center justify-center">
          {modelName}
        </div>
        {messages.map((message) => (
          <Markdown
            key={message.id}
            className={message.role === "user" ? "user-message" : "ai-message"}
          >
            {message.content}
          </Markdown>
        ))}
      </div>
    );
  }
);

Chat.displayName = "Chat";

export default Chat;

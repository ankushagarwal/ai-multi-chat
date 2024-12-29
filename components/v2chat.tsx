'use client';

import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { useChat } from 'ai/react';
// import { Markdown } from '@/components/markdown';
import 'github-markdown-css/github-markdown-light.css';
import Markdown, { type Components } from 'react-markdown';
import 'highlight.js/styles/github.css';
import rehypeHighlight from 'rehype-highlight';
import { ModelSelector } from '@/components/modelselector';
import { CodeBlock } from '@/components/code-block';

export interface ChatHandle {
  submit: () => void;
}
import Link from 'next/link';

const components: Partial<Components> = {
  code: CodeBlock,
  // https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
  // https://github.com/react-syntax-highlighter/react-syntax-highlighter
  // code: (props) => {
  //   const { children, className, node, ...rest } = props;
  //   const match = /language-(\w+)/.exec(className || '');
  //   return match ? (
  //     // @ts-expect-error
  //     <SyntaxHighlighter
  //       {...rest}
  //       PreTag="div"
  //       // eslint-disable-next-line
  //       children={String(children).replace(/\n$/, '')}
  //       language={match[1]}
  //       style={github}
  //       customStyle={{
  //         borderRadius: '0.5rem',
  //       }}
  //     />
  //   ) : (
  //     <code {...rest} className={`${className} bg-zinc-200 px-1 rounded-sm`}>
  //       {children}
  //     </code>
  //   );
  // },
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
};

const V2Chat = forwardRef<
  ChatHandle,
  {
    inputValue: string;
    modelName: string;
  }
>(({ inputValue, modelName }, ref) => {
  const [selectedModel, setSelectedModel] = useState(modelName);

  const { messages, handleSubmit, setInput } = useChat({
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
              <div className="flex items-center bg-zinc-100 backdrop-blur shadow-[0_1px_rgba(202,206,214,.3),0_5px_10px_-5px_rgba(0,0,0,.05)] dark:shadow-[0_1px_rgba(255,255,255,0.15)] justify-between py-3 pl-3 pr-2">
                {/* <div className="flex items-center">{modelName}</div> */}
                <ModelSelector
                  initialValue={modelName}
                  onSelectAction={(value) => {
                    setSelectedModel(value);
                  }}
                />
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
                        <Markdown
                          // key={message.id}
                          className="user-message text-sm"
                          // rehypePlugins={[[rehypeHighlight, { detect: true }]]}
                          components={components}
                        >
                          {message.content}
                        </Markdown>
                      </div>
                    ) : (
                      <div
                        key={message.id}
                        className="px-3 @md:py-4 py-2.5 group transition-opacity message"
                      >
                        {/* <Markdown>{message.content}</Markdown> */}
                        <Markdown
                          // key={message.id}
                          className="ai-message text-sm"
                          rehypePlugins={[[rehypeHighlight, { detect: true }]]}
                          // components={components}
                        >
                          {message.content}
                        </Markdown>
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

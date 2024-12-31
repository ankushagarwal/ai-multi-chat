import Link from 'next/link';
import React, { memo, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// @ts-expect-error
const CodeBlockComponent = ({ children, className, ...rest }) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return match ? (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute size-fit top-1 right-1 p-0 bg-transparent text-zinc-300 hover:bg-transparent hover:text-zinc-50 flex items-center"
        onClick={handleCopy}
      >
        <Copy />
        <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
      </Button>
      <SyntaxHighlighter
        {...rest}
        // PreTag="div"
        // eslint-disable-next-line
        children={String(children).replace(/\n$/, '')}
        language={match[1]}
        style={oneDark}
        customStyle={{
          borderRadius: '0.5rem',
          fontSize: '14px',
        }}
      />
    </div>
  ) : (
    <code {...rest} className={`${className} bg-zinc-200 px-1 rounded-sm`}>
      {children}
    </code>
  );
};
const CodeBlock = memo(CodeBlockComponent);
CodeBlock.displayName = 'CodeBlock';

// @ts-expect-error
const PreComponent = ({ children }) => <>{children}</>;
const Pre = memo(PreComponent);
Pre.displayName = 'Pre';

// @ts-expect-error
const OlComponent = ({ node, children, ...props }) => (
  <ol className="list-decimal list-outside ml-4" {...props}>
    {children}
  </ol>
);
const Ol = memo(OlComponent);
Ol.displayName = 'Ol';

// @ts-expect-error
const LiComponent = ({ node, children, ...props }) => (
  <li className="py-1" {...props}>
    {children}
  </li>
);
const Li = memo(LiComponent);
Li.displayName = 'Li';

// @ts-expect-error
const UlComponent = ({ node, children, ...props }) => (
  <ul className="list-decimal list-outside ml-4" {...props}>
    {children}
  </ul>
);
const Ul = memo(UlComponent);
Ul.displayName = 'Ul';

// @ts-expect-error
const StrongComponent = ({ node, children, ...props }) => (
  <span className="font-semibold" {...props}>
    {children}
  </span>
);
const Strong = memo(StrongComponent);
Strong.displayName = 'Strong';

// @ts-expect-error
const AComponent = ({ node, children, ...props }) => (
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
const A = memo(AComponent);
A.displayName = 'A';

// @ts-expect-error
const H1Component = ({ node, children, ...props }) => (
  <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
    {children}
  </h1>
);
const H1 = memo(H1Component);
H1.displayName = 'H1';

// @ts-expect-error
const H2Component = ({ node, children, ...props }) => (
  <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
    {children}
  </h2>
);
const H2 = memo(H2Component);
H2.displayName = 'H2';

// @ts-expect-error
const H3Component = ({ node, children, ...props }) => (
  <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
    {children}
  </h3>
);
const H3 = memo(H3Component);
H3.displayName = 'H3';

// @ts-expect-error
const H4Component = ({ node, children, ...props }) => (
  <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
    {children}
  </h4>
);
const H4 = memo(H4Component);
H4.displayName = 'H4';

// @ts-expect-error
const H5Component = ({ node, children, ...props }) => (
  <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
    {children}
  </h5>
);
const H5 = memo(H5Component);
H5.displayName = 'H5';

// @ts-expect-error
const H6Component = ({ node, children, ...props }) => (
  <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
    {children}
  </h6>
);
const H6 = memo(H6Component);
H6.displayName = 'H6';

const components: Partial<Components> = {
  // code: CodeBlock,
  // https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
  // https://github.com/react-syntax-highlighter/react-syntax-highlighter
  // @ts-expect-error
  code: CodeBlock,
  // @ts-expect-error
  pre: Pre,
  // @ts-expect-error
  ol: Ol,
  // @ts-expect-error
  li: Li,
  // @ts-expect-error
  ul: Ul,
  // @ts-expect-error
  strong: Strong,
  // @ts-expect-error
  a: A,
  // @ts-expect-error
  h1: H1,
  // @ts-expect-error
  h2: H2,
  // @ts-expect-error
  h3: H3,
  // @ts-expect-error
  h4: H4,
  // @ts-expect-error
  h5: H5,
  // @ts-expect-error
  h6: H6,
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

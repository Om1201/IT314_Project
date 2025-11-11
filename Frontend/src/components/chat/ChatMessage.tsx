import { Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  onCopy?: () => void;
}

export default function ChatMessage({ role, content, onCopy }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "flex w-full py-6 px-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-3xl",
        isUser && "flex justify-end"
      )}>
        {isUser ? (
          <div className="text-right">
            <div className="inline-block text-sm text-muted-foreground mb-2">
              {content}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="text-foreground leading-7 mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-foreground my-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-foreground my-4">{children}</ol>,
                  li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">{children}</code>
                    ) : (
                      <code className={cn("block bg-secondary p-4 rounded-lg overflow-x-auto", className)}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mb-2">{children}</h3>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            {onCopy && (
              <button
                onClick={onCopy}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-smooth text-sm"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

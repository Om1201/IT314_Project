import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // choose your theme

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="prose prose-slate prose-invert max-w-none bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 overflow-x-auto">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-3xl font-bold text-blue-300 mt-6 mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-2xl font-semibold text-blue-200 mt-4 mb-2" {...props} />
                    ),
                    code({ inline, className, children, ...props }) {
                        return !inline ? (
                            <pre className="bg-slate-800 rounded-xl p-4 text-sm overflow-x-auto">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        ) : (
                            <code className="bg-slate-800/70 rounded px-2 py-1 text-pink-300">
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;

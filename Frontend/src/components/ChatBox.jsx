import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Maximize2, Minimize2, ExternalLink, Plus, MessageSquare, Trash2, Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createChat, getChatResponse, setActiveChat, fetchChatsForChapter, deleteChat, renameChat } from '../features/chatSlicer.js';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatBox({ roadmapId, chapterId, onClose, isFullscreen: externalFullscreen, onFullscreenToggle }) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(externalFullscreen || false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);

    const userEmail = useSelector(state => state.user.email);
    const chatKey = `${chapterId}`;
    const chapterChats = useSelector(state => state.chat.chats?.[chatKey] || { chats: [], activeChatId: null });
    const activeChat = chapterChats.chats.find(c => c.id === chapterChats.activeChatId);

    // Fetch chats when component mounts or when chapterId changes
    useEffect(() => {
        if (roadmapId && chapterId) {
            dispatch(fetchChatsForChapter({ roadmapId, moduleId: chapterId }));
        }
    }, [roadmapId, chapterId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [chapterChats.activeChatId]);

    useEffect(() => {
        if (externalFullscreen !== undefined) {
            setIsFullscreen(externalFullscreen);
        }
    }, [externalFullscreen]);

    const handleFullscreen = async () => {
        if (chatBoxRef.current) {
            try {
                if (!document.fullscreenElement) {
                    await chatBoxRef.current.requestFullscreen();
                    setIsFullscreen(true);
                    onFullscreenToggle?.(true);
                } else {
                    await document.exitFullscreen();
                    setIsFullscreen(false);
                    onFullscreenToggle?.(false);
                }
            } catch (err) {
                console.error('Error toggling fullscreen:', err);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);
            onFullscreenToggle?.(isCurrentlyFullscreen);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [onFullscreenToggle]);

    const handleOpenInNewTab = () => {
        window.open(`${window.location.origin}/roadmap/${roadmapId}/chat/${chapterId}`, '_blank');
    };

    const handleNewChat = () => {
        dispatch(setActiveChat({ chapterId, chatId: null }));
        inputRef.current?.focus();
    };

    const handleSelectChat = chatId => {
        dispatch(setActiveChat({ chapterId, chatId }));
    };

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this chat?')) return;

        const result = await dispatch(deleteChat({ chatId }));
        if (result.payload?.message === 'Chat deleted successfully') {
            toast.success('Chat deleted');
            dispatch(fetchChatsForChapter({ roadmapId, moduleId: chapterId }));
        } else {
            toast.error('Failed to delete chat');
        }
    };

    const handleRenameChat = async (e, chatId, currentTitle) => {
        e.stopPropagation();
        const newTitle = window.prompt('Enter new chat title:', currentTitle);
        if (!newTitle || newTitle.trim() === '' || newTitle === currentTitle) return;

        const result = await dispatch(renameChat({ chatId, newTitle: newTitle.trim() }));
        if (result.payload?.message === 'Chat renamed successfully') {
            toast.success('Chat renamed');
        } else {
            toast.error(result.payload?.message || 'Failed to rename chat');
        }
    };

    const handleSend = async e => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        const userMessage = message.trim();
        setMessage('');
        setIsSending(true);

        try {
            // Check if we need to create a new chat (no active chat or active chat has no backend chatId)
            const needsNewChat = !chapterChats.activeChatId || !activeChat || !activeChat.chatId;
            
            if (needsNewChat) {
                // Create new chat - ensure activeChatId is null first
                dispatch(setActiveChat({ chapterId, chatId: null }));
                const result = await dispatch(createChat({ roadmapId, moduleId: chapterId, userMessage }));
                
                if (result.payload?.message === 'Chat created successfully') {
                    // Fetch chats to get the new chat with its chatId
                    await dispatch(fetchChatsForChapter({ roadmapId, moduleId: chapterId }));
                } else {
                    toast.error(result.payload?.message || 'Failed to create chat');
                }
            } else {
                // Send message to existing chat
                const result = await dispatch(getChatResponse({ chatId: activeChat.chatId, userMessage }));
                if (result.payload?.message !== 'AI response generated') {
                    toast.error(result.payload?.message || 'Failed to get response');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div
            ref={chatBoxRef}
            className={`${isFullscreen ? 'fixed inset-0 w-full h-full' : 'fixed right-0 top-16 bottom-0 w-[400px]'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${isFullscreen ? '' : 'border-l border-blue-500/30'} flex flex-col shadow-2xl z-50`}
        >
            <div className="flex items-center justify-between p-4 border-b border-blue-500/30 bg-slate-800/50">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-white truncate">AI Chat</h3>
                        <p className="text-xs text-slate-400 truncate">{activeChat?.title || 'Chapter Chat'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={handleNewChat}
                        className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                        title="New Chat"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                    {!isFullscreen && (
                        <>
                            <button
                                onClick={handleOpenInNewTab}
                                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                                title="Open in new tab"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleFullscreen}
                                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                                title="Enter fullscreen"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                    {isFullscreen && (
                        <button
                            onClick={handleFullscreen}
                            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                            title="Exit fullscreen"
                        >
                            <Minimize2 className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                        title="Close chat"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-48 border-r border-blue-500/30 bg-slate-900/50 flex flex-col">
                    <div className="p-3 border-b border-blue-500/20">
                        <button
                            onClick={handleNewChat}
                            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {chapterChats.chats.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center py-4">No chats yet. Start a new conversation!</p>
                        ) : (
                            chapterChats.chats.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`group relative flex items-center gap-1 rounded-lg transition-colors ${
                                        chat.id === chapterChats.activeChatId
                                            ? 'bg-blue-600/20 border border-blue-500/30'
                                            : 'hover:bg-slate-800/50'
                                    }`}
                                >
                                    <button
                                        onClick={() => handleSelectChat(chat.id)}
                                        className="flex-1 text-left px-3 py-2 rounded-lg text-sm truncate text-slate-400 hover:text-white"
                                        title={chat.title}
                                    >
                                        {chat.title}
                                    </button>
                                    {chat.chatId && (
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={e => handleRenameChat(e, chat.chatId, chat.title)}
                                                className="p-1.5 rounded hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-all"
                                                title="Rename chat"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={e => handleDeleteChat(e, chat.chatId)}
                                                className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                                title="Delete chat"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {!activeChat ? (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 text-sm mb-2">Start a new conversation about this chapter</p>
                                <p className="text-slate-500 text-xs">Ask questions, get explanations, or request examples</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeChat.messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <p className="text-slate-400 text-sm mb-2">Start a conversation about this chapter</p>
                                        <p className="text-slate-500 text-xs">Ask questions, get explanations, or request examples</p>
                                    </div>
                                </div>
                            ) : (
                                activeChat.messages.map((msg, index) => (
                                    <div key={index} className="space-y-3">
                                        {msg.role === 'user' ? (
                                            <div className="flex justify-end">
                                                <div className="max-w-[85%] bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                                                    <p className="text-white text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-start">
                                                <div className="max-w-[85%] bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
                                                    {msg.content ? (
                                                        <div className="text-slate-200 text-sm prose prose-invert prose-sm max-w-none">
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                                    code: ({ inline, className, children, ...props }) =>
                                                                        inline ? (
                                                                            <code className="bg-slate-900/70 rounded px-1.5 py-0.5 text-pink-300 text-xs" {...props}>
                                                                                {children}
                                                                            </code>
                                                                        ) : (
                                                                            <code className="block bg-slate-900/70 rounded p-2 text-xs overflow-x-auto" {...props}>
                                                                                {children}
                                                                            </code>
                                                                        ),
                                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    ) : index === activeChat.messages.length - 1 && isSending ? (
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span className="text-sm">Our expert is thinking...</span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Input - Always visible */}
                    <div className="p-4 border-t border-blue-500/30 bg-slate-800/50">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={activeChat ? "Type your message..." : "Start a new conversation..."}
                                className="flex-1 px-4 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                                disabled={isSending}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || isSending}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                                title="Send message"
                            >
                                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Plus, Search, MessageSquare, X, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface Chat {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat?: (chatId: string) => void;
  onSearchClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ChatSidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onSearchClick,
  isCollapsed,
  onToggleCollapse,
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const todayChats = chats.filter(() => true); // You can add date filtering logic here

  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-sidebar-collapsed flex flex-col items-center py-4 space-y-4 border-r border-border">
        <button className="text-primary flex items-center justify-center" onClick={onToggleCollapse}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.5 3.5L5.5 3.5C7.43 3.5 9 5.07 9 7C9 8.93 7.43 10.5 5.5 10.5L3.5 10.5L3.5 3.5ZM15.5 3.5L17.5 3.5C19.43 3.5 21 5.07 21 7C21 8.93 19.43 10.5 17.5 10.5L15.5 10.5L15.5 3.5ZM3.5 13.5L5.5 13.5C7.43 13.5 9 15.07 9 17C9 18.93 7.43 20.5 5.5 20.5L3.5 20.5L3.5 13.5ZM15.5 13.5L17.5 13.5C19.43 13.5 21 15.07 21 17C21 18.93 19.43 20.5 17.5 20.5L15.5 20.5L15.5 13.5Z" />
          </svg>
        </button>
        
        <button 
          onClick={onNewChat}
          className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary rounded-lg transition-smooth"
          title="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button 
          onClick={onSearchClick}
          className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary rounded-lg transition-smooth"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <button 
          onClick={onToggleCollapse}
          className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary rounded-lg transition-smooth"
          title="Toggle sidebar"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-sidebar-bg flex flex-col border-r border-border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center space-x-2">
          <button onClick={onToggleCollapse} className="text-primary flex items-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.5 3.5L5.5 3.5C7.43 3.5 9 5.07 9 7C9 8.93 7.43 10.5 5.5 10.5L3.5 10.5L3.5 3.5ZM15.5 3.5L17.5 3.5C19.43 3.5 21 5.07 21 7C21 8.93 19.43 10.5 17.5 10.5L15.5 10.5L15.5 3.5ZM3.5 13.5L5.5 13.5C7.43 13.5 9 15.07 9 17C9 18.93 7.43 20.5 5.5 20.5L3.5 20.5L3.5 13.5ZM15.5 13.5L17.5 13.5C19.43 13.5 21 15.07 21 17C21 18.93 19.43 20.5 17.5 20.5L15.5 20.5L15.5 13.5Z" />
            </svg>
            <span className="ml-2 font-semibold text-foreground">Chat</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onSearchClick}
            className="p-2 hover:bg-secondary rounded-lg transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={onToggleCollapse}
            className="p-2 hover:bg-secondary rounded-lg transition-smooth text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button onClick={onNewChat} variant="primary" className="w-full">
          New chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {todayChats.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground font-medium px-3 py-2">Today</div>
            {todayChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-smooth text-left group",
                  activeChat === chat.id 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
                {(hoveredChat === chat.id || activeChat === chat.id) && (
                  <div className="flex items-center space-x-1 ml-2">
                    {onRenameChat && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameChat(chat.id);
                        }}
                        className="p-1 hover:bg-background rounded opacity-0 group-hover:opacity-100 transition-smooth"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 hover:bg-background rounded opacity-0 group-hover:opacity-100 transition-smooth"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-smooth">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-sm">Login with GitHub</span>
        </button>
      </div>
    </div>
  );
}

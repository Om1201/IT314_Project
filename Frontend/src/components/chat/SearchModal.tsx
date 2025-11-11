import { useState } from 'react';
import { Search, X, MessageSquare, Edit3 } from 'lucide-react';
import Modal from './Modal';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export default function SearchModal({ isOpen, onClose, chats, onSelectChat, onNewChat }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input-bg border border-input-border rounded-lg pl-10 pr-10 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Option */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-secondary hover:bg-secondary-hover rounded-lg transition-smooth mb-4"
        >
          <Edit3 className="w-5 h-5 text-foreground" />
          <span className="text-foreground font-medium">New chat</span>
        </button>

        {/* Results */}
        <div>
          {filteredChats.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground font-medium mb-3">Today</div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-secondary rounded-lg transition-smooth text-left"
                  >
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{chat.title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {filteredChats.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              No chats found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

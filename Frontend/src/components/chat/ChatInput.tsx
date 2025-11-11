import { forwardRef, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ value, onChange, onSend, disabled, placeholder = "Type your message here..." }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !disabled) {
          onSend();
        }
      }
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full bg-input-bg border border-input-border rounded-lg pl-4 pr-12 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none",
            "min-h-[52px] max-h-32"
          )}
          style={{ 
            height: 'auto',
            overflowY: value.split('\n').length > 3 ? 'auto' : 'hidden'
          }}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg transition-smooth",
            value.trim() && !disabled
              ? "bg-foreground text-background hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;

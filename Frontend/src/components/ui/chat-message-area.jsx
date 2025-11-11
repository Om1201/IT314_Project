import { useState } from "react"
import { StickToBottom } from "use-stick-to-bottom"
import { cn } from "../../lib/utils"
import { User, Bot, Copy, Check } from "lucide-react"
import MDEditor from "@uiw/react-md-editor"

export function ChatMessageArea({ className, ...props }) {
  return (
    <StickToBottom
      className={cn("flex-1 relative h-full overflow-y-auto bg-background", className)}
      resize="smooth"
      initial="smooth"
      {...props}
    />
  )
}

export function ChatMessageAreaContent({ className, messages = [], ...props }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }


  return (
    <StickToBottom.Content className={cn("mx-auto w-[70%] h-full py-4 px-4 space-y-4", className)} {...props}>
     
      {messages.map((msg, index) => (
  <div
    key={index}
    className={cn(
      "flex items-start gap-3 group",
      msg.role === "user" ? "justify-end" : "justify-start"
    )}
  >
    {/* AI icon — top-left */}
    {msg.role === "ai" && (
      <div className="flex-shrink-0 bg-[#4B61F5] rounded-full w-9 h-9 flex items-center justify-center">
        <img
          src="/images/ai.png"
          alt="AI"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    )}

    {/* Message bubble */}
    <div
      className={cn(
        "flex flex-col gap-1 relative",
        msg.role === "user" ? "max-w-xl items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg transition-all prose dark:prose-invert prose-sm max-w-none",
          msg.role === "user"
            ? "bg-primary bg-[#333C4D] text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none"
        )}
      >
        <div className="rounded-2xl overflow-hidden">
          <MDEditor.Markdown
            // style={{ backgroundColor: "#252B37", padding: "0.5rem 1.7rem" }}
            style={{ backgroundColor: "transparent", padding: "0.5rem 1.7rem", fontSize: "1.1rem" }}
            source={msg.content}
            />
          </div>
          </div>

          {/* Timestamp + copy button */}
      <div
        className={cn(
          "flex items-center ml-6 gap-2 text-xs transition-opacity opacity-0 group-hover:opacity-100",
          msg.role === "user" ? "justify-end pr-1" : "justify-start pl-1"
        )}

      >
        <span className="text-muted-foreground">
          {msg.time && new Date(msg.time).toLocaleTimeString()}
        </span>
        <button
          onClick={() => {handleCopy(msg.content, index)}}
          className={cn(
            "p-1 rounded cursor-pointer hover:bg-muted transition-colors",
            msg.role === "user"
              ? "text-primary-foreground hover:bg-primary/20"
              : "text-muted-foreground hover:bg-muted"
          )}
          title="Copy message"
          aria-label="Copy message"
        >
          {copiedIndex === index ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>

    {/* User icon — top-right */}
    {msg.role === "user" && (
      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center">
        <div className="bg-[#4B61F5] w-8 h-8 rounded-full flex items-center justify-center">
          <User size={18} className="text-primary-foreground" />
        </div>
      </div>
    )}
  </div>
))}

    </StickToBottom.Content>
  )
}

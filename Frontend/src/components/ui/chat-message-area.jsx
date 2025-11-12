import { useState, useEffect, useRef } from "react"
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

export function ChatMessageAreaContent({ className, messages = [], shouldStream, setShouldStream, isSending, ...props }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const contentRef = useRef(null)
  const [streamedContent, setStreamedContent] = useState({})
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesContainerRef = useRef(null)


  const scrollToBottom = (smooth = true) => {
    const scrollContainer = contentRef.current?.closest(".overflow-y-auto")
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          }
  }

  useEffect(() => {
    setTimeout(() => scrollToBottom(false), 0)
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    
    if(!shouldStream) return;
    const lastMessage = messages[messages.length - 1]
    const messageKey = `${messages.length - 1}`
    
    
    if (lastMessage.role === 'ai' && lastMessage.content && !streamedContent[messageKey]) {
      setIsStreaming(true)
      const fullContent = lastMessage.content
      let currentIndex = 0
      
      const streamInterval = setInterval(() => {
        if (currentIndex < fullContent.length) {
          const charsToAdd = Math.min(10, fullContent.length - currentIndex) 
          currentIndex += charsToAdd
          
          setStreamedContent(prev => ({
            ...prev,
            [messageKey]: fullContent.slice(0, currentIndex)
          }))
          
          
          const scrollContainer = contentRef.current?.closest(".overflow-y-auto")
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          }
        } else {
          clearInterval(streamInterval)
          setIsStreaming(false)
        }
      }, 100) 
      setShouldStream(false)
      return () => clearInterval(streamInterval)
    }
  }, [messages])

  useEffect(() => {
  if (isSending){const scrollContainer = contentRef.current?.closest(".overflow-y-auto")
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }
}, [isSending])

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }


  return (
    <StickToBottom className={cn("mx-auto w-[70%] h-full py-4 px-4 space-y-4", className)} {...props}>
     
      {messages
        .filter(msg => msg.content && msg.content.trim() !== '') // Skip empty messages
        .map((msg, index) => {
          const messageKey = `${index}`
          const isLastAiMessage = index === messages.length - 1 && msg.role === 'ai'
          const displayContent = isLastAiMessage && streamedContent[messageKey] 
            ? streamedContent[messageKey] 
            : msg.content
          
          return (
  <div
   ref={contentRef} 
   key={index}
    className={cn(
      "flex items-start gap-3 group",
      msg.role === "user" ? "justify-end" : "justify-start"
    )}
  >
    {/* AI icon — top-left */}

    {msg.role === "ai"  && (
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
            source={displayContent}
            />
          </div>
          </div>

          {/* Timestamp + copy button */}
      <div
        className={cn(
          "flex items-center ml-6 gap-2 text-xs transition-opacity opacity-0 group-hover:opacity-100",
          !isSending && msg.role === "user" ? "justify-end pr-1" : "justify-start pl-1"
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
          )
        })}

      {/* AI Thinking Indicator */}
      {isSending && (
        <div className="flex items-start gap-3 animate-in fade-in duration-300">
          {/* AI Avatar with pulse animation */}
          <div className="flex-shrink-0">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
              <div className="absolute inset-1 rounded-full bg-[#4B61F5] flex items-center justify-center">
                <img
                  src="/images/ai.png"
                  alt="AI"
                  className="w-7 h-7 rounded-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
          
          {/* Thinking message bubble */}
          <div className="flex flex-col gap-1">
            <div className="bg-card text-card-foreground rounded-lg rounded-bl-none px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span 
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-bounce" 
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span 
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-bounce" 
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span 
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-bounce" 
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </StickToBottom>
  )
}

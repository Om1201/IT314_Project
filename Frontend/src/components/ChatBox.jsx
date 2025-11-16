import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { Plus, MessageSquare, Trash2, Pencil, ArrowUp ,Loader2} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import {
  createChat,
  getChatResponse,
  setActiveChat,
  fetchChatsForChapter,
  deleteChat,
  renameChat,
} from "../features/chatSlicer.js"
import toast from "react-hot-toast"
import { ChatMessageArea, ChatMessageAreaContent } from "../components/ui/chat-message-area.jsx"
import { ConfirmationDialog } from "./confirmation-dialog.jsx"

export default function ChatBox({ roadmapId, chapterId, onClose, isFullscreen: externalFullscreen }) {
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [shouldStream, setShouldStream] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, chatId: null })
  const isFullscreen = externalFullscreen || false
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const userEmail = useSelector((state) => state.user.email)
  const chatKey = `${chapterId}`
  const chapterChats = useSelector((state) => state.chat.chats?.[chatKey] || { chats: [], activeChatId: null })
  const activeChat = chapterChats.chats.find((c) => c.id === chapterChats.activeChatId)

  useEffect(() => {
    if (roadmapId && chapterId) {
      dispatch(fetchChatsForChapter({ roadmapId, moduleId: chapterId }))
    }
  }, [roadmapId, chapterId, dispatch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChat?.messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [chapterChats.activeChatId])

  const handleNewChat = () => {
    dispatch(setActiveChat({ chapterId, chatId: null }))
    inputRef.current?.focus()
  }

  const handleSelectChat = (chatId) => {
    dispatch(setActiveChat({ chapterId, chatId }))
  }

  const handleDeleteChat = async () => {
    const chatId = deleteConfirm.chatId
    setDeleteConfirm({ isOpen: false, chatId: null })

    const result = await dispatch(deleteChat({ chatId }))
    if (result.payload?.message === "Chat deleted successfully") {
      toast.success("Chat deleted")
      dispatch(fetchChatsForChapter({ roadmapId, moduleId: chapterId }))
    } else {
      toast.error("Failed to delete chat")
    }
  }

  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation()
    setDeleteConfirm({ isOpen: true, chatId })
  }

  const handleRenameChat = async (e, chatId, currentTitle) => {
    e.stopPropagation()
    const newTitle = window.prompt("Enter new chat title:", currentTitle)
    if (!newTitle || newTitle.trim() === "" || newTitle === currentTitle) return

    const result = await dispatch(renameChat({ chatId, newTitle: newTitle.trim() }))
    if (result.payload?.message === "Chat renamed successfully") {
      toast.success("Chat renamed")
    } else {
      toast.error(result.payload?.message || "Failed to rename chat")
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    const userMessage = message.trim()
    setMessage("")
    setIsSending(true)
    setShouldStream(true)

    try {
      const needsNewChat = !chapterChats.activeChatId || !activeChat || !activeChat.chatId

      if (needsNewChat) {
        dispatch(setActiveChat({ chapterId, chatId: null }))
        const result = await dispatch(createChat({ roadmapId, moduleId: chapterId, userMessage }))

        if (result.payload?.message === "Chat created successfully") {
          await dispatch(fetchChatsForChapter({ roadmapId, moduleId: chapterId }))
        } else {
          toast.error(result.payload?.message || "Failed to create chat")
        }
      } else {
        const result = await dispatch(getChatResponse({ chatId: activeChat.chatId, userMessage }))
        if (result.payload?.message !== "AI response generated") {
          toast.error(result.payload?.message || "Failed to get response")
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef(null)

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return

    ta.style.height = "0px"

    const targetHeight = Math.min(ta.scrollHeight, 120)
    ta.style.height = `${targetHeight}px`

    ta.style.overflowY = ta.scrollHeight > 120 ? "auto" : "hidden"
  }

  useLayoutEffect(() => {
    adjustHeight()
  }, [message])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <>
      <div
        className={`${isFullscreen ? "fixed inset-0 w-full h-full" : "fixed right-0 top-16 bottom-0 w-[400px]"} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${isFullscreen ? "" : "border-l border-blue-500/30"} flex flex-col shadow-2xl z-50`}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="w-54 border-r border-blue-500/20 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col shadow-lg">
            <div className="p-3 border-b border-blue-500/20 bg-slate-800/50">
              <button
                onClick={handleNewChat}
                className="w-full px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50 hover:shadow-md active:scale-95 transform"
              >
                <Plus className="h-4 w-4" />
                <p className="text-center">
                  New Chat
                </p>
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
              {chapterChats.chats.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8 px-2 animate-pulse">
                  No chats yet. <br /> Start a new conversation!
                </p>
              ) : (
                chapterChats.chats.map((chat, index) => (
                  <div
                    key={chat.id}
                    className="animate-fadeIn"
                    style={{
                      animation: `fadeIn 0.3s ease-out ${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div
                      className={`group relative flex items-center gap-1 rounded-lg transition-all duration-200 cursor-pointer overflow-hidden ${
                        chat.id === chapterChats.activeChatId
                          ? "bg-gradient-to-r from-blue-600/30 to-blue-500/20 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                          : "hover:bg-slate-700/50 border border-transparent"
                      }`}
                    >
                      {/* Active indicator line */}
                      {chat.id === chapterChats.activeChatId && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r"></div>
                      )}

                      <button
                        onClick={() => handleSelectChat(chat.id)}
                        className="flex-1 cursor-pointer text-left px-3 py-2.5 rounded-lg text-sm truncate text-slate-400 hover:text-slate-200 transition-colors duration-150 font-medium"
                        title={chat.title}
                      >
                        {chat.title}
                      </button>

                      {/* Action Buttons */}
                      {chat.chatId && (
                        <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-100 scale-90">
                          <button
                            onClick={(e) => handleRenameChat(e, chat.chatId, chat.title)}
                            className="p-1.5 cursor-pointer rounded hover:bg-blue-500/30 text-slate-400 hover:text-blue-300 transition-all duration-150 hover:scale-110 active:scale-95"
                            title="Rename chat"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, chat.chatId)}
                            className="p-1.5 cursor-pointer rounded hover:bg-red-500/30 text-slate-400 hover:text-red-300 transition-all duration-150 hover:scale-110 active:scale-95"
                            title="Delete chat"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!activeChat && !isSending ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4 animate-pulse" />
                  <p className="text-slate-400 text-sm mb-2">Start a new conversation about this chapter</p>
                  <p className="text-slate-500 text-xs">Ask questions, get explanations, or request examples</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {activeChat && activeChat.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-2">Start a conversation about this chapter</p>
                      <p className="text-slate-500 text-xs">Ask questions, get explanations, or request examples</p>
                    </div>
                  </div>
                ) : (
                  <>
                  <div>
                  </div>
                  <ChatMessageArea>
                   <ChatMessageAreaContent needsNewChat={!chapterChats.activeChatId || !activeChat || !activeChat.chatId} messages={activeChat?.messages || []} isSending={isSending} shouldStream={shouldStream} setShouldStream={setShouldStream}/>
                    
                    {/* Add animated loading indicator for AI response */}
                    
                  </ChatMessageArea>
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="px-4 py-2 border-t border-blue-500/30 bg-slate-800/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <div className="w-full flex justify-center items-center">
                  <div className="relative bg-gray-800 w-[60%] flex justify-center items-center rounded-xl shadow-2xl transition-all duration-300 border border-gray-700/50 hover:border-blue-500 focus-within:border-blue-500 focus-within:shadow-blue-500/20 focus-within:shadow-lg">
                    <textarea
                      ref={textareaRef}
                      className="w-full bg-transparent text-gray-100 placeholder-gray-400 p-3 
                       pr-12 resize-none focus:outline-none text-base leading-snug 
                       max-h-[100px] overflow-y-auto hide-scrollbar"
                      placeholder="Type @ for agents, / for files..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                      }}
                      onKeyDown={handleKeyDown}
                      style={{ minHeight: "40px" }}
                      rows={1}
                    />

                    <button
                      onClick={(e) => handleSend(e)}
                      disabled={!message.trim()}
                      className={`absolute bottom-2 right-2.5 w-8 h-8 rounded-full 
                        flex items-center justify-center transition-all duration-200 
                        ${
                          message.trim()
                            ? "bg-blue-500 text-white hover:bg-blue-400 active:scale-90 hover:scale-105"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      aria-label="Send message"
                      title="Send message (or Enter)"
                    >
                      <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Chat?"
        description="This action cannot be undone. The entire conversation will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteChat}
        onCancel={() => setDeleteConfirm({ isOpen: false, chatId: null })}
      />
    </>
  )
}

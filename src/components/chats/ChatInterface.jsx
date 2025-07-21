// src/components/chat/ChatInterface.jsx
import React, { useRef, useEffect } from "react";
import { Menu, FolderPlus, MessageSquare, Send } from "lucide-react";
import ChatMessage, {
  TypingIndicator,
  EmptyMessagesState,
} from "./ChatMessage";
import Button from "../ui/Button";

const ChatInterface = ({
  currentChat,
  messages,
  sending,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onCreateProject,
  onToggleSidebar,
  formatTime,
  isMobile,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const canCreateProject = currentChat && messages && messages.length >= 2;

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Fixed Chat Header - No sticky positioning */}
      {isMobile && (
        <ChatHeader
          title={currentChat?.title || "Chat"}
          onToggleSidebar={onToggleSidebar}
          onCreateProject={() => onCreateProject(currentChat._id)}
          canCreateProject={canCreateProject}
          isMobile
        />
      )}

      {/* Desktop Chat Header */}
      {!isMobile && (
        <ChatHeader
          title={currentChat?.title || "Chat"}
          subtitle="AI Assistant • Always ready to help"
          onCreateProject={() => onCreateProject(currentChat._id)}
          canCreateProject={canCreateProject}
        />
      )}

      {/* Messages Container - Fixed scrolling */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 md:p-6 space-y-4 md:space-y-6">
        {!messages || messages.length === 0 ? (
          <EmptyMessagesState isMobile={isMobile} />
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message._id || index}
                message={message}
                formatTime={formatTime}
                isMobile={isMobile}
              />
            ))}
            {sending && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Message Input - No movement */}
      <div className="flex-shrink-0">
        <MessageInput
          value={messageInput}
          onChange={onMessageInputChange}
          onSend={onSendMessage}
          sending={sending}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

// ChatHeader Component - Fixed positioning
const ChatHeader = ({
  title,
  subtitle,
  onToggleSidebar,
  onCreateProject,
  canCreateProject,
  isMobile,
}) => (
  <div className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {isMobile && onToggleSidebar && (
          <Button
            onClick={onToggleSidebar}
            variant="ghost"
            size="sm"
            className="p-2 text-gray-600 hover:bg-gray-100"
            title="Open chat sidebar"
          >
            <Menu size={20} />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h2>
          {subtitle && !isMobile && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {canCreateProject ? (
          <Button
            onClick={onCreateProject}
            variant={isMobile ? "ghost" : "success"}
            size="sm"
            className={
              isMobile
                ? "p-2 text-green-600 hover:bg-green-50"
                : "px-4 py-2 flex items-center space-x-2"
            }
            title="Create project from this conversation"
          >
            <FolderPlus size={16} />
            {!isMobile && <span>Create Project</span>}
          </Button>
        ) : (
          <Button
            disabled
            variant="ghost"
            size="sm"
            className={
              isMobile
                ? "p-2 text-gray-400 cursor-not-allowed"
                : "px-4 py-2 bg-gray-400 text-white cursor-not-allowed flex items-center space-x-2"
            }
            title="Have a more detailed conversation to create a project"
          >
            <FolderPlus size={16} />
            {!isMobile && <span>Create Project</span>}
          </Button>
        )}
      </div>
    </div>
  </div>
);

// MessageInput Component
const MessageInput = ({ value, onChange, onSend, sending, isMobile }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || sending) return;
    onSend();
  };

  return (
    <div className="border-t border-gray-200 p-3 md:p-6 bg-white">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <MessageSquare
            className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={isMobile ? 18 : 20}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Message AI Assistant..."
            className="w-full pl-10 md:pl-12 pr-12 md:pr-16 py-3 md:py-4 
              border border-gray-300 rounded-xl md:rounded-2xl focus:outline-none 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              bg-white shadow-sm text-sm md:text-base"
            disabled={sending}
          />
          <Button
            type="submit"
            disabled={!value.trim() || sending}
            variant="primary"
            size="sm"
            className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 
              p-2 rounded-lg md:rounded-xl"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • AI can make mistakes, verify important
          information
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

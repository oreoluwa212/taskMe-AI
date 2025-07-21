// src/components/chat/ChatMessage.jsx
import React from "react";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ message, formatTime, isMobile }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser ? "order-2" : "order-1"
        }`}
      >
        {/* Avatar and timestamp */}
        <div
          className={`flex items-center space-x-2 mb-2 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex items-center space-x-2 ${
              isUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <MessageAvatar sender={message.sender} isMobile={isMobile} />
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>

        {/* Message content */}
        <div
          className={`rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900 border"
          }`}
        >
          <div className="whitespace-pre-wrap break-words text-sm md:text-base">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

// MessageAvatar Component
const MessageAvatar = ({ sender, isMobile }) => {
  const isUser = sender === "user";
  const size = isMobile ? 12 : 16;

  return (
    <div
      className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
        isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
      }`}
    >
      {isUser ? <User size={size} /> : <Bot size={size} />}
    </div>
  );
};

// TypingIndicator Component
export const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 border">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[0, 0.1, 0.2].map((delay, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">AI is thinking...</span>
      </div>
    </div>
  </div>
);

// EmptyMessagesState Component
export const EmptyMessagesState = ({ isMobile }) => (
  <div className="text-center text-gray-500 py-8 md:py-12">
    <Bot size={isMobile ? 40 : 48} className="mx-auto text-gray-300 mb-4" />
    <p className="text-base md:text-lg">No messages yet</p>
    <p className="text-sm">Start the conversation below!</p>
  </div>
);

export default ChatMessage;

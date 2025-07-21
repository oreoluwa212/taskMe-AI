import React from "react";
import { MessageSquare, Plus, Menu } from "lucide-react";
import Button from "../ui/Button";

const EmptyState = ({
  onCreateChat,
  isMobile,
  onToggleSidebar,
  hasChats = false,
  chatCount = 0,
}) => {
  return (
    <div className="flex-1 flex flex-col relative bg-gray-50">
      {/* Mobile header with sidebar toggle when chats exist */}
      {isMobile && hasChats && onToggleSidebar && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            onClick={onToggleSidebar}
            variant="ghost"
            size="sm"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="View your chats"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <MessageSquare
              size={isMobile ? 64 : 80}
              className="mx-auto text-gray-300 mb-4"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
            {hasChats && isMobile
              ? "Select a chat to continue"
              : "Welcome to TaskMe AI"}
          </h2>

          <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
            {hasChats && isMobile
              ? "Open the sidebar to view and select from your existing chats, or create a new one to get started."
              : "Start a conversation with your AI assistant. Ask questions, get help with tasks, or brainstorm ideas together."}
          </p>

          <div className="space-y-3 flex flex-col items-center">
            {/* Main action button - properly centered */}
            <Button
              onClick={onCreateChat}
              variant="primary"
              size="lg"
              className="w-full max-w-xs px-6 py-3 text-base font-medium flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Start New Chat</span>
            </Button>

            {/* Secondary action for mobile when chats exist */}
            {isMobile && hasChats && onToggleSidebar && (
              <Button
                onClick={onToggleSidebar}
                variant="secondary"
                size="lg"
                className="w-full max-w-xs px-6 py-3 text-base font-medium flex items-center justify-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>View My Chats</span>
              </Button>
            )}
          </div>

          {/* Helper text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {hasChats
                ? `You have ${chatCount} chat${
                    chatCount !== 1 ? "s" : ""
                  } saved`
                : "Your conversations will appear here once you start chatting"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

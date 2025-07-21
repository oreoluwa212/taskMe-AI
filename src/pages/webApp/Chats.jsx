// src/pages/webApp/Chats.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  MessageSquare,
  Send,
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  Clock,
  User,
  Bot,
  Sparkles,
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { toast } from "react-toastify";

const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const messagesEndRef = useRef(null);

  const {
    chats,
    currentChat,
    messages,
    loading,
    sending,
    error,
    fetchChats,
    createChat,
    fetchChat,
    sendMessage,
    updateChatTitle,
    deleteChat,
    createProjectFromChat,
    setCurrentChat,
    clearError,
  } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSelectChat = useCallback(
    async (chat) => {
      // Prevent duplicate fetching if already selected
      if (selectedChatId === chat._id && currentChat?._id === chat._id) {
        return;
      }

      setSelectedChatId(chat._id);
      try {
        await fetchChat(chat._id);
      } catch (error) {
        console.error("Error fetching chat:", error);
        toast.error("Failed to load chat");
      }
    },
    [fetchChat, selectedChatId, currentChat]
  );

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!messageInput.trim() || !selectedChatId || sending) return;

      const message = messageInput.trim();
      setMessageInput("");

      try {
        await sendMessage(selectedChatId, message);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessageInput(message); // Restore message on error
      }
    },
    [messageInput, selectedChatId, sending, sendMessage]
  );

  const handleCreateChat = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newChatTitle.trim()) return;

      try {
        const newChat = await createChat({ title: newChatTitle });
        setSelectedChatId(newChat._id);
        setNewChatTitle("");
        setShowNewChatModal(false);
        toast.success("Chat created successfully!");
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    },
    [newChatTitle, createChat]
  );

  const handleEditTitle = useCallback(
    async (chatId) => {
      if (!editTitle.trim()) return;

      try {
        await updateChatTitle(chatId, editTitle);
        setEditingChatId(null);
        setEditTitle("");
        toast.success("Chat title updated!");
      } catch (error) {
        console.error("Error updating title:", error);
      }
    },
    [editTitle, updateChatTitle]
  );

  const handleDeleteChat = useCallback(
    async (chatId) => {
      if (window.confirm("Are you sure you want to delete this chat?")) {
        try {
          await deleteChat(chatId);
          if (selectedChatId === chatId) {
            setSelectedChatId(null);
          }
          toast.success("Chat deleted successfully!");
        } catch (error) {
          console.error("Error deleting chat:", error);
        }
      }
    },
    [deleteChat, selectedChatId]
  );

  const handleCreateProject = useCallback(
    async (chatId) => {
      // Check if chat has enough content for project creation
      if (!messages || messages.length < 2) {
        toast.warning(
          "Please have a more detailed conversation before creating a project. The chat needs more context to generate a meaningful project."
        );
        return;
      }

      // Check if there's substantial content in the messages
      const totalContent = messages.reduce(
        (acc, msg) => acc + (msg.content?.length || 0),
        0
      );
      if (totalContent < 100) {
        toast.warning(
          "The conversation is too brief to create a project. Please provide more details about what you'd like to build."
        );
        return;
      }

      try {
        const result = await createProjectFromChat(chatId);
        toast.success("Project created from chat!");

        // Optionally redirect to projects page or show project details
        console.log("Created project:", result);
      } catch (error) {
        console.error("Error creating project:", error);

        // More specific error handling
        if (error.message.includes("extract project information")) {
          toast.error(
            "Unable to create project from this conversation. Try discussing a specific project idea, tech stack, or development task in more detail."
          );
        } else if (error.message.includes("400")) {
          toast.error(
            "Please provide more specific project details in your chat before creating a project."
          );
        } else {
          toast.error("Failed to create project. Please try again.");
        }
      }
    },
    [createProjectFromChat, messages]
  );

  // Memoize the formatMessageTime function
  const formatMessageTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  }, []);

  // Memoize the ChatSidebar component
  const ChatSidebar = useMemo(
    () => (
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading && chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Loading chats...
            </div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No chats yet. Create your first chat to get started!
            </div>
          ) : (
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChatId === chat._id
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat._id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleEditTitle(chat._id)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleEditTitle(chat._id)
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-900 truncate">
                          {chat.title || "Untitled Chat"}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock size={12} className="mr-1" />
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(chat._id);
                        setEditTitle(chat.title || "");
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateProject(chat._id);
                      }}
                      className="p-1 text-gray-400 hover:text-green-600"
                    >
                      <FolderPlus size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat._id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    [
      chats,
      loading,
      selectedChatId,
      editingChatId,
      editTitle,
      handleSelectChat,
      handleCreateProject,
      handleDeleteChat,
      handleEditTitle,
    ]
  );

  // Memoize the EmptyState component
  const EmptyState = useMemo(
    () => (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Welcome to TaskMe AI Chat
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start a conversation with our AI assistant. Ask questions, get
              help with tasks, or just have a friendly chat. Create a new
              conversation to begin.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Sparkles size={20} />
              <span>Start New Chat</span>
            </button>

            <div className="grid grid-cols-1 gap-3 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-1">
                  💡 Ask anything
                </h4>
                <p className="text-sm text-gray-600">
                  Get answers to your questions
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-1">
                  🚀 Get productive
                </h4>
                <p className="text-sm text-gray-600">
                  Turn conversations into projects
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-1">
                  📝 Stay organized
                </h4>
                <p className="text-sm text-gray-600">
                  All your chats in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  // Create a stable message input component to prevent re-renders
  const MessageInputForm = useMemo(
    () => (
      <div className="border-t border-gray-200 p-6 bg-white">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="relative flex items-center">
            <MessageSquare
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Message AI Assistant..."
              className="w-full pl-12 pr-16 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || sending}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • AI can make mistakes, verify important
            information
          </div>
        </form>
      </div>
    ),
    [messageInput, sending, handleSendMessage]
  );

  const ChatInterface = useMemo(
    () => (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentChat?.title || "Chat"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                AI Assistant • Always ready to help
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {currentChat && messages && messages.length >= 2 ? (
                <button
                  onClick={() => handleCreateProject(currentChat._id)}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  title="Create a project from this conversation"
                >
                  <FolderPlus size={16} />
                  <span>Create Project</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 text-sm bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center space-x-2"
                  title="Have a more detailed conversation to create a project"
                >
                  <FolderPlus size={16} />
                  <span>Create Project</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!messages || messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Bot size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start the conversation below!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] ${
                    message.sender === "user" ? "order-2" : "order-1"
                  }`}
                >
                  {/* Avatar and timestamp */}
                  <div
                    className={`flex items-center space-x-2 mb-2 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-2 ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User size={16} />
                        ) : (
                          <Bot size={16} />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Message content */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 border">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {MessageInputForm}
      </div>
    ),
    [
      currentChat,
      messages,
      sending,
      handleCreateProject,
      formatMessageTime,
      MessageInputForm,
    ]
  );

  return (
    <div className="h-screen flex bg-white">
      {ChatSidebar}
      {selectedChatId && currentChat ? ChatInterface : EmptyState}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus size={20} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Chat
              </h3>
            </div>

            <form onSubmit={handleCreateChat}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chat Title
                </label>
                <input
                  type="text"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your chat"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewChatModal(false);
                    setNewChatTitle("");
                  }}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newChatTitle.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;

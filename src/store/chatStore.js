// src/store/chatStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    sending: false,
    error: null,
    user: null,
    fetchingChats: {}, // Track which chats are being fetched

    setUser: (userData) => {
        set({ user: userData });
    },

    fetchChats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/chats');
            const chats = response.data.data?.chats || response.data.data || response.data;

            // If user data is not set, you might want to fetch it
            const { user } = get();
            if (!user) {
                try {
                    const userResponse = await api.get('/users/profile'); // or whatever your user endpoint is
                    set({ user: userResponse.data.user || userResponse.data });
                } catch (userError) {
                    console.log('Could not fetch user data:', userError);
                }
            }

            set({ chats: Array.isArray(chats) ? chats : [], loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch chats';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Add method to fetch user profile specifically
    fetchUserProfile: async () => {
        try {
            const response = await api.get('/users/profile'); // Adjust endpoint as needed
            const userData = response.data.user || response.data;
            set({ user: userData });
            return userData;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            throw error;
        }
    },

    // Create a new chat
    createChat: async (chatData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/chats', chatData);
            const newChat = response.data.data?.chat || response.data.data || response.data;

            set(state => ({
                chats: [newChat, ...state.chats],
                currentChat: newChat,
                messages: newChat.messages || [],
                loading: false
            }));

            return newChat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create chat';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Create chat with suggestion
    createChatWithSuggestion: async (suggestionData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/chats/create-with-suggestion', suggestionData);
            const newChat = response.data.data?.chat || response.data.data || response.data;
            const messages = response.data.data?.messages || newChat.messages || [];

            set(state => ({
                chats: [newChat, ...state.chats],
                currentChat: newChat,
                messages: Array.isArray(messages) ? messages : [],
                loading: false
            }));

            return newChat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create chat with suggestion';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Fetch specific chat with duplicate prevention
    fetchChat: async (chatId) => {
        const state = get();

        // Prevent duplicate fetching
        if (state.fetchingChats[chatId]) {
            console.log('Already fetching chat:', chatId);
            return state.currentChat;
        }

        // If it's the same chat that's already loaded, don't refetch
        if (state.currentChat?._id === chatId && state.messages.length > 0) {
            console.log('Chat already loaded:', chatId);
            return state.currentChat;
        }

        set(state => ({
            loading: true,
            error: null,
            fetchingChats: { ...state.fetchingChats, [chatId]: true }
        }));

        try {
            const response = await api.get(`/chats/${chatId}`);
            const data = response.data.data;
            const chat = data?.chat || data || response.data;
            const messages = data?.messages || chat.messages || [];

            console.log('Fetched chat data:', { chat, messages }); // Debug log

            set(state => ({
                currentChat: chat,
                messages: Array.isArray(messages) ? messages : [],
                loading: false,
                fetchingChats: { ...state.fetchingChats, [chatId]: false }
            }));

            return chat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch chat';
            set(state => ({
                error: errorMessage,
                loading: false,
                fetchingChats: { ...state.fetchingChats, [chatId]: false }
            }));
            throw new Error(errorMessage);
        }
    },

    // Send message to chat
    sendMessage: async (chatId, messageContent) => {
        set({ sending: true, error: null });

        // Add optimistic user message
        const userMessage = {
            _id: `temp-${Date.now()}`,
            chatId,
            content: messageContent,
            sender: 'user',
            type: 'text',
            createdAt: new Date().toISOString(),
        };

        set(state => ({
            messages: [...state.messages, userMessage]
        }));

        try {
            const response = await api.post(`/chats/${chatId}/messages`, {
                content: messageContent
            });

            const responseData = response.data.data || response.data;

            // Handle different possible response structures
            let newMessages = [];
            if (responseData.messages) {
                // If response includes all messages
                newMessages = responseData.messages;
            } else if (Array.isArray(responseData)) {
                // If response is array of messages
                newMessages = responseData;
            } else if (responseData.userMessage && responseData.assistantMessage) {
                // If response has separate user and assistant messages
                newMessages = [responseData.userMessage, responseData.assistantMessage];
            } else {
                // Single message response
                newMessages = [...get().messages.filter(m => !m._id.startsWith('temp-')), responseData];
            }

            set({
                messages: Array.isArray(newMessages) ? newMessages : [...get().messages.filter(m => !m._id.startsWith('temp-')), responseData],
                sending: false
            });

            return responseData;
        } catch (error) {
            // Remove optimistic message on error
            set(state => ({
                messages: state.messages.filter(m => !m._id.startsWith('temp-')),
                sending: false,
                error: error.response?.data?.message || 'Failed to send message'
            }));
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    // Update chat title
    updateChatTitle: async (chatId, newTitle) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/chats/${chatId}/title`, {
                title: newTitle
            });

            const updatedChat = response.data.data?.chat || response.data.data || response.data;

            set(state => ({
                chats: state.chats.map(chat =>
                    chat._id === chatId ? { ...chat, title: newTitle } : chat
                ),
                currentChat: state.currentChat?._id === chatId
                    ? { ...state.currentChat, title: newTitle }
                    : state.currentChat,
                loading: false
            }));

            return updatedChat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update chat title';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    createProjectFromChat: async (chatId) => {
        const state = get();

        // Additional validation
        if (!state.messages || state.messages.length < 2) {
            throw new Error('Not enough conversation content to create a project. Please have a more detailed discussion first.');
        }

        const totalContentLength = state.messages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
        if (totalContentLength < 100) {
            throw new Error('The conversation is too brief to extract meaningful project information. Please provide more details about your project idea.');
        }

        set({ loading: true, error: null });
        try {
            const response = await api.post(`/chats/${chatId}/create-project`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false });
            // Check for 429 or 503 and throw a specific error message
            if (error.response?.status === 429) {
                set({ error: "You have reached the daily limit for AI requests. Please try again tomorrow or upgrade your plan." });
                throw new Error("You have reached the daily limit for AI requests. Please try again tomorrow or upgrade your plan.");
            }
            if (error.response?.status === 503) {
                set({ error: "The AI service is currently overloaded. Please try again in a few minutes." });
                throw new Error("The AI service is currently overloaded. Please try again in a few minutes.");
            }
            const errorMessage = error.response?.data?.message || 'Failed to create project from chat';
            set({ error: errorMessage });
            // Enhance error message for better UX
            if (error.response?.status === 400) {
                throw new Error('Unable to extract project information from the conversation. Please provide more specific project details in your chat.');
            }
            throw new Error(errorMessage);
        }
    },

    // Delete chat
    deleteChat: async (chatId) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/chats/${chatId}`);

            set(state => ({
                chats: state.chats.filter(chat => chat._id !== chatId),
                currentChat: state.currentChat?._id === chatId ? null : state.currentChat,
                messages: state.currentChat?._id === chatId ? [] : state.messages,
                loading: false,
                // Clean up fetching state
                fetchingChats: { ...state.fetchingChats, [chatId]: false }
            }));

            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete chat';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Set current chat
    setCurrentChat: (chat) => {
        set({
            currentChat: chat,
            messages: chat?.messages || []
        });
    },

    // Add message to current chat (for optimistic updates)
    addMessage: (message) => {
        set(state => ({
            messages: [...state.messages, message]
        }));
    },

    // Clear current chat
    clearCurrentChat: () => {
        set({
            currentChat: null,
            messages: []
        });
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear all chat data
    clearChats: () => set({
        chats: [],
        currentChat: null,
        messages: [],
        loading: false,
        sending: false,
        error: null,
        fetchingChats: {}
    })
}));
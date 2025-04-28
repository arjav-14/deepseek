'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const { isLoaded: isUserLoaded, user } = useUser();
    const { isLoaded: isAuthLoaded, getToken } = useAuth();

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState({
        _id: null,
        messages: [],
        name: "New Chat",
        updatedAt: new Date()
    });

    const refreshCurrentChat = async () => {
        try {
            if (!selectedChat?._id) return;

            const token = await getToken();
            const response = await axios.get('/api/clerk/Chat/get', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                const updatedChats = response.data.data;
                const currentChat = updatedChats.find(chat => chat._id === selectedChat._id);
                
                if (currentChat) {
                    setSelectedChat(currentChat);
                    setChats(updatedChats);
                }
            }
        } catch (error) {
            console.error('Error refreshing chats:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to refresh chat');
        }
    };

    useEffect(() => {
        // Only refresh if selectedChat exists and has no messages yet
        if (selectedChat?._id && selectedChat.messages.length === 0) {
            refreshCurrentChat();
        }
    }, [selectedChat?._id]);

    const createNewChat = async () => {
        try {
            if (!user) {
                toast.error('Please login first');
                return null;
            }

            const token = await getToken();
            const response = await axios.post('/api/clerk/Chat/create', {
                name: "New Chat"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                const newChat = response.data.data;
                setChats(prev => [newChat, ...prev]);
                setSelectedChat(newChat);
                return newChat;
            }
            throw new Error(response.data.message || 'Failed to create chat');
        } catch (error) {
            console.error('Create chat error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to create chat');
            return null;
        }
    };

    const fetchUsersChats = async () => {
        try {
            const token = await getToken();
            if (!token) {
                console.error('No auth token available');
                return;
            }

            const response = await axios.get('/api/clerk/Chat/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setChats(response.data.data);
            } else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            console.error('Fetch chats error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch chats');
        }
    };

    useEffect(() => {
        if (isUserLoaded && isAuthLoaded && user) {
            fetchUsersChats();
        }
    }, [isUserLoaded, isAuthLoaded, user]);

    const value = {
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        createNewChat,
        fetchUsersChats,
        refreshCurrentChat
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

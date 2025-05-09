'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import assets from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const TIMEOUT = 120000; // 2 minutes

const PromptBox = ({ Loading, setLoading }) => {
    const [prompt, setPrompt] = useState('');
    const { user, selectedChat, setSelectedChat, createNewChat, refreshCurrentChat } = useAppContext();
    const { getToken } = useAuth();

    const sendAIRequest = async (chatId, prompt, token, retryCount = 0) => {
        try {
            const { data } = await axios.post('/api/clerk/Chat/ai', 
                {
                    chatId,
                    prompt
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: TIMEOUT
                }
            );
            return data;
        } catch (error) {
            if ((error.code === 'ECONNABORTED' || error.response?.status === 504) 
                && retryCount < MAX_RETRIES) {
                console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return sendAIRequest(chatId, prompt, token, retryCount + 1);
            }
            throw error;
        }
    };

    const sendPrompt = async (e) => {
        e.preventDefault();
        let currentPrompt = ''; 
        
        try {
            if (!user) {
                return toast.error('Please login to send messages');
            }
            
            if (Loading) {
                return toast.error('Please wait for the previous response');
            }

            currentPrompt = prompt.trim(); 
            if (!currentPrompt) {
                return toast.error('Please enter a message');
            }

            setLoading(true);
            setPrompt('');

            const userMessage = {
                role: 'user',
                content: currentPrompt,
                timestamp: new Date().toISOString()
            };

            let currentChat = selectedChat;

            if (!currentChat?._id) {
                currentChat = await createNewChat();
                if (!currentChat) {
                    setPrompt(currentPrompt);
                    setLoading(false);
                    return;
                }
            }

            setSelectedChat(prev => ({
                ...prev,
                messages: [...(prev.messages || []), userMessage]
            }));

            const token = await getToken();
            
            const data = await sendAIRequest(currentChat._id, currentPrompt, token);

            if (!data.success) {
                toast.error(data.message || 'Failed to get AI response');
                return;
            }

            const assistantMessage = {
                role: 'assistant',
                content: data.data.content,
                timestamp: new Date().toISOString()
            };

            setSelectedChat(prev => ({
                ...prev,
                messages: [...prev.messages, assistantMessage]
            }));

            await refreshCurrentChat();

        } catch (error) {
            console.error('Send prompt error:', error);
            if (currentPrompt) {
                setPrompt(currentPrompt); 
            }
            toast.error(
                error.code === 'ECONNABORTED' 
                    ? 'Request timed out. The AI is taking too long to respond.'
                    : error.response?.data?.message || 'Failed to get AI response'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrompt(e);
        }
    };

    return (
        <form
            onSubmit={sendPrompt}
            className={`w-full ${selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
        >
            <textarea
                onKeyDown={handleKeyDown}
                className="outline-none w-full resize-none overflow-hidden break-word bg-transparent text-white"
                rows={2}
                placeholder="Message DeepSeek"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray/20 transition">
                        <Image className="h-5" src={assets.deepthink_icon} alt="" />
                        DeepThink (R1)
                    </p>
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray/20 transition">
                        <Image className="h-5" src={assets.search_icon} alt="" />
                        Search (R1)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
                    <button
                        type="submit"
                        className={`${prompt.trim() ? "bg-blue-400" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}
                        disabled={!prompt.trim() || Loading}
                    >
                        <Image
                            className="w-3.5 aspect-square" 
                            src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull} 
                            alt=""
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PromptBox;
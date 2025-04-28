'use client';

import React from 'react';
import Image from 'next/image';
import assets from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const Chatlabel = ({ chat, openMenu, setOpenMenu }) => {
  const { fetchUsersChats, setSelectedChat } = useAppContext();
  const { getToken } = useAuth();

  if (!chat?._id) {
    return null;
  }

  const selectChat = () => {
    setSelectedChat(chat);
  };

  const renameHandler = async (e) => {
    try {
      e.stopPropagation(); // Prevent chat selection when clicking rename
      const newname = prompt('Enter new chat name:');
      if (!newname?.trim()) return;

      const token = await getToken();
      const { data } = await axios.post('/api/clerk/Chat/rename', 
        { 
          chatId: chat._id, 
          name: newname.trim() 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: null, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Rename error:', error);
      toast.error('Something went wrong while renaming.');
    }
  };

  const deleteHandler = async (e) => {
    try {
      e.stopPropagation(); // Prevent chat selection when clicking delete
      const confirmDelete = confirm('Are you sure you want to delete this chat?');
      if (!confirmDelete) return;

      const token = await getToken();
      const { data } = await axios.post('/api/clerk/Chat/delete', 
        { chatId: chat._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        // If this was the selected chat, reset it
        setSelectedChat(prev => prev?._id === chat._id ? null : prev);
        await fetchUsersChats();
        setOpenMenu({ id: null, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete chat');
    }
  };
  
  return (
    <div
      className="flex items-center justify-between py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer transition-colors relative"
      onClick={selectChat}
    >
      <p className="truncate text-sm flex-1">
        {chat?.name || 'New Chat'}
      </p>

      {/* Menu Button */}
      <div 
        className="relative ml-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="p-1 hover:bg-white/10 rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenu(prev => ({
              id: prev?.id === chat._id ? null : chat._id,
              open: prev?.id !== chat._id
            }));
          }}
        >
          <Image
            src={assets.three_dots}
            alt="Menu"
            width={16}
            height={16}
            className="w-4"
          />
        </button>

        {/* Dropdown Menu */}
        {openMenu?.open && openMenu?.id === chat._id && (
          <div 
            className="absolute right-0 top-8 bg-gray-700 rounded-xl py-1 w-40 z-50 shadow-xl border border-gray-600"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 w-full text-left text-white/80"
              onClick={renameHandler}
            >
              <Image 
                src={assets.pencil_icon} 
                alt="Rename" 
                width={16} 
                height={16} 
                className="w-4" 
              />
              <span>Rename</span>
            </button>

            <button
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 w-full text-left text-red-400"
              onClick={deleteHandler}
            >
              <Image 
                src={assets.delete_icon} 
                alt="Delete" 
                width={16} 
                height={16} 
                className="w-4" 
              />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatlabel;

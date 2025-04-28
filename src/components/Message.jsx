'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import assets from '@/assets/assets';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs'
const Message = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  
  // For user messages, clean asterisks. For AI messages, keep markdown formatting
  const messageContent = isUser ? content?.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') || '' : content || '';

    useEffect(()=>{
        Prism.highlightAll();
    }, [content])
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const handleRegenerate = () => {
    toast.success('Regenerating response...');
  };

  const handleFeedback = (type) => {
    toast.success(`${type} feedback recorded`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2">
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-4`}>
        
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="flex-shrink-0">
            <Image 
              src={assets.logo_icon} 
              alt="AI"
              width={32}
              height={32}
              className="rounded-full border border-white/15"
            />
          </div>
        )}

        {/* Message Bubble */}
        <div className={`group relative flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-xl ${
            isUser ? 'bg-blue-600' : 'bg-gray-700'
          }`}>
            {isUser ? (
              // Regular text for user messages
              <p className="text-white whitespace-pre-wrap break-words">
                {messageContent}
              </p>
            ) : (
              // Markdown for AI messages
              <div className="text-white prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    // Style code blocks
                    code: ({ node, inline, className, children, ...props }) => (
                      <code
                        className={`${className} ${
                          inline ? 'bg-gray-800 px-1 py-0.5 rounded' : 'block bg-gray-800 p-4 rounded-lg'
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                    // Style links
                    a: ({ node, className, children, ...props }) => (
                      <a
                        className="text-blue-400 hover:text-blue-300 underline"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {messageContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`absolute opacity-0 group-hover:opacity-100 transition-all duration-200
            ${isUser ? '-left-16 top-2.5' : 'left-9 -bottom-6'}`}>
            <div className="flex items-center gap-2 opacity-70">
              {isUser ? (
                <>
                  <Image 
                    src={assets.copy_icon} 
                    alt="Copy" 
                    width={16}
                    height={16}
                    className="w-4 cursor-pointer hover:opacity-100"
                    onClick={handleCopy}
                  />
                  <Image 
                    src={assets.pencil_icon} 
                    alt="Edit" 
                    width={16}
                    height={16}
                    className="w-4 cursor-pointer hover:opacity-100"
                    onClick={() => toast.info('Edit feature coming soon')}
                  />
                </>
              ) : (
                <>
                  <Image 
                    src={assets.copy_icon} 
                    alt="Copy" 
                    width={16}
                    height={16}
                    className="w-4 cursor-pointer hover:opacity-100"
                    onClick={handleCopy}
                  />
                  <Image 
                    src={assets.regenerate_icon} 
                    alt="Regenerate" 
                    width={16}
                    height={16}
                    className="w-4 cursor-pointer hover:opacity-100"
                    onClick={handleRegenerate}
                  />
                  <Image 
                    src={assets.like_icon} 
                    alt="Like" 
                    width={16}
                    height={16}
                    className="w-4 cursor-pointer hover:opacity-100"
                    onClick={() => handleFeedback('Positive')}
                  />
                  <Image 
                    src={assets.dislike_icon} 
                    alt="Dislike" 
                    width={16}
                    height={16}
                    className="w-4 cursor-pointer hover:opacity-100"
                    onClick={() => handleFeedback('Negative')}
                  />
                </>
              )}
            </div>
          </div>

          {/* Timestamp */}
          {timestamp && (
            <span className="text-xs text-gray-400 mt-1">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
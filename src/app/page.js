'use client';
import assets from "@/assets/assets";
import SideBar from "@/components/SideBar";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedChat?.messages]);

  return (
    <div className="bg-black">
      <div className="flex h-screen">
        <SideBar expand={expand} setExpand={setExpand} />
        <div className="flex-1 flex flex-col items-center px-4 pb-8 bg-[#29212d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => setExpand(!expand)}
              className="rotate-180 cursor-pointer"
              src={assets.menu_icon}
              alt="menu"
            />
            <Image className="opacity-70" src={assets.chat_icon} alt="chat" />
          </div>

          {!selectedChat?.messages?.length ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3">
                <Image 
                  src={assets.logo_icon} 
                  alt="Logo" 
                  width={64}
                  height={64}
                />
                <p className="text-2xl font-medium">Hi, I&apos;m DeepSeek</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className="relative flex flex-col w-full mt-20 px-4 max-h-[calc(100vh-180px)] overflow-y-auto"
            >
              <p className="fixed top-8 left-1/2 -translate-x-1/2 border border-transparent 
                hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold">
                {selectedChat.name}
              </p>
              
              {selectedChat.messages.map((msg, index) => (
                <Message
                  key={msg._id || `${msg.role}-${index}`}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timeStamp}
                />
              ))}

              {loading && (
                <div className="flex gap-4 py-4 max-w-3xl mx-auto w-full">
                  <Image 
                    src={assets.logo_icon} 
                    alt="AI thinking" 
                    width={32}
                    height={32}
                    className="rounded-full border border-white/15"
                  />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative mt-4 w-full max-w-3xl">
            <PromptBox loading={loading} setLoading={setLoading} />
            <p className="text-sm text-center text-gray-500 mt-2">
              AI-generated, for reference only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

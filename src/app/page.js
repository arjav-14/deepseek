'use client';
import assets from "@/assets/assets";
import SideBar from "@/components/SideBar";
import Image from "next/image";
import { useState } from "react";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
export default function Home() {
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);

  return (
    <div className="bg-black">
      <div className="flex h-screen">
        <SideBar expand={expand} setExpand={setExpand} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#29212d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180 cursor-pointer"
              src={assets.menu_icon}
              alt="menu"
            />
            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="chat"
            />
          </div>

          {message.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="" className="h-16 w-16" />
                <p className="text-2xl font-medium">Hi, I&apos;m DeepSeek</p>
              </div>
              <p className="text-sm mt-2">How Can I Help You Today?</p>
            </>
          ) : (
            <div>
              <Message role= 'user' content='what is next js'></Message>
            </div>
          )}

          {/* prompt box */}
          <PromptBox Loading={Loading} setLoading={setLoading}></PromptBox>

          <p className="text-sm absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}

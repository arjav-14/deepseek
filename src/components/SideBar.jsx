import React from 'react';
import Image from 'next/image';
import assets from '@/assets/assets';
import { useClerk , UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import Chatlabel from './Chatlabel';
const SideBar = ({ expand, setExpand }) => {
  const {openSignIn} = useClerk()
  const {user, chats , createNewChat} = useAppContext();
  const [openMenu , setOpenMenu] = React.useState({id: 0 , open : false})
  return (
    <div className={`flex flex-col justify-between bg-black pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expand ? 'p-4 w-64' : 'md:w-20 min-w-20 max-md:overflow-hidden'}`}>

      {/* Logo & Toggle Button */}
      <div>
        <div className={`flex ${expand ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
          {/* Logo */}
          <Image
            className={expand ? 'w-36' : 'w-10'}
            src={expand ? assets.logo_text : assets.logo_icon}
            alt="Company Logo"
          />

          {/* Toggle Sidebar Button */}
          <div
            onClick={() => setExpand(!expand)}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 rounded-lg cursor-pointer"
          >
            {/* Menu Icon for Mobile */}
            <Image src={assets.menu_icon} alt="Menu" className="md:hidden" />

            {/* Expand/Collapse Icon for Desktop */}
            <Image
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
              alt="Toggle Sidebar"
              className="hidden md:block w-10"
            />

            {/* Tooltip */}
            <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-white text-black text-sm px-3 rounded-lg shadow-lg pointer-events-none`}>
              {expand ? "Close sidebar" : "Open sidebar"}
              <div className={`w-3 h-3 absolute bg-white rotate-45 ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`} />
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button onClick={createNewChat}
  className={`mt-8 flex items-center justify-center cursor-pointer ${
    expand
      ? "bg-blue-500 hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max"
      : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"
  }`}
>
  <Image
    className={expand ? "w-6" : "w-7"}
    src={expand ? assets.chat_icon : assets.chat_icon_dull}
    alt="Chat Icon"
  />
  
  {/* Tooltip (only for collapsed sidebar) */}
  {!expand && (
    <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
      New chat
      <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
    </div>
  )}

  {/* Text label (only for expanded sidebar) */}
  {expand && (
    <p className="text-white text-sm font-medium">New chat</p>
  )}
</button>


        {/* Recents Section */}
        <div className={`mt-8 flex flex-col h-[calc(100vh-350px)] ${expand ? "block" : "hidden"}`}>
          <p className='text-white/25 font-medium mb-2 px-2'>Recents</p>
          
          {/* Chat List without scrollbar */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {chats.map((chat) => (
              <Chatlabel
                key={chat._id}
                chat={chat}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Get App Section */}
      <div>
        <div className={`flex items-center cursor-pointer group relative ${expand ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10 cursor-pointer" : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
          <Image
            className={expand ? "w-5" : "w-6.5 mx-auto"}
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt=''
          />
          <div className={`absolute -top-60 pb-8 ${!expand ? "-right-40" : ""} opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}>
            <div className='relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg'>
              <Image src={assets.qrcode} alt='' className='w-44' />
              <p>Scan to get deepseek app</p>
              <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "right-1/2" : "left-4"} -bottom-1.5`}></div>
            </div>
          </div>
          {expand && (
            <>
              <span>GET APP</span>
              <Image alt='' src={assets.new_icon} />
            </>
          )}
        </div>
        <div onClick={user ? null : openSignIn} className={`flex items-center ${expand ? "hover:bg-white/10 rounded-lg " :"justify-center w-full" } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}>
        {
          user ? <UserButton /> : <Image src={assets.profile_icon} alt='' className='w-7'></Image>
        }
          
          {expand && <span>My Profile</span>}
        </div>
      </div>

    </div>
  );
};

export default SideBar;

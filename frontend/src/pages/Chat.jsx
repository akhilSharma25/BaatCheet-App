import React, { useEffect, useState } from 'react'
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../LIB/api';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader.jsx';
import { useParams } from 'react-router';
import CallButton from '../components/CallButton.jsx';


//! https://chatgpt.com/c/68319568-db9c-8002-8a86-78cec20e75a5   pdna k liya important h stream 

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY
const ChatPage = () => {
  const {id:tagretUserId}=useParams()
  const [chatClient,setChatClient]=useState(null)
  const [channel,setChannel]=useState(null)
  const [loading,setLoading]=useState(true)


  const {authUser}=useAuthUser()
  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser // this will run only when authUser is available
  })

  useEffect(()=>{
    const initChat=async()=>{
if(!tokenData?.token || !authUser) return ;

try {
  console.log("Initializing Strem chat client");

  const client=StreamChat.getInstance(STREAM_API_KEY)
  await client.connectUser({
    id:authUser._id,
    name:authUser.fullname,
    image:authUser.profilePic
  },tokenData.token)

  const channelId=[authUser._id,tagretUserId].sort().join("-")

  const currChannel=client.channel("messaging",channelId,{
    members:[authUser._id,tagretUserId],
  })

  await currChannel.watch()

  setChatClient(client)
  setChannel(currChannel)
  
} catch (error) {
  console.error("Error in chat",error);
  
  toast.error("Could not connect to chat. Please try again")
}
finally{
  setLoading(false)
}
    }

    initChat()
  },[tokenData,authUser,tagretUserId])

   const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if(loading || !chatClient || !channel ) return <ChatLoader/>
  return (
    <div className='h-[93vh]'>
    <Chat client={chatClient} theme="messaging light">
  <Channel channel={channel}>
    <div className='w-full relative'>
      <CallButton handleVideoCall={handleVideoCall}/>
        <Window>
      <ChannelHeader />
      <MessageList />
      <MessageInput />
    </Window>
    </div>
  
    <Thread />
  </Channel>
</Chat>



    </div>
  )
}

export default ChatPage
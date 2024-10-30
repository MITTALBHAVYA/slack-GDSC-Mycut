// ChatPage.jsx
import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import UserList from '../components/chat/UserList';
// import { fetchMessages } from '../features/messageSlice.js';
import useSocket from '../hooks/useSocket.js';

const ChatPage = () => {
  const { workspaceId, channelId } = useParams();
  console.log("chatpage params input workspaceId : ",workspaceId," channelId : ",channelId);
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { joinChannel } = useSocket();

  useEffect(() => {
    if (!workspaceId || !channelId) {
      navigate('/workspaceorchannelnotfound');
    } else if(channelId!=="greet"){
      // dispatch(fetchMessages(workspaceId,channelId));
      joinChannel(channelId);
    }
  }, [channelId, joinChannel, navigate, workspaceId]);

  if (!workspaceId || !channelId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a workspace and channel</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {channelId === "greet" ? (
          <main className="flex-1 flex flex-col">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Welcome! Please select a channel from the sidebar to start chatting.
              </p>
            </div>
            </main>
          ) : (
            <>
            <main className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <MessageList />
              </div>
              <MessageInput />
            </main>
            <UserList workspaceId={workspaceId} channelId={channelId}/>
            </>
          )}
        
      </div>
    </div>
  );
};

export default ChatPage;

// ChatPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import useSocket from '../hooks/useSocket.js';
import { useDispatch } from 'react-redux';
import { fetchChannelMembers } from '../features/channelSlice.js';

const SPECIAL_CHANNELS = {
  GREET: "greet",
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const { workspaceId, channelId } = useParams();
  const navigate = useNavigate();
  const { joinChannel } = useSocket();

  useEffect(() => {
    if (!workspaceId || !channelId) {
      navigate('/workspaceorchannelnotfound');
      return;
    }
    
    if (channelId !== SPECIAL_CHANNELS.GREET) {
      joinChannel(channelId);
      dispatch(fetchChannelMembers({ workspaceId, channelId }));
    }
  }, [channelId, joinChannel, navigate, workspaceId,dispatch]);

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
        {channelId === SPECIAL_CHANNELS.GREET ? (
          <main className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500">
              Welcome! Please select a channel from the sidebar to start chatting.
            </p>
          </main>
        ) : (
            <main className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <MessageList workspaceId={workspaceId} channelId={channelId} />
              </div>
              <MessageInput channelId={channelId}/>
            </main>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

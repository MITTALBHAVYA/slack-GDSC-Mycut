// ChatPage.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import UserList from '../components/chat/UserList';
import { fetchMessages } from '../features/messageSlice.js';
import useSocket from '../hooks/useSocket.js';

const ChatPage = () => {
  const { workspaceId, channelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { joinChannel } = useSocket();

  useEffect(() => {
    if (!workspaceId || !channelId) {
      navigate('/'); // Redirect if no workspace or channel is selected
    } else {
      dispatch(fetchMessages(channelId));
      joinChannel(channelId);
    }
  }, [channelId, dispatch, joinChannel, navigate, workspaceId]);

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
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <MessageList />
          </div>
          <MessageInput />
        </main>
        <UserList />
      </div>
    </div>
  );
};

export default ChatPage;

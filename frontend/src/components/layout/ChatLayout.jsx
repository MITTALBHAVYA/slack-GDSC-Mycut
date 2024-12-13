// ChatLayout.jsx
import WorkspaceList from '../workspace/WorkspaceList';
import ChannelList from '../chat/ChannelList';
import MessageList from '../chat/MessageList';
import MessageInput from '../chat/MessageInput';
import Header from './Header';

const ChatLayout = () => {
  return (
    <div className="h-screen flex">
      <WorkspaceList />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <ChannelList />
          <div className="flex-1 flex flex-col">
            <MessageList />
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
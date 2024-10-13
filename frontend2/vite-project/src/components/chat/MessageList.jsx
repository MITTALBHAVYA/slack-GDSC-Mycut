// MessageList.jsx
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../features/messageSlice.js';

const MessageList = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { messages, isLoading } = useSelector((state) => state.message);
  const currentChannel = useSelector((state) => state.channel.currentChannel);
  const currentWorkspace = useSelector((state) => state.workspace.currentWorkspace);

  useEffect(() => {
    if (currentWorkspace && currentChannel) {
      dispatch(fetchMessages({
        workspaceId: currentWorkspace.id,
        channelId: currentChannel.id
      }));
    }
  }, [currentWorkspace, currentChannel, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentChannel) return <div>Select a channel</div>;
  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="text-gray-500">No messages yet</div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  {message.username?.[0]?.toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {message.username}
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </p>
                <p className="text-sm text-gray-700">{message.message}</p>
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

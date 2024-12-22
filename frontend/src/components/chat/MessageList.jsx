import { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../features/messageSlice.js';
// import useSocket from '../../hooks/useSocket.js';
import { useParams } from 'react-router-dom';

const MessageList = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  // const { socket } = useSocket();
  const { messages, isLoading, error } = useSelector((state) => state.message);
  const { workspaceId, channelId } = useParams();
  const user = useSelector((state) => state.auth.user);

  // Memoize messages to prevent unnecessary re-renders
  const sortedMessages = useMemo(() => 
    [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), 
    [messages]
  );

  // Fetch messages when workspace or channel changes
  useEffect(() => {
    if (workspaceId && channelId) {
      dispatch(fetchMessages({ workspaceId, channelId }));
    }
  }, [channelId, dispatch, workspaceId]);

  // Scroll to bottom after messages update
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timer);
  }, [sortedMessages]);

  // Socket listener for new messages
  // useEffect(() => {
  //   if (socket) {
  //     const handleNewMessage = (message) => {
  //       dispatch(addMessage(message));
  //     };

  //     socket.on('newMessage', handleNewMessage);
  //     return () => {
  //       socket.off('newMessage', handleNewMessage);
  //     };
  //   }
  // }, [socket, dispatch]);

  // Render loading state
  if (!channelId) return (
    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
      Select a channel to view messages
    </div>
  );

  // Render loading state
  if (isLoading) return (
    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
      Loading messages...
    </div>
  );

  // Render error state
  if (error) return (
    <div className="flex items-center justify-center h-full text-red-500 text-lg">
      Error loading messages: {error}
    </div>
  );

  return (
    <div 
      ref={messageListRef} 
      className="flex-1 overflow-y-auto p-4 bg-white space-y-4"
    >
      {sortedMessages.length === 0 ? (
        <div className="text-gray-500 text-center py-4 text-lg font-medium">
          No messages yet. Start the conversation!
        </div>
      ) : (
        sortedMessages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-md w-full p-3 rounded-lg
                ${message.user_id === user.id
                  ? 'bg-gray-700 text-gray-100 mr-2'
                  : 'bg-gray-600 text-gray-100 ml-2'}
                shadow-md transition-all duration-300 ease-in-out
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-1">
                {message.userId !== user.id && (
                  <span className="text-sm font-semibold text-gray-300">
                    {message?.username}
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
             
              {message.attachments?.map((attachment, index) => (
                <div 
                  key={index} 
                  className='flex flex-row items-start justify-between space-x-2 mb-2'
                >
                  <div className='text-sm text-gray-300'>
                    {attachment.filename}
                  </div>
                  {attachment.url && (
                    <a 
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='text-sm text-blue-400 underline flex flex-row'
                    >
                      <img 
                        src={attachment.url} 
                        alt="attachedpic" 
                        className="w-[18rem] h-[8rem] object-cover rounded-md"
                      />
                    </a>
                  )}
                </div>
              ))}
              <span className="text-sm break-words">{message.message}</span>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
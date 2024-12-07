import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages } from '../../features/messageSlice.js';
import useSocket from '../../hooks/useSocket.js';
import { useParams } from 'react-router-dom';

const MessageList = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const { messages, isLoading } = useSelector((state) => state.message);
  const { workspaceId, channelId } = useParams();
  const user = useSelector((state) => state.auth.user);
  // console.log("user.id : ",user.id," messages[0].userId : ",messages);

  useEffect(() => {
    if (workspaceId && channelId) {
      dispatch(
        fetchMessages({
          workspaceId,
          channelId,
        })
      );
    }
  }, [channelId, dispatch, workspaceId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        dispatch(addMessage(message));
      });
      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, dispatch]);

  if (!channelId) return (
    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
      Select a channel to view messages
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
      Loading messages...
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white  space-y-4">
      {messages.length === 0 ? (
        <div className="text-gray-500 text-center py-4 text-lg font-medium">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => (
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
              <p className="text-sm break-words">{message.message}</p>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
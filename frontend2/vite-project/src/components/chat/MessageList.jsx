// MessageList.jsx
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages } from '../../features/messageSlice.js';
import useSocket from '../../hooks/useSocket.js';
import PropTypes from 'prop-types';

const MessageList = ({workspaceId,channelId}) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const {socket} = useSocket();
  const { messages, isLoading } = useSelector((state) => state.message);

  console.log("message list ", messages, "here is messages.messages", messages.messages);

  useEffect(() => {
    if (workspaceId && channelId) {
      console.log("message list workspaceId : ",workspaceId, " channelId : ",channelId);
      dispatch(fetchMessages({
        workspaceId,
        channelId
      }));
    }
  }, [channelId, dispatch, workspaceId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(()=>{
    if(socket){
      socket.on('newMessage',(message)=>{
        dispatch(addMessage(message));
      });

      return ()=>{
        socket.off('newMessage');
      }
    }

  },[socket,dispatch]);

  if (!channelId) return <div>Select a channel</div>;
  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="text-gray-500">No messages yet</div>
      ) : (
        messages.map((message) => (
          <div key={message._id} className="mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  {message.user_id?.[0]?.toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {message.user_id}
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

MessageList.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  channelId: PropTypes.string.isRequired,
};
export default MessageList;

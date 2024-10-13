// MessageInput.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useSocket from '../../hooks/useSocket.js';

const MessageInput = ({ channelId }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useSocket();
  const userId = useSelector((state) => state.auth.user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      sendMessage({
        channelId,
        message: message.trim(),
        userId,
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 border-t">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="px-6 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        Send
      </button>
    </form>
  );
};
MessageInput.propTypes = {
  channelId: PropTypes.string.isRequired, // channelId must be a string and is required
};

export default MessageInput;

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useSocket from '../../hooks/useSocket.js';
import { FiSend, FiVideo, FiPhone, FiPaperclip } from 'react-icons/fi';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { socket, sendMessage } = useSocket();
  const userId = useSelector((state) => state.auth.user?.id);
  const username = useSelector((state) => state.auth.user?.username);
  const { channelId } = useParams();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !channelId || !userId || !username) return;

    setIsLoading(true);
    try {
      const newMessage = {
        channelId,
        message: message.trim(),
        userId,
        username,
        timestamp: new Date().toISOString(),
      };
      if (file) {
        console.log('file :', file);
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result.split(',')[1];
          newMessage.file = {
            data: fileData,
            name: file.name,
            mimetype: file.type,
          };
          sendMessage(newMessage);
        };
        reader.readAsDataURL(file);
      }
      else {
        sendMessage(newMessage);
      }
      setMessage('');
      setFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border-t bg-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Start Video Call"
        >
          <FiVideo size={20} />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Start Voice Call"
        >
          <FiPhone size={20} />
        </button>
        <label
          className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          title="Upload File"
        >
          <FiPaperclip size={20} />
          <input type="file" onChange={handleFileChange} className='hidden' disabled={isLoading || !socket} />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading || !socket}
        />
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && !file) || !socket}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          <FiSend size={20} className="mr-1" />
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

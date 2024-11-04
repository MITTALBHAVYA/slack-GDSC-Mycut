// Updated ChannelList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../../features/channelSlice.js';
import { PlusIcon } from 'lucide-react';
import { CreateChannel } from './CreateChannel';

const ChannelList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channels, currentChannel, isLoading } = useSelector((state) => state.channel);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const [localChannels, setLocalChannels] = useState([]);
  const [pendingChannel, setPendingChannel] = useState(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchChannels(currentWorkspace.id));
      setLocalChannels([]);
    }
  }, [currentWorkspace, dispatch]);

  useEffect(() => {
    if (channels?.channels?.[0]) {
      setLocalChannels(Array.isArray(channels.channels[0]) ? channels.channels[0] : []);
    } else {
      setLocalChannels([]);
    }
  }, [channels]);

  const handleChannelClick = (channel) => {
    if (channel?.id) {
      setPendingChannel(channel);
      dispatch(setCurrentChannel(channel));
    }
  };

  useEffect(() => {
    if (pendingChannel && currentChannel?.id === pendingChannel.id) {
      navigate(`/workspace/${currentWorkspace.id}/${currentChannel.id}`);
      setPendingChannel(null);
    }
  }, [currentChannel, pendingChannel, navigate, currentWorkspace]);

  if (!currentWorkspace) return <div>Select a workspace</div>;
  if (isLoading) return <div>Loading channels...</div>;

  return (
    <div className="bg-gray-700 w-64 flex-shrink-0">
      <div className="px-4 py-2 border-b border-gray-600">
        <h2 className="text-white font-semibold">{currentWorkspace.name}</h2>
      </div>

      <div className="px-2 py-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-400 text-sm">Channels</h3>
          <button
            onClick={() => setShowCreateChannel(true)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-600"
            title="Create Channel"
          >
            <PlusIcon size={16} />
          </button>
        </div>

        {localChannels.length === 0 ? (
          <div className="text-gray-400">No channels available</div>
        ) : (
          localChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelClick(channel)}
              className={`w-full text-left px-2 py-1 rounded ${
                currentChannel?.id === channel.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-300 hover:bg-gray-600'
              }`}
            >
              # {channel.name || 'may be error'}
            </button>
          ))
        )}
      </div>

      {showCreateChannel && (
        <CreateChannel
          onClose={() => {
            setShowCreateChannel(false);
            if (currentWorkspace) {
              dispatch(fetchChannels(currentWorkspace.id));
            }
          }}
        />
      )}
    </div>
  );
};

export default ChannelList;

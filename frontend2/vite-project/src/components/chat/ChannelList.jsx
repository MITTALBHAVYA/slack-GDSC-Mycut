// ChannelList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../../features/channelSlice.js';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannel, isLoading } = useSelector((state) => state.channel);
  const currentWorkspace = useSelector((state) => state.workspace.currentWorkspace);
  const [localChannels, setLocalChannels] = useState([]);

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchChannels(currentWorkspace.id));
    }
  }, [currentWorkspace, dispatch]);

  useEffect(()=>{
    if(channels && channels.channels && channels.channels[0]){
      setLocalChannels(channels.channels[0]);
    }
  },[channels]);

  const handleChannelClick = (channel) => {
    dispatch(setCurrentChannel(channel));
  };

  if (!currentWorkspace) return <div>Select a workspace</div>;
  if (isLoading) return <div>Loading channels...</div>;
  return (
    <div className="bg-gray-700 w-64 flex-shrink-0">
      <div className="px-4 py-2 border-b border-gray-600">
        <h2 className="text-white font-semibold">{currentWorkspace.name}</h2>
      </div>
      <div className="px-2 py-2">
        <h3 className="text-gray-400 text-sm mb-2">Channels</h3>
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
              # {channel.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChannelList;

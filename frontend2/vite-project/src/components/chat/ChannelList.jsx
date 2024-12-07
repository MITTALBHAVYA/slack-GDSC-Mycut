import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../../features/channelSlice.js';
import { PlusIcon } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import CreateChannel from './CreateChannel';

const ChannelList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channels, currentChannel, isLoading } = useSelector((state) => state.channel);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  
  const [localChannels, setLocalChannels] = useState([]);
  const [pendingChannel, setPendingChannel] = useState(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredChannels = localChannels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentWorkspace) return <div className="text-center text-gray-500">Select a workspace</div>;
  if (isLoading) return <div className="text-center text-gray-500">Loading channels...</div>;

  return (
    <div className="bg-gray-800 w-64 flex-shrink-0 h-full border-r border-gray-700">
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-300 text-lg font-medium">Channels</h3>
          <button
            onClick={() => setShowCreateChannel(true)}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
            title="Create Channel"
          >
            <PlusIcon size={20} />
          </button>
        </div>
        {localChannels.length === 0 ? (
          <div className="text-gray-500 text-sm">No channels available</div>
        ) : (
          <Listbox onChange={handleChannelClick}>
            <div className="relative">
              <ListboxButton className="w-full px-4 py-2 text-left text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {currentChannel ? `#${currentChannel.name}` : 'Select a channel'}
              </ListboxButton>
              <ListboxOptions className="absolute mt-2 w-full bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 text-white bg-gray-600 border-none rounded-t-lg focus:outline-none"
                />
                <div className="max-h-48 overflow-y-auto">
                  {filteredChannels.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">No channels found</div>
                  ) : (
                    filteredChannels.map((channel) => (
                      <ListboxOption
                        key={channel.id}
                        value={channel}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 ${
                            active ? 'bg-gray-600 text-white' : 'text-gray-300'
                          }`
                        }
                      >
                        #{channel.name || 'Unnamed Channel'}
                      </ListboxOption>
                    ))
                  )}
                </div>
              </ListboxOptions>
            </div>
          </Listbox>
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
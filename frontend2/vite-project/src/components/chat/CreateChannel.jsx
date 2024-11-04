// CreateChannel.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../../features/channelSlice';
import {XIcon } from 'lucide-react';

export const CreateChannel = ({ onClose }) => {
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { isLoading } = useSelector((state) => state.channel)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!channelName.trim()) {
      setError('Channel name cannot be empty');
      return;
    }

    // Remove special characters and spaces, convert to lowercase
    const formattedName = channelName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-');

    try {
      await dispatch(createChannel({
        workspaceId: currentWorkspace.id,
        channelData: { name: formattedName }
      })).unwrap();
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create channel');
  };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-semibold">Create Channel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. general"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
CreateChannel.propTypes = {
    onClose: PropTypes.func.isRequired,
  };
// UserList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchChannelMembers } from '../../features/channelSlice.js';

const UserList = ({ channelId }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.channel.members);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchChannelMembers(channelId)).unwrap();
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [channelId, dispatch]);

  if (isLoading) {
    return <div className="p-4">Loading members...</div>;
  }

  return (
    <div className="p-4 border-l">
      <h3 className="text-lg font-semibold mb-4">Channel Members</h3>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{member.username}</span>
            {member.role !== 'member' && (
              <span className="text-xs text-gray-500 ml-1">({member.role})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define prop types for validation
UserList.propTypes = {
  channelId: PropTypes.string.isRequired, // Ensure channelId is a required string
};

export default UserList;

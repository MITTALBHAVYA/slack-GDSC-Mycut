// UserList.jsx
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChannelMembers } from '../../features/channelSlice.js';
import PropTypes from 'prop-types';

const UserList = ({ workspaceId, channelId }) => {
  const dispatch = useDispatch();
  // const { channelMembers } = useSelector((state) => state.channel);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(fetchChannelMembers({ workspaceId, channelId })).unwrap();
        setMembers(response.data);
      } catch (error) {
        console.error('Failed to fetch channel members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [workspaceId, channelId, dispatch]);

  if (isLoading) {
    return <div className="p-4">Loading channel members...</div>;
  }

  return (
    <div className="p-4 border-l">
      <h3 className="text-lg font-semibold mb-4">Channel Members</h3>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.userId} className="flex items-center space-x-2">
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

UserList.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  channelId: PropTypes.string.isRequired,
};

export default UserList;

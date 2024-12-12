import { useSelector } from 'react-redux';
import AddUser from './AddUser.jsx';

const UserList = () => {
  const members = useSelector((state) => state.channel.channelMembers);

  return (
    <>
      <h3 className="text-lg font-semibold">
        Users in Channel ({members.length})
      </h3>
      <div className="p-4 border-l">
        {/* Scrollable user list container */}
        <div className="space-y-2 h-32 overflow-y-auto hide-scrollbar">
          <ul>
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
        {/* Add User button */}
      </div>
      <AddUser />
    </>
  );
};

export default UserList;

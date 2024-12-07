// UserList.jsx

import {useSelector } from 'react-redux';
import AddUser from './AddUser.jsx';
const UserList = () => {

  const members = useSelector((state)=>state.channel.channelMembers);
  return (
    <div className="p-4 border-l">
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
      <AddUser/>
    </div>
  );
};


export default UserList;

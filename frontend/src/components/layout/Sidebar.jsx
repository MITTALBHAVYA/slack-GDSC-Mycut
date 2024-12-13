import { useSelector } from 'react-redux';
import UserList from '../chat/UserList';
import ChannelList from '../chat/ChannelList';
import { useParams } from 'react-router-dom';

const Sidebar = () => {
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { channelId } = useParams();
  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col relative shadow-lg">
      {currentWorkspace ? (
        <div className="flex-3 hide-scrollbar">
          <div className="border-b border-gray-600 p-4">
            <h2 className="text-xl font-bold">{currentWorkspace.name}</h2>
          </div>
          <div className="p-2">
            <ChannelList />
          </div>
          {channelId!=="greet" && (
            <div className="mt-4 p-2 border-t border-gray-600">
              <UserList/>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-center">
            Select a workspace to view channels
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

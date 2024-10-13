// Sidebar.jsx
import { useSelector } from 'react-redux';
import WorkspaceList from '../workspace/WorkspaceList';
import ChannelList from '../chat/ChannelList';

const Sidebar = () => {
  const currentWorkspace = useSelector((state) => state.workspace.currentWorkspace);

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-full">
      <WorkspaceList />
      {currentWorkspace ? (
        <div className="flex-1 overflow-y-auto">
          <ChannelList/>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Select a workspace to view channels</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

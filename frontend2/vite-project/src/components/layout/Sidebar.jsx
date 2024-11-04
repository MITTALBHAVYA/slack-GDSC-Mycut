// Sidebar.jsx
import { useSelector } from 'react-redux';
import WorkspaceList from '../workspace/WorkspaceList';
import ChannelList from '../chat/ChannelList';

const Sidebar = () => {
  const { workspaces,currentWorkspace } = useSelector((state) => state.workspace);

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-full">
      <WorkspaceList workspaces={workspaces}/>
      {currentWorkspace ? (
        <div className="flex-3 overflow-y-auto">
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

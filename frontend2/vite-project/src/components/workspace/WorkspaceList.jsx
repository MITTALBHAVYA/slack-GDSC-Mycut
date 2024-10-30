// WorkspaceList.jsx
import PropTypes from 'prop-types'; 
import CreateWorkspace from './CreateWorkspace.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Missing import for dispatch
import { setCurrentWorkspace } from '../../features/workspaceSlice.js';
import { setCurrentChannel } from '../../features/channelSlice.js';

const WorkspaceList = ({ workspaces }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const handleWorkspaceClick = (workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setCurrentChannel(null));
    navigate(`/workspace/${workspace.id}/greet`);
  };

  return (
    <div className="bg-gray-800 w-16 flex-shrink-0 flex flex-col items-center py-4">
      {workspaces.length === 0 ? (
        <div className="text-gray-500">No workspaces available</div>
      ) : (
        workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => handleWorkspaceClick(workspace)}
            className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center text-white font-semibold bg-gray-700 hover:bg-gray-600"
          >
            {workspace.name.charAt(0).toUpperCase() + workspace.name.slice(1).toLowerCase()}
          </button>
        ))
      )}

      <CreateWorkspace />
    </div>
  );
};

// Prop types validation
WorkspaceList.propTypes = {
  workspaces: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
};

export default WorkspaceList;

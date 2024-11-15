// WorkspaceList.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Missing import for dispatch
import { setCurrentWorkspace } from '../../features/workspaceSlice.js';
import { setCurrentChannel } from '../../features/channelSlice.js';
import { ArrowRightCircle } from 'lucide-react';

const WorkspaceList = ({ workspaces }) => {
    const dispatch = useDispatch(); // Initialize dispatch
    const navigate = useNavigate();
    

    const user = useSelector((state) => state.auth.user);
    console.log("here is the workspace user", user);
    //user have name, email, id
    const handleWorkspaceClick = (workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        dispatch(setCurrentChannel(null));
        navigate(`/workspace/${workspace.id}/greet`);
    };

    return (
        <div className='createworkspace'>
            <div className='malikemail'>
                <p className='text-gray-700 text-[15px]'>
                    workspaces for {user.email}
                </p>
            </div>

            <hr className="w-full h-1 bg-gray-200" />
            
            <div className="flex-1 overflow-y-auto w-full no-scrollbar">
                {workspaces.length === 0 ? (
                    <div className="p-4 text-gray-500">No workspaces available</div>
                ) : (
                    <div className="px-4 py-2 h-[5rem]">
                        {
                            workspaces.map((workspace) => (
                                <div key={workspace.id} className='flex items-center hover:bg-gray-50 h-[4rem] mb-3 workspacelist'>
                                    <div className="bg-gray-500 flex items-center justify-center h-[4rem] w-[4rem]">
                                        <span>{workspace.name[0].toUpperCase()}</span>
                                    </div>
                                    <span className='text-grey-700'> {workspace.name}</span>
                                    <button onClick={() => handleWorkspaceClick(workspace)} className='p-2 text-gray-600 hover:text-gray-800'>
                                        <ArrowRightCircle size={40} />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
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

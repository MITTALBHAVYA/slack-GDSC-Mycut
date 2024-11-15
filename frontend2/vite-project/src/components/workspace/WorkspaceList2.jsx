// WorkspaceList.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Missing import for dispatch
import { setCurrentWorkspace } from '../../features/workspaceSlice.js';
import { setCurrentChannel } from '../../features/channelSlice.js';
import { ArrowRightCircle, Search } from 'lucide-react';
import { useState } from 'react';

const WorkspaceList = ({ workspaces }) => {
    const dispatch = useDispatch(); // Initialize dispatch
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    //user have name, email, id
    const handleWorkspaceClick = (workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        dispatch(setCurrentChannel(null));
        navigate(`/workspace/${workspace.id}/greet`);
    };

    const filteredWorkspacecs = (isSearchFocused && searchTerm.length >= 4) ? workspaces.filter(workspace => workspace.name.toLowerCase().startsWith(searchTerm.toLowerCase())) : workspaces;

    return (
        <div className='w-full'>
            <div className='createworkspace'>
                <div className='malikemail'>
                    <p className='text-gray-700 text-[15px]'>
                        workspaces for {user.email}
                    </p>
                </div>

                <hr className="w-full h-1 bg-gray-200" />

                <div className="flex-1 overflow-y-auto w-full no-scrollbar">
                    {workspaces.length === 0 ? (
                        <div className="p-4 text-gray-500">{(isSearchFocused && searchTerm.length >= 4) ? "No matching found" : "No workspaces available"}</div>
                    ) : (
                        <div className="px-4 py-2 h-[5rem]">
                            {
                                filteredWorkspacecs.map((workspace) => (
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
            <div className="mt-[3rem] w-full relative ">
                <div className="flex items-center border rounded-md bg-gray-200 h-[5rem]">
                    <div className='flex border items-center w-full content-center rounded-[20px] bg-white'>
                        <Search className="w-5 h-5 text-gray-800 ml-2" />
                        <input
                            type="text"
                            placeholder='Search Workspace (min 4 characters)'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full px-3 py-2 bg-transparent focus:outline-none text-gray-700 border border-transparent hover:border-gray-200"
                        />

                    </div>
                </div>
                {isSearchFocused && searchTerm.length > 0 && searchTerm.length < 4 && (
                    <p className='text-sm text-gray-500 mt-1 ml-2'>
                        Pleae type at least 4 characters to search
                    </p>
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

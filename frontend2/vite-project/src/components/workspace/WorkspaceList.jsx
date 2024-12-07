import CreateWorkspace from './CreateWorkspace.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setCurrentWorkspace } from '../../features/workspaceSlice.js';
import { setCurrentChannel } from '../../features/channelSlice.js';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

const WorkspaceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);
  const [searchTerm, setSearchTerm] = useState("");

  const handleWorkspaceClick = (workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setCurrentChannel(null));
    navigate(`/workspace/${workspace.id}/greet`);
  };

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-row bg-gray-800 items-center space-x-4">
      <Listbox onChange={handleWorkspaceClick}>
        <div className="relative">
          <ListboxButton className="w-64 px-4 py-2 text-white bg-gray-700 rounded-lg">
            {currentWorkspace ? currentWorkspace.name : "Select a workspace"}
          </ListboxButton>
          <ListboxOptions
            className="absolute mt-2 w-64 bg-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search workspace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-600 border-none rounded-t-lg focus:outline-none"
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredWorkspaces.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No workspaces found</div>
              ) : (
                filteredWorkspaces.map((workspace) => (
                  <ListboxOption
                    key={workspace.id}
                    value={workspace}
                    className={({ active }) =>
                      `cursor-pointer px-4 py-2 ${
                        active ? 'bg-gray-600 text-white' : 'text-gray-300'
                      }`
                    }
                  >
                    {workspace.name.charAt(0).toUpperCase() + workspace.name.slice(1).toLowerCase()}
                  </ListboxOption>
                ))
              )}
            </div>
          </ListboxOptions>
        </div>
      </Listbox>
      <CreateWorkspace />
    </div>
  );
};

export default WorkspaceList;

// CreateWorkspace.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createWorkspace,fetchWorkspaces } from '../../features/workspaceSlice.js';
// import { Plus } from 'lucide-react';

const CreateWorkspace = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      dispatch(createWorkspace({ name })).unwrap();
      dispatch(fetchWorkspaces());
      setName(''); 
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="workspacebtn"
      >
        <span>Create a Workspace</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Create a new Workspace</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700">
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="workspace-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter workspace name"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className={`${
                    isLoading || !name.trim() ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isLoading ? 'Creating...' : 'Create Workspace'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ml-2 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateWorkspace;

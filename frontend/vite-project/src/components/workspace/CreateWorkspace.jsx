// CreateWorkspace.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createWorkspace, fetchWorkspaces } from '../../features/workspaceSlice.js';
import { Plus } from 'lucide-react';

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
      {/* Trigger Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gray-700 hover:bg-gray-600"
        aria-label="Create a new workspace"
      >
        <Plus size={20} />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-100 rounded-lg p-8 max-w-md w-full shadow-lg">
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">Create a new Workspace</h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Workspace Name Input */}
              <div className="mb-4">
                <label 
                  htmlFor="workspace-name" 
                  className="block text-sm font-medium mb-1"
                >
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="workspace-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter workspace name"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end">
                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className={`py-2 px-4 text-sm font-medium rounded-md focus:outline-none ${
                    isLoading || !name.trim()
                      ? 'bg-indigo-500 hover:bg-indigo-600'
                      : 'bg-indigo-700 hover:bg-indigo-800'
                  } focus:ring-2 focus:ring-indigo-500`}
                >
                  {isLoading ? 'Creating...' : 'Create Workspace'}
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ml-2 py-2 px-4 text-sm bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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

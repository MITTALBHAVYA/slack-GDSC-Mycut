// WorkspacePage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/layout/Header.jsx';
import WorkspaceList from '../components/workspace/WorkspaceList.jsx';
import { fetchWorkspaces} from '../features/workspaceSlice.js';


const WorkspacePage = () => {
  const dispatch = useDispatch();
  const { workspaces, isLoading, error } = useSelector((state) => state.workspace);
  console.log('Workspaces : ',workspaces);
  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">Loading workspaces...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchWorkspaces())}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Your Workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <WorkspaceList workspaces={workspaces} />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;

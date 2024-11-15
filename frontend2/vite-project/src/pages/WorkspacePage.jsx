// WorkspacePage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Header from '../components/layout/Header.jsx';
import WorkspaceList from '../components/workspace/WorkspaceList2.jsx';
import CreateWorkspace from '../components/workspace/CreateWorkspace2.jsx';
import { fetchWorkspaces } from '../features/workspaceSlice.js';
import Navbar from '../components/layout/Navbar.jsx';
import PageLayout from '../components/layout/PageLayout.jsx';


const WorkspacePage = () => {
  const dispatch = useDispatch();
  const { workspaces, isLoading, error } = useSelector((state) => state.workspace);
  console.log('Workspaces : ', workspaces);
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
    <PageLayout>
      <div className="flex flex-col relative bg-transparent">
        <Navbar variant='workspace' />
        <div className="flex-1 p-6 mt-[8rem]">
          <div className='flex flex-col ml-[2%] mr-[2%] mt-[0%] lg:ml-[5%] lg:mr-[40%] mt-[0%] pt-0 relative'>
            <h1 className="WhiteText text-white text-3xl sm:text-4xl md:text-5xl -mt-8 mb-[2rem]">Create a new GDSC Slack workspace</h1>
            <p className="connect text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide"> Gdsc Slack gives your team a home - a place where they can talk and work together. To create a new fetchWorkspaces, click on the button below</p>
          </div>
          <div className='flex items-center justify-center bg-transparent'>
            <div className=' centered-container mt-[2rem] relative'>
              <div className='flex flex-col items-center justify-center mb-[10%]'>
                <CreateWorkspace />
                <img src="/images/FloatingRobot.png" alt="floatingrobot" className='workspacebot w-[6rem]' />
              </div>
              <div className='w-full flex flex-col items-center justify-center'>
                <p className='opnwksp'>Open a workspace</p>
                <WorkspaceList workspaces={workspaces} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WorkspacePage;

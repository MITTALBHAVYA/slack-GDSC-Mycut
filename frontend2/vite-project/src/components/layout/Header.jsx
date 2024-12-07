// Header.jsx
import Logo from '../ui/Logo.jsx';
import UserProfilePopUp from '../ui/UserProfilePopUp.jsx';
import WorkspaceList from '../workspace/WorkspaceList.jsx';

const Header = () => {  

  return (
    <header className="bg-gray-800 text-white h-14 flex items-center justify-between px-4">
      <Logo />
      <WorkspaceList />
      <div className="flex items-center space-x-4">
        <UserProfilePopUp/>
      </div>
    </header>
  );
};

export default Header;

import { Link, } from 'react-router-dom';
const Logo = () => (
    <div className="gdscslacklogo text-white font-bold tracking-wider ml-6 flex items-center">
      <Link to="/" className="text-shadow-md text-3xl lg:text-3xl flex items-center gdsclogolink">
        <img src="/images/logo.png" alt="G" className="logo-image w-12 h-12" />
        GDSC SLACK
      </Link>
    </div>
  );
export default Logo;
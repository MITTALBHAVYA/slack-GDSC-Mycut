import PageLayout from '../components/layout/PageLayout.jsx';
import SpaceRobot2 from "../components/SpaceRobot/SpaceRobot2.jsx";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <PageLayout>
      <div className="relative flex justify-between items-start w-full h-full">
        <div
          className="upper-left-vector top-0 left-0 w-1/3 lg:w-1/5 h-[315px] bg-contain bg-no-repeat"
          style={{ backgroundImage: 'url("/images/Vector2.png")' }}
        />
        <div
          className="upper-right-vector  top-0 right-0 w-1/3 lg:w-1/5 h-[310px] bg-contain bg-no-repeat"
          style={{ backgroundImage: 'url("/images/Vector3.png")' }}
        />
      </div>
      <SpaceRobot2 top="5%" left="5%" delay={2}/>
      <SpaceRobot2 top="60%" left="5%" delay={5} />
      <SpaceRobot2 top='60%' left="80%" delay={8}/>
      <SpaceRobot2 top='5%' left='80%' delay={10}/>
      <div className="flex flex-col items-center justify-center bg-transparent relative">
        <div className="text-center">
          <Link to="/" className="gdscslacklogo gdsclogolink text-white flex items-center justify-center mt-[-8%] text-[14rem] md:text-[15rem] lg:text-[18rem] font-bold logo-link">
            4
            <img
              src="/images/logo.png"
              alt="G"
              className="mx-2 w-[15rem] h-[15rem] sm:w-[15rem] sm:h-[15rem] md:w-[18rem] md:h-[18rem] lg:w-[20rem] lg:h-[20rem]"
            />
            4
          </Link>
          <p className="mt-4 text-[2rem] md:text-[3rem] lg:text-[4rem] text-gray-300">
            Oops! The page you’re looking for doesn’t exist.
          </p>
        </div>
        <div className="text-center">
          <Link to='/' className="signin-ggl-btn mt-[2%] w-[25rem]">
            DASHBOARD
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;

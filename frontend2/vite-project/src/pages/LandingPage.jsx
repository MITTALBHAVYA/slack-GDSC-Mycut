import PageLayout from "../components/layout/PageLayout.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import SpaceRobot2 from "../components/SpaceRobot/SpaceRobot2.jsx";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();

  const handleEmailSignup = ()=>{
    navigate('/auth/register');
  }
  
  return (
    <PageLayout>
      <div
        className="upper-left-vector top-0 left-0 w-1/3 lg:w-1/5 h-[315px] bg-contain bg-no-repeat bg-top-left z-1"
        style={{ backgroundImage: 'url("/images/Vector2.png")', position:'relative' }}
      />
      <Navbar variant="landing"/>
      <SpaceRobot2 />
      <div className="right-side-area flex flex-col ml-[2%] mr-[2%] mt-[0%] lg:ml-[42%] lg:mr-[20%] mt-[0%] z-5 pt-0 relative">
        <div className="content max-w-[600px] mt-0 mb-[8%]">
          <h1 className="WhiteText text-white text-3xl sm:text-4xl md:text-5xl -mt-8 mb-2">
            Made For People.
          </h1>
          <h1 className="YelloText text-[#FFB409] text-3xl sm:text-4xl md:text-5xl mt-0 mb-10">
            Built For Productivity
          </h1>
          <p className="connect text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
            Connect the right people, find anything that you need and automate the rest. That’s work in GDSC Slack, your productivity platform.
          </p>
        </div>

        <div className="signup_btns flex flex-col justify-around sm:flex-row gap-4 sm:gap-4 mt-4">
          <button className="email_signup_btn overflow-hidden whitespace-wrap py-3 px-5 border-none cursor-pointer w-full lg:w-[18vw] h-auto flex items-center justify-center text-center rounded-[0.25em] bg-white text-[#31304D] hover:bg-[#d85bb5] hover:text-[#f5deb3]" onClick={handleEmailSignup}>
            <span className="font-bold font-inter text-base lg:text-lg">
              SIGN UP WITH EMAIL ADDRESS
            </span>
          </button>
          <button className="ggl_signup_btn overflow-hidden whitespace-wrap py-3 px-5 border-none cursor-pointer w-full lg:w-[18vw] h-auto flex items-center justify-center text-center rounded-[0.25em] bg-[#FFB409] text-black hover:bg-[#3498db] hover:text-white">
            <img src='./images/google_icon.png' alt='G' className='gimg mr-3 h-6 w-6 lg:h-8 lg:w-8 rounded-sm' />
            <span className="font-bold font-inter text-base lg:text-lg">
              SIGN UP WITH GOOGLE
            </span>
          </button>
        </div>

      </div>
      <div className="bottom-text text-center z-4 mt-[7%] relative">
        <p className="center-text font-quicksand text-2xl font-bold text-white tracking-wider">
          GDSC Slack is free to try for as long as you like !
        </p>
      </div>
    </PageLayout>
  );
};

export default LandingPage;
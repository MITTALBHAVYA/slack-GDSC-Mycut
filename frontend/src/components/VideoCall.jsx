import { useEffect } from "react";
import PropTypes from "prop-types";

const VideoCall = ({ meetingId, userName, onLeave }) => {
  useEffect(() => {
    const waitForScript = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (window.VideoSDKMeeting) {
            clearInterval(interval);
            resolve(window.VideoSDKMeeting);
          }
        }, 100);

        // Optional timeout after 10 seconds
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error("VideoSDKMeeting not loaded in time"));
        }, 10000);
      });
    };

    const initMeeting = async () => {
      try {
        const VideoSDKMeeting = await waitForScript();

        const meeting = new VideoSDKMeeting();
        meeting.init({
          name: userName || "Guest",
          meetingId: meetingId || "demo-meeting",
          apiKey: "8dc85a42-b219-44eb-a54e-f885d365a0e5",
          containerId: null,
          micEnabled: true,
          webcamEnabled: true,
          chatEnabled: true,
          screenShareEnabled: true,
          raiseHandEnabled: true,
          branding: {
            enabled: true,
            logoURL: "/images/logo.png",
            name: "GDSC Slack",
          },
          joinScreen: {
            visible: true,
            title: "GDSC Slack Video Call",
            meetingUrl: window.location.href,
          },
          onLeave: () => {
            if (onLeave) onLeave();
          },
        });
      } catch (error) {
        console.error("VideoSDKMeeting is not available on window.", error);
      }
    };

    initMeeting();
  }, [meetingId, userName, onLeave]);

  return null;
};

VideoCall.propTypes = {
  meetingId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  onLeave: PropTypes.func,
};

export default VideoCall;

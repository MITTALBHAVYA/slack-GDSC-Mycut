import React, { useState, useEffect } from 'react';
import './SpaceRobot.css';
import FloatingRobotImage from '../SpaceRobot/FloatingRobot.png';

const SpaceRobot = () => {
  const [position, setPosition] = useState({ top: '0', left: '0' });
  const [size, setSize] = useState('50px');
  const [rotation, setRotation] = useState(0);
  const [linearTransition, setLinearTransition] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Enable linear transition
      setLinearTransition(true);

      setTimeout(() => {
        // Reset rotation and disable linear transition
        setRotation(0);
        setLinearTransition(false);

        // After the delay, rotate with a random amount between 36 and 360 degrees
        const randomRotation = Math.random() * (360 - 36) + 36;
        setRotation(randomRotation);

        setTimeout(() => {
          // After rotation, set new position
          const newPosition = {
            top: (Math.random() * window.innerHeight) * 0.75 + 'px',
            left: (Math.random() * window.innerWidth) * 0.75 + 'px',
          };
          const newSize = Math.random() * 100 + 'px';

          setPosition(newPosition);
          setSize(newSize);
        }, 6000); // Adjust the rotation delay as needed
      }, 2000); // Adjust the initial delay as needed
    }, 8000); // Adjust the total interval time as needed

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`space-robot ${linearTransition ? 'linearTransition' : ''}`}
      style={{
        top: position.top,
        left: position.left,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <img src={FloatingRobotImage} alt="Floating Robot" />
    </div>
  );
};

export default SpaceRobot;

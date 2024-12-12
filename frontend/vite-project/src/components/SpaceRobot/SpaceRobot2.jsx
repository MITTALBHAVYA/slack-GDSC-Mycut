import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './SpaceRobot2.css';
import FloatingRobotImage from '../SpaceRobot/FloatingRobot.png';

const SpaceRobot2 = ({top='20%',left='20%',delay=12}) => {
    const [position, setPosition] = useState({ top, left });
    const [wsize] = useState('15%');
    const [hsize] = useState('40%')
    const [rotation, setRotation] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isClickable, setIsClickable] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [autoMoveEnabled, setAutoMoveEnabled] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false); // New state to trigger animation after delay

    const robotRef = useRef(null);
    const intervalRef = useRef(null);

    const teleportToNewPosition = useCallback(() => {
        if (!isDragging && autoMoveEnabled) {
            setIsVisible(false);
            setIsClickable(false);

            setTimeout(() => {
                const maxWidth = window.innerWidth - 150;
                const maxHeight = window.innerHeight - 150;

                const newPosition = {
                    top: `${Math.max(100, Math.random() * maxHeight)}px`,
                    left: `${Math.max(100, Math.random() * maxWidth)}px`
                };

                const isSmallRotation = Math.random() < 0.5;
                const newRotation = isSmallRotation
                    ? Math.random() * 60 - 30 
                    : (Math.random() < 0.5 ? 360 : -360);

                setRotation(newRotation);
                setPosition(newPosition);

                setTimeout(() => {
                    setIsVisible(true);
                    setTimeout(() => setIsClickable(true), 1000);
                }, 300);
            }, 500);
        }
    }, [isDragging, autoMoveEnabled]);

    useEffect(() => {
        const delayStartAnimation = setTimeout(() => {
            setIsAnimating(true); 
        }, delay*1000);

        return () => clearTimeout(delayStartAnimation);
    }, [delay]); // Empty dependency array to run only once on mount

    useEffect(() => {
        if (isAnimating) {
            teleportToNewPosition(); // Start animation once the delay is over
            intervalRef.current = setInterval(teleportToNewPosition, 8000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isAnimating, isDragging, autoMoveEnabled, teleportToNewPosition]);

    const handleMouseDown = (e) => {
        if (!isClickable) return;

        if (e.button === 2) {
            teleportToNewPosition();
            return;
        }

        const rect = robotRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDragging(true);
        setAutoMoveEnabled(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const maxX = window.innerWidth - parseInt(wsize);
            const maxY = window.innerHeight - parseInt(hsize);

            const newX = Math.min(Math.max(0, e.clientX - dragOffset.x), maxX);
            const newY = Math.min(Math.max(0, e.clientY - dragOffset.y), maxY);

            setPosition({
                top: `${newY}px`,
                left: `${newX}px`
            });

            const dragRotation = (newX % 30) - 15;
            setRotation(dragRotation);
        }
    }, [isDragging, wsize, hsize, dragOffset]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            setAutoMoveEnabled(true);
            intervalRef.current = setInterval(teleportToNewPosition, 8000);
        }
    }, [isDragging, teleportToNewPosition]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={robotRef}
            className={`space-robot ${!isVisible ? 'vanishing' : ''} 
                 ${!isClickable ? 'not-clickable' : ''} 
                 ${isDragging ? 'dragging' : ''}`}
            style={{
                top: position.top,
                left: position.left,
                width: wsize,
                height: hsize,
                transform: `rotate(${rotation}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => {
                e.preventDefault();
                teleportToNewPosition();
            }}
        >
            <img
                src={FloatingRobotImage}
                alt="Floating Robot"
                className="robot-image"
                draggable="false"
            />
            <div className="teleport-effect" />
            {isDragging && <div className="drag-indicator" />}
        </div>
    );
};
SpaceRobot2.propTypes = {
    top: PropTypes.string,
    left: PropTypes.string,
    delay: PropTypes.number
};

export default SpaceRobot2;

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const cursorAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const trailAnimation = keyframes`
  0% { opacity: 1; width: 10px; height: 10px; }
  100% { opacity: 0; width: 5px; height: 5px; }
`;

const CursorWrapper = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
`;

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.1s ease;
  animation: ${cursorAnimation} 1s infinite;
`;

const Trail = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  transform: translate(-50%, -50%);
  animation: ${trailAnimation} 0.5s linear;
`;

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrail((prevTrail) => [
        ...prevTrail,
        { x: position.x, y: position.y, id: Date.now() },
      ].slice(-20)); // Keep only the last 20 positions
    }, 50); // Add a new trail point every 50ms

    return () => clearTimeout(timer);
  }, [position]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrail((prevTrail) => prevTrail.slice(1)); // Remove the oldest trail point
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <CursorWrapper>
      {trail.map((point) => (
        <Trail key={point.id} style={{ left: point.x, top: point.y }} />
      ))}
      <Cursor style={{ left: position.x, top: position.y }} />
    </CursorWrapper>
  );
};

export default CustomCursor;
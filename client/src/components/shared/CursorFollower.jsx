import React, { useEffect, useRef, useState } from 'react';

// Wait, actually let's use GSAP for smoother cursor tracking
import { gsap as GsapCore } from 'gsap';
import { useGSAP } from '@gsap/react';

const CursorFollower = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useGSAP(() => {
    // QuickSetter is much better for cursor performance than normal gsap.to
    const xTo = GsapCore.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
    const yTo = GsapCore.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || 
          e.target.tagName.toLowerCase() === 'a' || 
          e.target.closest('button') || 
          e.target.closest('a') ||
          e.target.classList.contains('interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
    />
  );
};

export default CursorFollower;

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const container = useRef();
    const location = useLocation();

    useGSAP(() => {
        // Basic page fade-in/slide-up transition on route change
        gsap.fromTo(
            container.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
        );
    }, [location.pathname]); // Re-run animation when route changes

    return (
        <div ref={container} className="h-full w-full">
            {children}
        </div>
    );
};

export default PageTransition;

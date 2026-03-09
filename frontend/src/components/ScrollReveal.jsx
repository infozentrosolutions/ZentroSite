import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ children, delay = 0, y = 30, duration = 0.6, className = "" }) => {
    const elementRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            elementRef.current,
            { opacity: 0, y: y },
            {
                opacity: 1,
                y: 0,
                duration: duration,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elementRef.current,
                    start: 'top 85%', // Trigger when top of element hits 85% down viewport
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }, { scope: elementRef });

    return (
        <div ref={elementRef} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    );
};

export default ScrollReveal;

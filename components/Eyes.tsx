import React, { useState, useEffect, useRef, useCallback } from 'react';

const Eyes: React.FC = () => {
    const [pupilTransform, setPupilTransform] = useState({ left: '', right: '' });
    const [isBlinking, setIsBlinking] = useState(false);
    const [isMouseIdle, setIsMouseIdle] = useState(false);

    const leftEyeRef = useRef<HTMLDivElement>(null);
    const rightEyeRef = useRef<HTMLDivElement>(null);
    const leftPupilRef = useRef<HTMLDivElement>(null);
    const rightPupilRef = useRef<HTMLDivElement>(null);
    
    const blinkTimeoutRef = useRef<number | null>(null);
    const blinkDurationTimeoutRef = useRef<number | null>(null);
    const inactivityTimerRef = useRef<number | null>(null);
    const lookAroundIntervalRef = useRef<number | null>(null);

    const trackMouse = useCallback((event: MouseEvent) => {
        const eyes = [
            { eyeRef: leftEyeRef, pupilRef: leftPupilRef, key: 'left' as const },
            { eyeRef: rightEyeRef, pupilRef: rightPupilRef, key: 'right' as const },
        ];

        const newTransforms = { left: '', right: '' };

        for (const { eyeRef, pupilRef, key } of eyes) {
            if (eyeRef.current && pupilRef.current) {
                const eyeRect = eyeRef.current.getBoundingClientRect();
                const pupilRect = pupilRef.current.getBoundingClientRect();

                const eyeX = eyeRect.left + eyeRect.width / 2;
                const eyeY = eyeRect.top + eyeRect.height / 2;

                const deltaX = event.clientX - eyeX;
                const deltaY = event.clientY - eyeY;

                const angle = Math.atan2(deltaY, deltaX);
                
                const maxDistance = (eyeRect.width / 2) - (pupilRect.width / 2);

                const distanceToMouse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const distance = Math.min(distanceToMouse, maxDistance);

                const pupilX = Math.cos(angle) * distance;
                const pupilY = Math.sin(angle) * distance;

                newTransforms[key] = `translate(${pupilX}px, ${pupilY}px)`;
            }
        }
        setPupilTransform(newTransforms);
    }, []);

    // Effect for mouse tracking and inactivity detection
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // If idle, wake up
            if (isMouseIdle) {
                setIsMouseIdle(false);
            }
            trackMouse(event);

            // Reset inactivity timer
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            inactivityTimerRef.current = window.setTimeout(() => {
                setIsMouseIdle(true);
            }, 60000); // 1 minute
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        // Start initial timer
        inactivityTimerRef.current = window.setTimeout(() => setIsMouseIdle(true), 60000);


        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        }
    }, [isMouseIdle, trackMouse]);

    // Effect for idle "looking around" behavior
    useEffect(() => {
        if (isMouseIdle) {
            const lookAround = () => {
                // Generate a single random angle and distance ratio for both eyes to ensure they look at the same point.
                const angle = Math.random() * 2 * Math.PI;
                const distanceRatio = Math.random(); // A value between 0 and 1

                const eyes = [
                    { eyeRef: leftEyeRef, pupilRef: leftPupilRef, key: 'left' as const },
                    { eyeRef: rightEyeRef, pupilRef: rightPupilRef, key: 'right' as const },
                ];
                const newTransforms = { left: '', right: '' };

                for (const { eyeRef, pupilRef, key } of eyes) {
                    if (eyeRef.current && pupilRef.current) {
                        const eyeRect = eyeRef.current.getBoundingClientRect();
                        const pupilRect = pupilRef.current.getBoundingClientRect();
                        const maxDistance = (eyeRect.width / 2) - (pupilRect.width / 2);
                        
                        // Use the shared angle and distance ratio
                        const distance = distanceRatio * maxDistance;
                        const pupilX = Math.cos(angle) * distance;
                        const pupilY = Math.sin(angle) * distance;

                        newTransforms[key] = `translate(${pupilX}px, ${pupilY}px)`;
                    }
                }
                setPupilTransform(newTransforms);
            };
            
            lookAround(); // Look somewhere immediately
            lookAroundIntervalRef.current = window.setInterval(lookAround, Math.random() * 2000 + 2000); // Look every 2-4 seconds
        } else {
             if (lookAroundIntervalRef.current) {
                clearInterval(lookAroundIntervalRef.current);
            }
        }
        return () => {
            if (lookAroundIntervalRef.current) clearInterval(lookAroundIntervalRef.current);
        }
    }, [isMouseIdle]);

    // Blinking effect
    useEffect(() => {
        const scheduleBlink = () => {
            const blinkInterval = Math.random() * 4000 + 4000; // Random interval between 4 to 8 seconds
            blinkTimeoutRef.current = window.setTimeout(() => {
                setIsBlinking(true);
                blinkDurationTimeoutRef.current = window.setTimeout(() => {
                    setIsBlinking(false);
                    scheduleBlink(); // Schedule the next blink
                }, 150); // Blink duration
            }, blinkInterval);
        };

        scheduleBlink();

        return () => {
            if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
            if (blinkDurationTimeoutRef.current) clearTimeout(blinkDurationTimeoutRef.current);
        };
    }, []);

    const eyeClasses = `w-24 h-24 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-800 transition-transform duration-150 ease-in-out ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`;
    const pupilClasses = `w-10 h-10 md:w-16 md:h-16 bg-gray-800 rounded-full ${isBlinking ? 'opacity-0' : 'opacity-100'}`;
    const pupilTransition = isMouseIdle ? 'transform 0.8s ease-in-out' : 'transform 0.1s ease-out';


    return (
        <div className="w-full h-full flex items-center justify-center gap-x-8 md:gap-x-16" aria-hidden="true">
            {/* Left Eye */}
            <div ref={leftEyeRef} className={eyeClasses}>
                <div 
                    ref={leftPupilRef}
                    className={pupilClasses}
                    style={{ transform: pupilTransform.left, transition: pupilTransition }}
                />
            </div>
            {/* Right Eye */}
            <div ref={rightEyeRef} className={eyeClasses}>
                 <div 
                    ref={rightPupilRef}
                    className={pupilClasses}
                    style={{ transform: pupilTransform.right, transition: pupilTransition }}
                />
            </div>
        </div>
    );
};

export default Eyes;
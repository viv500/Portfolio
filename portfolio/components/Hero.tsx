"use client"
import React, { useState, useEffect } from 'react';
import { Spotlight } from './ui/Spotlight';
import './Hero.css'; // Import the CSS file for styling
import { BackgroundBeams } from './ui/background-beams';

const Hero = () => {
    const [text, setText] = useState('');
    const fullText = "Hi, I'm Vivek.";
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            setText(fullText.substring(0, index + 1));
            index += 1;
            if (index === fullText.length) {
                clearInterval(typingInterval);
                setShowText(true); // Trigger secondary text effect
            }
        }, 95); // typing speed 95ms

        return () => clearInterval(typingInterval); // Cleanup
    }, [fullText]);

    return (
        <div className="pb-25 pt-25 relative h-screen flex flex-col items-center justify-center text-center">
            <div className="relative h-full w-full">
                <Spotlight className="-top-20 -left-10 md:-left-32 h-screen" fill="white" />
                <Spotlight className="-top-1 -left-10 md:-left-32 h-screen" fill="purple" />
                <Spotlight className="top-15 -left-10 md:-left-32 h-screen" fill="blue" />

                <BackgroundBeams/>
            </div>

            <div className="heroContainer">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl text-white mb-0.5">
                        {text}
                    </div>
                    <div className={`secondaryText ${showText ? 'show' : ''}`}>
                        Software Engineer and Web Developer
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;

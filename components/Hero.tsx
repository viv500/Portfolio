"use client"
import React, { useState, useEffect } from 'react';
import { Spotlight } from './ui/Spotlight';
import './Hero.css'; // Import the CSS file for styling
import { BackgroundBeams } from './ui/background-beams';

const Hero = () => {
    const [text, setText] = useState('');
    const fullText = "Hi, I'm Vivek.";
    const [showText, setShowText] = useState(false);
    const [showButton, setShowButton] = useState(false);

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

    useEffect(() => {
        if (showText) {
            const timer = setTimeout(() => {
                setShowButton(true); // Show button after the secondary text is fully shown
            }, 500); // Adjust delay as needed
            return () => clearTimeout(timer); // Cleanup
        }
    }, [showText]);

    return (
        <div className="relative h-screen flex flex-col items-center justify-center text-center">
            <div className="relative h-full w-full">

                {/* the flashing lights from the top left */}
                <Spotlight className="-top-20 -left-10 md:-left-32 h-screen" fill="white" />
                <Spotlight className="-top-1 -left-10 md:-left-32 h-screen" fill="purple" />
                <Spotlight className="top-15 -left-10 md:-left-32 h-screen" fill="blue" />

                <div className="mobile">
                    <BackgroundBeams />
                </div>

            </div>

            <div className="heroContainer">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl text-white mb-0.5">
                        {text}
                    </div>
                    <div className={`secondaryText ${showText ? 'show' : ''}`}>
                        Software Engineer and Web Developer
                    </div>

                    {/* Button to scroll down to bento box */}
                    {/* Only showing button once secondary text has loaded */}
                    {showButton && (
                        <button
                            onClick={scrollDownByFullHeight}
                            className={`absolute bottom-16 inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 buttonFloat ${showButton ? 'show' : ''}`}
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                Explore My Work
                            </span>
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}

// Function to scroll down by the height of the webpage
const scrollDownByFullHeight = () => {
    // Get the height of the entire document
    const documentHeight = document.documentElement.scrollHeight;

    // Scroll down by the height of the document
    window.scrollBy({
        top: documentHeight,
        behavior: 'smooth' // Makes the scrolling smooth
    });
}

export default Hero;

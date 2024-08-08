import React from 'react'
// aceternity's way of only installing the Spotlight component rather than the entire library
import { Spotlight } from './ui/Spotlight'

const Hero = () => {
    return (
        <div className="pb-25 pt-25">
            <div className="relative h-screen">
                <Spotlight className="-top-20 -left-10 md:-left-32 h-screen" fill="white" />
                <Spotlight className="-top-1 -left-10 md:-left-32 h-screen" fill="purple" />
                <Spotlight className="top-15 -left-10 md:-left-32 h-screen" fill="blue" />
            </div>

            <div className="h-screen w-full dark:bg-black-100 bg-white  dark:bg-grid-white/[0.3] bg-grid-black/[0.2] relative flex items-center justify-center">
                {/* Radial gradient for the container to give a faded look */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            </div>
        </div>
    )
}

export default Hero

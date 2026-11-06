"use client";
import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Spotlight } from "./ui/Spotlight";
import "./Hero.css";
import { FloatingNav } from "./ui/floating-navbar";
import { GridSmallBackgroundDemo } from "./ui/background-grid";
import { PlatformIcon } from "./ui/PlatformIcon";
import { contactLinks, profile, resumePath } from "./data";
import { useResumeAvailable } from "@/lib/useAvailableMedia";

const navItems = [
  { name: "Home", link: "#" },
  { name: "About", link: "#about" },
  { name: "Experience", link: "#experience" },
  { name: "Projects", link: "#projects" },
  { name: "Contact", link: "#contact" },
];

const fullText = "Hi, I'm Vivek.";

const Hero = () => {
  const reduced = useReducedMotion();
  const resume = useResumeAvailable(resumePath);
  const links = resume ? [...contactLinks, { label: "Resume", href: "#resume", platform: "resume" as const }] : contactLinks;
  const [text, setText] = useState("");
  const [showText, setShowText] = useState(false);
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(fullText);
      setShowText(true);
      setShowRest(true);
      return;
    }
    let index = 0;
    const typing = setInterval(() => {
      index += 1;
      setText(fullText.substring(0, index));
      if (index === fullText.length) {
        clearInterval(typing);
        setShowText(true);
      }
    }, 95);
    return () => clearInterval(typing);
  }, [reduced]);

  useEffect(() => {
    if (!showText) return;
    const timer = setTimeout(() => setShowRest(true), 500);
    return () => clearTimeout(timer);
  }, [showText]);

  return (
    <div className="relative flex h-screen min-h-[640px] flex-col items-center justify-center overflow-hidden text-center">
      <FloatingNav navItems={navItems} />

      <div className="absolute inset-0">
        <Spotlight className="-top-20 -left-10 md:-left-32 h-screen" fill="white" />
        <Spotlight className="-top-1 -left-10 md:-left-32 h-screen" fill="purple" />
        <Spotlight className="top-15 -left-10 md:-left-32 h-screen" fill="blue" />
        <GridSmallBackgroundDemo />
      </div>

      <div className="heroContainer relative z-10 flex w-full max-w-3xl flex-col items-center px-5">
        {/* The invisible copy reserves the full width, so the centred line doesn't drift while typing. */}
        <h1 className="relative mb-2 min-h-[2.75rem] whitespace-nowrap text-4xl font-semibold tracking-tight text-white md:text-6xl md:min-h-[4.5rem]">
          <span className="sr-only">{fullText}</span>
          <span aria-hidden="true" className="invisible">{fullText}</span>
          <span aria-hidden="true" className="absolute left-0 top-0 text-left">
            {text}
            {!showText && <span className="caret absolute ml-1.5 top-[0.14em] h-[0.78em] w-[3px] rounded-full bg-purple" />}
          </span>
        </h1>
        <p className={`secondaryText ${showText ? "show" : ""}`}>{profile.hero}</p>

        <div className={`buttonFloat mt-8 flex w-full flex-col items-center ${showRest ? "show" : ""}`}>
          <ul className="mb-8 flex flex-wrap justify-center gap-2">
            {profile.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-xs text-white-100 backdrop-blur">
                {chip}
              </li>
            ))}
          </ul>

          <a href="#work" className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] motion-reduce:animate-none" />
            <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Explore My Work
            </span>
          </a>

          <div className="mt-6 flex gap-5 text-white/70">
            {links.map((link) => (
              <a
                key={link.platform}
                href={link.href}
                target={link.platform === "email" || link.platform === "resume" ? undefined : "_blank"}
                rel={link.platform === "email" || link.platform === "resume" ? undefined : "noopener noreferrer"}
                aria-label={link.platform === "email" ? "Email" : link.label}
                className="transition hover:text-purple"
              >
                <PlatformIcon platform={link.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

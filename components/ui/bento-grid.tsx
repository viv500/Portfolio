"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CARD_BACKGROUND = "rgb(2,0,36)";

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-3", className)}>{children}</div>
);

export const BentoGridItem = ({
  id,
  index,
  className,
  title,
  description,
  children,
}: {
  id: string;
  index: number;
  className?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className={className}
    >
      <motion.a
        layoutId={`card-${id}`}
        href={`#${id}`}
        aria-label={`${title}: ${description} Open details.`}
        style={{ background: CARD_BACKGROUND, borderRadius: 24 }}
        className="group/bento relative flex h-full flex-col overflow-hidden border border-white/[0.14] transition-colors duration-200 hover:border-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
      >
        <div className="relative z-10 p-5 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-100">{title}</h3>
            <span aria-hidden="true" className="text-white/30 transition-colors duration-200 group-hover/bento:text-white/80">
              ↗
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-300">{description}</p>
        </div>
        <div className="relative z-10 flex flex-1 flex-col justify-center">{children}</div>
      </motion.a>
    </motion.div>
  );
};

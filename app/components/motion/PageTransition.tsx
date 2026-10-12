
"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="flex min-h-full flex-1 flex-col"
        initial={{
          opacity: 0,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          filter: "blur(2px)",
        }}
        transition={{
          duration: 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-px origin-left bg-gradient-to-r from-transparent via-[#67d8eb] to-[#d0b16b] shadow-[0_0_14px_rgba(103,216,235,0.35)]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1, 1],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: 0.55,
            times: [0, 0.65, 1],
            ease: "easeOut",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
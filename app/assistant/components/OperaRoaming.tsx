"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";

import OperaSpirit from "./OperaSpirit";
import type { OperaExpression } from "./opera-types";

export type OperaMode = "roaming" | "chatting";
export type OperaReaction = "idle" | "celebrating";

export type ChatPosition = {
  x: number;
  y: number;
};

type OperaRoamingProps = {
  expression: OperaExpression;
  message: string;
  showMessage: boolean;
  mode: OperaMode;
  reaction?: OperaReaction;
  onClick: (position: ChatPosition) => void;
};

export default function OperaRoaming({
  expression,
  message,
  showMessage,
  mode,
  reaction = "idle",
  onClick,
}: OperaRoamingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    onClick({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="opera-roaming-stage"
      data-mode={mode}
      data-reaction={reaction}
    >
      {showMessage && mode !== "chatting" && (
        <div className="opera-speech-bubble" aria-live="polite">
          {message}
        </div>
      )}

      <div className="opera-glide">
        <div className="opera-bob" data-expression={expression}>
          <button
            type="button"
            onClick={handleClick}
            aria-label="Chat with Opera Assistant"
            title="Chat with Opera Assistant"
            className="pointer-events-auto block w-full cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#071827]"
            disabled={mode === "chatting"}
          >
            <OperaSpirit
              className="opera-roaming-mascot"
              expression={expression}
            />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
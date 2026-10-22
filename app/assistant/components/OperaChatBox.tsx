"use client";

import { useEffect, useRef, useState } from "react";
import type {
  FormEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import OperaSpirit from "./OperaSpirit";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatPosition = {
  x: number;
  y: number;
};

type OperaChatBoxProps = {
  isOpen: boolean;
  position: ChatPosition | null;
  onClose: () => void;
  onResponseComplete: () => void;
};

type PanelSize = {
  width: number;
  height: number;
};

type PanelPosition = {
  left: number;
  top: number;
};

type ResizeState = {
  pointerId: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
};

const suggestions = [
  "What is Quill & Ink?",
  "Tell me about the Bulletin plugin",
  "How do I get started?",
];

const MIN_WIDTH = 280;
const MIN_HEIGHT = 320;
const DESKTOP_MAX_WIDTH = 440;
const DESKTOP_MAX_HEIGHT = 660;
const VIEWPORT_GUTTER = 16;
const PANEL_GAP = 16;

function getViewportLimits() {
  return {
    width: Math.max(
      1,
      Math.min(
        DESKTOP_MAX_WIDTH,
        window.innerWidth - VIEWPORT_GUTTER * 2,
      ),
    ),
    height: Math.max(
      1,
      Math.min(
        DESKTOP_MAX_HEIGHT,
        window.innerHeight - VIEWPORT_GUTTER * 2,
      ),
    ),
  };
}

function getPanelPosition(
  position: ChatPosition,
  width: number,
  height: number,
): PanelPosition {
  const maxLeft = Math.max(
    VIEWPORT_GUTTER,
    window.innerWidth - width - VIEWPORT_GUTTER,
  );

  const maxTop = Math.max(
    VIEWPORT_GUTTER,
    window.innerHeight - height - VIEWPORT_GUTTER,
  );

  // Prefer opening to Opera's left so the panel doesn't cover her.
  let left = position.x - width - PANEL_GAP;

  // If there isn't enough room on the left, open on her right.
  if (left < VIEWPORT_GUTTER) {
    left = position.x + PANEL_GAP;
  }

  left = Math.max(VIEWPORT_GUTTER, Math.min(left, maxLeft));

  // Center the panel vertically around Opera's click position.
  const top = Math.max(
    VIEWPORT_GUTTER,
    Math.min(position.y - height / 2, maxTop),
  );

  return { left, top };
}

export default function OperaChatBox({
  isOpen,
  position,
  onClose,
  onResponseComplete,
}: OperaChatBoxProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [panelSize, setPanelSize] = useState<PanelSize | null>(null);

  const [panelPosition, setPanelPosition] = useState<PanelPosition>({
    left: VIEWPORT_GUTTER,
    top: VIEWPORT_GUTTER,
  });

  const nextId = useRef(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  // Wait until mounted before accessing the browser viewport.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Position the chat beside Opera when it opens or the viewport changes.
  useEffect(() => {
    if (!mounted || !isOpen || !position) return;

    const clickPosition = position;

    function updatePosition() {
      const limits = getViewportLimits();

      const width = Math.min(
        panelSize?.width ?? limits.width,
        limits.width,
      );

      const height = Math.min(
        panelSize?.height ?? limits.height,
        limits.height,
      );

      setPanelPosition(
        getPanelPosition(clickPosition, width, height),
      );
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [mounted, isOpen, position, panelSize]);

  // Focus the message field without scrolling the document.
  useEffect(() => {
    if (!mounted || !isOpen) return;

    inputRef.current?.focus({ preventScroll: true });
  }, [mounted, isOpen]);

  // Keep resized dimensions within the viewport.
  useEffect(() => {
    if (!mounted) return;

    function clampPanelToViewport() {
      setPanelSize((current) => {
        if (!current) return current;

        const limits = getViewportLimits();

        return {
          width: Math.min(current.width, limits.width),
          height: Math.min(current.height, limits.height),
        };
      });
    }

    window.addEventListener("resize", clampPanelToViewport);

    return () => {
      window.removeEventListener("resize", clampPanelToViewport);
    };
  }, [mounted]);

  function handleResizeStart(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    if (!panelRef.current || event.button !== 0) return;

    const rect = panelRef.current.getBoundingClientRect();

    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function handleResizeMove(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    const start = resizeRef.current;

    if (!start || start.pointerId !== event.pointerId) return;

    const limits = getViewportLimits();

    // The handle is at the top-left; dragging left/up enlarges the panel.
    const width = Math.min(
      limits.width,
      Math.max(
        Math.min(MIN_WIDTH, limits.width),
        start.startWidth + start.startX - event.clientX,
      ),
    );

    const height = Math.min(
      limits.height,
      Math.max(
        Math.min(MIN_HEIGHT, limits.height),
        start.startHeight + start.startY - event.clientY,
      ),
    );

    setPanelSize({ width, height });
  }

  function handleResizeEnd(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    if (resizeRef.current?.pointerId !== event.pointerId) return;

    resizeRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setInput("");
    setError("");
    setLoading(true);

    setMessages((current) => [
      ...current,
      {
        id: nextId.current++,
        role: "user",
        content: message,
      },
    ]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data: { answer?: unknown; error?: unknown } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Opera couldn't respond. Please try again.",
        );
      }

      if (
        typeof data.answer !== "string" ||
        !data.answer.trim()
      ) {
        throw new Error("Opera returned an empty response.");
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: data.answer as string,
        },
      ]);

      // Trigger Opera's celebration only after a valid response.
      onResponseComplete();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Keep server rendering and the first client render consistent.
  const limits = mounted
    ? getViewportLimits()
    : {
        width: DESKTOP_MAX_WIDTH,
        height: DESKTOP_MAX_HEIGHT,
      };

  const panelStyle = {
    left: `${panelPosition.left}px`,
    top: `${panelPosition.top}px`,
    width: `${Math.min(
      panelSize?.width ?? limits.width,
      limits.width,
    )}px`,
    height: `${Math.min(
      panelSize?.height ?? limits.height,
      limits.height,
    )}px`,
  };

  // Render only after mounting, then portal outside page transition wrappers.
  if (!mounted) return null;

  return createPortal(
    <section
      ref={panelRef}
      aria-label="Chat with Opera Assistant"
      aria-hidden={!isOpen}
      style={panelStyle}
      className={`fixed z-[60] flex flex-col overflow-hidden rounded-3xl border border-cyan-200/15 bg-[#071827]/95 shadow-[0_20px_100px_rgba(0,0,0,0.55),0_0_50px_rgba(39,174,207,0.10)] backdrop-blur-2xl transition-[opacity,transform,visibility] duration-200 ${
        isOpen
          ? "visible translate-y-0 scale-100 opacity-100"
          : "invisible pointer-events-none translate-y-3 scale-[0.98] opacity-0"
      }`}
    >
      {/* Touch and mouse resize handle */}
      <button
        type="button"
        aria-label="Resize chat window"
        title="Drag to resize the chat window"
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerCancel={handleResizeEnd}
        className="absolute left-0 top-0 z-20 flex h-7 w-7 touch-none cursor-nwse-resize items-start justify-start rounded-br-xl border-b border-r border-cyan-200/15 bg-cyan-200/[0.04] pl-1.5 pt-1.5 text-cyan-100/70 hover:bg-cyan-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
      >
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 2H2.1M2 5H5M2 8H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.08] px-4 py-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.05]">
          <OperaSpirit
            className="h-full w-full"
            expression={loading ? "scribing" : "curious"}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-200/65">
            Quill &amp; Ink
          </p>

          <h2 className="font-serif text-xl text-white">
            Opera Assistant
          </h2>

          <p className="text-xs text-slate-400">
            {loading
              ? "Composing a response…"
              : "Ready to help with your story"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          title="Close chat"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
        >
          ×
        </button>
      </header>

      <div
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
            <div className="mb-3 w-36 max-w-full">
              <OperaSpirit
                className="h-auto w-full drop-shadow-[0_0_20px_rgba(75,220,218,0.13)]"
                expression="curious"
              />
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200/70">
              Your story starts here
            </p>

            <h3 className="mt-2 font-serif text-2xl text-slate-100">
              What can I help you discover?
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
              Ask me about Quill &amp; Ink, its plugins, or setting up your
              Discord community.
            </p>

            <div className="mt-5 flex w-full flex-col gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-left text-sm text-slate-300 transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.06] hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="h-8 w-8 shrink-0 overflow-hidden">
                  <OperaSpirit
                    className="h-10 w-10 max-w-none"
                    expression="relaxed"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-3 ${
                  isUser
                    ? "rounded-br-md border border-cyan-200/15 bg-cyan-300/[0.09] text-cyan-50"
                    : "rounded-bl-md border border-white/[0.08] bg-white/[0.035] text-slate-200"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5" role="status">
            <div className="h-8 w-8 shrink-0 overflow-hidden">
              <OperaSpirit
                className="h-10 w-10 max-w-none"
                expression="scribing"
              />
            </div>

            <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200/80 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200/80 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200/80" />
                </span>
                Thinking…
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            className="rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-3 py-3 text-sm text-rose-200"
            role="alert"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="mt-1 underline underline-offset-2 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-white/[0.08] bg-black/10 p-3 sm:p-4">
        <form onSubmit={sendMessage} className="flex items-end gap-2">
          <label htmlFor="opera-chat-message" className="sr-only">
            Your message
          </label>

          <textarea
            ref={inputRef}
            id="opera-chat-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Ask Opera anything…"
            rows={1}
            maxLength={2000}
            disabled={loading}
            className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-white/10 bg-[#061321]/80 px-3.5 py-3 text-sm leading-5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-200/35 focus:ring-2 focus:ring-cyan-200/[0.06] disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-200/[0.09] text-xl text-cyan-100 transition hover:border-cyan-100/40 hover:bg-cyan-200/[0.15] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↑
          </button>
        </form>

        <p className="mt-2 px-1 text-[10px] text-slate-500">
          Enter to send · Shift + Enter for a new line
        </p>
      </footer>
    </section>,
    document.body,
  );
}
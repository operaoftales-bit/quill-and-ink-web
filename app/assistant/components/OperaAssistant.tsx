"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import OperaRoaming, {
  type ChatPosition,
} from "./OperaRoaming";
import OperaChatBox from "./OperaChatBox";
import {
  getOperaPage,
  operaMessages,
} from "./operaMessages";
import { useOperaExpression } from "./useOperaExpression";
const FIRST_MESSAGE_DELAY = 4000;
const MESSAGE_VISIBLE_DURATION = 10000;
const CELEBRATION_DURATION = 900;

export default function OperaAssistant() {
  const pathname = usePathname() ?? "/";
  const page = getOperaPage(pathname);
  const messages = operaMessages[page];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPosition, setChatPosition] =
    useState<ChatPosition | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
const roamingExpression = useOperaExpression(pathname);

  // Choose a fresh message when the visitor changes pages.
  useEffect(() => {
    setMessageIndex(
      messages.length > 0
        ? Math.floor(Math.random() * messages.length)
        : 0,
    );
    setIsBubbleVisible(false);
  }, [page, messages.length]);

    // Show one speech bubble per page visit, then hide it after 10 seconds.
  useEffect(() => {
    setIsBubbleVisible(false);

    if (isChatOpen || messages.length === 0) {
      return;
    }

    const showTimeout = window.setTimeout(() => {
      setIsBubbleVisible(true);
    }, FIRST_MESSAGE_DELAY);

    const hideTimeout = window.setTimeout(() => {
      setIsBubbleVisible(false);
    }, FIRST_MESSAGE_DELAY + MESSAGE_VISIBLE_DURATION);

    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, [isChatOpen, page, messages.length]);

  // End the short celebration after a successful AI response.
  useEffect(() => {
    if (!isCelebrating) return;

    const timeout = window.setTimeout(() => {
      setIsCelebrating(false);
    }, CELEBRATION_DURATION);

    return () => window.clearTimeout(timeout);
  }, [isCelebrating]);

  const activeMessage =
    messages[messageIndex % Math.max(messages.length, 1)] ??
    operaMessages.default[0];

  return (
    <>
      <OperaRoaming
        expression={roamingExpression}
        message={activeMessage.text}
        showMessage={isBubbleVisible && !isChatOpen}
        mode={isChatOpen ? "chatting" : "roaming"}
        reaction={isCelebrating ? "celebrating" : "idle"}
        onClick={(position) => {
          setChatPosition(position);
          setIsChatOpen(true);
        }}
      />

      <OperaChatBox
        isOpen={isChatOpen}
        position={chatPosition}
        onClose={() => setIsChatOpen(false)}
        onResponseComplete={() => setIsCelebrating(true)}
      />
    </>
  );
}
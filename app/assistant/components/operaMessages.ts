import type { OperaExpression } from "./opera-types";

export type OperaPage =
  | "home"
  | "explore"
  | "pricing"
  | "about"
  | "contact"
  | "assistant"
  | "default";

export type OperaMessage = {
  text: string;
  expression: OperaExpression;
};

export const operaMessages: Record<OperaPage, OperaMessage[]> = {
  home: [
    { text: "Welcome, storyteller! Ready to create something wonderful?", expression: "excited" },
    { text: "Oh, a visitor! I was just polishing my favourite quill.", expression: "happy" },
    { text: "Every great community has a story. Let's write yours.", expression: "proud" },
    { text: "Psst... have you explored everything Quill & Ink can do?", expression: "mischievous" },
    { text: "A little imagination can turn a community into a home.", expression: "happy" },
    { text: "I promise I'm only a tiny bit nosy.", expression: "winking" },
    { text: "Ooh! Something tells me we're going to get along.", expression: "excited" },
    { text: "A good story always starts somewhere. Why not here?", expression: "curious" },
    { text: "I practised my welcome all morning. How did I do?", expression: "shy" },
    { text: "Oh! Was that a new visitor? Let me look welcoming!", expression: "surprised" },
    { text: "A community isn't just a server. It's the people in it.", expression: "proud" },
    { text: "I have a good feeling about this little adventure.", expression: "happy" },
    { text: "Between you and me, I rather like it here.", expression: "mischievous" },
    { text: "Take a look around! There's plenty to discover.", expression: "curious" },
    { text: "Imagine the stories your community could tell.", expression: "excited" },
  ],

  explore: [
    { text: "So many tools, so many possibilities! Where shall we begin?", expression: "curious" },
    { text: "Looking for a command? I can help you find it!", expression: "happy" },
    { text: "Go on, explore! I promise not to rearrange the plugins.", expression: "mischievous" },
    { text: "There's a lot tucked away in these tools. Take your time!", expression: "curious" },
    { text: "Moderation, games, community tools... what catches your eye?", expression: "excited" },
    { text: "I do enjoy a well-organised command list.", expression: "proud" },
    { text: "Oh! That tool looks interesting, doesn't it?", expression: "surprised" },
    { text: "Every community is different. Find what fits yours.", expression: "happy" },
    { text: "So many buttons, so little time. Just kidding. Take your time!", expression: "winking" },
    { text: "A tidy collection of tools makes my little heart happy.", expression: "happy" },
    { text: "Hmm... I wonder which feature you'll discover first.", expression: "curious" },
    { text: "Don't mind me. I'm just admiring the collection.", expression: "proud" },
    { text: "Found something useful? I knew you had a good eye!", expression: "mischievous" },
    { text: "Not sure where to start? Pick the problem you want to solve.", expression: "relaxed" },
    { text: "There's probably a tool for that. Let's have a look!", expression: "excited" },
    { text: "I could browse these features all day.", expression: "happy" },
    { text: "One feature at a time. No need to take on the whole world!", expression: "relaxed" },
    { text: "Ooh, decisions! Which tool deserves your attention first?", expression: "confused" },
  ],

  pricing: [
    { text: "Considering Premium? Let's see what comes with it!", expression: "curious" },
    { text: "Premium is ₹350 for 30 days. No mysterious arithmetic!", expression: "winking" },
    { text: "Take your time. The best choice is an informed one.", expression: "relaxed" },
    { text: "No pressure! Your community, your pace.", expression: "relaxed" },
    { text: "A good plan should make sense before you choose it.", expression: "proud" },
    { text: "Have a look at what's included before making a decision.", expression: "curious" },
    { text: "Your budget matters too. Choose what works for you.", expression: "happy" },
    { text: "Questions about Premium? It's perfectly fine to be curious.", expression: "concerned" },
    { text: "A little comparison now can save a lot of guesswork later.", expression: "proud" },
    { text: "No need to rush. I'm quite patient. Usually.", expression: "mischievous" },
    { text: "Let's make sure you know what you're getting.", expression: "determined" },
    { text: "The right choice is the one that suits your community.", expression: "relaxed" },
    { text: "Numbers can look intimidating. We'll take them one step at a time.", expression: "happy" },
    { text: "Have a peek at the benefits. There may be something useful for you!", expression: "excited" },
  ],

  about: [
    { text: "Every good creation starts with an idea and a little ink.", expression: "proud" },
    { text: "Quill & Ink is built for communities and made for stories.", expression: "happy" },
    { text: "Every feature starts with someone asking, 'What if?'", expression: "curious" },
    { text: "A little ink, a little code, and a whole lot of imagination.", expression: "excited" },
    { text: "Behind every tool is a problem someone wanted to solve.", expression: "proud" },
    { text: "I may be a tiny fairy, but I have very big ideas.", expression: "mischievous" },
    { text: "Good communities aren't built by tools alone. People matter most.", expression: "relaxed" },
    { text: "Every improvement begins with noticing what could be better.", expression: "determined" },
    { text: "A project grows one thoughtful idea at a time.", expression: "happy" },
    { text: "I do take my quill-and-ink business rather seriously.", expression: "winking" },
    { text: "The best features are the ones that genuinely help.", expression: "proud" },
    { text: "A little creativity can go a surprisingly long way.", expression: "surprised" },
    { text: "There's always room for one more good idea.", expression: "curious" },
  ],

  contact: [
    { text: "Need a hand? Don't be shy. I'm right here!", expression: "happy" },
    { text: "Something not working as expected? Let's get it sorted.", expression: "concerned" },
    { text: "Questions are welcome. Even the complicated ones!", expression: "excited" },
    { text: "We'll take it one step at a time.", expression: "relaxed" },
    { text: "Not sure how to explain the problem? Start wherever you can.", expression: "happy" },
    { text: "A little detail can help us understand a problem much better.", expression: "curious" },
    { text: "It's okay if something went wrong. Let's work through it.", expression: "concerned" },
    { text: "I'm listening! Well... metaphorically. I have very good ears.", expression: "mischievous" },
    { text: "Clear questions deserve helpful answers.", expression: "proud" },
    { text: "Take your time putting your thoughts together.", expression: "relaxed" },
    { text: "Hmm, let's see how we can help.", expression: "curious" },
    { text: "Every bit of feedback can help make things better.", expression: "happy" },
    { text: "No question is silly if it's something you need to know.", expression: "determined" },
  ],

  assistant: [
    { text: "Hello again! What shall we figure out together?", expression: "curious" },
    { text: "Ask away. I'll do my best to point you in the right direction.", expression: "happy" },
    { text: "I'm here, should you need a little guidance.", expression: "relaxed" },
    { text: "Hmm... what shall we discover today?", expression: "curious" },
    { text: "Ooh, a question! Those are my favourite.", expression: "excited" },
    { text: "Let me think that through with you.", expression: "determined" },
    { text: "I might need a moment for this one. Thinking face engaged!", expression: "confused" },
    { text: "We'll figure it out together. That's a promise.", expression: "happy" },
    { text: "Go on, I'm listening.", expression: "curious" },
    { text: "Oh! I hadn't thought about it that way.", expression: "surprised" },
    { text: "One question can lead to a rather wonderful discovery.", expression: "proud" },
    { text: "No need to have everything figured out before asking.", expression: "relaxed" },
    { text: "Let's untangle this little mystery.", expression: "mischievous" },
    { text: "I shall do my very best. Quill at the ready!", expression: "determined" },
    { text: "Sometimes the simplest explanation is the right one.", expression: "proud" },
    { text: "Well now, that's an interesting question.", expression: "winking" },
    { text: "It's alright to ask me to explain something another way.", expression: "happy" },
  ],

  default: [
    { text: "A new page to explore! I wonder what we'll discover.", expression: "curious" },
    { text: "I'm here if you need a little guidance.", expression: "happy" },
    { text: "Oh! I haven't seen this corner yet.", expression: "surprised" },
    { text: "Every page has a little something worth discovering.", expression: "proud" },
    { text: "I wonder what brought you here.", expression: "curious" },
    { text: "Don't mind me. Just having a little look around.", expression: "mischievous" },
    { text: "Lost, or simply exploring? Either is perfectly fine.", expression: "winking" },
    { text: "A new corner of the story!", expression: "excited" },
  ],
};

export function getOperaPage(pathname: string): OperaPage {
  if (pathname === "/") return "home";

  if (pathname === "/pricing" || pathname.startsWith("/pricing/")) {
    return "pricing";
  }

  if (pathname === "/explore" || pathname.startsWith("/explore/")) {
    return "explore";
  }

  if (pathname === "/about" || pathname.startsWith("/about/")) {
    return "about";
  }

  if (pathname === "/contact" || pathname.startsWith("/contact/")) {
    return "contact";
  }

  if (pathname === "/assistant" || pathname.startsWith("/assistant/")) {
    return "assistant";
  }

  return "default";
}
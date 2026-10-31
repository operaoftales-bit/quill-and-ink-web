import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import PageTransition from "./components/motion/PageTransition";
import BackgroundPage from "./components/BackgroundPage";
import OperaAssistant from "./assistant/components/OperaAssistant";

import "./assistant/components/opera-animations.css";
import "./assistant/components/opera-path.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://quill-and-ink-web.vercel.app";
const EXPLORE_URL = `${SITE_URL}/explore`;
const ADD_BOT_URL = "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2253294731390128&integration_type=0&scope=bot+applications.commands"
const SUPPORT_SERVER_URL = "https://discord.gg/3qbKqxBJDa";
const VOTE_URL = "https://top.gg/bot/1535187211958489208#reviews";
const PREVIEW_URL = `${SITE_URL}/og-preview-v2.gif`;

const discordComponentEmbed = {
  component: {
    type: 17,
    accent_color: 0x287f83,
    components: [
      {
        type: 10,
        content:
          "# Quill & Ink\nBuilt for communities. Made for stories.\n\nA modular Discord bot for moderation, economy, games, and community tools. Explore our plugins and bring your server to life.",
      },
      {
        type: 12,
        items: [
          {
            media: {
              url: PREVIEW_URL,
            },
            description: "Quill & Ink — Built for communities. Made for stories.",
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "Explore Plugins",
            url: EXPLORE_URL,
          },
          {
            type: 2,
            style: 5,
            label: "Add to Discord",
            url: ADD_BOT_URL,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "Support Server",
            url: SUPPORT_SERVER_URL,
          },
          {
            type: 2,
            style: 5,
            label: "Vote for Us",
            url: VOTE_URL,
          },
        ],
      },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Quill & Ink",
    template: "%s | Quill & Ink",
  },

  description:
    "Built for communities. Made for stories. A modular Discord bot for moderation, community, economy, games, and more.",
  
  icons: {
    icon: "/images/quill-icon.png",
    shortcut: "/images/quill-icon.png",
    apple: "/images/quill-icon.png",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Quill & Ink",
    title: "Quill & Ink",
    description:
      "Meet Quill & Ink — moderation, economy, games, and community tools for Discord. Explore our plugins and bring your server to life.",
    images: [
      {
        url: PREVIEW_URL,
        alt: "Quill & Ink — Built for communities. Made for stories.",
        width: 480,
        height: 270,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Quill & Ink",
    description:
      "Built for communities. Made for stories. Explore moderation, economy, games, and community tools for Discord.",
    images: [PREVIEW_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          id="discord:component-embed"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(discordComponentEmbed),
          }}
        />
      </head>

      <body className="relative isolate min-h-full flex flex-col">
        <BackgroundPage />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
          <Footer />
        </div>

        <OperaAssistant />
      </body>
    </html>
  );
}
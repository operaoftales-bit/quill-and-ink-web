
import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#discover" },
      { label: "Plugins", href: "/explore" },
      { label: "Premium", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "Commands", href: "/docs/commands" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Support Server",
        href: "https://discord.gg/3qbKqxBJDa",
        external: true,
      },
      {
        label: "Add to Discord",
        href: "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2253294731390128&integration_type=0&scope=bot+applications.commands",
        external: true,
      },
      {
        label: "Vote for Us",
        href: "https://top.gg/bot/1535187211958489208#reviews",
        external: true,
      },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Quill & Ink", href: "/about" },
      // Add verified legal policy routes here when available.
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-[#45647b]/25 bg-[#061525]/95 px-5 pb-8 pt-12 sm:px-8 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-serif text-lg text-[#eaf3f4]">
                {group.title}
              </h2>

              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                      className="text-sm text-[#91a9b8] transition-colors duration-200 hover:text-[#83dce9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79d9e9]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#45647b]/25 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-serif text-lg text-[#eaf3f4]">
                Quill <span className="italic text-[#d0b16b]">&</span> Ink
              </p>
              <p className="mt-1 text-xs text-[#8299a9]">
                Built for communities. Made for stories.
              </p>
            </div>

            <p className="text-xs text-[#8299a9]">
              © {new Date().getFullYear()} Quill & Ink. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

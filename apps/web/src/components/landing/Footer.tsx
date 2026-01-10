import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Limited Editions", href: "#" },
  { label: "Accessories", href: "#" },
  { label: "Gift Cards", href: "#" },
];

const COMPANY_LINKS = [
  { label: "Our Story", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Press", href: "#" },
];

const HELP_LINKS = [
  { label: "Support", href: "/support" },
  { label: "Docs", href: "/docs" },
];

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/iBreakProd", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ibreakprod/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/I_Break_Prod", label: "X (Twitter)" },
  { icon: Globe, href: "https://hrsht.me", label: "Website" },
];

export function Footer() {
  const { openChat } = useChatWidget();
  return (
    <footer className="border-t border-neutral-border bg-background-dark pt-16 pb-8 px-8 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-1">
          <Link
            to="/"
            className="h-10 w-10 bg-primary rounded flex items-center justify-center text-white font-bold text-xl mb-6 overflow-hidden p-1"
          >
            <img
              alt="Arctic Logo"
              className="w-full h-full object-contain"
              src="/arctic.png"
            />
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Arctic.
            <br />
            AI support at the heart of everything.
            <br />
            Est. 2024
          </p>
        </div>
        <div className="col-span-1">
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">
            Shop
          </h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">
            Company
          </h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">
            Help
          </h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>
              <button
                type="button"
                onClick={openChat}
                className="text-primary hover:text-primary/75 cursor-pointer transition-colors"
              >
                Try the AI
              </button>
            </li>
            {HELP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">
            Connect
          </h4>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                to={href}
                className="w-10 h-10 border border-neutral-border rounded flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <div>
          Made by{" "}
          <a
            href="https://hrsht.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
          >
            Harshit
          </a>{" "}
          — © 2024 ARCTIC.
        </div>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-white transition-colors">
            PRIVACY POLICY
          </Link>
          <Link to="#" className="hover:text-white transition-colors">
            TERMS OF SERVICE
          </Link>
        </div>
      </div>
    </footer>
  );
}

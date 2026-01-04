import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContextHook";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Orders", href: "/orders" },
  { label: "Support", href: "/support" },
  { label: "Docs", href: "/docs" },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="lg:hidden fixed w-full top-0 z-50 bg-background/90 backdrop-blur-md border-b border-neutral-border px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white font-bold overflow-hidden p-1"
        >
          <img
            alt="Arctic Logo"
            className="w-full h-full object-contain"
            src="/arctic.png"
          />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 -m-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-8" /> : <Menu className="size-8" />}
        </button>
      </header>
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="lg:hidden fixed top-16 left-0 right-0 z-50 bg-background border-b border-neutral-border py-4 px-6 shadow-xl"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-sm font-bold tracking-widest hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-neutral-border pt-3 mt-2">
                {isAuthenticated && user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 py-2">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full bg-linear-to-br from-primary via-primary-dark to-indigo-600"
                          aria-hidden
                        />
                      )}
                      <span className="text-sm text-gray-400">{user.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm hover:text-primary"
                    >
                      <User className="size-4" /> Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 py-2 text-sm hover:text-primary w-full text-left"
                    >
                      <LogOut className="size-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-sm font-bold tracking-widest hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}

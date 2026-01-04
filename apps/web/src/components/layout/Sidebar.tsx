import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContextHook";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Orders", href: "/orders" },
  { label: "Support", href: "/support" },
  { label: "Docs", href: "/docs" },
];

export function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 border-r border-neutral-border bg-background z-50 flex-col items-center justify-between py-8">
      <Link
        to="/"
        className="h-10 w-10 bg-primary rounded flex items-center justify-center text-white font-bold text-xl overflow-hidden p-1"
      >
        <img
          alt="Arctic Logo"
          className="w-full h-full object-contain"
          src="/arctic.png"
        />
      </Link>
      <div className="flex flex-row gap-12 -rotate-90">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            to={href}
            className="text-sm font-bold tracking-widest hover:text-primary transition-colors whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-6 text-gray-400 relative">
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/20 bg-conic-90 from-red-400 via-primary-dark to-orange-600"
                />
              )}
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-full ml-2 z-50 w-40 py-2 rounded-lg bg-background-dark border border-neutral-border shadow-xl">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5"
                  >
                    <User className="size-4" /> Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 text-left"
                  >
                    <LogOut className="size-4" /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-bold tracking-widest hover:text-primary transition-colors"
          >
            <LogIn className="size-4 inline -ml-1 mr-1.5" />
          </Link>
        )}
      </div>
    </aside>
  );
}

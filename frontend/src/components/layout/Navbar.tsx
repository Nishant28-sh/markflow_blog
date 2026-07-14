import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border/60 bg-bg/80 backdrop-blur-md px-6 py-4">
      {onSearch && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            placeholder="Search your blogs..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface/60 py-2 pl-9 pr-3 text-sm placeholder:text-text-faint focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />

        <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-surface transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
          <ChevronDown className="h-4 w-4 text-text-muted" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 glass-panel bg-surface shadow-soft py-1 animate-slide-up">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}

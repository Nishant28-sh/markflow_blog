import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, PenSquare, Feather } from "lucide-react";
import clsx from "@/utils/clsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/blogs", label: "All Blogs", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-bg-raised/60 backdrop-blur-md h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow">
          <Feather className="text-white" size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight">MarkFlow</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
                  : "text-text-muted hover:bg-surface hover:text-text border border-transparent"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <NavLink
          to="/editor/new"
          className="flex items-center justify-center gap-2 btn-gradient w-full"
        >
          <PenSquare className="h-4 w-4" />
          New Blog
        </NavLink>
      </div>
    </aside>
  );
}

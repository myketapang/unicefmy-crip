import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Heart,
  ShieldAlert,
  TrendingDown,
  Building2,
  MessagesSquare,
  Database,
  BookOpen,
  Landmark,
  Users,
  LogOut,
  UserCircle,
  Moon,
  Sun,
  Menu,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { id: "overview",   label: "Overview",       icon: LayoutDashboard, path: "/" },
  { id: "marriage",   label: "Child marriage",  icon: Heart,           path: "/marriage" },
  { id: "abuse",      label: "Abuse & neglect", icon: ShieldAlert,     path: "/abuse" },
  { id: "poverty",    label: "Poverty & risk",  icon: TrendingDown,    path: "/poverty" },
  { id: "facilities", label: "Care facilities", icon: Building2,       path: "/facilities" },
  { id: "sentiment",  label: "Discourse NLP",   icon: MessagesSquare,  path: "/sentiment" },
  { id: "parliament", label: "Hansard",          icon: Landmark,        path: "/parliament" },
  { id: "sources",    label: "Data sources",    icon: Database,        path: "/sources" },
  { id: "glossary",   label: "Glossary",         icon: BookOpen,        path: "/glossary" },
];

const platformNavItems = [
  { id: "admin", label: "System Manage", icon: Users, path: "/admin" },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isMobile = () => window.innerWidth < 768;

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile()) setSidebarOpen(false);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="shell">
      {/* Mobile backdrop */}
      {sidebarOpen && isMobile() && (
        <div className="sb-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sb-open" : "sb-closed"}`}>
        <div className="logo">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div className="logo-badge">UNICEF MY · Phase 1</div>
              <div className="logo-t">Child Rights Intelligence</div>
              <div className="logo-s">Platform prototype v2</div>
            </div>
            <button className="sb-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>

        <div className="ns">Core modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isOn = location.pathname === item.path;
          return (
            <div key={item.id} className={`ni ${isOn ? "on" : ""}`} onClick={() => handleNav(item.path)}>
              <Icon size={14} />
              {item.label}
            </div>
          );
        })}

        {isAdmin && (
          <>
            <div className="ns">Platform</div>
            {platformNavItems.map((item) => {
              const Icon = item.icon;
              const isOn = location.pathname === item.path;
              return (
                <div key={item.id} className={`ni ${isOn ? "on" : ""}`} onClick={() => handleNav(item.path)}>
                  <Icon size={14} />
                  {item.label}
                </div>
              );
            })}
          </>
        )}

        <div style={{ marginTop: "auto" }}>
          {isAuthenticated && user && (
            <div style={{ padding: "8px 10px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                <UserCircle size={12} />
                <span style={{ fontWeight: 500 }}>{user.name || "User"}</span>
                {isAdmin && (
                  <span style={{ background: "var(--color-background-info)", color: "var(--color-text-info)", padding: "0 4px", borderRadius: "3px", fontSize: "8px" }}>ADMIN</span>
                )}
              </div>
              <div onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--color-text-tertiary)", cursor: "pointer", padding: "2px 0" }}>
                <LogOut size={10} />
                Sign out
              </div>
            </div>
          )}
          <div className="sfooter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span>Sources: JKM · DOSM · KPWKM</span>
              <div onClick={toggleDark} style={{ cursor: "pointer" }}>
                {isDark ? <Sun size={10} /> : <Moon size={10} />}
              </div>
            </div>
            UNICEF MY · UN Malaysia<br />
            BMJ Open · data.gov.my<br />
            Updated: May 2026
          </div>
        </div>
      </div>

      {/* Desktop re-open button (visible when sidebar collapsed) */}
      {!sidebarOpen && (
        <button className="sb-reopen-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <Menu size={14} />
        </button>
      )}

      {/* Main wrapper */}
      <div className="main-wrap">
        {/* Mobile topbar */}
        <div className="mob-topbar">
          <button className="mob-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <span className="mob-title">Child Rights Intelligence</span>
          <div onClick={toggleDark} style={{ cursor: "pointer", marginLeft: "auto", color: "var(--color-text-tertiary)" }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </div>
        </div>

        <div className="main">
          {children}
        </div>
      </div>
    </div>
  );
}



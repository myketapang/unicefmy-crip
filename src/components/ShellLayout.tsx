import { useState } from "react";
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
  Users,
  LogOut,
  UserCircle,
  Moon,
  Sun,
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/" },
  { id: "marriage", label: "Child marriage", icon: Heart, path: "/marriage" },
  { id: "abuse", label: "Abuse & neglect", icon: ShieldAlert, path: "/abuse" },
  { id: "poverty", label: "Poverty & risk", icon: TrendingDown, path: "/poverty" },
  { id: "facilities", label: "Care facilities", icon: Building2, path: "/facilities" },
  { id: "sentiment", label: "Discourse NLP", icon: MessagesSquare, path: "/sentiment" },
  { id: "sources", label: "Data sources", icon: Database, path: "/sources" },
];

const platformNavItems = [
  { id: "admin", label: "System Manage", icon: Users, path: "/admin" },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="shell">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-badge">UNICEF MY · Phase 1</div>
          <div className="logo-t">Child Rights Intelligence</div>
          <div className="logo-s">Platform prototype v2</div>
        </div>

        <div className="ns">Core modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isOn = location.pathname === item.path;
          return (
            <div
              key={item.id}
              className={`ni ${isOn ? "on" : ""}`}
              onClick={() => navigate(item.path)}
            >
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
                <div
                  key={item.id}
                  className={`ni ${isOn ? "on" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={14} />
                  {item.label}
                </div>
              );
            })}
          </>
        )}

        {/* User section */}
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
              <div
                onClick={logout}
                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--color-text-tertiary)", cursor: "pointer", padding: "2px 0" }}
              >
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

      {/* Main */}
      <div className="main">
        {children}
      </div>
    </div>
  );
}

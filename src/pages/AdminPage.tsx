import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Users, UserCheck, Clock } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const { data: users, refetch } = trpc.admin.users.list.useQuery();
  const { data: stats } = trpc.admin.users.stats.useQuery();
  const updateRole = trpc.admin.users.updateRole.useMutation({ onSuccess: () => refetch() });

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <>
        <div className="topbar">
          <div>
            <div className="tt">System Management</div>
            <div className="tm">Admin-only access</div>
          </div>
        </div>
        <div className="content">
          <div className="card-d" style={{ textAlign: "center", padding: 40 }}>
            <Shield size={32} style={{ color: "var(--color-text-tertiary)", marginBottom: 12 }} />
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Access Denied</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>This page requires administrator privileges.</div>
          </div>
        </div>
      </>
    );
  }

  const userList = users || [];

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">System Management</div>
          <div className="tm">User management · Role assignment · Platform analytics</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m4">
          <div className="mc">
            <div className="ml">Total Users</div>
            <div className="mv">{stats?.totalUsers || userList.length || 0}</div>
            <div className="ms">Platform accounts</div>
          </div>
          <div className="mc">
            <div className="ml">Administrators</div>
            <div className="mv mv-g">{stats?.adminCount || 0}</div>
            <div className="ms">Full access</div>
          </div>
          <div className="mc">
            <div className="ml">Regular Users</div>
            <div className="mv">{(stats?.totalUsers || userList.length || 0) - (stats?.adminCount || 0)}</div>
            <div className="ms">Read-only access</div>
          </div>
          <div className="mc">
            <div className="ml">Your Role</div>
            <div className="mv mv-g">{user?.role || "user"}</div>
            <div className="ms">Current session</div>
          </div>
        </div>

        <div className="card-d">
          <div className="ch">
            <div>
              <div className="ct">User Directory</div>
              <div className="cs">All registered platform users</div>
            </div>
          </div>

          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>Role</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>Joined</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>Last Sign In</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, color: "var(--color-text-secondary)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                    <td style={{ padding: "6px 8px", color: "var(--color-text-tertiary)" }}>{u.id}</td>
                    <td style={{ padding: "6px 8px", color: "var(--color-text-primary)", fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width: 20, height: 20, borderRadius: "50%" }} /> : <UserCheck size={14} style={{ color: "var(--color-text-tertiary)" }} />}
                        {u.name || "—"}
                      </div>
                    </td>
                    <td style={{ padding: "6px 8px", color: "var(--color-text-secondary)" }}>{u.email || "—"}</td>
                    <td style={{ padding: "6px 8px" }}>
                      <span className={`pill ${u.role === "admin" ? "p-hi" : "p-ok"}`}>
                        {u.role === "admin" ? <Shield size={8} style={{ display: "inline", marginRight: 2 }} /> : <Users size={8} style={{ display: "inline", marginRight: 2 }} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "6px 8px", color: "var(--color-text-tertiary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={10} />
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </div>
                    </td>
                    <td style={{ padding: "6px 8px", color: "var(--color-text-tertiary)" }}>
                      {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : "—"}
                    </td>
                    <td style={{ padding: "6px 8px" }}>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value as "user" | "admin" })}
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          border: "0.5px solid var(--color-border-tertiary)",
                          background: "var(--color-background-secondary)",
                          color: "var(--color-text-primary)",
                          cursor: "pointer",
                        }}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {!userList.length && (
                  <tr>
                    <td colSpan={7} style={{ padding: 20, textAlign: "center", color: "var(--color-text-tertiary)" }}>
                      No users found. Users will appear here after signing in.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

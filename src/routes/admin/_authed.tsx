import { createFileRoute, redirect, Outlet, useRouterState } from "@tanstack/react-router";
import { getSessionFn } from "@/rpc/auth.server";
import { AdminShell } from "@/components/admin/AdminShell";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/hero": "Hero",
  "/admin/keunggulan": "Keunggulan",
  "/admin/cakupan": "Cakupan",
  "/admin/paket": "Paket",
  "/admin/testimoni": "Testimoni",
  "/admin/cta": "CTA Akhir",
  "/admin/footer": "Footer",
  "/admin/pengaturan": "Pengaturan",
};

export const Route = createFileRoute("/admin/_authed")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" });
    }
    return { session };
  },
  component: AuthedAdminLayout,
});

function AuthedAdminLayout() {
  const { session } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "Admin";

  return (
    <AdminShell title={title} email={session.email}>
      <Outlet />
    </AdminShell>
  );
}

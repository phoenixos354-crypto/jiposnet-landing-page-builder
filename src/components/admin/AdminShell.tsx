import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Sparkles,
  MapPinned,
  Package,
  MessagesSquare,
  Megaphone,
  PanelBottom,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutFn } from "@/rpc/auth.server";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/hero", label: "Hero", icon: Sparkles },
  { to: "/admin/keunggulan", label: "Keunggulan", icon: Sparkles },
  { to: "/admin/cakupan", label: "Cakupan", icon: MapPinned },
  { to: "/admin/paket", label: "Paket", icon: Package },
  { to: "/admin/testimoni", label: "Testimoni", icon: MessagesSquare },
  { to: "/admin/cta", label: "CTA Akhir", icon: Megaphone },
  { to: "/admin/footer", label: "Footer", icon: PanelBottom },
  { to: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  title,
  description,
  email,
  children,
}: {
  title: string;
  description?: string;
  email?: string | undefined;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutFn();
      toast.success("Berhasil keluar.");
      navigate({ to: "/admin/login" });
    } catch {
      toast.error("Gagal keluar. Coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-background px-4 py-6 md:block">
          <div className="mb-6 px-2">
            <p className="text-sm font-extrabold text-brand-deep">JIPOSNET Admin</p>
            {email && <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>}
          </div>
          <NavLinks />
          <div className="mt-8 space-y-2 border-t border-border pt-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink size={17} /> Lihat Website
            </a>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
            >
              <LogOut size={17} /> {loggingOut ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar mobile */}
          <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Buka menu admin">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="mb-6 mt-4 px-1">
                  <p className="text-sm font-extrabold text-brand-deep">JIPOSNET Admin</p>
                  {email && <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>}
                </div>
                <NavLinks onNavigate={() => setMobileOpen(false)} />
                <div className="mt-8 space-y-2 border-t border-border pt-4">
                  <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent">
                    <ExternalLink size={17} /> Lihat Website
                  </a>
                  <button onClick={handleLogout} disabled={loggingOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60">
                    <LogOut size={17} /> {loggingOut ? "Keluar..." : "Keluar"}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
            <p className="text-sm font-extrabold text-brand-deep">{title}</p>
            <div className="w-9" />
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 hidden md:block">
                <h1 className="text-2xl font-extrabold text-brand-deep">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              {description && (
                <p className="mb-4 text-sm text-muted-foreground md:hidden">{description}</p>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, MapPinned, Package, MessagesSquare, Megaphone, PanelBottom, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdminContentFn } from "@/rpc/content.server";

export const Route = createFileRoute("/admin/_authed/")({
  loader: () => getAdminContentFn(),
  component: AdminDashboard,
});

const SECTIONS = [
  { to: "/admin/hero", label: "Hero", icon: Sparkles, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => c.hero.headline_highlight },
  { to: "/admin/keunggulan", label: "Keunggulan", icon: Sparkles, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => `${c.keunggulan.cards.length} kartu keunggulan` },
  { to: "/admin/cakupan", label: "Cakupan", icon: MapPinned, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => c.cakupan.title },
  { to: "/admin/paket", label: "Paket", icon: Package, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => `${c.packages.length} paket aktif` },
  { to: "/admin/testimoni", label: "Testimoni", icon: MessagesSquare, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => `${c.testimonials.length} testimoni` },
  { to: "/admin/cta", label: "CTA Akhir", icon: Megaphone, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => c.cta.headline },
  { to: "/admin/footer", label: "Footer", icon: PanelBottom, summary: (c: Awaited<ReturnType<typeof getAdminContentFn>>) => c.footer.whatsapp_display },
  { to: "/admin/pengaturan", label: "Pengaturan", icon: Settings, summary: () => "Password, WhatsApp, logo, SEO" },
] as const;

function AdminDashboard() {
  const content = Route.useLoaderData();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SECTIONS.map(({ to, label, icon: Icon, summary }) => (
        <Link key={to} to={to} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                  <Icon size={18} />
                </div>
                <CardTitle className="text-base">{label}</CardTitle>
              </div>
              <ArrowRight className="mt-2 text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">{summary(content)}</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

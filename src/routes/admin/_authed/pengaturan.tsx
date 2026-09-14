import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getAdminContentFn, updateSectionFn } from "@/rpc/content.server";
import { changePasswordFn } from "@/rpc/auth.server";
import type { GlobalContent } from "@/lib/content-types";
import logoImageDefault from "@/assets/jiposnet-logo.png";

export const Route = createFileRoute("/admin/_authed/pengaturan")({
  loader: () => getAdminContentFn(),
  component: PengaturanEditor,
});

function PengaturanEditor() {
  const initial = Route.useLoaderData().global;
  const [form, setForm] = useState<GlobalContent>(initial);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  function set<K extends keyof GlobalContent>(key: K, value: GlobalContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveGlobal() {
    setSaving(true);
    try {
      const result = await updateSectionFn({ data: { sectionKey: "global", content: form } });
      if (result.success) toast.success("Pengaturan umum berhasil disimpan.");
      else toast.error(result.error ?? "Gagal menyimpan.");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }
    setChangingPassword(true);
    try {
      const result = await changePasswordFn({ data: { currentPassword: currentPassword, newPassword: newPassword } });
      if (result.success) {
        toast.success("Password berhasil diganti.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error ?? "Gagal mengganti password.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nomor WhatsApp, Logo & SEO</CardTitle>
          <CardDescription>Berlaku untuk seluruh halaman (nomor WA dipakai di semua tombol).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nomor WhatsApp utama (format internasional tanpa "+", mis. 6281279349994)</Label>
            <Input value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} />
          </div>
          <ImageUploadField
            label="Logo"
            value={form.logo}
            onChange={(path) => set("logo", path)}
            defaultPreview={logoImageDefault}
          />
          <div className="space-y-2">
            <Label>SEO — Judul halaman</Label>
            <Input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>SEO — Deskripsi halaman</Label>
            <Textarea rows={3} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveGlobal} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Menyimpan..." : "Simpan Pengaturan Umum"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><KeyRound size={16} /> Ganti Password Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Password saat ini</Label>
              <Input id="current-password" type="password" required autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Password baru</Label>
                <Input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi password baru</Label>
                <Input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="outline" disabled={changingPassword}>
                {changingPassword ? <Loader2 className="animate-spin" size={16} /> : <KeyRound size={16} />}
                {changingPassword ? "Menyimpan..." : "Ganti Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

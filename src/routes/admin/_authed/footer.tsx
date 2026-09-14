import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminContentFn, updateSectionFn } from "@/rpc/content.server";
import type { FooterContent } from "@/lib/content-types";

export const Route = createFileRoute("/admin/_authed/footer")({
  loader: () => getAdminContentFn(),
  component: FooterEditor,
});

function FooterEditor() {
  const initial = Route.useLoaderData().footer;
  const [form, setForm] = useState<FooterContent>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FooterContent>(key: K, value: FooterContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateSectionFn({ data: { sectionKey: "footer", content: form } });
      if (result.success) toast.success("Section Footer berhasil disimpan.");
      else toast.error(result.error ?? "Gagal menyimpan.");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader><CardTitle className="text-base">Informasi Footer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Deskripsi singkat</Label><Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="space-y-2"><Label>Alamat</Label><Textarea rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="space-y-2"><Label>Nomor WhatsApp (tampilan, mis. 0812-xxxx)</Label><Input value={form.whatsapp_display} onChange={(e) => set("whatsapp_display", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Jam layanan</Label><Input value={form.service_hours} onChange={(e) => set("service_hours", e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Teks hak cipta</Label><Input value={form.copyright} onChange={(e) => set("copyright", e.target.value)} /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={saving} className="shadow-lg">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}

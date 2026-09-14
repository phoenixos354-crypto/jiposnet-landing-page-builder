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
import type { CtaContent } from "@/lib/content-types";

export const Route = createFileRoute("/admin/_authed/cta")({
  loader: () => getAdminContentFn(),
  component: CtaEditor,
});

function CtaEditor() {
  const initial = Route.useLoaderData().cta;
  const [form, setForm] = useState<CtaContent>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CtaContent>(key: K, value: CtaContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateSectionFn({ data: { sectionKey: "cta", content: form } });
      if (result.success) toast.success("Section CTA Akhir berhasil disimpan.");
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
        <CardHeader><CardTitle className="text-base">Ajakan Bertindak (CTA) Akhir</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Headline</Label><Input value={form.headline} onChange={(e) => set("headline", e.target.value)} /></div>
          <div className="space-y-2"><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Label tombol</Label><Input value={form.button_label} onChange={(e) => set("button_label", e.target.value)} /></div>
            <div className="space-y-2"><Label>Pesan WhatsApp</Label><Input value={form.button_message} onChange={(e) => set("button_message", e.target.value)} /></div>
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

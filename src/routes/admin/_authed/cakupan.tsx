import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getAdminContentFn, updateSectionFn } from "@/rpc/content.server";
import type { CakupanContent } from "@/lib/content-types";
import coverageImageDefault from "@/assets/jiposnet-coverage.jpg";

export const Route = createFileRoute("/admin/_authed/cakupan")({
  loader: () => getAdminContentFn(),
  component: CakupanEditor,
});

function CakupanEditor() {
  const initial = Route.useLoaderData().cakupan;
  const [form, setForm] = useState<CakupanContent>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CakupanContent>(key: K, value: CakupanContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function updateMetric(index: number, patch: Partial<CakupanContent["metrics"][number]>) {
    const next = [...form.metrics];
    next[index] = { ...next[index], ...patch } as CakupanContent["metrics"][number];
    set("metrics", next);
  }
  function removeMetric(index: number) {
    set("metrics", form.metrics.filter((_, i) => i !== index));
  }
  function addMetric() {
    set("metrics", [...form.metrics, { value: "", label: "" }]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateSectionFn({ data: { sectionKey: "cakupan", content: form } });
      if (result.success) toast.success("Section Cakupan berhasil disimpan.");
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
        <CardHeader><CardTitle className="text-base">Judul Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Kicker</Label><Input value={form.kicker} onChange={(e) => set("kicker", e.target.value)} /></div>
          <div className="space-y-2"><Label>Judul</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="space-y-2"><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Metrik ({form.metrics.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {form.metrics.map((metric, index) => (
            <div key={index} className="flex items-end gap-2 rounded-lg border border-border p-3">
              <div className="flex-1 space-y-2"><Label>Angka/Nilai</Label><Input value={metric.value} onChange={(e) => updateMetric(index, { value: e.target.value })} /></div>
              <div className="flex-1 space-y-2"><Label>Label</Label><Input value={metric.label} onChange={(e) => updateMetric(index, { label: e.target.value })} /></div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeMetric(index)} aria-label="Hapus metrik"><Trash2 size={15} className="text-destructive" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addMetric}><Plus size={15} /> Tambah metrik</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Gambar & CTA</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label="Gambar ilustrasi cakupan"
            value={form.image}
            onChange={(path) => set("image", path)}
            defaultPreview={coverageImageDefault}
          />
          <div className="space-y-2"><Label>Catatan kecil di bawah metrik</Label><Input value={form.note} onChange={(e) => set("note", e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Label tombol CTA</Label><Input value={form.cta_label} onChange={(e) => set("cta_label", e.target.value)} /></div>
            <div className="space-y-2"><Label>Pesan WhatsApp CTA</Label><Input value={form.cta_message} onChange={(e) => set("cta_message", e.target.value)} /></div>
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

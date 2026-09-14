import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getAdminContentFn, updateSectionFn } from "@/rpc/content.server";
import type { HeroContent } from "@/lib/content-types";
import heroImageDefault from "@/assets/jiposnet-hero.jpg";

export const Route = createFileRoute("/admin/_authed/hero")({
  loader: () => getAdminContentFn(),
  component: HeroEditor,
});

function HeroEditor() {
  const initial = Route.useLoaderData().hero;
  const [form, setForm] = useState<HeroContent>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateSectionFn({ data: { sectionKey: "hero", content: form } });
      if (result.success) {
        toast.success("Section Hero berhasil disimpan.");
      } else {
        toast.error(result.error ?? "Gagal menyimpan.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Teks Utama</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Badge (teks kecil di atas judul)</Label>
            <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Judul — bagian awal</Label>
              <Input value={form.headline_pre} onChange={(e) => set("headline_pre", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Judul — bagian ditonjolkan (warna merah)</Label>
              <Input value={form.headline_highlight} onChange={(e) => set("headline_highlight", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sub-headline</Label>
            <Textarea rows={3} value={form.subheadline} onChange={(e) => set("subheadline", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tombol CTA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Label tombol utama</Label>
              <Input value={form.cta_primary_label} onChange={(e) => set("cta_primary_label", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Label tombol kedua</Label>
              <Input value={form.cta_secondary_label} onChange={(e) => set("cta_secondary_label", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pesan WhatsApp otomatis (tombol utama)</Label>
            <Textarea rows={2} value={form.cta_primary_message} onChange={(e) => set("cta_primary_message", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tujuan tombol kedua (link/anchor, mis. #paket)</Label>
            <Input value={form.cta_secondary_href} onChange={(e) => set("cta_secondary_href", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gambar & Badge Kepercayaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImageUploadField
            label="Gambar latar belakang Hero"
            value={form.background_image}
            onChange={(path) => set("background_image", path)}
            defaultPreview={heroImageDefault}
            hint="Disarankan foto lanskap, minimal 1600px lebar."
          />
          <StringListEditor
            label="Badge kepercayaan (mis. Tim lokal, Respon cepat)"
            items={form.trust_badges}
            onChange={(items) => set("trust_badges", items)}
            addLabel="Tambah badge"
          />
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

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdminContentFn, updateSectionFn } from "@/rpc/content.server";
import type { KeunggulanContent } from "@/lib/content-types";
import { AVAILABLE_ICONS } from "@/lib/content-types";
import { resolveIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/admin/_authed/keunggulan")({
  loader: () => getAdminContentFn(),
  component: KeunggulanEditor,
});

function KeunggulanEditor() {
  const initial = Route.useLoaderData().keunggulan;
  const [form, setForm] = useState<KeunggulanContent>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof KeunggulanContent>(key: K, value: KeunggulanContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function updateCard(index: number, patch: Partial<KeunggulanContent["cards"][number]>) {
    const next = [...form.cards];
    next[index] = { ...next[index], ...patch } as KeunggulanContent["cards"][number];
    set("cards", next);
  }
  function removeCard(index: number) {
    set("cards", form.cards.filter((_, i) => i !== index));
  }
  function addCard() {
    set("cards", [...form.cards, { icon: "Sparkles", title: "", text: "" }]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateSectionFn({ data: { sectionKey: "keunggulan", content: form } });
      if (result.success) toast.success("Section Keunggulan berhasil disimpan.");
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
          <div className="space-y-2"><Label>Kicker (label kecil)</Label><Input value={form.kicker} onChange={(e) => set("kicker", e.target.value)} /></div>
          <div className="space-y-2"><Label>Judul</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="space-y-2"><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Kotak Sorotan</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Judul sorotan</Label><Input value={form.highlight_title} onChange={(e) => set("highlight_title", e.target.value)} /></div>
          <div className="space-y-2"><Label>Teks sorotan</Label><Textarea rows={2} value={form.highlight_text} onChange={(e) => set("highlight_text", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Kartu Keunggulan ({form.cards.length})</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {form.cards.map((card, index) => {
            const Icon = resolveIcon(card.icon);
            return (
              <div key={index} className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-deep"><Icon size={16} /> Kartu {index + 1}</div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCard(index)} aria-label="Hapus kartu"><Trash2 size={15} className="text-destructive" /></Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                  <div className="space-y-2">
                    <Label>Ikon</Label>
                    <Select value={card.icon} onValueChange={(value) => updateCard(index, { icon: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ICONS.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Judul kartu</Label>
                    <Input value={card.title} onChange={(e) => updateCard(index, { title: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Teks kartu</Label>
                  <Textarea rows={2} value={card.text} onChange={(e) => updateCard(index, { text: e.target.value })} />
                </div>
              </div>
            );
          })}
          <Button type="button" variant="outline" size="sm" onClick={addCard}><Plus size={15} /> Tambah kartu</Button>
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

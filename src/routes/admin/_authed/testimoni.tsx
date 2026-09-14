import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown, Quote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getAdminContentFn,
  createTestimonialFn,
  updateTestimonialFn,
  deleteTestimonialFn,
  reorderTestimonialsFn,
} from "@/rpc/content.server";
import type { TestimonialItem } from "@/lib/content-types";

export const Route = createFileRoute("/admin/_authed/testimoni")({
  loader: () => getAdminContentFn(),
  component: TestimoniEditor,
});

const EMPTY_TESTIMONIAL = { name: "", area: "", text: "" };

function TestimoniEditor() {
  const initial = Route.useLoaderData().testimonials;
  const [items, setItems] = useState<TestimonialItem[]>([...initial].sort((a, b) => a.sort_order - b.sort_order));
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_TESTIMONIAL);
  const [creating, setCreating] = useState(false);

  function updateItem(id: number, patch: Partial<TestimonialItem>) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function handleSaveItem(item: TestimonialItem) {
    setSavingId(item.id);
    try {
      const { id, ...rest } = item;
      const result = await updateTestimonialFn({ data: { id, ...rest } });
      if (result.success) toast.success(`Testimoni "${item.name}" disimpan.`);
      else toast.error(result.error ?? "Gagal menyimpan testimoni.");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const result = await deleteTestimonialFn({ data: { id } });
      if (result.success) {
        setItems((prev) => prev.filter((t) => t.id !== id));
        toast.success("Testimoni dihapus.");
      } else {
        toast.error(result.error ?? "Gagal menghapus testimoni.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex]!, next[index]!];
    const withOrder = next.map((item, i) => ({ ...item, sort_order: i + 1 }));
    setItems(withOrder);
    setReordering(true);
    try {
      const result = await reorderTestimonialsFn({ data: { items: withOrder } });
      if (!result.success) toast.error("Gagal menyimpan urutan.");
    } catch {
      toast.error("Gagal menyimpan urutan.");
    } finally {
      setReordering(false);
    }
  }

  async function handleCreate() {
    if (!newItem.name || !newItem.area || !newItem.text) {
      toast.error("Nama, area, dan teks testimoni wajib diisi.");
      return;
    }
    setCreating(true);
    try {
      const result = await createTestimonialFn({ data: { ...newItem, sort_order: items.length + 1 } });
      if (result.success) {
        setItems((prev) => [...prev, result.data]);
        setNewItem(EMPTY_TESTIMONIAL);
        toast.success("Testimoni baru ditambahkan.");
      } else {
        toast.error(result.error ?? "Gagal menambah testimoni.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {items.map((item, index) => (
        <Card key={item.id}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base"><Quote size={16} /> {item.name || "Testimoni baru"}</CardTitle>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" disabled={index === 0 || reordering} onClick={() => handleMove(index, -1)} aria-label="Pindah ke atas"><ArrowUp size={15} /></Button>
              <Button type="button" variant="ghost" size="icon" disabled={index === items.length - 1 || reordering} onClick={() => handleMove(index, 1)} aria-label="Pindah ke bawah"><ArrowDown size={15} /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" disabled={deletingId === item.id} aria-label="Hapus testimoni">
                    {deletingId === item.id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} className="text-destructive" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus testimoni "{item.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Nama</Label><Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Area/lokasi</Label><Input value={item.area} onChange={(e) => updateItem(item.id, { area: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Teks testimoni</Label><Textarea rows={3} value={item.text} onChange={(e) => updateItem(item.id, { text: e.target.value })} /></div>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleSaveItem(item)} disabled={savingId === item.id}>
                {savingId === item.id ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                {savingId === item.id ? "Menyimpan..." : "Simpan Testimoni Ini"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus size={16} /> Tambah Testimoni Baru</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nama</Label><Input value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} placeholder="Rina W." /></div>
            <div className="space-y-2"><Label>Area/lokasi</Label><Input value={newItem.area} onChange={(e) => setNewItem((p) => ({ ...p, area: e.target.value }))} placeholder="Rawajitu Selatan" /></div>
          </div>
          <div className="space-y-2"><Label>Teks testimoni</Label><Textarea rows={3} value={newItem.text} onChange={(e) => setNewItem((p) => ({ ...p, text: e.target.value }))} /></div>
          <div className="flex justify-end">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? <Loader2 className="animate-spin" size={16} /> : <Quote size={16} />}
              {creating ? "Menambahkan..." : "Tambah Testimoni"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

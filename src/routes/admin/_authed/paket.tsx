import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { StringListEditor } from "@/components/admin/StringListEditor";
import {
  getAdminContentFn,
  createPackageFn,
  updatePackageFn,
  deletePackageFn,
  reorderPackagesFn,
} from "@/rpc/content.server";
import { AVAILABLE_ICONS, type PackageItem } from "@/lib/content-types";
import { resolveIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/admin/_authed/paket")({
  loader: () => getAdminContentFn(),
  component: PaketEditor,
});

const EMPTY_PACKAGE: Omit<PackageItem, "id" | "sort_order"> = {
  name: "",
  speed: "",
  price: "",
  icon: "Wifi",
  featured: false,
  features: [],
};

function PaketEditor() {
  const initial = Route.useLoaderData().packages;
  const [items, setItems] = useState<PackageItem[]>([...initial].sort((a, b) => a.sort_order - b.sort_order));
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [newPackage, setNewPackage] = useState(EMPTY_PACKAGE);
  const [creating, setCreating] = useState(false);

  function updateItem(id: number, patch: Partial<PackageItem>) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function handleSaveItem(item: PackageItem) {
    setSavingId(item.id);
    try {
      const { id, ...rest } = item;
      const result = await updatePackageFn({ data: { id, ...rest } });
      if (result.success) toast.success(`Paket "${item.name}" disimpan.`);
      else toast.error(result.error ?? "Gagal menyimpan paket.");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const result = await deletePackageFn({ data: { id } });
      if (result.success) {
        setItems((prev) => prev.filter((p) => p.id !== id));
        toast.success("Paket dihapus.");
      } else {
        toast.error(result.error ?? "Gagal menghapus paket.");
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
      const result = await reorderPackagesFn({ data: { items: withOrder } });
      if (!result.success) toast.error("Gagal menyimpan urutan.");
    } catch {
      toast.error("Gagal menyimpan urutan.");
    } finally {
      setReordering(false);
    }
  }

  async function handleCreate() {
    if (!newPackage.name || !newPackage.speed || !newPackage.price) {
      toast.error("Nama, kecepatan, dan harga wajib diisi.");
      return;
    }
    setCreating(true);
    try {
      const result = await createPackageFn({ data: { ...newPackage, sort_order: items.length + 1 } });
      if (result.success) {
        setItems((prev) => [...prev, result.data]);
        setNewPackage(EMPTY_PACKAGE);
        toast.success("Paket baru ditambahkan.");
      } else {
        toast.error(result.error ?? "Gagal menambah paket.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {items.map((item, index) => {
        const Icon = resolveIcon(item.icon);
        return (
          <Card key={item.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base"><Icon size={16} /> {item.name || "Paket baru"}</CardTitle>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" disabled={index === 0 || reordering} onClick={() => handleMove(index, -1)} aria-label="Pindah ke atas"><ArrowUp size={15} /></Button>
                <Button type="button" variant="ghost" size="icon" disabled={index === items.length - 1 || reordering} onClick={() => handleMove(index, 1)} aria-label="Pindah ke bawah"><ArrowDown size={15} /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" disabled={deletingId === item.id} aria-label="Hapus paket">
                      {deletingId === item.id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} className="text-destructive" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus paket "{item.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan. Paket akan langsung hilang dari landing page.</AlertDialogDescription>
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
                <div className="space-y-2"><Label>Nama paket</Label><Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Ikon</Label>
                  <Select value={item.icon} onValueChange={(value) => updateItem(item.id, { icon: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{AVAILABLE_ICONS.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Kecepatan (mis. 20 Mbps)</Label><Input value={item.speed} onChange={(e) => updateItem(item.id, { speed: e.target.value })} /></div>
                <div className="space-y-2"><Label>Harga (mis. Rp225.000)</Label><Input value={item.price} onChange={(e) => updateItem(item.id, { price: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={item.featured} onCheckedChange={(checked) => updateItem(item.id, { featured: checked })} id={`featured-${item.id}`} />
                <Label htmlFor={`featured-${item.id}`} className="cursor-pointer">Tandai sebagai "Paling diminati"</Label>
              </div>
              <StringListEditor label="Fitur paket" items={item.features} onChange={(features) => updateItem(item.id, { features })} addLabel="Tambah fitur" />
              <div className="flex justify-end">
                <Button size="sm" onClick={() => handleSaveItem(item)} disabled={savingId === item.id}>
                  {savingId === item.id ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                  {savingId === item.id ? "Menyimpan..." : "Simpan Paket Ini"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card className="border-dashed">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus size={16} /> Tambah Paket Baru</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nama paket</Label><Input value={newPackage.name} onChange={(e) => setNewPackage((p) => ({ ...p, name: e.target.value }))} placeholder="JIPOS Super" /></div>
            <div className="space-y-2">
              <Label>Ikon</Label>
              <Select value={newPackage.icon} onValueChange={(value) => setNewPackage((p) => ({ ...p, icon: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{AVAILABLE_ICONS.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Kecepatan</Label><Input value={newPackage.speed} onChange={(e) => setNewPackage((p) => ({ ...p, speed: e.target.value }))} placeholder="50 Mbps" /></div>
            <div className="space-y-2"><Label>Harga</Label><Input value={newPackage.price} onChange={(e) => setNewPackage((p) => ({ ...p, price: e.target.value }))} placeholder="Rp450.000" /></div>
          </div>
          <StringListEditor label="Fitur paket" items={newPackage.features} onChange={(features) => setNewPackage((p) => ({ ...p, features }))} addLabel="Tambah fitur" />
          <div className="flex justify-end">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? <Loader2 className="animate-spin" size={16} /> : <Package size={16} />}
              {creating ? "Menambahkan..." : "Tambah Paket"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

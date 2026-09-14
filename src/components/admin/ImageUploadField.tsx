import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadImageFn } from "@/rpc/content.server";
import { resolveAssetUrl } from "@/lib/assets";

interface ImageUploadFieldProps {
  label: string;
  value: string; // path relatif tersimpan (mis. "/api/uploads/xxx.jpg") atau "" kalau pakai gambar bawaan
  onChange: (path: string) => void;
  defaultPreview?: string; // gambar bawaan (bundled) untuk preview kalau value kosong
  hint?: string;
}

export function ImageUploadField({ label, value, onChange, defaultPreview, hint }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const previewSrc = resolveAssetUrl(value) ?? defaultPreview ?? null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Gunakan gambar JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadImageFn({ data: formData });
      if (result.success) {
        onChange(result.url);
        toast.success("Gambar berhasil diupload.");
      } else {
        toast.error(result.error ?? "Upload gagal.");
      }
    } catch {
      toast.error("Upload gagal. Periksa koneksi Anda.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40">
          {previewSrc ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageOff className="text-muted-foreground" size={20} />
          )}
        </div>
        <div className="space-y-1">
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="animate-spin" size={15} /> : <Upload size={15} />}
            {uploading ? "Mengupload..." : "Ganti gambar"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" className="ml-2 text-muted-foreground" onClick={() => onChange("")}>
              Pakai gambar bawaan
            </Button>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

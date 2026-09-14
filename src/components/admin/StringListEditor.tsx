import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StringListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

/** Editor sederhana untuk list teks (trust badges, fitur paket, dll) — tambah/hapus/edit inline. */
export function StringListEditor({ label, items, onChange, placeholder, addLabel = "Tambah" }: StringListEditorProps) {
  function updateAt(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }
  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <GripVertical className="shrink-0 text-muted-foreground" size={15} />
            <Input value={item} placeholder={placeholder} onChange={(e) => updateAt(index, e.target.value)} />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeAt(index)} aria-label="Hapus item">
              <Trash2 size={15} className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus size={15} /> {addLabel}
      </Button>
    </div>
  );
}

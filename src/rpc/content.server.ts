import { createServerFn } from "@tanstack/react-start";
import { callApi, purgeContentCache } from "@/lib/api-server";
import { requireAdminToken } from "@/rpc/auth.server";
import { FALLBACK_CONTENT } from "@/lib/content-fallback";
import type {
  SiteContent,
  PackageItem,
  TestimonialItem,
  HeroContent,
  KeunggulanContent,
  CakupanContent,
  CtaContent,
  FooterContent,
  GlobalContent,
} from "@/lib/content-types";

type SectionKey = "hero" | "keunggulan" | "cakupan" | "cta" | "footer" | "global";
type SectionContentMap = {
  hero: HeroContent;
  keunggulan: KeunggulanContent;
  cakupan: CakupanContent;
  cta: CtaContent;
  footer: FooterContent;
  global: GlobalContent;
};

/**
 * Dipanggil dari loader "/" — publik, tanpa auth.
 * Kalau API down/timeout, fallback ke FALLBACK_CONTENT supaya halaman tidak
 * pernah blank (lihat B1).
 */
export const getSiteContentFn = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const result = await callApi<SiteContent>("/content.php");
  if (!result.success || !result.data) {
    return FALLBACK_CONTENT;
  }
  // Isi kekosongan per-section dengan fallback, kalau-kalau ada section yang
  // belum pernah disimpan sama sekali di database.
  return {
    hero: result.data.hero ?? FALLBACK_CONTENT.hero,
    keunggulan: result.data.keunggulan ?? FALLBACK_CONTENT.keunggulan,
    cakupan: result.data.cakupan ?? FALLBACK_CONTENT.cakupan,
    cta: result.data.cta ?? FALLBACK_CONTENT.cta,
    footer: result.data.footer ?? FALLBACK_CONTENT.footer,
    global: result.data.global ?? FALLBACK_CONTENT.global,
    packages: result.data.packages?.length ? result.data.packages : FALLBACK_CONTENT.packages,
    testimonials: result.data.testimonials?.length ? result.data.testimonials : FALLBACK_CONTENT.testimonials,
  };
});

/** Dipakai admin dashboard/preview — SELALU fetch langsung, tanpa cache Vercel,
 * supaya admin selalu melihat data ter-update meski CDN publik masih cache lama. */
export const getAdminContentFn = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  requireAdminToken();
  const result = await callApi<SiteContent>("/content.php");
  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Gagal memuat konten dari API.");
  }
  return result.data;
});

interface UpdateSectionInput<K extends SectionKey> {
  sectionKey: K;
  content: SectionContentMap[K];
}

export const updateSectionFn = createServerFn({ method: "POST" })
  .validator((data: UpdateSectionInput<SectionKey>) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const result = await callApi("/content-update.php", {
      method: "POST",
      token,
      json: { section_key: data.sectionKey, content: data.content },
    });
    if (result.success) {
      await purgeContentCache();
      return { success: true as const };
    }
    return { success: false as const, error: result.error ?? "Gagal menyimpan." };
  });

// ------------------------------------------------------------
// Paket
// ------------------------------------------------------------

type PackageInput = Omit<PackageItem, "id">;

export const createPackageFn = createServerFn({ method: "POST" })
  .validator((data: PackageInput) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const result = await callApi<PackageItem>("/packages.php", { method: "POST", token, json: data });
    if (result.success) await purgeContentCache();
    return result.success
      ? { success: true as const, data: result.data! }
      : { success: false as const, error: result.error ?? "Gagal menambah paket." };
  });

export const updatePackageFn = createServerFn({ method: "POST" })
  .validator((data: { id: number } & PackageInput) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const { id, ...rest } = data;
    const result = await callApi<PackageItem>("/packages.php", {
      method: "PUT",
      token,
      json: rest,
      query: { id },
    });
    if (result.success) await purgeContentCache();
    return result.success
      ? { success: true as const, data: result.data! }
      : { success: false as const, error: result.error ?? "Gagal memperbarui paket." };
  });

export const deletePackageFn = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const result = await callApi("/packages.php", { method: "DELETE", token, query: { id: data.id } });
    if (result.success) await purgeContentCache();
    return result.success
      ? { success: true as const }
      : { success: false as const, error: result.error ?? "Gagal menghapus paket." };
  });

/** Simpan ulang urutan sekaligus (dipanggil setelah drag-reorder di admin). */
export const reorderPackagesFn = createServerFn({ method: "POST" })
  .validator((data: { items: PackageItem[] }) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    for (const item of data.items) {
      const { id, ...rest } = item;
      // eslint-disable-next-line no-await-in-loop
      await callApi("/packages.php", { method: "PUT", token, json: rest, query: { id } });
    }
    await purgeContentCache();
    return { success: true as const };
  });

// ------------------------------------------------------------
// Testimoni
// ------------------------------------------------------------

type TestimonialInput = Omit<TestimonialItem, "id">;

export const createTestimonialFn = createServerFn({ method: "POST" })
  .validator((data: TestimonialInput) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const result = await callApi<TestimonialItem>("/testimonials.php", { method: "POST", token, json: data });
    if (result.success) await purgeContentCache();
    return result.success
      ? { success: true as const, data: result.data! }
      : { success: false as const, error: result.error ?? "Gagal menambah testimoni." };
  });

export const updateTestimonialFn = createServerFn({ method: "POST" })
  .validator((data: { id: number } & TestimonialInput) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const { id, ...rest } = data;
    const result = await callApi<TestimonialItem>("/testimonials.php", {
      method: "PUT",
      token,
      json: rest,
      query: { id },
    });
    if (result.success) await purgeContentCache();
    return result.success
      ? { success: true as const, data: result.data! }
      : { success: false as const, error: result.error ?? "Gagal memperbarui testimoni." };
  });

export const deleteTestimonialFn = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const result = await callApi("/testimonials.php", { method: "DELETE", token, query: { id: data.id } });
    if (result.success) await purgeContentCache();
    return result.success
      ? { success: true as const }
      : { success: false as const, error: result.error ?? "Gagal menghapus testimoni." };
  });

export const reorderTestimonialsFn = createServerFn({ method: "POST" })
  .validator((data: { items: TestimonialItem[] }) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    for (const item of data.items) {
      const { id, ...rest } = item;
      // eslint-disable-next-line no-await-in-loop
      await callApi("/testimonials.php", { method: "PUT", token, json: rest, query: { id } });
    }
    await purgeContentCache();
    return { success: true as const };
  });

// ------------------------------------------------------------
// Upload gambar
// ------------------------------------------------------------

export const uploadImageFn = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    const token = requireAdminToken();
    const file = data.get("file");
    if (!(file instanceof File)) {
      return { success: false as const, error: "File tidak ditemukan." };
    }
    const forwardForm = new FormData();
    forwardForm.set("file", file, file.name);
    const result = await callApi<{ url: string; filename: string }>("/upload.php", {
      method: "POST",
      token,
      formData: forwardForm,
    });
    return result.success
      ? { success: true as const, url: result.data!.url }
      : { success: false as const, error: result.error ?? "Upload gagal." };
  });

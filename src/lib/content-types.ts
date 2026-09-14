/**
 * Tipe data konten landing page JIPOSNET.
 * Struktur ini harus selaras dengan JSON yang dikembalikan /api/content.php
 * di backend PHP (lihat PART A — migrations/001_init.sql untuk bentuk aslinya).
 */

export interface HeroContent {
  badge: string;
  headline_pre: string;
  headline_highlight: string;
  subheadline: string;
  cta_primary_label: string;
  cta_primary_message: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  background_image: string;
  trust_badges: string[];
}

export interface KeunggulanCard {
  icon: string;
  title: string;
  text: string;
}

export interface KeunggulanContent {
  kicker: string;
  title: string;
  description: string;
  highlight_title: string;
  highlight_text: string;
  cards: KeunggulanCard[];
}

export interface CakupanMetric {
  value: string;
  label: string;
}

export interface CakupanContent {
  kicker: string;
  title: string;
  description: string;
  metrics: CakupanMetric[];
  image: string;
  note: string;
  cta_label: string;
  cta_message: string;
}

export interface CtaContent {
  headline: string;
  description: string;
  button_label: string;
  button_message: string;
}

export interface FooterContent {
  description: string;
  address: string;
  email: string;
  whatsapp_display: string;
  service_hours: string;
  copyright: string;
  tagline: string;
}

export interface GlobalContent {
  whatsapp_number: string;
  logo: string;
  seo_title: string;
  seo_description: string;
}

export interface PackageItem {
  id: number;
  name: string;
  speed: string;
  price: string;
  icon: string;
  featured: boolean;
  features: string[];
  sort_order: number;
}

export interface TestimonialItem {
  id: number;
  name: string;
  area: string;
  text: string;
  sort_order: number;
}

export interface SiteContent {
  hero: HeroContent;
  keunggulan: KeunggulanContent;
  cakupan: CakupanContent;
  cta: CtaContent;
  footer: FooterContent;
  global: GlobalContent;
  packages: PackageItem[];
  testimonials: TestimonialItem[];
}

/** Nama-nama icon lucide-react yang boleh dipilih di admin (dropdown). */
export const AVAILABLE_ICONS = [
  "Wifi",
  "Router",
  "Network",
  "Zap",
  "Headphones",
  "ShieldCheck",
  "RadioTower",
  "Sparkles",
  "BadgeCheck",
  "Signal",
  "Globe",
  "Server",
] as const;

export type IconName = (typeof AVAILABLE_ICONS)[number];

/**
 * Tag cache Vercel CDN untuk landing page. Konstanta murni (aman diimpor dari
 * kode client) — logika purge-nya sendiri ada di lib/api-server.ts (server-only).
 */
export const CONTENT_CACHE_TAG = "jiposnet-content";

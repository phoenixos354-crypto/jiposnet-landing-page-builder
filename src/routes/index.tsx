import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  Quote,
  RadioTower,
  Router,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/use-reveal";
import heroImage from "@/assets/jiposnet-hero.jpg";
import coverageImage from "@/assets/jiposnet-coverage.jpg";
import logoImage from "@/assets/jiposnet-logo.png";

const WA_NUMBER = "6281279349994";
const waLink = (message: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

const strengths = [
  { icon: Zap, title: "Harga Bersahabat", text: "Pilihan paket dirancang agar koneksi berkualitas tetap terjangkau untuk rumah dan usaha lokal." },
  { icon: Headphones, title: "Tim Lokal Siap Membantu", text: "Dukungan lebih dekat dan tanggap karena kami memahami kebutuhan warga Rawajitu." },
  { icon: ShieldCheck, title: "Jaringan Lebih Stabil", text: "Koneksi dipantau untuk menjaga aktivitas belajar, bekerja, hiburan, dan usaha tetap lancar." },
];

const packages = [
  { name: "JIPOS Hemat", speed: "10 Mbps", price: "Rp150.000", icon: Wifi, features: ["Internet unlimited", "Cocok untuk 2–4 perangkat", "Instalasi dibantu teknisi lokal"] },
  { name: "JIPOS Keluarga", speed: "20 Mbps", price: "Rp225.000", icon: Router, featured: true, features: ["Internet unlimited", "Cocok untuk 5–8 perangkat", "Streaming dan belajar lebih nyaman"] },
  { name: "JIPOS Usaha", speed: "30 Mbps", price: "Rp325.000", icon: Network, features: ["Internet unlimited", "Prioritas dukungan pelanggan", "Cocok untuk usaha dan kantor kecil"] },
];

const testimonials = [
  { name: "Andi P.", area: "Rawajitu Selatan", text: "Koneksi lebih stabil untuk kebutuhan keluarga, dan saat ada kendala timnya cepat merespons." },
  { name: "Siti R.", area: "Hargorejo", text: "Sekarang belajar daring dan menonton bersama keluarga terasa jauh lebih nyaman." },
  { name: "Budi S.", area: "Tulang Bawang", text: "Komunikasinya jelas dan proses pemasangan dibantu sampai koneksi siap digunakan." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JIPOSNET | Internet Cepat Rawajitu" },
      { name: "description", content: "Internet cepat, stabil, dan terjangkau untuk Rawajitu Selatan, Tulang Bawang, dan sekitarnya." },
      { property: "og:title", content: "JIPOSNET | Internet Cepat Rawajitu" },
      { property: "og:description", content: "Internet lokal dengan jaringan stabil dan dukungan cepat tanggap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function WhatsAppButton({ label, message, variant = "hero", className = "" }: { label: string; message: string; variant?: "hero" | "soft" | "default"; className?: string }) {
  return (
    <Button asChild variant={variant} size="xl" className={className}>
      <a href={waLink(message)} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" /> {label} <ChevronRight aria-hidden="true" />
      </a>
    </Button>
  );
}

function SectionTitle({ kicker, title, copy, center = false }: { kicker: string; title: string; copy?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div className={`mb-3 flex items-center gap-2 text-xs font-extrabold uppercase text-primary ${center ? "justify-center" : ""}`}>
        <span className="h-0.5 w-7 bg-destructive" /> {kicker}
      </div>
      <h2 className="text-3xl font-extrabold leading-tight text-brand-deep md:text-4xl">{title}</h2>
      {copy && <p className="mt-4 leading-7 text-muted-foreground">{copy}</p>}
    </div>
  );
}

function Feature({ icon: Icon, title, text, delay = 0 }: { icon: LucideIcon; title: string; text: string; delay?: number }) {
  const { ref, isVisible } = useReveal<HTMLElement>();
  return (
    <article
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${isVisible ? "reveal-in" : ""} border-b border-border py-6 last:border-0 md:border-b-0 md:border-r md:px-7 md:last:border-r-0`}
    >
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl brand-gradient text-primary-foreground soft-shadow"><Icon size={23} /></div>
      <h3 className="text-lg font-extrabold text-brand-deep">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [["Keunggulan", "#keunggulan"], ["Paket", "#paket"], ["Cakupan", "#cakupan"], ["Testimoni", "#testimoni"]];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="animate-header-in fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="section-shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:flex md:justify-between">
          <a href="#beranda" aria-label="JIPOSNET beranda" className="flex min-w-0 items-center gap-3">
            <img src={logoImage} alt="Logo JIPOSNET" className="h-12 w-auto max-w-35 object-contain" width="640" height="552" />
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
            {nav.map(([label, href]) => <a key={href} href={href} className="text-sm font-bold text-brand-deep transition-colors hover:text-primary">{label}</a>)}
          </nav>
          <div className="hidden md:block"><WhatsAppButton label="Hubungi Kami" message="Halo JIPOSNET, saya ingin bertanya tentang layanan internet." /></div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 md:hidden" aria-label="Navigasi ponsel">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-border py-3 font-bold text-brand-deep">{label}</a>)}<WhatsAppButton label="Chat WhatsApp" message="Halo JIPOSNET, saya ingin bertanya tentang layanan internet." className="mt-4 w-full" /></nav>}
      </header>

      <section id="beranda" className="relative min-h-[760px] overflow-hidden pt-18 md:min-h-[720px]">
        <img src={heroImage} alt="Jaringan internet menjangkau kawasan Rawajitu" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" width={1536} height={1024} fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/5" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="section-shell relative flex min-h-[650px] items-start pt-20 md:items-center md:pt-0">
          <div className="max-w-2xl">
            <Reveal delay={0} className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/85 px-4 py-2 text-xs font-extrabold text-primary shadow-sm backdrop-blur"><Wifi size={16} /> Internet Lokal untuk Semua</Reveal>
            <Reveal as="h1" delay={120} className="text-4xl font-extrabold leading-[1.12] text-brand-deep sm:text-5xl md:text-6xl">Internet cepat &amp; stabil untuk <span className="text-destructive">Rawajitu dan Tulang Bawang</span></Reveal>
            <Reveal as="p" delay={240} className="mt-5 max-w-xl text-base font-medium leading-7 text-foreground/75 md:text-lg">JIPOSNET menghadirkan koneksi yang terjangkau dan dukungan lokal cepat tanggap untuk rumah, belajar, dan usaha Anda.</Reveal>
            <Reveal delay={360} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton label="Cek Pemasangan" message="Halo JIPOSNET, saya ingin mengecek ketersediaan pemasangan internet di lokasi saya." />
              <Button asChild variant="soft" size="xl"><a href="#paket">Lihat Paket <ArrowRight /></a></Button>
            </Reveal>
            <Reveal delay={480} className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-brand-deep"><span className="flex items-center gap-2"><BadgeCheck className="text-primary" /> Tim lokal</span><span className="flex items-center gap-2"><BadgeCheck className="text-primary" /> Respon cepat</span><span className="flex items-center gap-2"><BadgeCheck className="text-primary" /> Tanpa formulir rumit</span></Reveal>
          </div>
        </div>
      </section>

      <section id="keunggulan" className="py-18 md:py-24">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <Reveal variant="left"><SectionTitle kicker="Kenapa JIPOSNET" title="Koneksi dekat, layanan pun lebih sigap" copy="Kami hadir karena internet yang andal seharusnya tidak hanya mudah ditemukan di kota besar. JIPOSNET mendekatkan jaringan dan bantuan teknis kepada masyarakat Rawajitu dan sekitarnya." /></Reveal>
            <Reveal variant="right" delay={120} className="rounded-2xl border border-border bg-surface-blue p-6 md:p-8"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><RadioTower /></div><div><h3 className="font-extrabold text-brand-deep">Dari warga lokal, untuk koneksi lokal</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Kami memahami kondisi wilayah dan pentingnya komunikasi yang mudah saat Anda membutuhkan bantuan.</p></div></div></Reveal>
          </div>
          <div className="mt-10 grid rounded-2xl border border-border bg-card px-6 soft-shadow md:grid-cols-3 md:px-2">{strengths.map((item, i) => <Feature key={item.title} {...item} delay={i * 120} />)}</div>
        </div>
      </section>

      <section id="cakupan" className="overflow-hidden bg-surface-blue py-18 md:py-24">
        <div className="section-shell grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <Reveal variant="left">
            <SectionTitle kicker="Area Cakupan" title="Terhubung dari Rawajitu, menjangkau sekitar" copy="Fokus layanan awal kami mencakup Rawajitu Selatan dan wilayah sekitar di Kabupaten Tulang Bawang. Hubungi tim kami untuk pengecekan titik pemasangan." />
            <div className="mt-8 grid grid-cols-3 divide-x divide-border">
              {[{ value: "Rawajitu", label: "Fokus area" }, { value: "Lokal", label: "Tim dukungan" }, { value: "Tumbuh", label: "Jangkauan" }].map((metric) => <div key={metric.label} className="px-3 first:pl-0"><strong className="block text-xl font-extrabold text-brand-deep md:text-2xl">{metric.value}</strong><span className="mt-1 block text-xs font-semibold text-muted-foreground">{metric.label}</span></div>)}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-background px-3 py-2 text-xs font-bold text-muted-foreground"><Sparkles size={14} className="text-destructive" /> Detail titik cakupan masih berupa data sementara</div>
            <div className="mt-7"><WhatsAppButton label="Cek Area Saya" message="Halo JIPOSNET, mohon cek apakah alamat saya sudah terjangkau layanan internet." /></div>
          </Reveal>
          <Reveal variant="right" delay={150} className="overflow-hidden rounded-2xl border border-border bg-card soft-shadow"><img src={coverageImage} alt="Ilustrasi area cakupan jaringan JIPOSNET" className="aspect-[3/2] h-full w-full object-cover" loading="lazy" width={1200} height={800} /></Reveal>
        </div>
      </section>

      <section id="paket" className="py-18 md:py-24">
        <div className="section-shell">
          <Reveal><SectionTitle kicker="Paket Internet" title="Pilih koneksi sesuai kebutuhan" copy="Pilihan sederhana untuk rumah, keluarga, dan usaha. Konfirmasi harga, kecepatan, serta biaya pemasangan terbaru melalui WhatsApp." center /></Reveal>
           <Reveal delay={120} className="mt-4 flex justify-center"><span className="rounded-full bg-destructive/10 px-4 py-2 text-xs font-extrabold text-destructive">Harga &amp; kecepatan sesuai paket</span></Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {packages.map((item, i) => {
              const Icon = item.icon;
              return <Reveal as="article" key={item.name} variant="scale" delay={i * 140} className={`relative overflow-hidden rounded-2xl border bg-card p-6 soft-shadow ${item.featured ? "border-primary ring-2 ring-primary/15" : "border-border"}`}>
                {item.featured && <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground">Paling diminati</div>}
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary"><Icon /></div>
                <h3 className="mt-5 text-xl font-extrabold text-brand-deep">{item.name}</h3>
                <div className="mt-5 flex items-end gap-2"><strong className="text-4xl font-extrabold text-primary">{item.speed}</strong><span className="pb-1 text-xs font-bold text-muted-foreground">hingga</span></div>
                <div className="mt-3 text-lg font-extrabold text-brand-deep">{item.price}<span className="text-sm font-medium text-muted-foreground"> /bulan</span></div>
                <ul className="my-6 space-y-3">{item.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-muted-foreground"><Check className="mt-0.5 text-primary" size={17} /> {feature}</li>)}</ul>
                <WhatsAppButton label="Tanya Paket" message={`Halo JIPOSNET, saya tertarik dengan ${item.name}. Mohon info paket terbaru.`} variant={item.featured ? "hero" : "soft"} className="w-full" />
              </Reveal>;
            })}
          </div>
        </div>
      </section>

      <section id="testimoni" className="bg-surface-blue py-18 md:py-24">
        <div className="section-shell">
           <Reveal><SectionTitle kicker="Cerita Pelanggan" title="Terhubung lebih nyaman bersama JIPOSNET" copy="Koneksi yang stabil dan dukungan cepat. Banyak warga Rawajitu yang sudah merasakan manfaatnya." center /></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{testimonials.map((item, i) => <Reveal as="article" key={item.name} delay={i * 130} className="rounded-xl border border-border bg-card p-6 soft-shadow">                 <div className="flex items-center justify-between"><Quote className="text-primary" /></div><p className="mt-5 text-sm leading-7 text-foreground/80">“{item.text}”</p><div className="mt-6 border-t border-border pt-4"><strong className="block text-sm text-brand-deep">{item.name}</strong><span className="text-xs text-muted-foreground">{item.area}</span></div></Reveal>)}</div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <Reveal variant="scale" className="section-shell overflow-hidden rounded-2xl brand-gradient p-7 text-primary-foreground soft-shadow md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div><div className="mb-3 flex items-center gap-2 text-sm font-extrabold"><Wifi /> Saatnya terhubung lebih baik</div><h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">Siap pasang internet JIPOSNET di tempat Anda?</h2><p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80">Ceritakan lokasi dan kebutuhan Anda. Tim kami akan membantu mengecek ketersediaan jaringan.</p></div>
            <WhatsAppButton label="Chat Sekarang" message="Halo JIPOSNET, saya ingin berlangganan internet. Mohon bantu cek lokasi saya." />
          </div>
        </Reveal>
      </section>

      <footer className="bg-footer py-12 text-primary-foreground">
        <div className="section-shell grid gap-10 md:grid-cols-[1.2fr_.8fr_1fr]">
          <div><div className="inline-flex rounded-lg bg-background p-2"><img src={logoImage} alt="JIPOSNET" className="h-14 w-auto" width="640" height="552" loading="lazy" /></div><p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">Jitu Pos Internet — koneksi lokal yang cepat, stabil, dan dekat dengan kebutuhan masyarakat.</p></div>
          <div><h3 className="font-extrabold">Navigasi</h3><div className="mt-4 grid gap-3 text-sm text-primary-foreground/70">{nav.map(([label, href]) => <a key={href} href={href} className="hover:text-primary-foreground">{label}</a>)}</div></div>
          <address className="not-italic"><h3 className="font-extrabold">Hubungi JIPOSNET</h3><div className="mt-4 space-y-3 text-sm text-primary-foreground/70"><p className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0" size={17} /> Jl. Poros Rawajitu Selatan, RT/RW 003/001, Kel. Hargorejo, Kec. Rawajitu Selatan, Kab. Tulang Bawang, Lampung 34411</p><a href="mailto:widayat.dhafindzakiandra@gmail.com" className="flex items-start gap-3 break-all hover:text-primary-foreground"><Mail className="mt-0.5 shrink-0" size={17} /> widayat.dhafindzakiandra@gmail.com</a><a href={waLink("Halo JIPOSNET, saya ingin bertanya.")} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary-foreground"><MessageCircle size={17} /> 0812-7934-9994</a><p className="flex items-center gap-3"><Clock3 size={17} /> Dukungan melalui WhatsApp</p></div></address>
        </div>
        <div className="section-shell mt-10 flex flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:justify-between"><span>© 2026 JIPOSNET. Hak cipta dilindungi.</span><span>jipos.net · Jitu Pos Internet</span></div>
      </footer>

      <Button asChild variant="hero" size="icon" className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full shadow-xl md:hidden"><a href={waLink("Halo JIPOSNET, saya ingin bertanya tentang internet.")} target="_blank" rel="noreferrer" aria-label="Chat JIPOSNET melalui WhatsApp"><MessageCircle className="size-6" /></a></Button>
    </main>
  );
}

import type { SiteContent } from "./content-types";

/**
 * Konten default/fallback — persis sama dengan yang dulu hardcode di index.tsx.
 * Dipakai kalau content.php gagal diakses (down/timeout), supaya landing page
 * TIDAK PERNAH tampil blank/error ke pengunjung.
 */
export const FALLBACK_CONTENT: SiteContent = {
  hero: {
    badge: "Internet Lokal untuk Semua",
    headline_pre: "Internet cepat & stabil untuk ",
    headline_highlight: "Rawajitu dan Tulang Bawang",
    subheadline:
      "JIPOSNET menghadirkan koneksi yang terjangkau dan dukungan lokal cepat tanggap untuk rumah, belajar, dan usaha Anda.",
    cta_primary_label: "Cek Pemasangan",
    cta_primary_message:
      "Halo JIPOSNET, saya ingin mengecek ketersediaan pemasangan internet di lokasi saya.",
    cta_secondary_label: "Lihat Paket",
    cta_secondary_href: "#paket",
    background_image: "",
    trust_badges: ["Tim lokal", "Respon cepat", "Tanpa formulir rumit"],
  },
  keunggulan: {
    kicker: "Kenapa JIPOSNET",
    title: "Koneksi dekat, layanan pun lebih sigap",
    description:
      "Kami hadir karena internet yang andal seharusnya tidak hanya mudah ditemukan di kota besar. JIPOSNET mendekatkan jaringan dan bantuan teknis kepada masyarakat Rawajitu dan sekitarnya.",
    highlight_title: "Dari warga lokal, untuk koneksi lokal",
    highlight_text:
      "Kami memahami kondisi wilayah dan pentingnya komunikasi yang mudah saat Anda membutuhkan bantuan.",
    cards: [
      {
        icon: "Zap",
        title: "Harga Bersahabat",
        text: "Pilihan paket dirancang agar koneksi berkualitas tetap terjangkau untuk rumah dan usaha lokal.",
      },
      {
        icon: "Headphones",
        title: "Tim Lokal Siap Membantu",
        text: "Dukungan lebih dekat dan tanggap karena kami memahami kebutuhan warga Rawajitu.",
      },
      {
        icon: "ShieldCheck",
        title: "Jaringan Lebih Stabil",
        text: "Koneksi dipantau untuk menjaga aktivitas belajar, bekerja, hiburan, dan usaha tetap lancar.",
      },
    ],
  },
  cakupan: {
    kicker: "Area Cakupan",
    title: "Terhubung dari Rawajitu, menjangkau sekitar",
    description:
      "Fokus layanan awal kami mencakup Rawajitu Selatan dan wilayah sekitar di Kabupaten Tulang Bawang. Hubungi tim kami untuk pengecekan titik pemasangan.",
    metrics: [
      { value: "Rawajitu", label: "Fokus area" },
      { value: "Lokal", label: "Tim dukungan" },
      { value: "Tumbuh", label: "Jangkauan" },
    ],
    image: "",
    note: "Detail titik cakupan masih berupa data sementara",
    cta_label: "Cek Area Saya",
    cta_message:
      "Halo JIPOSNET, mohon cek apakah alamat saya sudah terjangkau layanan internet.",
  },
  cta: {
    headline: "Siap pasang internet JIPOSNET di tempat Anda?",
    description:
      "Ceritakan lokasi dan kebutuhan Anda. Tim kami akan membantu mengecek ketersediaan jaringan.",
    button_label: "Chat Sekarang",
    button_message:
      "Halo JIPOSNET, saya ingin berlangganan internet. Mohon bantu cek lokasi saya.",
  },
  footer: {
    description:
      "Jitu Pos Internet — koneksi lokal yang cepat, stabil, dan dekat dengan kebutuhan masyarakat.",
    address:
      "Jl. Poros Rawajitu Selatan, RT/RW 003/001, Kel. Hargorejo, Kec. Rawajitu Selatan, Kab. Tulang Bawang, Lampung 34411",
    email: "widayat.dhafindzakiandra@gmail.com",
    whatsapp_display: "0812-7934-9994",
    service_hours: "Dukungan melalui WhatsApp",
    copyright: "© 2026 JIPOSNET. Hak cipta dilindungi.",
    tagline: "jipos.net · Jitu Pos Internet",
  },
  global: {
    whatsapp_number: "6281279349994",
    logo: "",
    seo_title: "JIPOSNET | Internet Cepat Rawajitu",
    seo_description:
      "Internet cepat, stabil, dan terjangkau untuk Rawajitu Selatan, Tulang Bawang, dan sekitarnya.",
  },
  packages: [
    {
      id: 1,
      name: "JIPOS Hemat",
      speed: "10 Mbps",
      price: "Rp150.000",
      icon: "Wifi",
      featured: false,
      features: [
        "Internet unlimited",
        "Cocok untuk 2–4 perangkat",
        "Instalasi dibantu teknisi lokal",
      ],
      sort_order: 1,
    },
    {
      id: 2,
      name: "JIPOS Keluarga",
      speed: "20 Mbps",
      price: "Rp225.000",
      icon: "Router",
      featured: true,
      features: [
        "Internet unlimited",
        "Cocok untuk 5–8 perangkat",
        "Streaming dan belajar lebih nyaman",
      ],
      sort_order: 2,
    },
    {
      id: 3,
      name: "JIPOS Usaha",
      speed: "30 Mbps",
      price: "Rp325.000",
      icon: "Network",
      featured: false,
      features: [
        "Internet unlimited",
        "Prioritas dukungan pelanggan",
        "Cocok untuk usaha dan kantor kecil",
      ],
      sort_order: 3,
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "Andi P.",
      area: "Rawajitu Selatan",
      text: "Koneksi lebih stabil untuk kebutuhan keluarga, dan saat ada kendala timnya cepat merespons.",
      sort_order: 1,
    },
    {
      id: 2,
      name: "Siti R.",
      area: "Hargorejo",
      text: "Sekarang belajar daring dan menonton bersama keluarga terasa jauh lebih nyaman.",
      sort_order: 2,
    },
    {
      id: 3,
      name: "Budi S.",
      area: "Tulang Bawang",
      text: "Komunikasinya jelas dan proses pemasangan dibantu sampai koneksi siap digunakan.",
      sort_order: 3,
    },
  ],
};

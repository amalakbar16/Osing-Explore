# Osing Explore — Frontend Implementation Plan

**Tipe dokumen:** Blueprint arsitektur & desain sebelum implementasi kode
**Disiapkan untuk:** Prototipe PWA Smart City — Kabupaten Banyuwangi
**Tanggal:** 4 Agustus 2026 · v1.0

---

## 0. Cara Membaca Dokumen Ini

Ini adalah **rencana**, bukan kode. Tujuannya: mengunci keputusan arsitektur, desain, dan struktur data terlebih dahulu, supaya saat masuk fase coding kita tinggal eksekusi tanpa bongkar-pasang ulang. Setiap keputusan di bawah saya tandai alasannya, karena tim developer di fase lanjutan harus bisa membaca *kenapa*, bukan cuma *apa*.

Struktur dokumen:

1. Prinsip & Sistem Desain (warna, tipografi, elemen signature)
2. Arsitektur Folder
3. Tech Stack & Dependency
4. Arsitektur Data (mock) & Service Layer
5. State Management
6. Routing Map (React Router v7)
7. Peta Komponen per Halaman
8. Alur Pengguna Utama
9. Rencana PWA (manifest + service worker)
10. Aksesibilitas & Performa
11. Kesiapan Skalabilitas (koneksi ke backend riil nanti)
12. Roadmap Implementasi Bertahap
13. Keputusan Terbuka

---

## 1. Prinsip & Sistem Desain

### 1.1 Kenapa bukan "template travel-app"

Mayoritas travel-app generik jatuh ke satu dari dua pola: (a) biru-putih korporat dengan ikon pin generik, atau (b) tema "AI-generated" yang sekarang juga sudah jadi klise sendiri — krem hangat + aksen terracotta serif tebal, atau latar nyaris-hitam dengan satu aksen neon tunggal. Osing Explore harus terasa seperti diracik khusus untuk Banyuwangi, bukan *skin* dari template pariwisata mana pun. Maka setiap token warna & tipografi di bawah saya jangkarkan ke objek budaya/alam Banyuwangi yang konkret, bukan pilihan abstrak.

### 1.2 Palet Warna

Sumber inspirasi: api biru Kawah Ijen (fenomena langka yang hanya ada di 2 tempat di dunia), kain batik khas Osing motif **Gajah Oling**, kostum tari **Gandrung**, dan lanskap kopi/sawah dataran tinggi Ijen.

| Token | Hex | Nama | Peran | Sumber Inspirasi |
|---|---|---|---|---|
| `--color-base` | `#1A1613` | Arang Osing | Latar utama (dark) | Tanah vulkanik & malam batik (lilin/malam batik berwarna gelap kecoklatan, bukan hitam pekat generik) |
| `--color-surface` | `#241F19` | Lempung Kawah | Permukaan card/section | Bebatuan belerang Ijen yang teroksidasi |
| `--color-surface-alt` | `#2E2820` | Sogan | Permukaan sekunder, border halus | Warna coklat soga pada batik tradisional Using |
| `--color-accent-primary` | `#3FA8A0` | Api Biru | Aksen signature — interaktif, highlight rute, ikon aktif | Blue fire Kawah Ijen (dipakai presisi, bukan disebar rata) |
| `--color-accent-gold` | `#C9A24B` | Emas Gandrung | Aksen premium — badge "Kisah Destinasi", rating, garis dekoratif | Sulaman emas kostum omprok penari Gandrung |
| `--color-accent-rose` | `#A6453A` | Merah Keris | Aksen langka — tag budaya/urgent, gradient radial di card cerita | Selendang & aksen merah kostum Gandrung |
| `--color-ink` | `#F3ECDD` | Kapas Osing | Teks utama di atas latar gelap | Kain katun mentah, bukan putih murni (`#FFFFFF` terasa klinis) |
| `--color-ink-muted` | `#B8AD98` | Kapas Pudar | Teks sekunder/caption | — |

**Aturan pemakaian:**
- `Api Biru` dan `Emas Gandrung` **tidak pernah dipakai bersamaan sebagai warna dominan** di komponen yang sama — salah satu jadi aksen utama, yang lain jadi highlight kecil (garis tipis, ikon, angka rating). Ini menjaga hierarki visual tetap tenang.
- `Merah Keris` dibatasi maksimal 1 elemen per layar (biasanya ribbon/badge di card "Kisah Destinasi") — dipakai sebagai kejutan visual, bukan warna berulang.
- Tidak ada biru langit/putih polos ala Google Maps di mana pun dalam UI.

### 1.3 Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display / Judul (`font-display`) | **Fraunces** (variable, optical size besar, weight 500–600) | Serif hangat dengan karakter sedikit "terukir" — cocok untuk kesan heritage tanpa jatuh ke serif klasik-korporat (Playfair/Georgia yang sudah terlalu sering dipakai) |
| Body / UI (`font-body`) | **Plus Jakarta Sans** | Sans-serif humanis, dirancang atas komisi Pemprov DKI Jakarta — secara simbolis relevan untuk produk Indonesia, sangat legible di layar kecil |
| Data / Utility (`font-mono`) | **Space Grotesk** (angka only: jarak km, rating, durasi, harga) | Memberi kontras "presisi teknis" terhadap kehangatan Fraunces — cocok untuk elemen seperti "12.4 km" atau "★ 4.8" agar terasa seperti data rute yang dihitung sistem |

Skala tipe (mobile-first, `rem`): `text-xs 0.75` · `text-sm 0.875` · `text-base 1` · `text-lg 1.125` · `text-xl 1.25` · `text-2xl 1.5` · `text-display-sm 1.75` · `text-display-md 2.25` · `text-display-lg 3` (dipakai terbatas: hero Beranda & nama destinasi di halaman detail).

Ikon: **Lucide** (line icons, konsisten stroke-width 1.5–2px) — memenuhi arahan "hindari emoticon default" karena semua status/kategori direpresentasikan ikon vektor, bukan emoji.

### 1.4 Elemen Signature: "Jejak Rute" (Route Trail)

Satu elemen visual yang harus dikenali sebagai identitas Osing Explore: **garis putus-putus melengkung**, terinspirasi dari motif garis pada batik Gajah Oling sekaligus merepresentasikan polyline rute perjalanan. Elemen ini muncul di tiga tempat secara konsisten:

1. Sebagai **connector** antar `DestinationCard` di carousel rekomendasi searah rute (garis emas tipis dengan titik-titik yang punya animasi *dash-offset* pelan, seolah "mengalir" searah rute).
2. Sebagai **latar dekoratif** (blurred, opacity rendah) di belakang hero section Beranda dan section "Kisah Destinasi".
3. Sebagai **progress indicator** di halaman Peta Rute — menunjukkan posisi destinasi utama vs destinasi pendukung di sepanjang rute.

Elemen ini yang membuat produk “diingat”, sehingga di sekitarnya UI harus tenang — tidak semua card butuh glassmorphism atau shadow warna-warni sekaligus; itu diterapkan tepat di card `Kisah Destinasi` saja (lihat 1.5) supaya efeknya tidak menjadi tumpul karena dipakai di semua tempat.

### 1.5 Bahasa Visual per Jenis Komponen

| Jenis Konten | Perlakuan Visual |
|---|---|
| Info teknis (jarak, rating, jam buka, harga) | Card datar `surface`, border 1px `surface-alt`, tipografi `font-mono` untuk angka — terasa seperti *data*, sengaja "membosankan" secara visual |
| **Kisah Destinasi** (narasi budaya) | Card premium: latar radial-gradient tipis dari `surface` ke `accent-rose`/`accent-gold` di sudut, border 1px gradient emas, sedikit glassmorphism (`backdrop-blur` + opacity), colored box-shadow lembut warna Api Biru. Judul pakai Fraunces italic. Ini adalah satu-satunya tempat efek "premium" ditumpuk, sesuai prinsip *spend your boldness in one place* |
| Carousel destinasi searah rute | Auto-scroll marquee horizontal, pause on hover/touch, snap-scroll per card, dihubungkan elemen "Jejak Rute" |
| Badge kategori (alam/religi/budaya/kuliner) | Chip kecil outline, tanpa fill solid, ikon Lucide + label |
| Empty state (misal: kuliner tidak ditemukan di radius) | Ilustrasi garis sederhana (bukan generik "no data" 3D), copy actionable: menjelaskan sistem sedang memperluas radius, bukan sekadar "kosong" |

Motion: dipakai **terarah**, bukan dekoratif acak — (1) *staggered fade-up* saat card destinasi searah rute pertama kali dirender (memberi kesan "rute sedang tersusun"), (2) *bobbing* halus (translateY ±3px, durasi 3–4s ease-in-out infinite) khusus pada pin/marker aktif di representasi rute, (3) `prefers-reduced-motion` dihormati penuh — semua animasi di atas fallback ke fade instan.

---

## 2. Arsitektur Folder

Prinsip: **page-first untuk UI yang spesifik-halaman**, **shared-first untuk yang dipakai ulang**, dan **service layer sebagai satu-satunya pintu ke data** — supaya saat backend Node/Express + PostGIS (sesuai proposal) siap, tidak ada komponen yang perlu disentuh, cukup ganti isi `services/`.

```
osing-explore/
├── public/
│   ├── icons/                    # ikon PWA berbagai ukuran (192, 512, maskable)
│   └── offline.html              # fallback statis saat offline total
├── src/
│   ├── main.jsx                  # entry point, register service worker
│   ├── App.jsx                   # AppShell + Router outlet
│   │
│   ├── routes/
│   │   └── router.jsx            # definisi route React Router v7 (lazy-loaded)
│   │
│   ├── pages/                    # 1 folder = 1 halaman, isi = orkestrasi, bukan detail UI
│   │   ├── beranda/
│   │   │   ├── BerandaPage.jsx
│   │   │   └── components/       # komponen KHUSUS halaman ini saja
│   │   │       ├── HeroPencarianDestinasi.jsx
│   │   │       └── DestinasiPopulerMarquee.jsx
│   │   ├── peta-rute/
│   │   │   ├── PetaRutePage.jsx
│   │   │   └── components/
│   │   │       ├── RouteTrailVisual.jsx      # elemen signature
│   │   │       ├── DestinasiSearahCarousel.jsx
│   │   │       └── RadiusExpandNotice.jsx
│   │   ├── detail-destinasi/
│   │   │   ├── DetailDestinasiPage.jsx
│   │   │   └── components/
│   │   │       └── KisahDestinasiPanel.jsx
│   │   ├── kuliner/
│   │   │   ├── KulinerPage.jsx
│   │   │   └── components/
│   │   ├── penginapan/
│   │   │   ├── PenginapanPage.jsx
│   │   │   └── components/
│   │   └── not-found/
│   │       └── NotFoundPage.jsx
│   │
│   ├── components/                # dipakai lintas halaman
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── BottomNavigation.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── ui/                    # design-system primitives, tanpa business logic
│   │   │   ├── GlassCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Chip.jsx
│   │   │   ├── RatingBadge.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── destinasi/
│   │   │   ├── DestinationCard.jsx
│   │   │   └── KisahDestinasiCard.jsx     # card premium (lihat 1.5)
│   │   └── common/
│   │       ├── LazyImage.jsx
│   │       └── ErrorBoundary.jsx
│   │
│   ├── context/
│   │   └── RouteContext.jsx        # RouteProvider + reducer (state rute aktif — lihat bag. 5)
│   │
│   ├── hooks/
│   │   ├── useRouteRecommendation.js
│   │   ├── useCulinaryByRoute.js
│   │   ├── useLodgingByRoute.js
│   │   ├── useDebouncedValue.js
│   │   └── useOnlineStatus.js
│   │
│   ├── services/                   # ADAPTER LAYER — satu-satunya sumber data untuk hooks/pages
│   │   ├── destinationService.js
│   │   ├── culinaryService.js
│   │   ├── lodgingService.js
│   │   └── routeService.js
│   │
│   ├── data/                       # mock data (lihat bag. 4)
│   │   ├── destinations.json
│   │   ├── culinary.json
│   │   ├── lodging.json
│   │   └── routeCorridors.json
│   │
│   ├── utils/
│   │   ├── geo.js                  # placeholder haversine, dsb. — mudah diganti kalkulasi PostGIS-backed
│   │   ├── formatters.js           # formatDistance, formatRupiah, formatDuration
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── index.css               # @tailwind + CSS custom properties (design tokens dari bag. 1)
│   │   └── fonts.css
│   │
│   ├── assets/
│   │   └── motifs/                 # SVG motif "Jejak Rute", pola batik dekoratif
│   │
│   └── config/
│       └── siteConfig.js           # nama app, deskripsi, placeholder untuk i18n masa depan
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js                  # termasuk konfigurasi vite-plugin-pwa
├── package.json
└── README.md
```

**Kenapa `pages/*/components/` dipisah dari `components/`:** ini mencegah folder `components/` global membengkak jadi "tempat sampah" seiring app tumbuh. Aturan sederhana untuk developer baru: *"Kalau komponen ini hanya dipakai di satu halaman, dia tinggal di situ. Begitu dipakai halaman kedua, baru diangkat ke `src/components/`."*

---

## 3. Tech Stack & Dependency

| Kategori | Pilihan | Alasan |
|---|---|---|
| Build tool | **Vite** | Standar industri saat ini untuk React SPA/PWA; jauh lebih cepat dari CRA (yang sudah deprecated) dan punya integrasi PWA matang |
| Routing | **React Router v7** | Sesuai permintaan; pakai data mode (`createBrowserRouter`) agar siap untuk lazy loading & future loader/action per route |
| Styling | **Tailwind CSS** | Sesuai permintaan; token warna & font di atas dimasukkan ke `tailwind.config.js` sebagai `theme.extend`, bukan warna Tailwind default |
| PWA tooling | **vite-plugin-pwa** (mode `generateSW`, Workbox di baliknya) | Menghasilkan manifest + service worker otomatis dari konfigurasi deklaratif — cocok dengan arahan "service worker sederhana" tanpa menulis Workbox manual |
| Ikon | **lucide-react** | Line icon konsisten, tree-shakeable, memenuhi arahan "hindari emoticon default" |
| Animasi | **CSS transitions/keyframes native + Tailwind** dulu; **Framer Motion** hanya ditambahkan bila animasi orkestrasi (mis. page transition, stagger carousel) terasa janggal dibuat manual | Menjaga bundle size kecil di fase prototipe; tidak menambah dependency yang belum tentu perlu |
| Formatting/Lint | **ESLint (react-hooks, jsx-a11y plugin) + Prettier** | `jsx-a11y` penting karena app ini akan dipakai wisatawan lansia/awam — aksesibilitas bukan opsional |
| Bahasa | **JavaScript (ES2022+) dengan JSDoc** untuk type-hint ringan pada `services/` dan `data/` (bentuk objek Destination, Culinary, dst.) | Menjaga kecepatan development di fase prototipe; struktur JSDoc dirancang supaya migrasi ke TypeScript di fase lanjutan (saat backend riil masuk) tinggal rename `.js` → `.ts` tanpa desain ulang |

Package inti (`package.json` dependencies): `react`, `react-dom`, `react-router`, `lucide-react`. Dev dependencies: `vite`, `@vitejs/plugin-react`, `vite-plugin-pwa`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint` + plugin terkait, `prettier`.

---

## 4. Arsitektur Data (Mock) & Service Layer

### 4.1 Simulasi filter radius tanpa geo-computation riil

Proposal aslinya memakai PostGIS `ST_Distance` untuk memfilter destinasi terhadap polyline rute. Di frontend prototipe (tanpa backend), kita **tidak** mensimulasikan matematika geospasial di client — itu pekerjaan berat yang percuma karena toh akan diganti backend riil. Sebagai gantinya, setiap item mock data punya field `corridorIds: string[]` yang secara manual sudah "mewakili" hasil query radius tersebut. Ini menjaga logika di komponen/hooks **identik bentuknya** dengan yang nanti dipakai saat backend riil aktif — yang berubah hanya isi `services/`, bukan cara pemanggilannya.

### 4.2 Skema Data (JSDoc)

```js
// src/data/destinations.json — bentuk tiap item
/**
 * @typedef {Object} Destination
 * @property {string} id
 * @property {string} name
 * @property {'alam'|'budaya'|'religi'|'buatan'} category
 * @property {string[]} corridorIds        // rute mana saja yang "melewati" titik ini
 * @property {{lat: number, lng: number}} coordinates  // dummy, untuk render peta ilustrasi
 * @property {number} rating                // 0–5
 * @property {number} distanceFromRouteKm   // dummy, hasil "simulasi" ST_Distance
 * @property {boolean} isMainDestination    // true untuk Kawah Ijen, Pulau Merah, dst.
 * @property {string[]} images
 * @property {string} shortDescription
 * @property {{
 *   title: string,
 *   body: string,
 *   era: string,          // mis. "Era Kolonial", "Legenda Rakyat Using"
 *   tags: string[]
 * }} kisahDestinasi
 * @property {string} openingHours
 * @property {'gratis'|'murah'|'sedang'|'mahal'} priceRange
 */
```

```js
/**
 * @typedef {Object} RouteCorridor
 * @property {string} id                    // mis. "jalur-ijen-utara"
 * @property {string} label                 // "Menuju Kawah Ijen"
 * @property {string} mainDestinationId
 * @property {number} totalDistanceKm
 * @property {number} estimatedDurationMin
 * @property {number} radiusKm              // dummy, meniru logika radius dinamis di proposal
 * @property {{lat: number, lng: number}[]} trailPoints // titik-titik untuk render "Jejak Rute" ilustratif
 */
```

`Culinary` dan `Lodging` mengikuti pola serupa: `id`, `name`, `corridorIds`, `rating`, `priceRange`, `distanceFromRouteKm`, `images`, plus field spesifik (`cuisineType` untuk kuliner; `roomType`, `pricePerNight` untuk penginapan).

Contoh isi awal (untuk mengisi ±20–30 destinasi sesuai batasan proposal), memakai nama-nama riil dari dokumen: **Kawah Ijen** (main, corridor `jalur-ijen-utara`), **Air Terjun Jagir**, **Air Terjun Ketegan**, **Wisata Japuro**, **Terakota Gandrung** (searah corridor yang sama), serta **Pulau Merah** dan **Sukamade** sebagai main destination untuk `jalur-selatan`. Ini memastikan mock data dari awal sudah relevan secara konten, bukan data "Lorem Destination 1".

### 4.3 Service Layer (adapter pattern)

```js
// src/services/destinationService.js
export async function getMainDestinations() { /* baca dari data/destinations.json, filter isMainDestination */ }
export async function getDestinationsByCorridor(corridorId) { /* filter corridorIds.includes(corridorId), sort weighted score */ }
export async function getDestinationById(id) { /* ... */ }
```

Semua fungsi ini **async** sejak awal (walau membaca file lokal secara instan), supaya komponen yang memanggilnya lewat hooks tidak perlu diubah sama sekali ketika `services/` nanti diisi `fetch()` ke endpoint Express riil. Ini adalah keputusan arsitektur tunggal yang paling menghemat waktu tim di fase lanjutan.

---

## 5. State Management

**Keputusan: React Context + `useReducer`, bukan Redux/Zustand.** Untuk skala aplikasi ini (satu "rute aktif" yang perlu dibaca lintas 4 halaman), Context sudah cukup dan tidak menambah dependency. Kompleksitas state di app ini rendah — bukan alasan untuk over-engineering di fase prototipe.

- **`RouteContext`** (global, lewat `RouteProvider` yang membungkus `<App />`): menyimpan `activeCorridorId`, `mainDestination`, status loading rekomendasi. Inilah yang membuat halaman Kuliner & Penginapan bisa "tahu" rute yang sedang aktif tanpa prop-drilling.
- **State lokal per komponen** (`useState`): input pencarian, filter kategori, expand/collapse UI — apa pun yang tidak perlu dibaca komponen lain.
- **Data async** (destinasi, kuliner, dsb.): di-fetch lewat custom hooks (`useRouteRecommendation`, dst.) yang menyimpan `data/loading/error` secara lokal per pemanggilan — pola ini sengaja dibuat mirip antarmuka React Query, sehingga kalau app tumbuh dan butuh caching/refetching yang lebih canggih, migrasi ke **TanStack Query** tinggal mengganti isi hook, bukan menulis ulang halaman.

Catatan skalabilitas: bila di fase lanjutan ditambah fitur bookmark/favorit destinasi atau preferensi bahasa (i18n), itu masuk sebagai context/provider terpisah (`FavoritesContext`, `LanguageContext`) — **bukan** ditumpuk ke `RouteContext` yang sudah ada, supaya re-render tetap terisolasi sesuai domainnya.

---

## 6. Routing Map (React Router v7)

| Path | Halaman | Deskripsi |
|---|---|---|
| `/` | `BerandaPage` | Pencarian/pilih destinasi tujuan utama, carousel destinasi populer |
| `/rute/:destinationId` | `PetaRutePage` | Visual "Jejak Rute" + carousel destinasi searah + set `activeCorridorId` ke `RouteContext` |
| `/destinasi/:id` | `DetailDestinasiPage` | Detail + panel Kisah Destinasi |
| `/kuliner` | `KulinerPage` | List kuliner, terfilter otomatis oleh `activeCorridorId` bila ada rute aktif; menampilkan seluruh data + notice bila belum ada rute dipilih |
| `/kuliner/:id` | *(modal/sheet, bukan route baru)* | Detail singkat, dibuka sebagai bottom-sheet di atas `KulinerPage` |
| `/penginapan` | `PenginapanPage` | Sama polanya dengan Kuliner |
| `/penginapan/:id` | *(bottom-sheet)* | — |
| `*` | `NotFoundPage` | — |

Semua page di-*lazy load* lewat `React.lazy` + `Suspense` di `router.jsx`, dengan fallback `Skeleton` bergaya design system (bukan spinner generik), supaya loading state pun terasa "branded".

Bottom navigation hanya menyorot 4 item sesuai arahan (Beranda, Peta Rute, Kuliner, Penginapan) — `Peta Rute` di nav bar mengarah ke `/rute/:activeDestinationId` bila sudah ada rute aktif, atau kembali ke Beranda dengan prompt "Pilih destinasi dulu" bila belum.

---

## 7. Peta Komponen per Halaman

**Beranda** → `HeroPencarianDestinasi` (search + CTA) · `DestinasiPopulerMarquee` (auto-scroll carousel) · `DestinationCard` (varian ringkas)

**Peta Rute** → `RouteTrailVisual` (elemen signature, SVG ilustratif titik asal → destinasi utama) · `DestinasiSearahCarousel` → berisi `DestinationCard` (varian dengan jarak & `KisahDestinasiCard` teaser) · `RadiusExpandNotice` (muncul saat sistem "memperluas radius" sesuai edge case di proposal)

**Detail Destinasi** → `KisahDestinasiPanel` (full narrative, treatment premium) · info teknis (jam, kategori, harga) di card terpisah yang sengaja polos

**Kuliner / Penginapan** → `FilterChipGroup` · list card (varian netral, bukan premium — sesuai arahan bahwa fitur ini "pendukung") · `EmptyState` khusus saat radius kosong

**Global (lintas halaman)** → `BottomNavigation` (indikator aktif pakai underline `accent-primary`, transisi `250ms ease`) · `AppShell` (menangani safe-area-inset untuk PWA di iOS) · `ErrorBoundary` per route

---

## 8. Alur Pengguna Utama

1. **Beranda** — pengguna mencari/memilih destinasi utama (mis. Kawah Ijen) dari search atau carousel populer.
2. Navigasi ke **Peta Rute** → `RouteContext` di-set (`activeCorridorId = "jalur-ijen-utara"`) → `useRouteRecommendation` memanggil `destinationService.getDestinationsByCorridor()` → carousel destinasi searah tampil dengan animasi *staggered fade-up*, dihubungkan elemen Jejak Rute.
3. Pengguna tap salah satu card → **Detail Destinasi** → scroll ke `KisahDestinasiPanel` (di sinilah nilai "media edukasi budaya" dari proposal benar-benar terasa, bukan cuma daftar info teknis).
4. Kapan saja, pengguna pindah ke **Kuliner** atau **Penginapan** lewat bottom nav → karena `activeCorridorId` sudah tersimpan di context, list otomatis terfilter ke koridor yang sama tanpa pengguna mengulang input rute — inilah realisasi "single route computation, multi-purpose query" dari proposal, di sisi frontend.
5. Bila pengguna belum pernah memilih rute dan langsung buka Kuliner/Penginapan → tampil seluruh data + banner ringan mengarahkan untuk memilih destinasi dulu agar rekomendasi lebih relevan (bukan blocking, tetap bisa browse bebas).

---

## 9. Rencana PWA

**`manifest.webmanifest`** (via `vite-plugin-pwa`): `name: "Osing Explore"`, `short_name: "Osing Explore"`, `theme_color: #1A1613`, `background_color: #1A1613`, `display: standalone`, ikon 192/512 + maskable, `orientation: portrait`.

**Strategi caching (Workbox, lewat `generateSW`):**

| Jenis aset | Strategi | Alasan |
|---|---|---|
| App shell (JS/CSS/HTML build) | `precache` | Wajib tersedia offline sejak load pertama |
| Font (Fraunces, Plus Jakarta Sans, Space Grotesk — self-hosted, bukan Google Fonts CDN langsung) | `CacheFirst`, expiry lama | Font jarang berubah, dan self-hosting menghindari request eksternal yang gagal saat offline |
| Gambar destinasi/kuliner/penginapan | `CacheFirst` dengan batas jumlah entri (mis. 60) | Sesuai batasan proposal: "data yang sudah pernah diakses tampil terbatas dalam mode offline" |
| Data mock JSON (nanti: endpoint API riil) | `StaleWhileRevalidate` | Sudah disiapkan sejak sekarang walau untuk mock data efeknya belum terasa — begitu backend aktif, strategi ini langsung relevan tanpa perlu diubah |

Sesuai batasan privasi di proposal (data lokasi tidak disimpan permanen), **tidak ada** data pengguna yang ditulis ke `localStorage`/`IndexedDB` — cache PWA di atas murni cache aset & data publik, bukan riwayat personal.

Install prompt: custom UI kecil (bukan `beforeinstallprompt` browser default yang terasa generik) muncul setelah pengguna berinteraksi (mis. sudah membuka 1 halaman Peta Rute), sesuai praktik terbaik agar tidak mengganggu di kunjungan pertama.

---

## 10. Aksesibilitas & Performa

- Kontras warna: kombinasi `Kapas Osing (#F3ECDD)` di atas `Arang Osing (#1A1613)` sudah AA-compliant (rasio > 12:1); tim tetap harus mengecek kombinasi aksen (`Api Biru`/`Emas Gandrung`) khusus untuk teks kecil.
- Semua interaksi carousel/marquee bisa dinavigasi keyboard (`tabIndex`, `aria-label` per card) — bukan hanya swipe/hover.
- `prefers-reduced-motion` menonaktifkan bobbing & marquee auto-scroll, digantikan state statis.
- Gambar: `LazyImage` dengan `loading="lazy"`, ukuran eksplisit (`width`/`height`) untuk mencegah layout shift, format WebP.
- Code-splitting per route (bag. 6) menjaga initial bundle kecil — penting karena target pengguna termasuk wisatawan dengan koneksi seluler terbatas di area seperti Ijen (sesuai catatan konektivitas di proposal).

---

## 11. Kesiapan Skalabilitas ke Depan

Struktur ini sengaja dirancang supaya penambahan berikut **tidak** memaksa refactor besar:

- **Backend riil (Node/Express + PostGIS):** hanya `services/*.js` yang berubah isi (dari baca JSON lokal → `fetch()`), signature fungsi tetap sama.
- **Multibahasa (ID/EN + auto-translate):** `src/config/siteConfig.js` sudah jadi tempat naungan; nanti tinggal tambah `src/i18n/` + provider baru, sedangkan copy statis di komponen memang sejak awal ditulis sebagai string terpisah (bukan hardcoded di tengah JSX secara acak) supaya mudah diekstrak ke file locale.
- **Self-listing UMKM:** karena `Culinary`/`Lodging` sudah berbentuk objek terstruktur dari `services/`, form input UMKM baru nanti tinggal menulis ke endpoint yang sama, tanpa mengubah cara halaman Kuliner/Penginapan membaca data.
- **Autentikasi pengguna:** belum ada di prototipe (sesuai batasan), tapi `RouteContext` yang sudah dipisah dari komponen UI membuatnya mudah dibungkus `AuthProvider` di lapisan atas nanti tanpa mengganggu logic rute.

---

## 12. Roadmap Implementasi Bertahap

| Fase | Deliverable |
|---|---|
| **Fase 0 — Scaffolding** | Setup Vite + Tailwind + `vite-plugin-pwa`, tanam design tokens (bag. 1) ke `tailwind.config.js` & `styles/index.css`, setup ESLint/Prettier, struktur folder kosong sesuai bag. 2 |
| **Fase 1 — Design System & Shell** | `components/ui/*` (GlassCard, Button, Chip, RatingBadge, Skeleton, EmptyState), `AppShell` + `BottomNavigation` dengan transisi, elemen signature `RouteTrailVisual` versi statis |
| **Fase 2 — Data & Beranda** | `data/*.json` terisi (20–30 destinasi riil dari proposal), `services/*`, `RouteContext`, halaman Beranda lengkap (hero + marquee) |
| **Fase 3 — Peta Rute & Detail Destinasi** | `useRouteRecommendation`, carousel destinasi searah dengan animasi stagger, halaman Detail Destinasi + `KisahDestinasiPanel` premium |
| **Fase 4 — Kuliner & Penginapan** | Kedua halaman + filter otomatis berbasis `activeCorridorId`, edge case radius kosong (`RadiusExpandNotice`, `EmptyState`) |
| **Fase 5 — PWA & Polish** | Manifest final, ikon, offline fallback, install prompt custom, audit `prefers-reduced-motion`, audit Lighthouse (PWA + a11y + performance) |
| **Fase 6 — QA & Handoff** | Responsive check lintas breakpoint, dokumentasi `README.md` untuk developer selanjutnya |

Setiap fase bisa jadi satu sesi kerja terpisah — cocok untuk dilanjutkan bertahap di percakapan berikutnya.

---

## 13. Keputusan Terbuka

Satu hal yang sengaja belum saya kunci karena berdampak langsung ke pilihan dependency di Fase 0 — pendekatan visual untuk **Peta Rute**. Proposal secara eksplisit belum mau integrasi Google Maps/API riil, jadi ada dua arah yang sama-sah:

- Murni ilustrasi custom (SVG "Jejak Rute", tanpa koordinat geografis literal) — paling sesuai dengan visi "premium & khas budaya", nol dependency tambahan.
- Mini-map literal pakai Leaflet + tile OpenStreetMap gratis (tanpa API key) sebagai referensi geografis kecil, sambil elemen signature tetap jadi elemen utama di atasnya.

Saya sudah tentukan sendiri sebagian besar keputusan lain di dokumen ini (font, state management, folder, dsb.) supaya rencana ini langsung actionable — tapi yang satu ini saya lempar balik karena murni soal selera arah produk, bukan soal benar-salah teknis.

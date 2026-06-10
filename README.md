# Portfolio — Najwa Ikhwan Maulana

Website portofolio personal yang elegan, modern, dan mendukung dark mode.

## Fitur
- ✅ Light & Dark Mode (toggle + tersimpan di localStorage)
- ✅ Animasi scroll reveal yang halus
- ✅ Filter proyek berdasarkan kategori
- ✅ Desain responsif untuk mobile & desktop
- ✅ Form kontak interaktif
- ✅ Siap deploy ke Vercel

## Cara Deploy ke Vercel

### Opsi 1 — Melalui GitHub (Rekomendasi)

1. Upload semua file ke repositori GitHub baru
2. Buka [vercel.com](https://vercel.com) dan login
3. Klik **"Add New → Project"**
4. Import repositori GitHub kamu
5. Klik **Deploy** — selesai!

### Opsi 2 — Vercel CLI

```bash
npm i -g vercel
cd portfolio
vercel
```

Ikuti instruksi di terminal, dan portofoliomu akan live dalam hitungan menit.

## Cara Kustomisasi

### Ganti Foto Profil
Di `index.html`, cari bagian `about-img-placeholder` dan ganti dengan tag `<img>`:
```html
<img src="foto-kamu.jpg" alt="Najwa Ikhwan Maulana" style="width:100%;height:100%;object-fit:cover;" />
```

### Ganti Kontak
Di `index.html`, cari section `#contact` dan update email, Instagram, dan LinkedIn.

### Tambah Proyek
Duplikat salah satu `.project-card` di section `#projects` dan sesuaikan isinya.
Jangan lupa set atribut `data-category` yang sesuai: `uiux`, `mobile`, `web`, atau `foto`.

### Warna Aksen
Di `style.css`, ubah nilai `--accent-warm` di `:root` untuk warna aksen berbeda.

## Struktur File
```
portfolio/
├── index.html      # Halaman utama
├── style.css       # Semua styling
├── main.js         # Interaksi & animasi
├── vercel.json     # Konfigurasi Vercel
└── README.md       # Panduan ini
```

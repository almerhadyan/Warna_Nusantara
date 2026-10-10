🇮🇩 Warna NusantaraBring the rich heritage, vibrant colors, and natural beauty of Indonesia into your digital applications.Warna Nusantara adalah sebuah pustaka (library) dan sistem desain visual open-source yang mengekstraksi keindahan budaya, kain tradisional (batik & tenun), lanskap alam, hingga seni lokal Indonesia menjadi koleksi palet warna digital yang siap pakai untuk desainer dan pengembang web.📋 Daftar IsiFitur UtamaInstalasiCara PenggunaanMenggunakan CSS VariablesMenggunakan JavaScript / TypeScriptMenggunakan Tailwind CSSKategori Palet UtamaKontribusiLisensi✨ Fitur Utama🎨 Palet Otentik Nusantara: Ratusan kombinasi warna yang terinspirasi dari Batik Sogan, Tenun Toraja, Kain Songket, Laut Bunaken, hingga Sunset Tanah Lot.💻 Format Lengkap: Mendukung format HEX, RGB, HSL, CSS Variables, dan JSON.♿ Aksesibilitas Terjamin: Semua kombinasi warna telah diuji tingkat kontrasnya sesuai standar WCAG 2.1.⚡ Ringan & Tanpa Dependensi: Ukuran bundle sangat kecil dan dapat digunakan di framework mana saja (React, Vue, Svelte, atau Vanilla JS).📦 InstalasiKamu bisa memasang pustaka ini melalui npm, yarn, atau menggunakan CDN secara langsung.# Menggunakan npm
npm install warna-nusantara

# Menggunakan yarn
yarn add warna-nusantara
Atau sertakan langsung via CDN di HTML kamu:<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/warna-nusantara/dist/index.css">
🚀 Cara Penggunaan1. Menggunakan CSS VariablesImpor file CSS dan gunakan nama variabel warna yang tersedia:@import 'warna-nusantara/dist/index.css';

.hero-section {
  background-color: var(--wn-sogan-cokelat-tua);
  color: var(--wn-krem-prada);
}

.button-primary {
  background-color: var(--wn-tenun-merah-toraja);
  color: var(--wn-putih-kapas);
}
2. Menggunakan JavaScript / TypeScriptKamu bisa mengambil data palet warna secara programmatic:import { getPalette, getAllPalettes } from 'warna-nusantara';

// Mengambil palet warna spesifik
const batikSogan = getPalette('batik-sogan');

console.log(batikSogan);
/* Output:
{
  name: 'Batik Sogan',
  origin: 'Jawa Tengah',
  colors: {
    primary: '#4A2E16',   // Cokelat Tua
    secondary: '#8C5A2B', // Cokelat Sogan
    accent: '#D9A76A',    // Krem Prada
    background: '#F7EFE2' // Kain Morih
  }
}
*/

// Mengambil seluruh koleksi palet
const allPalettes = getAllPalettes();
3. Integrasi dengan Tailwind CSSTambahkan modul warna ini ke dalam file tailwind.config.js kamu:// tailwind.config.js
const { tailwindTheme } = require('warna-nusantara/tailwind');

module.exports = {
  theme: {
    extend: {
      colors: tailwindTheme
    }
  }
}
Kemudian gunakan class Tailwind seperti biasa:<div class="bg-sogan-cokelat text-krem-prada p-6 rounded-lg">
  <h1 class="text-2xl font-bold">Pesona Indonesia</h1>
</div>
🎨 Kategori Palet UtamaKategoriNama PaletInspirasiKode Warna UtamaWastra (Kain)batik-soganWarna klasik Batik Solo & Jogja#4A2E16, #8C5A2BWastra (Kain)tenun-torajaUkiran dan kain Tenun Toraja#8B0000, #E6A100Alambahari-bunakenKeindahan terumbu karang Sulawesi#007791, #40E0D0Alamhijau-parahyanganPerkebunan teh di Jawa Barat#2D5A27, #A8C3A0Lanskapsenja-tanah-lotPemandangan matahari terbenam Bali#FF5722, #4A154B🤝 KontribusiKontribusi dari komunitas sangat dialukan! Jika Kamu ingin menambahkan palet warna baru dari daerahmu:Fork repository ini.Buat branch baru untuk fitur/warna kamu (git checkout -b feature/palet-baru).Tambahkan data warna ke dalam folder src/palettes/ beserta referensi sumbernya.Commit perubahan kamu (git commit -m 'Menambahkan palet Songket Palembang').Push ke branch tersebut (git push origin feature/palet-baru).Buat Pull Request baru.📄 LisensiProyek ini dilesensikan di bawah MIT License. Bebas digunakan untuk proyek personal maupun komersial.

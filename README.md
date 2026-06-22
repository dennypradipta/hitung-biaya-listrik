# ⚡ Hitung Biaya Listrik

Kalkulator estimasi biaya listrik harian, mingguan, bulanan & tahunan berdasarkan TDP device (Watt) dan daya rumah (VA) sesuai tarif PLN.

**Live:** [hitung-biaya-listrik.vercel.app](https://hitung-biaya-listrik.vercel.app)

## Fitur

- Hitung biaya listrik per jam, hari, minggu, bulan, dan tahun
- Pilih daya rumah sesuai golongan PLN (450 VA – 6.600+ VA)
- Atur jam pemakaian per hari (1–24 jam)
- Kalkulasi presisi pakai [Decimal.js](https://github.com/MikeMcl/decimal.js/)
- Dark mode UI — mobile friendly

## Cara Pakai

```sh
npm install
npm run dev
```

Buka `http://localhost:5173`, masukin TDP device & daya rumah, hasil langsung keluar.

## Scripts

| Perintah                | Fungsi                  |
| ----------------------- | ----------------------- |
| `npm run dev`           | Jalankan dev server     |
| `npm run build`         | Build produksi          |
| `npm test`              | Jalankan unit tests     |
| `npm run test:coverage` | Test + laporan coverage |
| `npm run lint`          | ESLint check            |
| `npm run format`        | Prettier format         |
| `npm run format:check`  | Prettier check          |

## Tech Stack

- **React 19** + **Vite 8**
- **Decimal.js** — kalkulasi presisi tinggi
- **Vitest** — unit test + coverage
- **Prettier** + **ESLint** — formatting & linting
- **Husky** — pre-push hook otomatis
- **GitHub Actions** — CI (format → lint → test → coverage → build)

---

Made with ❤️ by [Denny Pradipta](https://github.com/dennypradipta)

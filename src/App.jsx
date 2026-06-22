import { useState, useMemo } from 'react'
import './App.css'

const TARIF_PLN = [
  { va: 450, label: '450 VA (R-1/TR)', tarif: 415, note: 'Subsidies' },
  { va: 900, label: '900 VA (R-1/TR)', tarif: 1352, note: 'Non-subsidies' },
  { va: 1300, label: '1.300 VA (R-1/TR)', tarif: 1444.7 },
  { va: 2200, label: '2.200 VA (R-1/TR)', tarif: 1444.7 },
  { va: 3500, label: '3.500 VA (R-2/TR)', tarif: 1699.53 },
  { va: 5500, label: '5.500 VA (R-2/TR)', tarif: 1699.53 },
  { va: 6600, label: '6.600 VA+ (R-3/TR)', tarif: 1699.53 },
]

function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

function App() {
  const [tdp, setTdp] = useState(9)
  const [va, setVa] = useState(1300)
  const [hours, setHours] = useState(24)

  const tarifData = TARIF_PLN.find((t) => t.va === va) ?? TARIF_PLN[2]

  const hasil = useMemo(() => {
    const kw = tdp / 1000
    const perJam = kw * tarifData.tarif
    const perHari = perJam * hours
    const perMinggu = perHari * 7
    const perBulan = perHari * 30
    const perTahun = perHari * 365

    return {
      perJam,
      perHari,
      perMinggu,
      perBulan,
      perTahun,
      kwhPerJam: kw,
      kwhPerHari: kw * hours,
      kwhPerBulan: kw * hours * 30,
    }
  }, [tdp, hours, tarifData])

  return (
    <div className="app">
      <header>
        <h1>⚡ Kalkulator Tarif Listrik</h1>
        <p className="subtitle">
          Estimasi biaya listrik harian s/d tahunan berdasarkan TDP device &amp; daya rumah
        </p>
      </header>

      <div className="card inputs">
        <div className="input-group">
          <label htmlFor="tdp">TDP Device (Watt)</label>
          <input
            id="tdp"
            type="number"
            min={0}
            step={0.1}
            value={tdp}
            onChange={(e) => setTdp(Number(e.target.value))}
          />
          <span className="hint">Contoh: 9W buat router, 65W buat laptop, 250W buat PC</span>
        </div>

        <div className="input-group">
          <label htmlFor="va">Daya Rumah (VA)</label>
          <select id="va" value={va} onChange={(e) => setVa(Number(e.target.value))}>
            {TARIF_PLN.map((t) => (
              <option key={t.va} value={t.va}>
                {t.label}
              </option>
            ))}
          </select>
          <span className="hint">Tarif: Rp {tarifData.tarif.toLocaleString('id-ID')}/kWh</span>
        </div>

        <div className="input-group">
          <label htmlFor="hours">Pemakaian per Hari</label>
          <div className="hours-row">
            <input
              id="hours"
              type="range"
              min={1}
              max={24}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
            <span className="hours-value">{hours} jam</span>
          </div>
        </div>
      </div>

      <div className="card result">
        <h2>Estimasi Biaya</h2>

        <div className="stats">
          <div className="stat">
            <span className="stat-label">Per Jam</span>
            <span className="stat-value">{formatRupiah(hasil.perJam)}</span>
          </div>
          <div className="stat highlight">
            <span className="stat-label">Per Hari</span>
            <span className="stat-value">{formatRupiah(hasil.perHari)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Per Minggu</span>
            <span className="stat-value">{formatRupiah(hasil.perMinggu)}</span>
          </div>
          <div className="stat highlight">
            <span className="stat-label">Per Bulan (30 hr)</span>
            <span className="stat-value">{formatRupiah(hasil.perBulan)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Per Tahun (365 hr)</span>
            <span className="stat-value">{formatRupiah(hasil.perTahun)}</span>
          </div>
        </div>
      </div>

      <div className="card detail">
        <h3>📊 Detail Konsumsi</h3>
        <table className="detail-table">
          <tbody>
            <tr>
              <td>Konsumsi listrik</td>
              <td>{hasil.kwhPerJam.toFixed(4)} kWh/jam</td>
            </tr>
            <tr>
              <td>Konsumsi per hari</td>
              <td>{hasil.kwhPerHari.toFixed(2)} kWh</td>
            </tr>
            <tr>
              <td>Konsumsi per bulan</td>
              <td>{hasil.kwhPerBulan.toFixed(2)} kWh</td>
            </tr>
            <tr>
              <td>Device power</td>
              <td>{tdp} W ({tdp / 1000} kW)</td>
            </tr>
            <tr>
              <td>Tarif listrik</td>
              <td>Rp {tarifData.tarif.toLocaleString('id-ID')}/kWh ({tarifData.label})</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer>
        <p>
          ⚠️ Ini estimasi aja ya — realita bisa beda karena faktor beban nyata,
          power factor, sama biaya admin/tax. Hitungan pake asumsi device nyala{' '}
          {hours} jam/hari terus-terusan.
        </p>
      </footer>
    </div>
  )
}

export default App
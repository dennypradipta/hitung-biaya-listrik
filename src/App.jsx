import { useState, useMemo } from 'react'
import { TARIF_PLN, findTarif, calculateCost, formatRupiah } from './tarif'
import './App.css'

function App() {
  const [tdp, setTdp] = useState(9)
  const [va, setVa] = useState(1300)
  const [hours, setHours] = useState(24)

  const tarifData = findTarif(va)

  const hasil = useMemo(() => {
    return calculateCost(tdp, hours, tarifData.tarif)
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
              <td>{hasil.kwhPerHari.toFixed(3)} kWh</td>
            </tr>
            <tr>
              <td>Konsumsi per bulan</td>
              <td>{hasil.kwhPerBulan.toFixed(3)} kWh</td>
            </tr>
            <tr>
              <td>Device power</td>
              <td>
                {tdp} W ({tdp / 1000} kW)
              </td>
            </tr>
            <tr>
              <td>Tarif listrik</td>
              <td>
                Rp {tarifData.tarif.toLocaleString('id-ID')}/kWh ({tarifData.label})
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <p className="disclaimer">
          ⚠️ Ini estimasi aja ya — realita bisa beda karena faktor beban nyata, power factor, sama
          biaya admin/tax. Hitungan pake asumsi device nyala {hours} jam/hari terus-terusan.
        </p>
        <p className="credit">
          Made with <span className="heart">❤️</span> by{' '}
          <a href="https://github.com/dennypradipta" target="_blank" rel="noopener noreferrer">
            Denny Pradipta
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

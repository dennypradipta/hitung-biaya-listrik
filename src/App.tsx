import { useState, useMemo } from 'react'
import type { ChangeEvent } from 'react'
import { TARIF_PLN, findTarif, calculateCost, formatRupiah } from './tarif'
import type { CostResult } from './tarif'
import './index.css'

// ─── Collapsible StatBox ───

interface FormulaLine {
  calc: string
  result: string
}

interface StatBoxProps {
  label: string
  value: string
  highlight?: boolean
  formula: FormulaLine[]
}

function StatBox({ label, value, highlight, formula }: StatBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`stat${highlight ? ' highlight' : ''}${open ? ' open' : ''}`}
      onClick={() => setOpen(!open)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen(!open)
        }
      }}
    >
      <div className="stat-header">
        <div className="stat-info">
          <span className="stat-label">{label}</span>
          <span className="stat-value">{value}</span>
        </div>
        <span className={`stat-toggle${open ? ' open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {open && (
        <div className="stat-formula">
          {formula.map((line, i) => (
            <div key={i} className="formula-line">
              <span className="formula-calc">{line.calc}</span>
              <span className="formula-result">{line.result}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── App ───

function App() {
  const [tdp, setTdp] = useState<number>(9)
  const [va, setVa] = useState<number>(1300)
  const [hours, setHours] = useState<number>(24)

  const tarifData = findTarif(va)

  const hasil: CostResult = useMemo(() => {
    return calculateCost(tdp, hours, tarifData.tarif)
  }, [tdp, hours, tarifData])

  const kw = hasil.kwhPerJam
  const tarifStr = `Rp ${tarifData.tarif.toLocaleString('id-ID')}`

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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTdp(Number(e.target.value))}
          />
          <span className="hint">Contoh: 9W buat router, 65W buat laptop, 250W buat PC</span>
        </div>

        <div className="input-group">
          <label htmlFor="va">Daya Rumah (VA)</label>
          <select
            id="va"
            value={va}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setVa(Number(e.target.value))}
          >
            {TARIF_PLN.map((t) => (
              <option key={t.va} value={t.va}>
                {t.label}
              </option>
            ))}
          </select>
          <span className="hint">Tarif: {tarifStr}/kWh</span>
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHours(Number(e.target.value))}
            />
            <span className="hours-value">{hours} jam</span>
          </div>
        </div>
      </div>

      <div className="card result">
        <h2>Estimasi Biaya</h2>
        <p className="result-hint">Klik kartu untuk lihat rumus</p>

        <div className="stats">
          <StatBox
            label="Per Jam"
            value={formatRupiah(hasil.perJam)}
            formula={[
              { calc: `${kw.toFixed(4)} kW × ${tarifStr}/kWh`, result: formatRupiah(hasil.perJam) },
            ]}
          />
          <StatBox
            label="Per Hari"
            value={formatRupiah(hasil.perHari)}
            highlight
            formula={[
              {
                calc: `${kw.toFixed(4)} kW × ${hours} jam`,
                result: `${hasil.kwhPerHari.toFixed(3)} kWh`,
              },
              {
                calc: `${hasil.kwhPerHari.toFixed(3)} kWh × ${tarifStr}/kWh`,
                result: formatRupiah(hasil.perHari),
              },
            ]}
          />
          <StatBox
            label="Per Minggu"
            value={formatRupiah(hasil.perMinggu)}
            formula={[
              {
                calc: `${kw.toFixed(4)} kW × ${hours} jam × 7 hari`,
                result: `${hasil.kwhPerMinggu.toFixed(3)} kWh`,
              },
              {
                calc: `${hasil.kwhPerMinggu.toFixed(3)} kWh × ${tarifStr}/kWh`,
                result: formatRupiah(hasil.perMinggu),
              },
            ]}
          />
          <StatBox
            label="Per Bulan (30 hr)"
            value={formatRupiah(hasil.perBulan)}
            highlight
            formula={[
              {
                calc: `${kw.toFixed(4)} kW × ${hours} jam × 30 hari`,
                result: `${hasil.kwhPerBulan.toFixed(3)} kWh`,
              },
              {
                calc: `${hasil.kwhPerBulan.toFixed(3)} kWh × ${tarifStr}/kWh`,
                result: formatRupiah(hasil.perBulan),
              },
            ]}
          />
          <StatBox
            label="Per Tahun (365 hr)"
            value={formatRupiah(hasil.perTahun)}
            formula={[
              {
                calc: `${kw.toFixed(4)} kW × ${hours} jam × 365 hari`,
                result: `${hasil.kwhPerTahun.toFixed(3)} kWh`,
              },
              {
                calc: `${hasil.kwhPerTahun.toFixed(3)} kWh × ${tarifStr}/kWh`,
                result: formatRupiah(hasil.perTahun),
              },
            ]}
          />
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
              <td>Konsumsi per minggu</td>
              <td>{hasil.kwhPerMinggu.toFixed(3)} kWh</td>
            </tr>
            <tr>
              <td>Konsumsi per bulan</td>
              <td>{hasil.kwhPerBulan.toFixed(3)} kWh</td>
            </tr>
            <tr>
              <td>Konsumsi per tahun</td>
              <td>{hasil.kwhPerTahun.toFixed(3)} kWh</td>
            </tr>
            <tr>
              <td>Device power</td>
              <td>
                {tdp} W ({kw} kW)
              </td>
            </tr>
            <tr>
              <td>Tarif listrik</td>
              <td>
                {tarifStr}/kWh ({tarifData.label})
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

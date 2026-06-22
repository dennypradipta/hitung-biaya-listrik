import Decimal from 'decimal.js'

Decimal.set({ precision: 20 })

export interface TarifEntry {
  va: number
  label: string
  tarif: number
  note?: string
}

export interface CostResult {
  perJam: number
  perHari: number
  perMinggu: number
  perBulan: number
  perTahun: number
  kwhPerJam: number
  kwhPerHari: number
  kwhPerBulan: number
}

export const TARIF_PLN: TarifEntry[] = [
  { va: 450, label: '450 VA (R-1/TR)', tarif: 415, note: 'Subsidies' },
  { va: 900, label: '900 VA (R-1/TR)', tarif: 1352, note: 'Non-subsidies' },
  { va: 1300, label: '1.300 VA (R-1/TR)', tarif: 1444.7 },
  { va: 2200, label: '2.200 VA (R-1/TR)', tarif: 1444.7 },
  { va: 3500, label: '3.500 VA (R-2/TR)', tarif: 1699.53 },
  { va: 5500, label: '5.500 VA (R-2/TR)', tarif: 1699.53 },
  { va: 6600, label: '6.600 VA+ (R-3/TR)', tarif: 1699.53 },
]

export function findTarif(va: number): TarifEntry {
  return TARIF_PLN.find((t) => t.va === va) ?? TARIF_PLN[2]
}

export function calculateCost(tdp: number, hours: number, tarif: number): CostResult {
  const kw = new Decimal(tdp).div(1000)
  const perJam = kw.mul(tarif)
  const perHari = perJam.mul(hours)
  const perMinggu = perHari.mul(7)
  const perBulan = perHari.mul(30)
  const perTahun = perHari.mul(365)

  return {
    perJam: perJam.toNumber(),
    perHari: perHari.toNumber(),
    perMinggu: perMinggu.toNumber(),
    perBulan: perBulan.toNumber(),
    perTahun: perTahun.toNumber(),
    kwhPerJam: kw.toNumber(),
    kwhPerHari: kw.mul(hours).toNumber(),
    kwhPerBulan: kw.mul(hours).mul(30).toNumber(),
  }
}

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

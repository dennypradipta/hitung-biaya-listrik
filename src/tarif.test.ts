import { describe, it, expect } from 'vitest'
import { TARIF_PLN, findTarif, calculateCost, formatRupiah } from './tarif'

describe('TARIF_PLN', () => {
  it('has correct number of tariff tiers', () => {
    expect(TARIF_PLN).toHaveLength(7)
  })

  it('each entry has required fields', () => {
    for (const entry of TARIF_PLN) {
      expect(entry).toHaveProperty('va')
      expect(entry).toHaveProperty('label')
      expect(entry).toHaveProperty('tarif')
      expect(typeof entry.va).toBe('number')
      expect(typeof entry.label).toBe('string')
      expect(typeof entry.tarif).toBe('number')
    }
  })

  it('sorted ascending by va', () => {
    const vas = TARIF_PLN.map((t) => t.va)
    expect(vas).toEqual([...vas].sort((a, b) => a - b))
  })

  it('tarif values are positive', () => {
    for (const entry of TARIF_PLN) {
      expect(entry.tarif).toBeGreaterThan(0)
    }
  })
})

describe('findTarif', () => {
  it('returns tariff for 1300 VA', () => {
    expect(findTarif(1300).tarif).toBe(1444.7)
  })

  it('returns tariff for 450 VA', () => {
    expect(findTarif(450).tarif).toBe(415)
  })

  it('returns tariff for 6600 VA', () => {
    expect(findTarif(6600).tarif).toBe(1699.53)
  })

  it('returns tariff for 3500 VA', () => {
    expect(findTarif(3500).tarif).toBe(1699.53)
  })

  it('falls back to 1300 VA for unknown daya', () => {
    const result = findTarif(9999)
    expect(result.va).toBe(1300)
    expect(result.tarif).toBe(1444.7)
  })
})

describe('calculateCost', () => {
  it('calculates correctly for 9W, 24h, 1444.7 tariff', () => {
    const result = calculateCost(9, 24, 1444.7)

    expect(result.kwhPerJam).toBe(0.009)
    expect(result.kwhPerHari).toBeCloseTo(0.216, 5)
    expect(result.kwhPerBulan).toBeCloseTo(6.48, 5)

    expect(result.perJam).toBeCloseTo(13.0023, 4)
    expect(result.perHari).toBeCloseTo(312.0552, 4)
    expect(result.perMinggu).toBeCloseTo(2184.3864, 4)
    expect(result.perBulan).toBeCloseTo(9361.656, 4)
    expect(result.perTahun).toBeCloseTo(113900.148, 4)
  })

  it('calculates correctly for 65W, 8h, 1699.53 tariff (laptop usage)', () => {
    const result = calculateCost(65, 8, 1699.53)

    expect(result.kwhPerJam).toBe(0.065)
    expect(result.kwhPerHari).toBeCloseTo(0.52, 5)
    expect(result.kwhPerBulan).toBeCloseTo(15.6, 5)

    expect(result.perJam).toBeCloseTo(110.46945, 4)
    expect(result.perHari).toBeCloseTo(883.7556, 4)
  })

  it('returns zero cost when TDP is 0W', () => {
    const result = calculateCost(0, 24, 1444.7)

    expect(result.kwhPerJam).toBe(0)
    expect(result.kwhPerHari).toBe(0)
    expect(result.kwhPerBulan).toBe(0)
    expect(result.perJam).toBe(0)
    expect(result.perHari).toBe(0)
    expect(result.perMinggu).toBe(0)
    expect(result.perBulan).toBe(0)
    expect(result.perTahun).toBe(0)
  })

  it('handles fractional TDP values correctly', () => {
    const result = calculateCost(0.5, 24, 1444.7)

    expect(result.kwhPerJam).toBe(0.0005)
    expect(result.kwhPerHari).toBeCloseTo(0.012, 5)
    expect(result.perHari).toBeCloseTo(17.3364, 4)
  })

  it('handles large TDP values like 1500W (AC unit)', () => {
    const result = calculateCost(1500, 12, 1699.53)

    expect(result.kwhPerJam).toBe(1.5)
    expect(result.kwhPerHari).toBe(18)
    expect(result.perHari).toBeCloseTo(30591.54, 2)
  })

  it('handles 1 hour of usage', () => {
    const result = calculateCost(100, 1, 1444.7)

    expect(result.kwhPerJam).toBe(0.1)
    expect(result.kwhPerHari).toBeCloseTo(0.1, 5)
    expect(result.perJam).toBeCloseTo(144.47, 4)
    expect(result.perHari).toBeCloseTo(144.47, 4)
    expect(result.perMinggu).toBeCloseTo(1011.29, 2)
    expect(result.perBulan).toBeCloseTo(4334.1, 2)
    expect(result.perTahun).toBeCloseTo(52731.55, 2)
  })

  it('produces deterministic results (no floating point drift)', () => {
    const r1 = calculateCost(9, 24, 1444.7)
    const r2 = calculateCost(9, 24, 1444.7)
    expect(r1).toEqual(r2)
  })
})

describe('formatRupiah', () => {
  const NBSP = '\u00a0'

  it('formats integer with IDR currency', () => {
    expect(formatRupiah(312)).toBe(`Rp${NBSP}312`)
  })

  it('formats decimal with two fraction digits', () => {
    expect(formatRupiah(312.06)).toBe(`Rp${NBSP}312,06`)
  })

  it('formats thousands with dot separator', () => {
    expect(formatRupiah(113900.15)).toBe(`Rp${NBSP}113.900,15`)
  })

  it('formats zero', () => {
    expect(formatRupiah(0)).toBe(`Rp${NBSP}0`)
  })

  it('formats large numbers with correct grouping', () => {
    expect(formatRupiah(10500000)).toBe(`Rp${NBSP}10.500.000`)
  })
})

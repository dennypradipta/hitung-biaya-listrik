import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('⚡ Kalkulator Tarif Listrik')).toBeInTheDocument()
  })

  it('renders TDP input field with default value 9', () => {
    render(<App />)
    const input = screen.getByLabelText('TDP Device (Watt)') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('9')
  })

  it('renders daya rumah dropdown with default 1300 VA', () => {
    render(<App />)
    const select = screen.getByLabelText('Daya Rumah (VA)') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('1300')
  })

  it('renders hours slider with default 24', () => {
    render(<App />)
    const slider = screen.getByLabelText('Pemakaian per Hari') as HTMLInputElement
    expect(slider).toBeInTheDocument()
    expect(slider.value).toBe('24')
  })

  it('renders estimated cost results', () => {
    render(<App />)
    expect(screen.getByText('Estimasi Biaya')).toBeInTheDocument()
  })

  it('renders result hint text', () => {
    render(<App />)
    expect(screen.getByText('Klik kartu untuk lihat rumus')).toBeInTheDocument()
  })

  it('renders detail consumption table', () => {
    render(<App />)
    expect(screen.getByText('📊 Detail Konsumsi')).toBeInTheDocument()
  })

  it('renders credit footer with Denny Pradipta link', () => {
    render(<App />)
    const link = screen.getByText('Denny Pradipta')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('https://github.com/dennypradipta')
  })

  it('renders Made with ❤️ text', () => {
    render(<App />)
    expect(screen.getByText(/Made with/)).toBeInTheDocument()
  })

  it('changes TDP value and recalculates', () => {
    render(<App />)
    const input = screen.getByLabelText('TDP Device (Watt)') as HTMLInputElement
    fireEvent.change(input, { target: { value: '65' } })
    expect(input.value).toBe('65')
  })

  it('changes daya rumah and shows correct tariff', () => {
    render(<App />)
    const select = screen.getByLabelText('Daya Rumah (VA)') as HTMLSelectElement
    fireEvent.change(select, { target: { value: '900' } })
    expect(select.value).toBe('900')
  })

  it('changes hours slider and shows updated value', () => {
    render(<App />)
    const slider = screen.getByLabelText('Pemakaian per Hari') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '12' } })
    expect(slider.value).toBe('12')
    expect(screen.getByText('12 jam')).toBeInTheDocument()
  })

  it('shows disclaimer text', () => {
    render(<App />)
    expect(screen.getByText(/Ini estimasi aja ya/)).toBeInTheDocument()
  })

  it('renders all tariff options in dropdown', () => {
    render(<App />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(7)
    expect(options[0]).toHaveTextContent('450 VA')
    expect(options[3]).toHaveTextContent('2.200 VA')
    expect(options[6]).toHaveTextContent('6.600 VA+')
  })

  it('shows detail table with all consumption rows', () => {
    render(<App />)
    expect(screen.getByText('Konsumsi per hari')).toBeInTheDocument()
    expect(screen.getByText('Konsumsi per minggu')).toBeInTheDocument()
    expect(screen.getByText('Konsumsi per bulan')).toBeInTheDocument()
    expect(screen.getByText('Konsumsi per tahun')).toBeInTheDocument()
  })

  it('expands formula on click, collapses on second click', () => {
    render(<App />)

    const perHariBox = screen.getByText('Per Hari').closest('.stat') as HTMLElement
    expect(perHariBox).toBeInTheDocument()

    // Hidden initially
    expect(perHariBox.classList.contains('open')).toBe(false)

    // Click to expand
    fireEvent.click(perHariBox)
    expect(perHariBox.classList.contains('open')).toBe(true)
    expect(screen.getByText(/kW ×/)).toBeInTheDocument()

    // Click to collapse
    fireEvent.click(perHariBox)
    expect(perHariBox.classList.contains('open')).toBe(false)
  })

  it('expands formula on Enter keydown, collapses on Space', () => {
    render(<App />)

    const perHariBox = screen.getByText('Per Hari').closest('.stat') as HTMLElement

    fireEvent.keyDown(perHariBox, { key: 'Enter' })
    expect(perHariBox.classList.contains('open')).toBe(true)

    fireEvent.keyDown(perHariBox, { key: ' ' })
    expect(perHariBox.classList.contains('open')).toBe(false)
  })

  it('does not toggle on other key presses', () => {
    render(<App />)

    const perHariBox = screen.getByText('Per Hari').closest('.stat') as HTMLElement

    fireEvent.keyDown(perHariBox, { key: 'Escape' })
    expect(perHariBox.classList.contains('open')).toBe(false)
  })
})

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
    const input = screen.getByLabelText('TDP Device (Watt)')
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('9')
  })

  it('renders daya rumah dropdown with default 1300 VA', () => {
    render(<App />)
    const select = screen.getByLabelText('Daya Rumah (VA)')
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('1300')
  })

  it('renders hours slider with default 24', () => {
    render(<App />)
    const slider = screen.getByLabelText('Pemakaian per Hari')
    expect(slider).toBeInTheDocument()
    expect(slider.value).toBe('24')
  })

  it('renders estimated cost results', () => {
    render(<App />)
    expect(screen.getByText('Estimasi Biaya')).toBeInTheDocument()
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
    const input = screen.getByLabelText('TDP Device (Watt)')
    fireEvent.change(input, { target: { value: '65' } })
    expect(input.value).toBe('65')
  })

  it('changes daya rumah and shows correct tariff', () => {
    render(<App />)
    const select = screen.getByLabelText('Daya Rumah (VA)')
    fireEvent.change(select, { target: { value: '900' } })
    expect(select.value).toBe('900')
  })

  it('changes hours slider and shows updated value', () => {
    render(<App />)
    const slider = screen.getByLabelText('Pemakaian per Hari')
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
})

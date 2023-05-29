import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Hero } from '../Hero'

jest.mock('../../lib/auth', () => ({
  getUser: jest.fn(() => ({
    name: 'John Doe',
    nlwLogo: '/path/to/avatar.png',
  })),
}))

jest.mock(
  'next/image',
  () =>
    function Image({ src, alt }: any) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} />
    },
)

describe('Componente Hero', () => {
  it('render correctly', () => {
    render(<Hero />)

    // Verifica se a imagem está sendo exibida corretamente
    const image = screen.getByAltText('NLW Spacetime')
    expect(image).toBeInTheDocument()
    expect(image.tagName).toBe('IMG')

    // Verifica se o título está sendo exibido corretamente
    const title = screen.getByText('Sua cápsula do tempo')
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H1')

    // Verifica se o texto está sendo exibido corretamente
    const text = screen.getByText(
      'Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!',
    )
    expect(text).toBeInTheDocument()
    expect(text.tagName).toBe('P')

    // Verifica se o link está sendo exibido corretamente
    const link = screen.getByRole('link', { name: 'CADASTRAR LEMBRANÇA' })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/memories/new')
  })
})

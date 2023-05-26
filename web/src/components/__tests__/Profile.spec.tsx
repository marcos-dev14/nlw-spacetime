import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Profile } from '../Profile'

jest.mock('../../lib/auth', () => ({
  getUser: jest.fn(() => ({
    name: 'John Doe',
    avatarUrl: '/path/to/avatar.png',
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

describe('Component Profile', () => {
  it('renders user profile correctly', () => {
    render(<Profile />)

    const container = screen.getByTestId('profile_test')
    expect(container).toBeInTheDocument()

    const nameElement = screen.getByText('John Doe')
    expect(nameElement).toBeInTheDocument()

    const imageElement = screen.getByAltText('')
    expect(imageElement).toBeInTheDocument()

    const avatarElement = screen.getByRole('img')
    expect(avatarElement).toHaveAttribute('src', '/path/to/avatar.png')

    const logoutLink = screen.getByText('Quero sair')
    expect(logoutLink).toHaveAttribute('href', '/api/auth/logout')
    expect(logoutLink).toHaveClass('block text-red-400 hover:text-red-300')

    const registerLink = screen.getByText('CADASTRAR LEMBRANÇA')
    expect(registerLink).toHaveAttribute('href', '/memories/new')
    expect(registerLink).toHaveClass(
      'inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600 max-lg:ml-3 lg:hidden',
    )

    // debug()
  })
})

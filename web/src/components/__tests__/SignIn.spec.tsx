import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { SignIn } from '../SignIn'

describe('Component SignIn', () => {
  it('renders signIn correctly', () => {
    render(<SignIn />)

    const createAccountText = screen.getByText('Crie sua conta')
    expect(createAccountText).toBeInTheDocument()

    userEvent.click(screen.getByRole('link'))

    const expectedUrl = `http://localhost/`
    expect(window.location.href).toBe(expectedUrl)
  })
})

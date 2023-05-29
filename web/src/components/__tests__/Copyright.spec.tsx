import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Copyright } from '../Copyright'

describe('Component Copyright', () => {
  it('renders copyright correctly', () => {
    render(<Copyright />)

    const link = screen.getByTestId('link_test')
    expect(link).toBeInTheDocument()
  })
})

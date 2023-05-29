import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EmptyMemories } from '../EmptyMemories'

describe('Component EmptyMemories', () => {
  it('renders emptyMemories correctly', () => {
    render(<EmptyMemories />)

    const link = screen.getByTestId('link_test')
    expect(link).toBeInTheDocument()
  })
})

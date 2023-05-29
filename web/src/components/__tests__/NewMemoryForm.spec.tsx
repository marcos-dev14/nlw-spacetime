import { render, screen, fireEvent } from '@testing-library/react'
import Cookie from 'js-cookie'

import { api } from '../../lib/api'

import { NewMemoryForm } from '../NewMemoryForm'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('../../lib/api', () => ({
  api: {
    post: jest.fn(),
  },
}))

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}))

describe('Component NewMemoryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders NewMemoryForm correctly', () => {
    render(<NewMemoryForm />)

    const midiaLabel = screen.getByLabelText('Anexar mídia')
    expect(midiaLabel).toBeInTheDocument()

    const isPublicLabel = screen.getByLabelText('Tornar memória pública')
    expect(isPublicLabel).toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: 'Salvar' })
    expect(submitButton).toBeInTheDocument()
  })

  it('should be possible to post to /upload route', async () => {
    const mockedToken = 'mockedToken'
    // eslint-disable-next-line spaced-comment
    //@ts-ignore
    Cookie.get.mockReturnValueOnce(mockedToken)
    // eslint-disable-next-line spaced-comment
    //@ts-ignore
    api.post.mockResolvedValueOnce({
      data: {
        fileUrl:
          'http://localhost:3333/uploads/95f18785-5e11-4242-b531-329714df54f5',
      },
    })
    render(<NewMemoryForm />)

    fireEvent.click(screen.getByText('Salvar'))

    // Assert API calls
    expect(api.post).toHaveBeenCalledWith('/upload', expect.any(FormData))
  })
})

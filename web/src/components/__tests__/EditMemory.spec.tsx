import { render, screen, fireEvent } from '@testing-library/react'
import { EditMemory } from '../EditMemory'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('../../lib/api', () => ({
  api: {
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}))

describe('Componente EditMemory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockMemory = {
    id: '123',
    coverUrl: 'https://example.com/image.jpg',
    content: 'Lorem ipsum dolor sit amet.',
    createdAt: '2023-05-29T10:00:00Z',
  }

  it('renders EditMemory component', () => {
    render(<EditMemory memory={mockMemory} />)

    // Verifica se a data está sendo exibida corretamente
    // const date = screen.getByText('29 de maio, 2023')
    // expect(date).toBeInTheDocument()

    // Verifica se os botões de editar e deletar estão sendo renderizados corretamente
    const editButton = screen.getByRole('button', { name: 'Editar' })
    expect(editButton).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: 'Deletar' })
    expect(deleteButton).toBeInTheDocument()

    // Verifica se a imagem e o texto da memória estão sendo exibidos corretamente
    const image = screen.getByAltText('')
    expect(image).toBeInTheDocument()
    expect(image.tagName).toBe('IMG')
    expect(image.getAttribute('src')).toBe(mockMemory.coverUrl)

    const content = screen.getByText(mockMemory.content)
    expect(content).toBeInTheDocument()
    expect(content.tagName).toBe('P')
  })

  it('handles editing and saving memory', async () => {
    const mockPut = jest.fn().mockResolvedValue({})
    const mockGetToken = jest.fn().mockReturnValue('mock-token')
    // eslint-disable-next-line spaced-comment
    //@ts-ignore
    Cookie.get.mockImplementation(mockGetToken)
    // eslint-disable-next-line spaced-comment
    //@ts-ignore
    api.put.mockImplementation(mockPut)
    // require('next/navigation').useRouter.mockReturnValue({ push: mockPush })

    render(<EditMemory memory={mockMemory} />)

    // Clica no botão de editar
    const editButton = screen.getByRole('button', { name: 'Editar' })
    fireEvent.click(editButton)

    // Verifica se o formulário de edição é exibido
    const contentTextarea = screen.getByTestId('textarea_test')
    expect(contentTextarea).toBeInTheDocument()

    // Simula a edição do conteúdo da memória
    fireEvent.change(contentTextarea, { target: { value: 'Novo conteúdo' } })

    // Simula o envio do formulário
    const saveButton = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.click(saveButton)

    // Verifica se a função de edição da memória foi chamada com os parâmetros corretos
    expect(mockPut).toHaveBeenCalledWith(
      `/memories/${mockMemory.id}`,
      {
        coverUrl: mockMemory.coverUrl,
        content: 'Novo conteúdo',
        isPublic: null,
      },
      {
        headers: {
          Authorization: 'Bearer mock-token',
        },
      },
    )
  })

  it('handles deleting memory', async () => {
    const mockDelete = jest.fn().mockResolvedValue({})
    const mockGetToken = jest.fn().mockReturnValue('mock-token')
    // eslint-disable-next-line spaced-comment
    //@ts-ignore
    Cookie.get.mockImplementation(mockGetToken)
    // eslint-disable-next-line spaced-comment
    //@ts-ignore
    api.delete.mockImplementation(mockDelete)
    // require('next/navigation').useRouter.mockReturnValue({ push: mockPush })

    render(<EditMemory memory={mockMemory} />)

    // Clica no botão de deletar
    const deleteButton = screen.getByRole('button', { name: 'Deletar' })
    fireEvent.click(deleteButton)

    // Verifica se a função de exclusão da memória foi chamada com o token de autenticação correto
    expect(mockDelete).toHaveBeenCalledWith(`/memories/${mockMemory.id}`, {
      headers: {
        Authorization: 'Bearer mock-token',
      },
    })
  })
})

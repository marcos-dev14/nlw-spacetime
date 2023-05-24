'use client'

import { FormEvent, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import Cookie from 'js-cookie'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
// import { MediaPicker } from './MediaPicker'

dayjs.locale(ptBr)

interface MemoryProps {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

interface EditMemoryProps {
  memory: MemoryProps
}

export function EditMemory({ memory }: EditMemoryProps) {
  const [editMemory, setEditMemory] = useState(false)

  const router = useRouter()

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    setEditMemory(!editMemory)

    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const token = Cookie.get('token')

    await api.put(
      `/memories/${memory.id}`,
      {
        coverUrl: memory.coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
  }

  async function handleDeleteMemory() {
    const token = Cookie.get('token')

    await api.delete(`/memories/${memory.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    router.push('/')
  }

  return (
    <>
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dayjs(memory.createdAt).format('D[ de ]MMMM[ , ]YYYY')}
      </time>
      <div className="flex h-9 items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditMemory(!editMemory)}
            className="flex items-center gap-1 text-green-500 transition-colors hover:text-green-400"
          >
            <Edit className="h4 w-4" />
            Editar
          </button>

          <button
            onClick={handleDeleteMemory}
            className="flex items-center gap-1 text-red-500 transition-colors hover:text-red-400"
          >
            <Trash2 className="h4 w-4" />
            Deletar
          </button>
        </div>
      </div>

      {editMemory && (
        <form
          onSubmit={handleEditMemory}
          className="flex flex-1 flex-col gap-2"
        >
          <div className="flex items-center gap-4">
            <label
              htmlFor="isPublic"
              className="flex items-center gap-1.5 text-sm text-gray-200 transition-colors hover:text-gray-100"
            >
              <input
                type="checkbox"
                name="isPublic"
                id="isPublic"
                value="true"
                className="h-4 w-4 cursor-pointer rounded border-gray-400 bg-gray-700 text-purple-500"
              />
              Tornar memória pública
            </label>
          </div>

          <textarea
            name="content"
            spellCheck={false}
            className="w-full flex-1 resize-none rounded border-0 bg-transparent px-1 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
            placeholder="Descreva sobre esse dia."
          />

          <button
            type="submit"
            className="inline-block self-end rounded-full bg-green-500 px-5 py-2 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600"
          >
            Salvar
          </button>
        </form>
      )}

      <div className="space-y-4">
        {/* eslint-disable-next-line */}
        <img
          src={memory.coverUrl}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
        <p className="text-lg leading-relaxed text-gray-100">
          {memory.content}
        </p>
      </div>
    </>
  )
}

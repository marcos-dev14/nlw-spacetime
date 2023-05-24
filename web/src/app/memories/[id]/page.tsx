import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { EditMemory } from '@/components/EditMemory'

interface ParamsProps {
  params: {
    id: string
  }
}

interface MemoryProps {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

export default async function Memory({ params }: ParamsProps) {
  const token = cookies().get('token')?.value
  const response = await api.get(`/memories/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory: MemoryProps = response.data

  return (
    <div className="flex h-full flex-col gap-10 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 transition-colors hover:text-gray-100"
      >
        <ChevronLeft className="h4 w-4" />
        Votar à timeline
      </Link>

      <EditMemory memory={memory} />
    </div>
  )
}

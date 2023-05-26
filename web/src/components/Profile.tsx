import { getUser } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div
      data-testid="profile_test"
      className="flex items-center gap-3 text-left max-lg:ml-5"
    >
      <div className="flex items-center gap-3 text-left max-lg:flex-col max-lg:items-start">
        <Image
          src={avatarUrl}
          width={40}
          height={40}
          alt=""
          className="h-10 w-10 rounded-full"
        />

        <p className="max-w-[140px] text-sm leading-snug">
          {name}
          <a
            href="/api/auth/logout"
            className="block text-red-400 hover:text-red-300"
          >
            Quero sair
          </a>
        </p>
      </div>

      <Link
        href="/memories/new"
        className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600 max-lg:ml-3 lg:hidden"
      >
        CADASTRAR LEMBRANÇA
      </Link>
    </div>
  )
}

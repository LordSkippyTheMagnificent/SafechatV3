import Link from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import UserContext from '~/lib/UserContext'
import { addChannel, deleteChannel } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import Avatar from '~/components/Avatar'

export default function Layout(props) {
  const { signOut, user } = useContext(UserContext)
  const router = useRouter()
  const activeChannelId = Number(router.query.id)

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  const newChannel = async () => {
    const slug = prompt('Please enter your channel name')
    if (slug && user) {
      addChannel(slugify(slug), user.id)
    }
  }

  const displayName = user?.username || user?.email || 'Anonymous'

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* User header */}
        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
          <Avatar user={user} size={40} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">
              {displayName}
            </div>
            <Link
              href="/profile"
              className="text-xs text-indigo-300 hover:text-indigo-200 hover:underline"
            >
              Edit profile
            </Link>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-gray-400 hover:text-red-400"
          >
            Log out
          </button>
        </div>

        {/* Channels header + new channel */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Channels
          </h4>
          <button
            onClick={newChannel}
            className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            New
          </button>
        </div>

        {/* Channel list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {props.channels.map((channel) => (
            <SidebarItem
              key={channel.id}
              channel={channel}
              isActiveChannel={channel.id === activeChannelId}
              user={user}
            />
          ))}
        </nav>
      </aside>

      {/* Main content (messages etc.) */}
      <main className="flex-1 flex flex-col">
        {props.children}
      </main>
    </div>
  )
}

const SidebarItem = ({ channel, isActiveChannel, user }) => (
  <div className="group flex items-center">
    <Link
      href={`/channels/${channel.id}`}
      className={`flex-1 px-4 py-2 text-sm truncate ${
        isActiveChannel
          ? 'bg-gray-700 text-white font-semibold'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      # {channel.slug}
    </Link>

    {channel.id !== 1 &&
      (channel.created_by === user?.id || user?.appRole === 'admin') && (
        <button
          onClick={() => deleteChannel(channel.id)}
          className="px-2 py-2 text-gray-500 hover:text-red-400"
          title="Delete channel"
        >
          <TrashIcon />
        </button>
      )}
  </div>
)

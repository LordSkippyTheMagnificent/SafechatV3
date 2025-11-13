import { useContext } from 'react'
import UserContext from '~/lib/UserContext'
import { deleteMessage } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import Avatar from '~/components/Avatar'

const Message = ({ message }) => {
  const { user } = useContext(UserContext)

  const canDelete =
    user?.id === message.user_id ||
    ['admin', 'moderator'].includes(user?.appRole)

  const author = message.author || null

  const displayName =
    author?.username ||
    author?.email ||
    'Unknown user'

  const timestamp = message.inserted_at
    ? new Date(message.inserted_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="flex items-start gap-3 px-4 py-2 hover:bg-gray-800/60 transition">
      {/* Avatar */}
      <Avatar user={author} size={36} />

      {/* Message body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-100 truncate">
            {displayName}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-500">
              {timestamp}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-200 break-words">
          {message.message}
        </div>
      </div>

      {/* Delete button */}
      {canDelete && (
        <button
          onClick={() => deleteMessage(message.id)}
          className="ml-2 text-gray-500 hover:text-red-400 transition flex-shrink-0"
          title="Delete message"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

export default Message

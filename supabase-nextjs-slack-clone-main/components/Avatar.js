import React from 'react'

const Avatar = ({ user, size = 32 }) => {
  if (!user) {
    return (
      <div
        className="rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white"
        style={{ width: size, height: size }}
      >
        ?
      </div>
    )
  }

  const displayName = user.username || user.email || ''
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={displayName}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white"
      style={{ width: size, height: size }}
    >
      {initials || '?'}
    </div>
  )
}

export default Avatar

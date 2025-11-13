import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import UserContext from '~/lib/UserContext'
import { supabase, fetchUser } from '~/lib/Store'

const ProfilePage = () => {
  const { user, authLoaded } = useContext(UserContext)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  // Load profile from public.users once auth is ready
  useEffect(() => {
    if (!authLoaded) return

    if (!user) {
      router.push('/')
      return
    }

    const loadProfile = async () => {
      setLoading(true)
      const data = await fetchUser(user.id)
      if (data) {
        setProfile(data)
        setUsername(data.username || '')
        setAvatarUrl(data.avatar_url || '')
      }
      setLoading(false)
    }

    loadProfile()
  }, [authLoaded, user, router])

  const handleUploadAvatar = async (event) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file || !user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data?.publicUrl

      if (publicUrl) {
        setAvatarUrl(publicUrl)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error.message)
      alert('Error uploading avatar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      const updates = {
        username: username || null,
        avatar_url: avatarUrl || null,
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      alert('Profile updated!')
      router.push('/channels/1')
    } catch (error) {
      console.error('Error updating profile:', error.message)
      alert('Error updating profile: ' + error.message)
    }
  }

  if (!authLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Your Profile</h1>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile picture
            </label>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                  No image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                disabled={uploading}
                className="text-sm"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Display name
            </label>
            <input
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Skippy"
            />
            <p className="mt-1 text-xs text-gray-400">
              This is what people will see next to your messages.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm"
          >
            Save profile
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ProfilePage

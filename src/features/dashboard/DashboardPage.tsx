import { useEffect, useState } from 'react';
import { Header } from '../../shared/components/Header';
import api from '../../shared/lib/axios';

interface Workspace {
  _id: string
  name: string
  description?: string
  bannerUrl?: string | null
}

export function DashBoardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [banner, setBanner] = useState<File | null>(null)

 const fetchWorkspaces = async () => {
  try {
    const res = await api.get('/workspaces')

    const data = res.data

    if (!Array.isArray(data)) {
      console.error('Expected array but got:', data)
      setWorkspaces([])
      return
    }

    setWorkspaces(data)
  } catch (error) {
    console.error('Fetch workspaces failed:', error)
    setWorkspaces([])
  }
}

  const createWorkspace = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)

    if (banner) {
      formData.append('Banner', banner)
    }

    await api.post('/workspaces', formData)

    setName('')
    setDescription('')
    setBanner(null)

    await fetchWorkspaces()
  } catch (error) {
    console.error('Create workspace failed:', error)
  }
}

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  return (
    <div>
      <Header showFunctions={true} />

      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome to your Dashboard
        </h1>

        <form
          onSubmit={createWorkspace}
          className="mb-8 flex flex-col gap-3 max-w-md"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name"
            className="border rounded px-3 py-2"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border rounded px-3 py-2"
          />

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setBanner(e.target.files?.[0] ?? null)}
          />

          <button
            type="submit"
            className="bg-stone-900 text-white rounded px-4 py-2"
          >
            Create workspace
          </button>
        </form>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className="border rounded-lg overflow-hidden"
            >
              {workspace.bannerUrl && (
                <img
                  src={`http://localhost:3000${workspace.bannerUrl}`}
                  alt={workspace.name}
                  className="w-full h-32 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="font-semibold">{workspace.name}</h2>
                <p className="text-sm text-stone-600">
                  {workspace.description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
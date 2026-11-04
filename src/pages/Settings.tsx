import { useState } from 'react'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import { toast } from 'sonner'

export function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || 'zZinuZz', bio: 'Body-positive artist • Koblenz', email: user?.email || 'studio@nackedei4all.de', location: 'Koblenz, DE' })
  const repos = useStore(s=>s.repos)

  function resetDemo() {
    if (!confirm('Reset all demo data? This will restore seed data.')) return
    localStorage.removeItem('n4a_store_v2')
    location.reload()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your studio profile and workspace.</p>
      </div>

      <div className="bg-[#111119] border border-[#232330] rounded-2xl p-6">
        <h3 className="font-semibold text-white">Profile</h3>
        <div className="flex gap-4 mt-4">
          <img src={user?.avatar} className="w-16 h-16 rounded-2xl object-cover border border-[#232330]" alt="" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400">Display name</label>
              <input value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} className="mt-1 w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Email</label>
              <input value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})} className="mt-1 w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-zinc-400">Bio</label>
              <input value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})} className="mt-1 w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Location</label>
              <input value={profile.location} onChange={e=>setProfile({...profile, location:e.target.value})} className="mt-1 w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <button onClick={()=>toast.success('Profile saved (local)')} className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111119] border border-[#232330] rounded-2xl p-6">
        <h3 className="font-semibold text-white">Workspace</h3>
        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div className="bg-[#0a0a0f] border border-[#232330] rounded-xl p-3">
            <div className="text-zinc-500 text-xs">Repositories</div>
            <div className="text-lg font-bold text-white">{repos.length}</div>
          </div>
          <div className="bg-[#0a0a0f] border border-[#232330] rounded-xl p-3">
            <div className="text-zinc-500 text-xs">Storage used</div>
            <div className="text-lg font-bold text-white">12.4 GB</div>
          </div>
          <div className="bg-[#0a0a0f] border border-[#232330] rounded-xl p-3">
            <div className="text-zinc-500 text-xs">Visibility</div>
            <div className="text-lg font-bold text-white">Public + Private</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={resetDemo} className="bg-[#1a1a24] border border-[#232330] text-white rounded-full px-4 py-2 text-sm">Reset demo data</button>
          <button onClick={()=>{localStorage.clear(); location.reload()}} className="bg-rose-600 text-white rounded-full px-4 py-2 text-sm">Clear all local data</button>
        </div>
        <p className="text-xs text-zinc-600 mt-2">Data is stored in localStorage for demo persistence. In production, connect Supabase (see README).</p>
      </div>

      <div className="bg-[#111119] border border-[#232330] rounded-2xl p-6">
        <h3 className="font-semibold text-white">About this migration</h3>
        <div className="text-sm text-zinc-400 mt-2 leading-relaxed space-y-2">
          <p><strong className="text-white">Original site:</strong> nackedei4all.wordpress.com — a WordPress.com blog with gallery pages (More Piczzz, Piczzz ohne Ende, Hier Daheim, etc.) and a booking form.</p>
          <p><strong className="text-white">New model:</strong> Each WordPress page → one Repository (with README, topics, commits). Each image set → Files. The booking form → Bookings kanban. Comments/inquiries → Inbox threads.</p>
          <p><strong className="text-white">Design:</strong> GitHub dark theme with warm accents, fully responsive, optimistic updates, and local persistence.</p>
          <p><strong className="text-white">Safety:</strong> No explicit pornographic content in demo. All demo models are 18+, consent-first language. Age gate on first load. Private repos for VIP.</p>
        </div>
      </div>
    </div>
  )
}

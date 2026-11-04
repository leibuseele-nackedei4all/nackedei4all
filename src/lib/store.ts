import { create } from 'zustand'
import type { Repo, Booking, Message, Activity } from '../types'
import { seedRepos, seedBookings, seedMessages, seedActivity } from './seed'
import { simulateDelay } from './utils'

type State = {
  repos: Repo[]
  bookings: Booking[]
  messages: Message[]
  activity: Activity[]
  isLoading: boolean
  search: string
  filterVisibility: string
  filterLanguage: string
  sortBy: string
  // actions
  init: () => Promise<void>
  setSearch: (s: string) => void
  setFilters: (v: { visibility?: string; language?: string; sortBy?: string }) => void
  // repos
  createRepo: (repo: Partial<Repo>) => Promise<Repo>
  updateRepo: (id: string, patch: Partial<Repo>) => Promise<void>
  deleteRepo: (id: string) => Promise<void>
  toggleStar: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  forkRepo: (id: string) => Promise<void>
  // bookings
  createBooking: (b: Omit<Booking, 'id'|'createdAt'>) => Promise<void>
  updateBooking: (id: string, patch: Partial<Booking>) => Promise<void>
  deleteBooking: (id: string) => Promise<void>
  // messages
  createMessage: (m: Omit<Message, 'id'|'createdAt'|'replies'|'read'|'status'> & Partial<Pick<Message,'status'>>) => Promise<void>
  updateMessage: (id: string, patch: Partial<Message>) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  replyMessage: (id: string, body: string) => Promise<void>
}

const LS_KEY = 'n4a_store_v2'

function loadLS(): Partial<State> | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function saveLS(s: Pick<State,'repos'|'bookings'|'messages'|'activity'>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  } catch {}
}

export const useStore = create<State>((set, get) => ({
  repos: [],
  bookings: [],
  messages: [],
  activity: [],
  isLoading: true,
  search: '',
  filterVisibility: 'all',
  filterLanguage: 'all',
  sortBy: 'updated',

  init: async () => {
    set({ isLoading: true })
    await simulateDelay(700)
    const ls = loadLS()
    if (ls && ls.repos && ls.repos.length) {
      set({ repos: ls.repos as Repo[], bookings: ls.bookings as Booking[], messages: ls.messages as Message[], activity: ls.activity as Activity[], isLoading: false })
    } else {
      set({ repos: seedRepos, bookings: seedBookings, messages: seedMessages, activity: seedActivity, isLoading: false })
      saveLS({ repos: seedRepos, bookings: seedBookings, messages: seedMessages, activity: seedActivity })
    }
  },

  setSearch: (s) => set({ search: s }),
  setFilters: ({ visibility, language, sortBy }) => set(state => ({
    filterVisibility: visibility ?? state.filterVisibility,
    filterLanguage: language ?? state.filterLanguage,
    sortBy: sortBy ?? state.sortBy
  })),

  // REPOS
  createRepo: async (partial) => {
    const newRepo: Repo = {
      id: 'r' + Math.random().toString(36).slice(2, 8),
      name: partial.name || 'new-repo',
      displayName: partial.displayName || 'Untitled',
      description: partial.description || '',
      longDescription: partial.longDescription || '',
      visibility: partial.visibility || 'public',
      topics: partial.topics || [],
      language: partial.language || 'Photography',
      cover: partial.cover || 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop',
      images: partial.images || [],
      stars: 0,
      forks: 0,
      watchers: 1,
      fileCount: 0,
      size: '0 MB',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      archived: false,
      pinned: false,
      isStarredByMe: false,
      readme: partial.readme || `# ${partial.displayName || 'New Repo'}\n\nEmpty repo — add a README and push your first commit.\n`,
      commits: [],
      license: 'All rights reserved',
    }
    // optimistic
    set(s => ({ repos: [newRepo, ...s.repos] }))
    saveLS(get())
    await simulateDelay(500)
    // push activity
    set((s:any) => ({ activity: [{ id: 'a'+Date.now(), type: 'commit' as const, actor: 'zZinuZz', repo: newRepo.name, message: `created repo ${newRepo.name}`, time: new Date().toISOString() }, ...s.activity].slice(0, 20) }))
    saveLS(get())
    return newRepo
  },

  updateRepo: async (id, patch) => {
    const prev = get().repos
    set(s => ({ repos: s.repos.map(r => r.id===id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r) }))
    saveLS(get())
    await simulateDelay(400)
    // success stays, on error would rollback to prev — simulated success
  },

  deleteRepo: async (id) => {
    const prev = get().repos
    set(s => ({ repos: s.repos.filter(r => r.id!==id) }))
    saveLS(get())
    await simulateDelay(400)
  },

  toggleStar: async (id) => {
    set(s => ({
      repos: s.repos.map(r => r.id===id ? { ...r, isStarredByMe: !r.isStarredByMe, stars: r.isStarredByMe ? r.stars-1 : r.stars+1 } : r)
    }))
    saveLS(get())
    await simulateDelay(300)
  },

  togglePin: async (id) => {
    set(s => ({ repos: s.repos.map(r => r.id===id ? { ...r, pinned: !r.pinned } : r)}))
    saveLS(get())
    await simulateDelay(300)
  },

  forkRepo: async (id) => {
    const orig = get().repos.find(r=>r.id===id)
    if (!orig) return
    set(s => ({ repos: s.repos.map(r=> r.id===id ? { ...r, forks: r.forks+1 } : r)}))
    // optimistic add fork copy
    const forked: Repo = { ...orig, id: 'r'+Math.random().toString(36).slice(2,8), name: orig.name+'-fork', displayName: orig.displayName+' (fork)', stars: 0, forks:0, isStarredByMe:false, pinned:false, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }
    set(s => ({ repos: [forked, ...s.repos] }))
    saveLS(get())
    await simulateDelay(500)
  },

  // BOOKINGS
  createBooking: async (b) => {
    const nb: Booking = { ...b, id: 'b'+Math.random().toString(36).slice(2,8), createdAt: new Date().toISOString() }
    set(s => ({ bookings: [nb, ...s.bookings] }))
    saveLS(get())
    await simulateDelay(400)
  },
  updateBooking: async (id, patch) => {
    set(s => ({ bookings: s.bookings.map(b=> b.id===id ? { ...b, ...patch } : b)}))
    saveLS(get())
    await simulateDelay(300)
  },
  deleteBooking: async (id) => {
    set(s => ({ bookings: s.bookings.filter(b=> b.id!==id)}))
    saveLS(get())
    await simulateDelay(300)
  },

  // MESSAGES
  createMessage: async (m) => {
    const nm: Message = { ...m, id: 'm'+Math.random().toString(36).slice(2,8), createdAt: new Date().toISOString(), replies: [], read:false, status: m.status || 'open' }
    set(s => ({ messages: [nm, ...s.messages] }))
    saveLS(get())
    await simulateDelay(400)
  },
  updateMessage: async (id, patch) => {
    set(s => ({ messages: s.messages.map(mm=> mm.id===id ? { ...mm, ...patch } : mm)}))
    saveLS(get())
    await simulateDelay(300)
  },
  deleteMessage: async (id) => {
    set(s => ({ messages: s.messages.filter(m=> m.id!==id)}))
    saveLS(get())
    await simulateDelay(300)
  },
  replyMessage: async (id, body) => {
    set(s => ({ messages: s.messages.map(m=> m.id===id ? { ...m, replies: [...m.replies, { id: 're'+Date.now(), author: 'zZinuZz', body, date: new Date().toISOString()}], read:true } : m)}))
    saveLS(get())
    await simulateDelay(300)
  },
}))

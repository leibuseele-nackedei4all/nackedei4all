import { useState, useMemo } from 'react'
import { useStore } from '../lib/store'
import { RepoCard, RepoSkeleton } from '../components/RepoCard'
import { EmptyState, Button, Input, Textarea, Select } from '../components/ui'
import { Search, Plus, LayoutGrid, List, X, BookOpen, Sparkles, Filter } from 'lucide-react'
import { slugify } from '../lib/utils'
import { toast } from 'sonner'

export function ReposPage() {
  const { repos, isLoading, search, filterVisibility, filterLanguage, sortBy, setSearch, setFilters, createRepo } = useStore()
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(()=>{
    let list = [...repos]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(r=> r.displayName.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.topics.some(t=>t.includes(q)) || r.description.toLowerCase().includes(q))
    }
    if (filterVisibility!=='all') list = list.filter(r=>r.visibility===filterVisibility)
    if (filterLanguage!=='all') list = list.filter(r=>r.language===filterLanguage)
    if (sortBy==='stars') list.sort((a,b)=>b.stars-a.stars)
    else if (sortBy==='name') list.sort((a,b)=>a.displayName.localeCompare(b.displayName))
    else list.sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    return list
  }, [repos, search, filterVisibility, filterLanguage, sortBy])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-[#111119] border border-[#232330] rounded-xl shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=><RepoSkeleton key={i}/>)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Repositories</h1>
          <p className="text-sm text-zinc-500">Your WordPress pages — now versioned, searchable, and bookable. {filtered.length} repos</p>
        </div>
        <button onClick={()=>setShowCreate(true)} className="bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 inline-flex items-center gap-2 self-start">
          <Plus size={16}/> New repository
        </button>
      </div>

      <div className="bg-[#111119] border border-[#232330] rounded-2xl p-3 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Find a repository…"
            className="w-full bg-[#0a0a0f] border border-[#232330] rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterVisibility} onChange={e=>setFilters({ visibility: e.target.value })} className="bg-[#0a0a0f] border border-[#232330] rounded-full px-3 py-2 text-sm text-zinc-300">
            <option value="all">All visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
          <select value={filterLanguage} onChange={e=>setFilters({ language: e.target.value })} className="bg-[#0a0a0f] border border-[#232330] rounded-full px-3 py-2 text-sm text-zinc-300">
            <option value="all">All languages</option>
            <option>Photography</option>
            <option>Lifestyle</option>
            <option>Art</option>
            <option>Studio</option>
            <option>Nature</option>
            <option>Portrait</option>
          </select>
          <select value={sortBy} onChange={e=>setFilters({ sortBy: e.target.value })} className="bg-[#0a0a0f] border border-[#232330] rounded-full px-3 py-2 text-sm text-zinc-300">
            <option value="updated">Last updated</option>
            <option value="stars">Most stars</option>
            <option value="name">Name</option>
          </select>
          <div className="flex bg-[#0a0a0f] border border-[#232330] rounded-full p-1">
            <button onClick={()=>setView('grid')} className={`p-1.5 rounded-full ${view==='grid' ? 'bg-white text-black' : 'text-zinc-500'}`}><LayoutGrid size={14}/></button>
            <button onClick={()=>setView('list')} className={`p-1.5 rounded-full ${view==='list' ? 'bg-white text-black' : 'text-zinc-500'}`}><List size={14}/></button>
          </div>
        </div>
      </div>

      {filtered.length===0 ? (
        <div className="bg-[#111119] border border-[#232330] rounded-2xl">
          <EmptyState
            icon={<BookOpen size={20}/>}
            title="No repositories found"
            desc={search ? `No results for "${search}". Try adjusting filters.` : "Create your first repository to get started."}
            action={<button onClick={()=>setShowCreate(true)} className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium">Create repository</button>}
          />
        </div>
      ) : (
        <div className={view==='grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
          {filtered.map(r=> <RepoCard key={r.id} repo={r} view={view} />)}
        </div>
      )}

      {showCreate && <CreateModal onClose={()=>setShowCreate(false)} onCreate={async (data)=>{
        const toastId = toast.loading('Creating repository…')
        await createRepo(data)
        toast.dismiss(toastId)
        toast.success('Repository created')
        setShowCreate(false)
      }} />}
    </div>
  )
}

function CreateModal({ onClose, onCreate }: { onClose: ()=>void; onCreate: (d:any)=>void }) {
  const [form, setForm] = useState({ displayName:'', description:'', topics:'', visibility:'public', language:'Photography', readme:'' })
  const [loading, setLoading] = useState(false)
  const slug = slugify(form.displayName) || 'new-repo'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="w-full max-w-lg bg-[#111119] border border-[#232330] rounded-[24px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#232330] flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2"><Sparkles size={16} className="text-amber-400"/> New repository</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-auto">
          <div className="bg-[#0a0a0f] border border-[#232330] rounded-xl p-3 flex items-center gap-2 text-sm">
            <span className="text-zinc-500">nackedei4all /</span>
            <span className="font-mono text-white">{slug}</span>
            <span className="ml-auto text-xs bg-[#1a1a24] border border-[#232330] rounded-full px-2 py-1">{form.visibility}</span>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400">Display name *</label>
            <Input value={form.displayName} onChange={e=>setForm({...form, displayName:e.target.value})} placeholder="e.g. Bodyscape Vol. IV" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400">Description</label>
            <Input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Short description" />
            <p className="text-xs text-zinc-600 mt-1">This will be the repo’s subtitle on cards.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-400">Visibility</label>
              <Select value={form.visibility} onChange={e=>setForm({...form, visibility:e.target.value})}>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Language</label>
              <Select value={form.language} onChange={e=>setForm({...form, language:e.target.value})}>
                <option>Photography</option><option>Lifestyle</option><option>Art</option><option>Studio</option><option>Nature</option><option>Portrait</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400">Topics (comma separated)</label>
            <Input value={form.topics} onChange={e=>setForm({...form, topics:e.target.value})} placeholder="art-nude, natural-light" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400">README (markdown)</label>
            <Textarea value={form.readme} onChange={e=>setForm({...form, readme:e.target.value})} placeholder="# Title

Describe your repo..." />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#232330] flex justify-end gap-2 bg-[#0f0f15]">
          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
          <button
            disabled={!form.displayName || loading}
            onClick={async()=>{
              setLoading(true)
              await onCreate({
                displayName: form.displayName,
                name: slug,
                description: form.description,
                visibility: form.visibility,
                language: form.language,
                topics: form.topics.split(',').map(s=>s.trim()).filter(Boolean),
                readme: form.readme || `# ${form.displayName}\n\n${form.description}`,
                cover: `https://images.unsplash.com/photo-${['1519608487953-e999c86e7455','1490481651871-ab68de25d43d','1529626455594-4ff0802cfb7e'][Math.floor(Math.random()*3)]}?w=800&h=600&fit=crop`
              })
              setLoading(false)
            }}
            className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >{loading ? 'Creating…' : 'Create repository'}</button>
        </div>
      </div>
    </div>
  )
}

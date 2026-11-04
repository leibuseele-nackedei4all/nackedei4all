import { useStore } from '../lib/store'
import { RepoCard } from '../components/RepoCard'
import { EmptyState } from '../components/ui'
import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export function StarredPage() {
  const repos = useStore(s=>s.repos.filter(r=>r.isStarredByMe))
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2"><Star size={20} className="text-amber-400 fill-amber-400"/> Starred repositories</h1>
        <p className="text-sm text-zinc-500">Your favorites — quick access to the galleries you love. {repos.length} repos</p>
      </div>
      {repos.length===0 ? (
        <div className="bg-[#111119] border border-[#232330] rounded-2xl">
          <EmptyState icon={<Star size={20}/>} title="No starred repositories" desc="Star repos to save them here. It helps the creator too." action={<Link to="/repos" className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium">Browse repos</Link>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {repos.map(r=> <RepoCard key={r.id} repo={r} />)}
        </div>
      )}
    </div>
  )
}

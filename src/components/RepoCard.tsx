import { Star, GitFork, Eye, Lock, BookOpen, Pin, MoreHorizontal, Archive } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Repo } from '../types'
import { formatRelative, languageColors, cn } from '../lib/utils'
import { useStore } from '../lib/store'
import { toast } from 'sonner'

export function RepoCard({ repo, view }: { repo: Repo; view?: 'grid'|'list' }) {
  const toggleStar = useStore(s=>s.toggleStar)
  const forkRepo = useStore(s=>s.forkRepo)

  const isList = view==='list'

  return (
    <div className={cn(
      "group relative bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden hover:border-[#2a2a3a] hover:bg-[#15151e] transition",
      isList ? "flex flex-col sm:flex-row" : "flex flex-col"
    )}>
      {/* cover */}
      <div className={cn("relative overflow-hidden bg-[#0f0f15]", isList ? "sm:w-[240px] h-[160px] sm:h-auto shrink-0" : "h-[160px]")}>
        <img src={repo.cover} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={cn("w-2.5 h-2.5 rounded-full", languageColors[repo.language] || 'bg-zinc-500')} />
          <span className="text-[11px] font-medium bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-full border border-white/10">{repo.language}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {repo.pinned && <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Pin size={10}/> PINNED</span>}
          {repo.visibility==='private' && <span className="bg-zinc-900 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-white/10"><Lock size={10}/> Private</span>}
          {repo.archived && <span className="bg-zinc-700 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1"><Archive size={10}/> Archived</span>}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs text-white/80 font-mono">{repo.fileCount} files • {repo.size}</span>
          <span className="text-xs text-white/90 bg-white/10 backdrop-blur px-2 py-1 rounded-full border border-white/10">Updated {formatRelative(repo.updatedAt)}</span>
        </div>
      </div>

      {/* body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/repos/${repo.id}`} className="min-w-0">
            <h3 className="font-semibold tracking-tight leading-tight hover:text-rose-400 transition line-clamp-1">{repo.displayName}</h3>
            <p className="text-xs text-zinc-500 font-mono">{repo.name}</p>
          </Link>
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500"><MoreHorizontal size={14}/></button>
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">{repo.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0,4).map(t=>(
            <span key={t} className="text-[11px] bg-[#1a1a24] border border-[#232330] text-zinc-400 px-2 py-1 rounded-full">{t}</span>
          ))}
          {repo.topics.length>4 && <span className="text-[11px] text-zinc-500">+{repo.topics.length-4}</span>}
        </div>

        <div className="flex items-center gap-3 pt-2 mt-auto text-xs text-zinc-500 border-t border-[#1f1f2a]">
          <button
            onClick={async()=>{
              await toggleStar(repo.id)
              toast.success(repo.isStarredByMe ? 'Removed star' : 'Starred!')
            }}
            className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition",
              repo.isStarredByMe ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-[#1a1a24] border-[#232330] hover:border-zinc-600 text-zinc-400"
            )}>
            <Star size={12} className={repo.isStarredByMe ? 'fill-amber-400' : ''}/> {repo.stars}
          </button>
          <span className="flex items-center gap-1"><GitFork size={12}/> {repo.forks}</span>
          <span className="flex items-center gap-1"><Eye size={12}/> {repo.watchers}</span>
          <Link to={`/repos/${repo.id}`} className="ml-auto flex items-center gap-1 text-zinc-300 hover:text-white font-medium"><BookOpen size={12}/> README</Link>
          <button onClick={async()=>{
            await forkRepo(repo.id)
            toast.success('Forked to your account')
          }} className="hidden sm:inline-flex text-zinc-400 hover:text-white">Fork</button>
        </div>
      </div>
    </div>
  )
}

export function RepoSkeleton() {
  return (
    <div className="bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-[160px] shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#1a1a24] rounded w-3/4" />
        <div className="h-3 bg-[#1a1a24] rounded w-full" />
        <div className="h-3 bg-[#1a1a24] rounded w-2/3" />
      </div>
    </div>
  )
}

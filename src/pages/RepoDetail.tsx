import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { formatRelative, languageColors, cn } from '../lib/utils'
import { Star, GitFork, Eye, BookOpen, Settings, Trash2, Pencil, Pin, Lock, Archive, Copy, History, FileImage, Sparkles, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function RepoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const repos = useStore(s=>s.repos)
  const updateRepo = useStore(s=>s.updateRepo)
  const deleteRepo = useStore(s=>s.deleteRepo)
  const toggleStar = useStore(s=>s.toggleStar)
  const togglePin = useStore(s=>s.togglePin)
  const forkRepo = useStore(s=>s.forkRepo)

  const repo = repos.find(r=>r.id===id)
  const [tab, setTab] = useState<'readme'|'files'|'commits'|'settings'>('readme')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ displayName: repo?.displayName || '', description: repo?.description || '', readme: repo?.readme || '' })

  if (!repo) return (
    <div className="bg-[#111119] border border-[#232330] rounded-2xl p-12 text-center">
      <p className="text-zinc-400">Repository not found</p>
      <Link to="/repos" className="text-rose-400 text-sm">← Back to repos</Link>
    </div>
  )

  return (
    <div className="space-y-4">
      <Link to="/repos" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={14}/> Back to repositories</Link>

      {/* header */}
      <div className="bg-[#111119] border border-[#232330] rounded-[20px] overflow-hidden">
        <div className="h-[180px] relative">
          <img src={repo.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111119] via-[#111119]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("w-2.5 h-2.5 rounded-full", languageColors[repo.language])} />
                  <span className="text-xs bg-black/50 backdrop-blur border border-white/10 text-white px-2 py-1 rounded-full">{repo.language}</span>
                  {repo.visibility==='private' ? <span className="text-xs bg-zinc-800 text-white px-2 py-1 rounded-full flex items-center gap-1"><Lock size={10}/> Private</span> : <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full">Public</span>}
                  {repo.archived && <span className="text-xs bg-zinc-700 text-white px-2 py-1 rounded-full flex items-center gap-1"><Archive size={10}/> Archived</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 tracking-tight">{repo.displayName}</h1>
                <p className="text-sm text-white/70 font-mono">{repo.name} • Updated {formatRelative(repo.updatedAt)} • {repo.fileCount} files</p>
              </div>
              <div className="hidden md:flex gap-2">
                <button onClick={async()=>{await toggleStar(repo.id); toast.success(repo.isStarredByMe ? 'Unstarred' : 'Starred')}} className={cn("rounded-full px-4 py-2 text-sm font-medium border flex items-center gap-1.5", repo.isStarredByMe ? "bg-amber-500 text-black border-amber-500" : "bg-[#1a1a24] text-white border-[#232330] hover:bg-[#232330]")}>
                  <Star size={14} className={repo.isStarredByMe ? 'fill-black' : ''}/> {repo.isStarredByMe ? 'Starred' : 'Star'} {repo.stars}
                </button>
                <button onClick={async()=>{await forkRepo(repo.id); toast.success('Forked')}} className="bg-white text-black rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5"><GitFork size={14}/> Fork {repo.forks}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 flex flex-wrap items-center gap-4 border-t border-[#232330] bg-[#0f0f15]">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Eye size={12}/> {repo.watchers} watching • <Copy size={12}/> {repo.size} • <FileImage size={12}/> {repo.fileCount} files
          </div>
          <div className="flex gap-1 ml-auto">
            <button onClick={async()=>{await togglePin(repo.id); toast.success(repo.pinned ? 'Unpinned' : 'Pinned to dashboard')}} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1", repo.pinned ? "bg-amber-500 text-black border-amber-500" : "bg-[#1a1a24] text-zinc-400 border-[#232330]")}><Pin size={12}/> {repo.pinned ? 'Pinned' : 'Pin'}</button>
            <button onClick={()=>setEditing(!editing)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1a1a24] border border-[#232330] text-zinc-300 flex items-center gap-1"><Pencil size={12}/> Edit</button>
          </div>
        </div>

        <div className="px-2 flex gap-1 border-t border-[#232330] overflow-auto">
          {[
            { id:'readme', label:'README', icon: BookOpen },
            { id:'files', label:'Files', icon: FileImage },
            { id:'commits', label:'Commits', icon: History },
            { id:'settings', label:'Settings', icon: Settings },
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as any)} className={cn("px-4 py-3 text-sm font-medium flex items-center gap-1.5 border-b-2 whitespace-nowrap", tab===t.id ? "border-rose-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300")}>
              <t.icon size={14}/> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* editing */}
      {editing && (
        <div className="bg-[#111119] border border-[#232330] rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-white">Edit repository</h3>
          <input value={editForm.displayName} onChange={e=>setEditForm({...editForm, displayName:e.target.value})} className="w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm" placeholder="Display name" />
          <input value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} className="w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm" placeholder="Description" />
          <textarea value={editForm.readme} onChange={e=>setEditForm({...editForm, readme:e.target.value})} rows={6} className="w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 text-sm font-mono" />
          <div className="flex gap-2">
            <button onClick={async()=>{
              await updateRepo(repo.id, { displayName: editForm.displayName, description: editForm.description, readme: editForm.readme })
              toast.success('Saved')
              setEditing(false)
            }} className="bg-white text-black rounded-full px-4 py-2 text-sm font-medium">Save</button>
            <button onClick={()=>setEditing(false)} className="px-4 py-2 text-sm text-zinc-400">Cancel</button>
          </div>
        </div>
      )}

      {/* content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="min-w-0">
          {tab==='readme' && (
            <div className="bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#232330] flex items-center gap-2 text-sm font-medium text-white bg-[#0f0f15]"><BookOpen size={14}/> README.md</div>
              <div className="p-6">
                <div className="markdown" dangerouslySetInnerHTML={{ __html: markdownToHtml(repo.readme) }} />
                <div className="mt-6 pt-6 border-t border-[#232330]">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Topics</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {repo.topics.map(t=><span key={t} className="text-xs bg-[#1a1a24] border border-[#232330] text-zinc-400 px-2.5 py-1 rounded-full">#{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab==='files' && (
            <div className="bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#232330] flex items-center justify-between bg-[#0f0f15]">
                <span className="text-sm font-medium text-white flex items-center gap-2"><FileImage size={14}/> Files • {repo.fileCount}</span>
                <span className="text-xs text-zinc-500">{repo.size}</span>
              </div>
              <div className="divide-y divide-[#1f1f2a]">
                {[
                  { name: '01-golden-hour', type:'folder', count: 24 },
                  { name: '02-shadow-play', type:'folder', count: 16 },
                  { name: '03-details', type:'folder', count: 8 },
                  { name: 'cover.jpg', type:'file', size:'4.2 MB' },
                  { name: 'README.md', type:'file', size:'2.1 KB' },
                  { name: 'LICENSE', type:'file', size:'1.1 KB' },
                ].map(f=>(
                  <div key={f.name} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02]">
                    <span className={f.type==='folder' ? 'text-amber-400' : 'text-zinc-500'}>{f.type==='folder' ? '📁' : '📄'}</span>
                    <span className="text-sm text-white font-mono flex-1">{f.name}</span>
                    <span className="text-xs text-zinc-500">{'count' in f ? `${f.count} files` : f.size}</span>
                    <span className="text-xs text-zinc-600">2 hours ago</span>
                  </div>
                ))}
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                {repo.images.map((img,i)=>(
                  <img key={i} src={img} alt="" className="w-full h-[120px] object-cover rounded-xl border border-[#232330]" />
                ))}
                <div className="h-[120px] rounded-xl border border-dashed border-[#2a2a3a] grid place-items-center text-zinc-500 text-xs bg-[#0a0a0f]">
                  + Upload files
                </div>
              </div>
            </div>
          )}

          {tab==='commits' && (
            <div className="bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#232330] bg-[#0f0f15] text-sm font-medium text-white flex items-center gap-2"><History size={14}/> Commit history</div>
              <div className="divide-y divide-[#1f1f2a]">
                {repo.commits.map(c=>(
                  <div key={c.id} className="px-5 py-4 flex gap-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" className="w-8 h-8 rounded-full" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{c.message}</div>
                      <div className="text-xs text-zinc-500">{c.author} committed {formatRelative(c.date)} • {c.filesChanged} files changed</div>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 bg-[#0a0a0f] border border-[#232330] rounded-full px-2 py-1 h-fit">{c.id}</span>
                  </div>
                ))}
                {repo.commits.length===0 && <div className="p-8 text-center text-sm text-zinc-500">No commits yet. Push your first commit.</div>}
              </div>
            </div>
          )}

          {tab==='settings' && (
            <div className="bg-[#111119] border border-[#232330] rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-white">General</h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#232330] rounded-xl p-4">
                    <div>
                      <div className="text-sm font-medium text-white">Visibility</div>
                      <div className="text-xs text-zinc-500">Current: {repo.visibility}</div>
                    </div>
                    <select value={repo.visibility} onChange={async e=>{await updateRepo(repo.id, { visibility: e.target.value as any }); toast.success('Visibility updated')}} className="bg-[#1a1a24] border border-[#232330] rounded-full px-3 py-2 text-sm">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="unlisted">Unlisted</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#232330] rounded-xl p-4">
                    <div>
                      <div className="text-sm font-medium text-white">{repo.archived ? 'Unarchive' : 'Archive'} repository</div>
                      <div className="text-xs text-zinc-500">Archived repos are read-only</div>
                    </div>
                    <button onClick={async()=>{await updateRepo(repo.id, { archived: !repo.archived}); toast.success(repo.archived ? 'Unarchived' : 'Archived')}} className={`rounded-full px-4 py-2 text-sm font-medium border ${repo.archived ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[#1a1a24] text-white border-[#232330]'}`}>{repo.archived ? 'Unarchive' : 'Archive'}</button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#232330] pt-6">
                <h3 className="font-semibold text-rose-400">Danger zone</h3>
                <div className="mt-3 bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Delete this repository</div>
                    <div className="text-xs text-zinc-500">Once deleted, it cannot be recovered.</div>
                  </div>
                  <button onClick={async()=>{
                    if (!confirm(`Delete ${repo.displayName}?`)) return
                    await deleteRepo(repo.id)
                    toast.success('Repository deleted')
                    navigate('/repos')
                  }} className="bg-rose-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-rose-700 flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* sidebar */}
        <div className="space-y-4">
          <div className="bg-[#111119] border border-[#232330] rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-white">About</h4>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{repo.longDescription}</p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-zinc-500">License</span><span className="text-white">{repo.license}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Stars</span><span className="text-white">{repo.stars}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Forks</span><span className="text-white">{repo.forks}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Created</span><span className="text-white">{new Date(repo.createdAt).toLocaleDateString()}</span></div>
            </div>
            <button className="w-full mt-4 bg-white text-black rounded-full py-2 text-sm font-medium flex items-center justify-center gap-1"><Sparkles size={14}/> Book this style</button>
          </div>

          <div className="bg-[#111119] border border-[#232330] rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-white">Clone</h4>
            <div className="mt-3 space-y-2">
              <div className="bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-500">https://</span><span className="text-white truncate">nackedei4all.studio/{repo.name}.git</span>
                <button onClick={()=>{navigator.clipboard.writeText(`https://nackedei4all.studio/${repo.name}.git`); toast.success('Copied')}} className="ml-auto bg-[#1a1a24] border border-[#232330] rounded-full p-1.5"><Copy size={12}/></button>
              </div>
              <p className="text-xs text-zinc-500">Use this URL to “clone” the gallery to your favorites (fork).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function markdownToHtml(md: string) {
  let html = md
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/---/g, '<hr/>')
    .replace(/> (.*)/g, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '</p><p>')
  // wrap in p if not heading
  if (!html.startsWith('<h')) html = '<p>' + html + '</p>'
  html = html.replace(/<p><h/g, '<h').replace(/<\/h(\d)><\/p>/g, '</h$1>')
  html = html.replace(/<li>/g, '<ul><li>').replace(/<\/li>\n<ul><li>/g, '</li><li>')
  // simple link
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return html
}

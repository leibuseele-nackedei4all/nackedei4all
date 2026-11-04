import { useState } from 'react'
import { useStore } from '../lib/store'
import { EmptyState } from '../components/ui'
import { Mail, Search, Archive, Trash2, Reply, Check, Star, Inbox as InboxIcon } from 'lucide-react'
import { formatRelative } from '../lib/utils'
import { toast } from 'sonner'

export function InboxPage() {
  const messages = useStore(s=>s.messages)
  const updateMessage = useStore(s=>s.updateMessage)
  const deleteMessage = useStore(s=>s.deleteMessage)
  const replyMessage = useStore(s=>s.replyMessage)
  const createMessage = useStore(s=>s.createMessage)

  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id || null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all'|'open'|'closed'>('all')
  const [reply, setReply] = useState('')
  const selected = messages.find(m=>m.id===selectedId) || null

  const filtered = messages.filter(m=>{
    if (filter!=='all' && m.status!==filter) return false
    if (q && !m.subject.toLowerCase().includes(q.toLowerCase()) && !m.fromName.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Inbox</h1>
          <p className="text-sm text-zinc-500">Messages from the WordPress contact form — now threads like GitHub issues.</p>
        </div>
        <button onClick={async()=>{
          const name = prompt('Your name?')
          if (!name) return
          const subject = prompt('Subject?') || 'New inquiry'
          const body = prompt('Message?') || 'Hello!'
          await createMessage({ fromName: name, fromEmail: `${name.toLowerCase().replace(/\s+/g,'.')}@example.com`, subject, body, priority: 'medium' } as any)
          toast.success('Message sent')
        }} className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium">New message</button>
      </div>

      <div className="bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* list */}
        <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-[#232330] flex flex-col">
          <div className="p-3 border-b border-[#232330] flex gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search messages…" className="w-full bg-[#0a0a0f] border border-[#232330] rounded-full pl-8 pr-3 py-2 text-xs placeholder:text-zinc-600 focus:outline-none" />
            </div>
            <div className="flex bg-[#0a0a0f] border border-[#232330] rounded-full p-0.5">
              {(['all','open','closed'] as const).map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${filter===f ? 'bg-white text-black' : 'text-zinc-500'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filtered.length===0 ? (
              <EmptyState icon={<InboxIcon size={18}/>} title="No messages" desc="No messages match your filter." />
            ) : filtered.map(m=>(
              <button
                key={m.id}
                onClick={()=>{setSelectedId(m.id); if (!m.read) updateMessage(m.id, { read: true })}}
                className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-white/[0.03] border-b border-[#1f1f2a] transition ${selectedId===m.id ? 'bg-[#1a1a24] border-l-2 border-l-rose-500' : ''} ${!m.read ? 'bg-white/[0.02]' : ''}`}
              >
                <img src={m.avatar || `https://i.pravatar.cc/100?u=${m.id}`} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm truncate ${!m.read ? 'font-semibold text-white' : 'font-medium text-zinc-300'}`}>{m.fromName}</span>
                    {!m.read && <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0"/>}
                    <span className="ml-auto text-[11px] text-zinc-500">{formatRelative(m.createdAt)}</span>
                  </div>
                  <div className={`text-xs truncate ${!m.read ? 'text-white' : 'text-zinc-400'}`}>{m.subject}</div>
                  <div className="text-xs text-zinc-500 truncate">{m.body}</div>
                  <div className="flex gap-1 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${m.priority==='high'?'bg-rose-500/10 text-rose-400 border-rose-500/20': m.priority==='medium'?'bg-amber-500/10 text-amber-400 border-amber-500/20':'bg-zinc-700 text-zinc-300 border-transparent'}`}>{m.priority}</span>
                    {m.repoId && <span className="text-[10px] bg-[#1a1a24] border border-[#232330] px-1.5 py-0.5 rounded-full text-zinc-400">repo</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 grid place-items-center p-8">
              <EmptyState icon={<Mail size={20}/>} title="Select a message" desc="Choose a thread from the left to read and reply." />
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-[#232330] flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-semibold text-white leading-tight">{selected.subject}</h2>
                  <p className="text-xs text-zinc-500 mt-1">From {selected.fromName} &lt;{selected.fromEmail}&gt; • {formatRelative(selected.createdAt)} • {selected.status}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={async()=>{await updateMessage(selected.id, { status: selected.status==='open' ? 'closed' : 'open'}); toast.success('Status updated')}} className="p-2 hover:bg-white/5 rounded-full" title="Toggle status"><Check size={16}/></button>
                  <button onClick={async()=>{await updateMessage(selected.id, { status:'archived'}); toast.success('Archived')}} className="p-2 hover:bg-white/5 rounded-full"><Archive size={16}/></button>
                  <button onClick={async()=>{if(confirm('Delete?')){await deleteMessage(selected.id); toast.success('Deleted'); setSelectedId(null)}} } className="p-2 hover:bg-white/5 rounded-full text-rose-400"><Trash2 size={16}/></button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 space-y-4">
                <div className="bg-[#0a0a0f] border border-[#232330] rounded-2xl p-4">
                  <div className="flex gap-3">
                    <img src={selected.avatar || `https://i.pravatar.cc/100?u=${selected.id}`} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{selected.fromName}</span>
                        <span className="text-xs bg-[#1a1a24] border border-[#232330] rounded-full px-2 py-0.5">{selected.fromEmail}</span>
                        <span className="text-xs text-zinc-500 ml-auto">{new Date(selected.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-zinc-300 mt-2 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
                    </div>
                  </div>
                </div>

                {selected.replies.map(r=>(
                  <div key={r.id} className="bg-[#1a1a24] border border-[#232330] rounded-2xl p-4">
                    <div className="flex gap-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" className="w-8 h-8 rounded-full object-cover" alt="" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{r.author}</span>
                          <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">OWNER</span>
                          <span className="text-xs text-zinc-500 ml-auto">{formatRelative(r.date)}</span>
                        </div>
                        <p className="text-sm text-zinc-300 mt-2 whitespace-pre-wrap">{r.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#232330] bg-[#0f0f15]">
                <div className="flex gap-2">
                  <input
                    value={reply}
                    onChange={e=>setReply(e.target.value)}
                    placeholder="Write a reply…"
                    className="flex-1 bg-[#111119] border border-[#232330] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                    onKeyDown={async e=>{
                      if (e.key==='Enter' && reply.trim()) {
                        await replyMessage(selected.id, reply)
                        setReply('')
                        toast.success('Replied')
                      }
                    }}
                  />
                  <button
                    onClick={async()=>{ if (!reply.trim()) return; await replyMessage(selected.id, reply); setReply(''); toast.success('Replied')}}
                    className="bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 flex items-center gap-1.5"
                  ><Reply size={14}/> Reply</button>
                </div>
                <div className="text-xs text-zinc-600 mt-2">Press Enter to send • Be kind, consent-first replies only</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

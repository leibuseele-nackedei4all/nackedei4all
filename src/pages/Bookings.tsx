import { useState } from 'react'
import { useStore } from '../lib/store'
import { EmptyState, Input, Textarea, Select } from '../components/ui'
import { CalendarCheck, Plus, X, Clock, Mail, Phone, Trash2, Check, Ban } from 'lucide-react'
import { formatRelative } from '../lib/utils'
import { toast } from 'sonner'

const services = ['Tee & Kuchen','Foto Session','Öl Massage','Private Session','Workshop'] as const

export function BookingsPage() {
  const bookings = useStore(s=>s.bookings)
  const createBooking = useStore(s=>s.createBooking)
  const updateBooking = useStore(s=>s.updateBooking)
  const deleteBooking = useStore(s=>s.deleteBooking)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'kanban'|'list'>('kanban')

  const filtered = filter==='all' ? bookings : bookings.filter(b=>b.status===filter)

  const columns: Record<string, typeof bookings> = {
    pending: filtered.filter(b=>b.status==='pending'),
    confirmed: filtered.filter(b=>b.status==='confirmed'),
    completed: filtered.filter(b=>b.status==='completed'),
    cancelled: filtered.filter(b=>b.status==='cancelled'),
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bookings</h1>
          <p className="text-sm text-zinc-500">From the WordPress form — now a kanban board. Manage Tee trinken, Foto Sessions, Öl Massage & more.</p>
        </div>
        <button onClick={()=>setShowCreate(true)} className="bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 inline-flex items-center gap-2"><Plus size={16}/> New booking</button>
      </div>

      <div className="bg-[#111119] border border-[#232330] rounded-2xl p-3 flex flex-wrap gap-2">
        <div className="flex gap-1 bg-[#0a0a0f] border border-[#232330] rounded-full p-1">
          {['all','pending','confirmed','completed','cancelled'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${filter===f ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>{f} {f!=='all' && `(${bookings.filter(b=>b.status===f).length})`}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-1 bg-[#0a0a0f] border border-[#232330] rounded-full p-1">
          <button onClick={()=>setView('kanban')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${view==='kanban' ? 'bg-white text-black' : 'text-zinc-400'}`}>Kanban</button>
          <button onClick={()=>setView('list')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${view==='list' ? 'bg-white text-black' : 'text-zinc-400'}`}>List</button>
        </div>
      </div>

      {filtered.length===0 ? (
        <div className="bg-[#111119] border border-[#232330] rounded-2xl">
          <EmptyState icon={<CalendarCheck size={20}/>} title="No bookings found" desc="Create a booking or adjust filters." action={<button onClick={()=>setShowCreate(true)} className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium">New booking</button>} />
        </div>
      ) : view==='kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.entries(columns).map(([status, list])=>(
            <div key={status} className="bg-[#111119] border border-[#232330] rounded-2xl p-3">
              <div className="flex items-center gap-2 px-2 py-1">
                <span className={`w-2 h-2 rounded-full ${status==='pending'?'bg-amber-500':status==='confirmed'?'bg-emerald-500':status==='completed'?'bg-violet-500':'bg-zinc-600'}`} />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{status}</span>
                <span className="ml-auto text-xs bg-[#0a0a0f] border border-[#232330] rounded-full px-2 py-0.5">{list.length}</span>
              </div>
              <div className="mt-3 space-y-3 min-h-[200px]">
                {list.map(b=>(
                  <div key={b.id} className="bg-[#0a0a0f] border border-[#232330] rounded-xl p-3 hover:border-zinc-700 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={b.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'} className="w-7 h-7 rounded-full object-cover" alt="" />
                        <div>
                          <div className="text-sm font-medium text-white">{b.clientName}</div>
                          <div className="text-xs text-zinc-500">{b.clientEmail}</div>
                        </div>
                      </div>
                      <button onClick={async()=>{ if (confirm('Delete?')) { await deleteBooking(b.id); toast.success('Booking deleted')}}} className="p-1 hover:bg-white/5 rounded-full text-zinc-500"><Trash2 size={12}/></button>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 bg-[#1a1a24] border border-[#232330] rounded-full px-2 py-1 text-xs font-medium text-zinc-300">{b.service}</div>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{b.message}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                      <Clock size={10}/> {new Date(b.date).toLocaleDateString()} {b.time && `• ${b.time}`}
                    </div>
                    <div className="mt-3 flex gap-1">
                      {status!=='confirmed' && <button onClick={async()=>{await updateBooking(b.id, { status:'confirmed'}); toast.success('Confirmed')}} className="flex-1 bg-emerald-500 text-white rounded-full py-1.5 text-xs font-medium flex items-center justify-center gap-1"><Check size={12}/> Confirm</button>}
                      {status!=='completed' && status==='confirmed' && <button onClick={async()=>{await updateBooking(b.id, { status:'completed'}); toast.success('Marked completed')}} className="flex-1 bg-violet-600 text-white rounded-full py-1.5 text-xs font-medium">Complete</button>}
                      {status!=='cancelled' && <button onClick={async()=>{await updateBooking(b.id, { status:'cancelled'}); toast.success('Cancelled')}} className="flex-1 bg-[#1a1a24] border border-[#232330] text-zinc-300 rounded-full py-1.5 text-xs font-medium flex items-center justify-center gap-1"><Ban size={12}/> Cancel</button>}
                    </div>
                    {b.price && <div className="text-xs text-zinc-500 mt-2">{b.price} • {formatRelative(b.createdAt)}</div>}
                  </div>
                ))}
                {list.length===0 && <div className="text-xs text-zinc-600 text-center py-8">No {status}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111119] border border-[#232330] rounded-2xl overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0f0f15] border-b border-[#232330] text-xs text-zinc-500 uppercase tracking-widest">
                <tr><th className="text-left px-4 py-3">Client</th><th className="text-left px-4 py-3">Service</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f2a]">
                {filtered.map(b=>(
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={b.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'} className="w-7 h-7 rounded-full object-cover" alt="" />
                        <div>
                          <div className="font-medium text-white">{b.clientName}</div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1"><Mail size={10}/> {b.clientEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="bg-[#1a1a24] border border-[#232330] rounded-full px-2.5 py-1 text-xs">{b.service}</span></td>
                    <td className="px-4 py-3 text-zinc-400">{new Date(b.date).toLocaleDateString()} {b.time && `• ${b.time}`}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium border ${b.status==='confirmed'?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': b.status==='pending'?'bg-amber-500/10 text-amber-400 border-amber-500/20': b.status==='completed'?'bg-violet-500/10 text-violet-400 border-violet-500/20':'bg-zinc-700 text-zinc-300'}`}>{b.status}</span></td>
                    <td className="px-4 py-3 text-right flex justify-end gap-1">
                      <button onClick={async()=>{await updateBooking(b.id, { status: b.status==='pending' ? 'confirmed' : 'completed'}); toast.success('Updated')}} className="p-2 hover:bg-white/5 rounded-full"><Check size={14}/></button>
                      <button onClick={async()=>{ await deleteBooking(b.id); toast.success('Deleted')}} className="p-2 hover:bg-white/5 rounded-full text-rose-400"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && <BookingModal onClose={()=>setShowCreate(false)} onCreate={async (d)=>{ await createBooking(d); toast.success('Booking created'); setShowCreate(false)}} />}
    </div>
  )
}

function BookingModal({ onClose, onCreate }: { onClose: ()=>void; onCreate: (d:any)=>void }) {
  const [form, setForm] = useState({ clientName:'', clientEmail:'', clientPhone:'', date:'', time:'', service:'Foto Session' as any, message:'', status:'pending' as any })
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="w-full max-w-lg bg-[#111119] border border-[#232330] rounded-[24px] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[#232330] flex items-center justify-between">
          <h3 className="font-semibold text-white">New booking</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-3 overflow-auto">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-zinc-400">Name *</label><Input value={form.clientName} onChange={e=>setForm({...form, clientName:e.target.value})} placeholder="Your name" /></div>
            <div><label className="text-xs text-zinc-400">Email *</label><Input value={form.clientEmail} onChange={e=>setForm({...form, clientEmail:e.target.value})} placeholder="you@example.com" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-zinc-400">Phone</label><Input value={form.clientPhone} onChange={e=>setForm({...form, clientPhone:e.target.value})} placeholder="+49 ..." /></div>
            <div><label className="text-xs text-zinc-400">Service</label>
              <Select value={form.service} onChange={e=>setForm({...form, service:e.target.value})}>
                {services.map(s=><option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-zinc-400">Date *</label><Input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} /></div>
            <div><label className="text-xs text-zinc-400">Time</label><Input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} /></div>
          </div>
          <div><label className="text-xs text-zinc-400">Message</label><Textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Tell us about your request… (the original WordPress form had: Tee trinken, Foto Session, Öl Massage, …)" /></div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
            Original WordPress form options: <strong>Tee trinken und Kuchen essen</strong> • Foto Session • Öl Massage • Richtig Geil und versaut Vögeln! — we keep the first three as tasteful services and map the last to Private Session (consensual, 18+).
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#232330] flex justify-end gap-2 bg-[#0f0f15]">
          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400">Cancel</button>
          <button disabled={!form.clientName || !form.clientEmail || !form.date} onClick={()=>onCreate({ ...form, date: new Date(form.date).toISOString(), price: form.service==='Tee & Kuchen' ? '—' : '€250', avatar: undefined })} className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50">Create booking</button>
        </div>
      </div>
    </div>
  )
}

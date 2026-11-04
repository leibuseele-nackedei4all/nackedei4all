import { Link } from 'react-router-dom'
import { Star, GitFork, Eye, Calendar, Mail, TrendingUp, BookOpen, ArrowUpRight, Clock, Zap, Users } from 'lucide-react'
import { useStore } from '../lib/store'
import { formatRelative } from '../lib/utils'
import { Card } from '../components/ui'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', views: 240 },
  { name: 'Tue', views: 390 },
  { name: 'Wed', views: 320 },
  { name: 'Thu', views: 520 },
  { name: 'Fri', views: 610 },
  { name: 'Sat', views: 480 },
  { name: 'Sun', views: 550 },
]

export function Dashboard() {
  const repos = useStore(s=>s.repos)
  const bookings = useStore(s=>s.bookings)
  const messages = useStore(s=>s.messages)
  const activity = useStore(s=>s.activity)

  const totalStars = repos.reduce((a,b)=>a+b.stars,0)
  const totalForks = repos.reduce((a,b)=>a+b.forks,0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* hero */}
      <div className="relative overflow-hidden rounded-[24px] border border-[#232330] bg-gradient-to-br from-[#1a1a24] via-[#1a1630] to-[#0f0f15] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,63,94,0.15),transparent_50%)]" />
        <div className="relative flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-full px-3 py-1 text-xs text-white"><Zap size={12} className="text-amber-400"/> Migrated from WordPress • Live</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-3">Good evening, zZinuZz</h1>
            <p className="text-zinc-400 mt-2 max-w-xl leading-relaxed">Your WordPress archive is now a living GitHub-style studio. 12 repositories, 7 upcoming bookings, and 3 unread messages. Keep creating.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link to="/repos" className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium hover:bg-zinc-200 inline-flex items-center gap-1.5">Browse repos <ArrowUpRight size={14}/></Link>
              <Link to="/bookings" className="bg-white/10 backdrop-blur border border-white/10 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-white/15">View bookings</Link>
            </div>
          </div>
          <div className="lg:w-[360px] shrink-0">
            <div className="bg-black/30 backdrop-blur rounded-2xl border border-white/10 p-4">
              <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Today</div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { label: 'Stars', value: totalStars, icon: Star },
                  { label: 'Forks', value: totalForks, icon: GitFork },
                  { label: 'Views', value: '4.2k', icon: Eye },
                ].map(s=>(
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <s.icon size={14} className="text-zinc-400"/>
                    <div className="text-lg font-bold text-white mt-1">{s.value}</div>
                    <div className="text-xs text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400"><Clock size={12}/> Last publish 2 hours ago • <span className="text-emerald-400">● live</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-300">Total repositories</div>
            <BookOpen size={16} className="text-zinc-500"/>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{repos.length}</div>
          <div className="text-xs text-zinc-500 mt-1"><span className="text-emerald-400">↗ +2</span> this week • {repos.filter(r=>r.visibility==='private').length} private</div>
          <div className="mt-3 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="views" fill="#f43f5e" radius={[4,4,0,0]} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background:'#14141c', border:'1px solid #232330', borderRadius:12, color:'#fff' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-300">Bookings</div>
            <Calendar size={16} className="text-zinc-500"/>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{bookings.length}</div>
          <div className="text-xs text-zinc-500 mt-1">{bookings.filter(b=>b.status==='pending').length} pending • {bookings.filter(b=>b.status==='confirmed').length} confirmed</div>
          <div className="mt-4 space-y-2">
            {bookings.slice(0,3).map(b=>(
              <div key={b.id} className="flex items-center gap-2 bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2">
                <img src={b.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'} className="w-6 h-6 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{b.clientName} • {b.service}</div>
                  <div className="text-[11px] text-zinc-500">{new Date(b.date).toLocaleDateString()} • {b.status}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${b.status==='confirmed'?'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20': b.status==='pending'?'bg-amber-500/15 text-amber-400 border border-amber-500/20':'bg-zinc-700 text-zinc-300'}`}>{b.status}</span>
              </div>
            ))}
            <Link to="/bookings" className="text-xs text-rose-400 hover:text-rose-300 font-medium">View all bookings →</Link>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-300">Inbox</div>
            <Mail size={16} className="text-zinc-500"/>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{messages.filter(m=>!m.read).length} unread</div>
          <div className="text-xs text-zinc-500 mt-1">{messages.length} total • {messages.filter(m=>m.status==='open').length} open</div>
          <div className="mt-4 space-y-2">
            {messages.slice(0,3).map(m=>(
              <div key={m.id} className="bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2">
                <div className="text-xs font-medium text-white truncate">{m.subject}</div>
                <div className="text-[11px] text-zinc-500 truncate">{m.fromName} • {formatRelative(m.createdAt)}</div>
              </div>
            ))}
            <Link to="/inbox" className="text-xs text-rose-400 hover:text-rose-300 font-medium">Open inbox →</Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-6">
        {/* pinned */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2"><TrendingUp size={16} className="text-rose-500"/> Pinned repositories</h3>
            <Link to="/repos" className="text-xs text-zinc-400 hover:text-white">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {repos.filter(r=>r.pinned).slice(0,4).map(r=>(
              <Link key={r.id} to={`/repos/${r.id}`} className="bg-[#0a0a0f] border border-[#232330] rounded-xl p-4 hover:border-zinc-600 transition group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-mono text-zinc-500">{r.name}</span>
                  <span className="ml-auto text-xs bg-[#1a1a24] border border-[#232330] rounded-full px-2 py-0.5">{r.language}</span>
                </div>
                <div className="font-medium text-white mt-2 line-clamp-1 group-hover:text-rose-400">{r.displayName}</div>
                <div className="text-xs text-zinc-500 line-clamp-2 mt-1">{r.description}</div>
                <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Star size={12}/> {r.stars}</span>
                  <span className="flex items-center gap-1"><GitFork size={12}/> {r.forks}</span>
                  <span className="ml-auto">{formatRelative(r.updatedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* activity */}
        <Card className="p-5">
          <h3 className="font-semibold text-white flex items-center gap-2"><Users size={16} className="text-violet-500"/> Recent activity</h3>
          <div className="mt-4 space-y-3">
            {activity.map(a=>(
              <div key={a.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1a1a24] border border-[#232330] grid place-items-center shrink-0">
                  {a.type==='star' ? <Star size={12} className="text-amber-400"/> : a.type==='fork' ? <GitFork size={12} className="text-violet-400"/> : a.type==='booking' ? <Calendar size={12} className="text-emerald-400"/> : <Mail size={12} className="text-rose-400"/>}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-300"><span className="font-medium text-white">{a.actor}</span> {a.message}</div>
                  <div className="text-xs text-zinc-500">{formatRelative(a.time)} {a.repo && `• ${a.repo}`}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-[#0a0a0f] border border-[#232330] rounded-xl p-3">
            <div className="text-xs font-medium text-white">WordPress migration</div>
            <div className="text-xs text-zinc-500 mt-1">12 pages → 12 repos. 400+ media files preserved. OG links redirect to new studio.</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

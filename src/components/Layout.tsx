import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, BookOpen, Star, CalendarCheck, Mail, BarChart3, Settings,
  Search, Command, Bell, Plus, Menu, X, LogOut, Github, Sparkles, Shield
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useStore } from '../lib/store'
import { cn } from '../lib/utils'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { to: '/repos', icon: BookOpen, label: 'Repositories', badge: null },
  { to: '/starred', icon: Star, label: 'Starred', badge: null },
  { to: '/bookings', icon: CalendarCheck, label: 'Bookings', badge: null },
  { to: '/inbox', icon: Mail, label: 'Inbox', badge: 'inbox' },
  { to: '/insights', icon: BarChart3, label: 'Insights', badge: null },
  { to: '/settings', icon: Settings, label: 'Settings', badge: null },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showCmd, setShowCmd] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const bookings = useStore(s=>s.bookings)
  const messages = useStore(s=>s.messages)

  const inboxUnread = messages.filter(m=>!m.read && m.status==='open').length
  const pendingBookings = bookings.filter(b=>b.status==='pending').length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 flex">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={()=>setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#0f0f15] border-r border-[#232330] flex flex-col transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-[64px] px-5 flex items-center justify-between border-b border-[#232330]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white">N4</div>
            <div>
              <div className="font-semibold tracking-tight leading-none">nackedei4all</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Creator Studio</div>
            </div>
          </div>
          <button onClick={()=>setMobileOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg"><X size={16}/></button>
        </div>

        <div className="px-3 py-3">
          <button onClick={()=>navigate('/repos')} className="w-full flex items-center gap-2 bg-white text-black rounded-full px-4 py-2.5 text-sm font-medium hover:bg-zinc-200 transition">
            <Plus size={16}/> New repository
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {nav.map(item=>{
            const isActive = item.to==='/' ? location.pathname==='/' : location.pathname.startsWith(item.to)
            let badgeCount: number | null = null
            if (item.badge==='inbox') badgeCount = inboxUnread
            return (
              <NavLink key={item.to} to={item.to} onClick={()=>setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                  isActive ? "bg-[#1a1a24] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                )}>
                <item.icon size={16} className={isActive ? 'text-white' : 'text-zinc-500'} />
                <span className="flex-1 font-medium">{item.label}</span>
                {badgeCount ? <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{badgeCount}</span> : null}
                {item.label==='Bookings' && pendingBookings>0 && <span className="bg-amber-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pendingBookings}</span>}
              </NavLink>
            )
          })}

          <div className="pt-6 pb-2">
            <div className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2">Pinned repos</div>
            <PinnedList />
          </div>
        </nav>

        <div className="p-3 border-t border-[#232330]">
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#1f1a2e] border border-[#2a2a3a] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-amber-400"/> Pro unlocked</div>
            <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">Unlimited private repos & bookings. Manage your WordPress archive like code.</p>
          </div>
          <div className="flex items-center gap-3 mt-3 px-2">
            <img src={user?.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-zinc-500 truncate">@{user?.username}</div>
            </div>
            <button onClick={()=>{logout(); navigate('/login')}} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400"><LogOut size={16}/></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-[64px] bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#232330] sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6">
          <button onClick={()=>setMobileOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg"><Menu size={18}/></button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input placeholder="Search repositories, bookings, messages…" className="w-full bg-[#14141c] border border-[#232330] rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600" onFocus={()=>setShowCmd(true)} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-md px-1.5 py-0.5 text-[10px] text-zinc-500"><Command size={10}/>K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <Shield size={12} className="text-emerald-400"/> Adult • 18+ • Curated
            </div>
            <button className="relative p-2.5 bg-[#14141c] border border-[#232330] rounded-full hover:bg-[#1a1a24]">
              <Bell size={16} />
              {inboxUnread>0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0a0a0f]"/>}
            </button>
            <div className="w-px h-6 bg-[#232330] hidden sm:block" />
            <a href="https://github.com/leibuseele-nackedei4all/nackedei4all" target="_blank" className="hidden sm:flex items-center gap-2 text-xs bg-white text-black rounded-full px-3 py-2 font-medium hover:bg-zinc-200">
              <Github size={14}/> GitHub Repo
            </a>
            <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-[#232330]" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 bg-[#0a0a0f]">
          {children}
        </main>

        <footer className="px-6 py-4 border-t border-[#232330] text-xs text-zinc-500 flex flex-wrap gap-4">
          <span>© 2025 nackedei4all — Body-positive art. All models 18+.</span>
          <span className="ml-auto">Migrated from WordPress → GitHub Repos • Built with React + Tailwind</span>
        </footer>
      </div>

      {/* Command palette mock */}
      {showCmd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] p-4" onClick={()=>setShowCmd(false)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-lg bg-[#14141c] border border-[#2a2a3a] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#232330]">
              <Search size={16} className="text-zinc-500"/>
              <input autoFocus placeholder="Type a command or search…" className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500" />
              <span className="text-xs bg-[#1a1a24] border border-[#232330] rounded px-1.5 py-0.5">ESC</span>
            </div>
            <div className="p-2 text-sm">
              <div className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase px-2 py-2">Suggestions</div>
              {[
                'Go to Repositories',
                'New repository',
                'Search “bodyscape”',
                'View pending bookings (2)',
                'Open inbox (3 unread)',
              ].map(s=>(
                <div key={s} className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-2 text-zinc-300" onClick={()=>setShowCmd(false)}>
                  <Command size={12} className="text-zinc-600"/> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PinnedList() {
  const repos = useStore(s=>s.repos.filter(r=>r.pinned).slice(0,4))
  if (!repos.length) return <div className="px-3 text-xs text-zinc-600">No pinned repos</div>
  return (
    <div className="space-y-1">
      {repos.map(r=>(
        <a key={r.id} href={`#/repos/${r.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs">
          <BookOpen size={12} className="text-zinc-500"/>
          <span className="truncate text-zinc-400">{r.name}</span>
        </a>
      ))}
    </div>
  )
}

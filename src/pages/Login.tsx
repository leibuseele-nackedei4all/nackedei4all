import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Eye, Sparkles, Github, Shield, ArrowRight, User, Lock } from 'lucide-react'
import { toast } from 'sonner'

export function LoginPage() {
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('studio@nackedei4all.de')
  const [password, setPassword] = useState('demo123')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginDemo, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode==='login') await login(email, password)
      else await register(name, email, password)
      toast.success(mode==='login' ? 'Welcome back!' : 'Account created')
      navigate('/')
    } catch (err:any) {
      toast.error(err.message || 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* left */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-fuchsia-600 to-amber-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&h=1000&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          <div className="flex items-center gap-2 font-semibold"><div className="w-8 h-8 rounded-lg bg-white text-black grid place-items-center font-bold">N4</div> nackedei4all</div>
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1 text-xs border border-white/20"><Sparkles size={12}/> WordPress → GitHub Repos</div>
            <h1 className="text-5xl font-bold leading-[0.95] mt-4 tracking-tight">Where<br/>body is<br/><span className="text-white/80">repository</span></h1>
            <p className="mt-4 text-white/80 max-w-md leading-relaxed">The WordPress archive transformed into a creator studio. Manage galleries like code — commit, star, fork, book.</p>
            <div className="mt-6 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/10"><Shield size={12}/> 18+ • Consent-first</span>
              <span className="flex items-center gap-1 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/10"><Eye size={12}/> Body-positive art</span>
            </div>
          </div>
          <div className="text-xs text-white/60">Migrated from nackedei4all.wordpress.com • 12 repos • 412 files • Koblenz</div>
        </div>
      </div>

      {/* right */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0a0f]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 font-semibold text-white mb-8"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 grid place-items-center font-bold">N4</div> nackedei4all <span className="text-zinc-500 font-normal">— Creator Studio</span></div>

          <div className="bg-[#111119] border border-[#232330] rounded-[24px] p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white">{mode==='login' ? 'Welcome back' : 'Create account'}</h2>
            <p className="text-sm text-zinc-500 mt-1">{mode==='login' ? 'Sign in to your studio' : 'Join the community'}</p>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button onClick={()=>{loginDemo('creator'); toast.success('Signed in as creator'); navigate('/')}} className="bg-white text-black rounded-full py-2.5 text-sm font-medium hover:bg-zinc-200 flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-amber-500" /> Demo creator
              </button>
              <button onClick={()=>{loginDemo('fan'); toast.success('Signed in as guest'); navigate('/')}} className="bg-[#1a1a24] border border-[#232330] text-white rounded-full py-2.5 text-sm font-medium hover:bg-[#232330] flex items-center justify-center gap-2">
                <User size={14}/> Guest explore
              </button>
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#232330]" />
              <span className="text-xs text-zinc-500">or continue with email</span>
              <div className="flex-1 h-px bg-[#232330]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode==='register' && (
                <div>
                  <label className="text-xs font-medium text-zinc-400">Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="mt-1 w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-600" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-zinc-400">Email</label>
                <div className="relative mt-1">
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="studio@nackedei4all.de" className="w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2.5 text-sm pl-9 focus:outline-none focus:border-zinc-600" />
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">Password</label>
                <div className="relative mt-1">
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#0a0a0f] border border-[#232330] rounded-xl px-3 py-2.5 text-sm pl-9 focus:outline-none focus:border-zinc-600" />
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
                <div className="text-xs text-zinc-600 mt-1">Demo: any password works. Try creator or guest above.</div>
              </div>

              <button disabled={loading} className="w-full bg-white text-black rounded-full py-2.5 text-sm font-semibold hover:bg-zinc-200 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Please wait…' : mode==='login' ? 'Sign in' : 'Create account'} <ArrowRight size={16}/>
              </button>
            </form>

            <div className="text-center mt-4">
              <button onClick={()=>setMode(mode==='login'?'register':'login')} className="text-sm text-zinc-400 hover:text-white">
                {mode==='login' ? "Don't have an account? " : "Already have an account? "}
                <span className="text-white font-medium underline">{mode==='login' ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-600">
              <a href="https://github.com/leibuseele-nackedei4all/nackedei4all" target="_blank" className="flex items-center gap-1 hover:text-zinc-400"><Github size={12}/> View on GitHub</a>
              <span>•</span>
              <span>Privacy • Terms</span>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-600 mt-4 px-4">This is a demo artistic portfolio. All featured models are 18+ and have consented. No explicit pornographic content is hosted.</p>
        </div>
      </div>
    </div>
  )
}

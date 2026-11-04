import React, { createContext, useContext, useEffect, useState } from 'react'

type User = { id: string; name: string; username: string; email: string; avatar: string; role: 'creator'|'fan' }
type Ctx = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginDemo: (as: 'creator'|'fan') => void
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  ageVerified: boolean
  verifyAge: () => void
}

const AuthCtx = createContext<Ctx>(null as any)

const LS_USER = 'n4a_user'
const LS_AGE = 'n4a_age_verified'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ageVerified, setAgeVerified] = useState(false)

  useEffect(() => {
    try {
      const u = localStorage.getItem(LS_USER)
      if (u) setUser(JSON.parse(u))
      const av = localStorage.getItem(LS_AGE)
      if (av === '1') setAgeVerified(true)
    } catch {}
  }, [])

  function persist(u: User | null) {
    if (u) localStorage.setItem(LS_USER, JSON.stringify(u))
    else localStorage.removeItem(LS_USER)
  }

  async function login(email: string, password: string) {
    // mock validation — allow any if both filled, but demo creds work
    await new Promise(r => setTimeout(r, 600))
    if (!email || !password) throw new Error('Fill all fields')
    const u: User = {
      id: 'u-demo',
      name: email.split('@')[0],
      username: email.split('@')[0].toLowerCase(),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      role: email.includes('studio') ? 'creator' : 'fan'
    }
    setUser(u); persist(u)
  }

  function loginDemo(as: 'creator'|'fan') {
    const u: User = as==='creator' ? {
      id: 'u1', name: 'zZinuZz', username: 'nackedei4all', email: 'studio@nackedei4all.de',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      role: 'creator'
    } : {
      id: 'u2', name: 'Alex Rivera', username: 'alex.r', email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      role: 'fan'
    }
    setUser(u); persist(u)
  }

  async function register(name: string, email: string, password: string) {
    await new Promise(r => setTimeout(r, 700))
    if (!name || !email || !password) throw new Error('All fields required')
    const u: User = { id: 'u'+Date.now(), name, username: name.toLowerCase().replace(/\s+/g,'.'), email, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', role: 'fan' }
    setUser(u); persist(u)
  }

  function logout() { setUser(null); persist(null) }
  function verifyAge() { setAgeVerified(true); localStorage.setItem(LS_AGE, '1') }

  return <AuthCtx.Provider value={{ user, login, loginDemo, register, logout, ageVerified, verifyAge }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)

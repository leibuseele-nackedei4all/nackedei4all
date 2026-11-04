import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './lib/auth'
import { LoginPage } from './pages/Login'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ReposPage } from './pages/Repos'
import { RepoDetail } from './pages/RepoDetail'
import { StarredPage } from './pages/Starred'
import { BookingsPage } from './pages/Bookings'
import { InboxPage } from './pages/Inbox'
import { InsightsPage } from './pages/Insights'
import { SettingsPage } from './pages/Settings'
import { useStore } from './lib/store'
import './index.css'
import { Shield } from 'lucide-react'

function AgeGate({ children }: { children: React.ReactNode }) {
  const { ageVerified, verifyAge } = useAuth()
  if (ageVerified) return <>{children}</>
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111119] border border-[#232330] rounded-[24px] p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 grid place-items-center mx-auto text-amber-400"><Shield size={20}/></div>
        <h2 className="text-xl font-bold text-white mt-4">Adult content • 18+</h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">This studio contains artistic nudity (body-positive, consent-first). You must be 18 or older to enter. No explicit pornographic content is hosted — demo uses tasteful, artistic placeholders.</p>
        <div className="flex gap-2 mt-6">
          <button onClick={()=>window.location.href='https://wordpress.com'} className="flex-1 bg-[#1a1a24] border border-[#232330] text-white rounded-full py-2.5 text-sm font-medium">Leave</button>
          <button onClick={verifyAge} className="flex-1 bg-white text-black rounded-full py-2.5 text-sm font-medium">I am 18+ — Enter</button>
        </div>
        <p className="text-xs text-zinc-600 mt-3">By entering you confirm all models are 18+ and you respect our consent policy.</p>
      </div>
    </div>
  )
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const init = useStore(s=>s.init)
  React.useEffect(()=>{ init() }, [init])
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace/> : <LoginPage/>} />
      <Route path="/" element={<Protected><Dashboard/></Protected>} />
      <Route path="/repos" element={<Protected><ReposPage/></Protected>} />
      <Route path="/repos/:id" element={<Protected><RepoDetail/></Protected>} />
      <Route path="/starred" element={<Protected><StarredPage/></Protected>} />
      <Route path="/bookings" element={<Protected><BookingsPage/></Protected>} />
      <Route path="/inbox" element={<Protected><InboxPage/></Protected>} />
      <Route path="/insights" element={<Protected><InsightsPage/></Protected>} />
      <Route path="/settings" element={<Protected><SettingsPage/></Protected>} />
      <Route path="*" element={<Navigate to="/" replace/>} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AgeGate>
          <AppRoutes />
        </AgeGate>
        <Toaster position="top-right" richColors theme="dark" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

import { useStore } from '../lib/store'
import { Card } from '../components/ui'
import { TrendingUp, Users, Eye, Star, GitFork } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const viewsData = [
  { name: 'Jan', views: 3200 }, { name: 'Feb', views: 4100 }, { name: 'Mar', views: 3800 }, { name: 'Apr', views: 5200 }, { name: 'May', views: 6100 }, { name: 'Jun', views: 5800 }
]
const languageData = [
  { name: 'Photography', value: 5, color: '#f59e0b' },
  { name: 'Lifestyle', value: 2, color: '#f43f5e' },
  { name: 'Art', value: 3, color: '#8b5cf6' },
  { name: 'Nature', value: 2, color: '#10b981' },
]

export function InsightsPage() {
  const repos = useStore(s=>s.repos)
  const bookings = useStore(s=>s.bookings)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Insights</h1>
        <p className="text-sm text-zinc-500">GitHub-style analytics for your creator studio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total views', value: '34.2k', delta: '+12%', icon: Eye },
          { label: 'Stars', value: repos.reduce((a,b)=>a+b.stars,0), delta: '+8%', icon: Star },
          { label: 'Forks', value: repos.reduce((a,b)=>a+b.forks,0), delta: '+5%', icon: GitFork },
          { label: 'Bookings', value: bookings.length, delta: '+2 this week', icon: Users },
        ].map(card=>(
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">{card.label}</span>
              <card.icon size={16} className="text-zinc-500"/>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{card.value}</div>
            <div className="text-xs text-emerald-400 mt-1">{card.delta} vs last month</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-white flex items-center gap-2"><TrendingUp size={16} className="text-rose-500"/> Views over time</h3>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <XAxis dataKey="name" stroke="#555" fontSize={12} />
                <YAxis stroke="#555" fontSize={12}/>
                <Tooltip contentStyle={{ background:'#111119', border:'1px solid #232330', borderRadius:12 }} />
                <Line type="monotone" dataKey="views" stroke="#f43f5e" strokeWidth={2.5} dot={{ r:4, fill:'#f43f5e'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Reconstructed from WordPress hits → repo views. Peak in May after Wald-Ritual drop.</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-white">Top repositories by stars</h3>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...repos].sort((a,b)=>b.stars-a.stars).slice(0,5).map(r=>({ name: r.name.slice(0,12), stars: r.stars }))}>
                <XAxis dataKey="name" stroke="#555" fontSize={11} interval={0} />
                <YAxis stroke="#555" fontSize={12}/>
                <Tooltip contentStyle={{ background:'#111119', border:'1px solid #232330', borderRadius:12 }} />
                <Bar dataKey="stars" fill="#f59e0b" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-white">Language mix</h3>
          <div className="h-[200px] mt-4 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languageData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={4}>
                  {languageData.map((entry, i)=><Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'#111119', border:'1px solid #232330', borderRadius:12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {languageData.map(d=>(
              <span key={d.name} className="text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background:d.color}}/> {d.name} • {d.value}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-white">Booking funnel</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Inquiries (Inbox)', value: 18, percent: 100 },
              { label: 'Pending bookings', value: 4, percent: 45 },
              { label: 'Confirmed', value: 7, percent: 38 },
              { label: 'Completed', value: 5, percent: 28 },
            ].map(row=>(
              <div key={row.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{row.label}</span>
                  <span className="text-white font-medium">{row.value}</span>
                </div>
                <div className="mt-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden border border-[#232330]">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" style={{ width: `${row.percent}%`}} />
                </div>
              </div>
            ))}
            <div className="text-xs text-zinc-500 mt-2">Conversion is healthy. Most drop-off after inquiry is pricing/availability — consider a rate card repo.</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

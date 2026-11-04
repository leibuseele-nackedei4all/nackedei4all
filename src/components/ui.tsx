import { ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Button({ variant='default', size='md', className, ...props }: any) {
  const variants: Record<string,string> = {
    default: 'bg-white text-black hover:bg-zinc-200',
    ghost: 'bg-transparent hover:bg-white/5 text-zinc-300 border border-transparent',
    outline: 'bg-transparent border border-[#2a2a3a] hover:bg-white/5 text-white',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    subtle: 'bg-[#1a1a24] border border-[#232330] hover:bg-[#232330] text-white'
  }
  const sizes: Record<string,string> = {
    sm: 'px-3 py-1.5 text-xs rounded-full',
    md: 'px-4 py-2 text-sm rounded-full',
    lg: 'px-5 py-2.5 text-sm rounded-full',
    icon: 'p-2 rounded-full'
  }
  return <button className={cn("inline-flex items-center justify-center font-medium transition disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border", className)}>{children}</span>
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("bg-[#111119] border border-[#232330] rounded-2xl", className)}>{children}</div>
}

export function EmptyState({ icon, title, desc, action }: { icon?: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1a1a24] border border-[#232330] flex items-center justify-center text-zinc-500 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mt-1">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Input(props: any) {
  return <input {...props} className={cn("w-full bg-[#14141c] border border-[#232330] rounded-xl px-3 py-2.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10", props.className)} />
}
export function Textarea(props: any) {
  return <textarea {...props} className={cn("w-full bg-[#14141c] border border-[#232330] rounded-xl px-3 py-2.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 min-h-[100px]", props.className)} />
}
export function Select(props: any) {
  return <select {...props} className={cn("w-full bg-[#14141c] border border-[#232330] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-600", props.className)} />
}

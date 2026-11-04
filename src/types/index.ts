export type Visibility = 'public' | 'private' | 'unlisted'
export type RepoLanguage = 'Photography' | 'Lifestyle' | 'Art' | 'Studio' | 'Nature' | 'Portrait'
export type BookingService = 'Tee & Kuchen' | 'Foto Session' | 'Öl Massage' | 'Private Session' | 'Workshop'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type MessageStatus = 'open' | 'closed' | 'archived'
export type Priority = 'low' | 'medium' | 'high'

export interface Commit {
  id: string
  message: string
  date: string
  filesChanged: number
  author: string
}

export interface Repo {
  id: string
  name: string // slug like "bodyscape-vol-3"
  displayName: string
  description: string
  longDescription: string
  visibility: Visibility
  topics: string[]
  language: RepoLanguage
  cover: string
  images: string[]
  stars: number
  forks: number
  watchers: number
  fileCount: number
  size: string
  updatedAt: string
  createdAt: string
  archived: boolean
  pinned: boolean
  isStarredByMe: boolean
  isPrivate?: boolean
  readme: string
  commits: Commit[]
  license: string
}

export interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  date: string
  time?: string
  service: BookingService
  status: BookingStatus
  message: string
  price?: string
  createdAt: string
  avatar?: string
}

export interface Message {
  id: string
  fromName: string
  fromEmail: string
  subject: string
  body: string
  status: MessageStatus
  priority: Priority
  repoId?: string
  createdAt: string
  replies: { id: string; author: string; body: string; date: string }[]
  read: boolean
  avatar?: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  role: 'creator' | 'fan' | 'admin'
  verified?: boolean
}

export interface Activity {
  id: string
  type: 'star' | 'fork' | 'commit' | 'booking' | 'message'
  actor: string
  repo?: string
  message: string
  time: string
}

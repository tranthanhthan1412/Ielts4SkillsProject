import {
  BookOpen,
  Headphones,
  LayoutDashboard,
  Mic2,
  PenLine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type SidebarItem = {
  end?: boolean
  icon: LucideIcon
  label: string
  path: string
}

export const sidebarItems: SidebarItem[] = [
  { end: true, icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
  { icon: BookOpen, label: 'Reading', path: '/reading' },
  { icon: Headphones, label: 'Listening', path: '/listening' },
  { icon: PenLine, label: 'Writing', path: '/writing' },
  { icon: Mic2, label: 'Speaking', path: '/speaking' },
]

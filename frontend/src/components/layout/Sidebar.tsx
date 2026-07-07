import { LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { sidebarItems } from '../../data/sidebarItems'
import type { User } from '../../services/api'

type SidebarProps = {
  onNavigate?: () => void
  onSignOut: () => void
  user: User
}

function Sidebar({ onNavigate, onSignOut, user }: SidebarProps) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-heading">
        <Link className="brand dashboard-brand" to="/" aria-label="IELTS Master">
          <span className="brand-mark">I</span>
          <span>
            IELTS <strong>MASTER</strong>
          </span>
        </Link>
      </div>

      <nav className="sidebar-nav" aria-label="Điều hướng chính">
        <span className="sidebar-label">Học tập</span>
        {sidebarItems.map(({ end, icon: Icon, label, path }) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            end={end}
            key={path}
            onClick={onNavigate}
            to={path}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <span className="user-avatar">{user.displayName.charAt(0).toUpperCase()}</span>
        <div>
          <strong>{user.displayName}</strong>
          <span>Mục tiêu: Band 7.5</span>
        </div>
        <button type="button" onClick={onSignOut} aria-label="Đăng xuất">
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

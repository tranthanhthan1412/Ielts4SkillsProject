import { ClipboardCheck, HelpCircle, LogOut, Menu, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { sidebarItems } from '../data/sidebarItems'
import type { User } from '../services/api'

type DashboardLayoutProps = {
  user: User
  onSignOut: () => void
}

function DashboardLayout({ onSignOut, user }: DashboardLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <main className="dashboard dashboard-v2">
      <aside className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-heading">
          <Link className="brand dashboard-brand" to="/" aria-label="IELTS Master">
            <span className="brand-mark">I</span>
            <span>
              IELTS <strong>MASTER</strong>
            </span>
          </Link>
          <button
            aria-label="Đóng menu"
            className="sidebar-close"
            onClick={closeMenu}
            type="button"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          <span className="sidebar-label">Học tập</span>
          {sidebarItems.map(({ end, icon: Icon, label, path }) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              end={end}
              key={path}
              onClick={closeMenu}
              to={path}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav sidebar-secondary" aria-label="Hỗ trợ">
          <span className="sidebar-label">Tài khoản</span>
          <NavLink onClick={closeMenu} to="/profile">
            <Settings size={18} aria-hidden="true" />
            <span>Hồ sơ</span>
          </NavLink>
          <button type="button">
            <HelpCircle size={18} aria-hidden="true" />
            <span>Trợ giúp</span>
          </button>
        </nav>

        <div className="sidebar-user">
          <span className="user-avatar">
            {user.displayName.charAt(0).toUpperCase()}
          </span>
          <div>
            <strong>{user.displayName}</strong>
            <span>Mục tiêu: Band 7.5</span>
          </div>
          <button type="button" onClick={onSignOut} aria-label="Đăng xuất">
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {isMenuOpen && (
        <button
          aria-label="Đóng menu"
          className="sidebar-backdrop"
          onClick={closeMenu}
          type="button"
        />
      )}

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            aria-label="Mở menu"
            className="menu-button"
            onClick={() => setIsMenuOpen(true)}
            type="button"
          >
            <Menu size={22} />
          </button>
          <div>
            <span>Không gian học tập</span>
            <strong>IELTS Academic</strong>
          </div>
          <Link className="start-test-button" to="/reading">
            <ClipboardCheck size={18} />
            <span>Bắt đầu thi thử</span>
          </Link>
        </header>

        <div className="dashboard-content dashboard-v2-content">
          <Outlet />
        </div>
      </section>
    </main>
  )
}

export default DashboardLayout

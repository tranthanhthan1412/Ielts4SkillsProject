import type { ReactNode } from 'react'
import { Link } from 'react-router'

type NavbarProps = {
  action?: ReactNode
  title?: string
}

function Navbar({ action, title = 'IELTS Academic' }: NavbarProps) {
  return (
    <header className="dashboard-topbar">
      <Link className="brand dashboard-brand" to="/" aria-label="IELTS Master">
        <span className="brand-mark">I</span>
        <span>
          IELTS <strong>MASTER</strong>
        </span>
      </Link>
      <div>
        <span>Không gian học tập</span>
        <strong>{title}</strong>
      </div>
      {action}
    </header>
  )
}

export default Navbar

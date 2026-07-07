import { LogOut, UserRound } from 'lucide-react'
import Badge from '../../components/common/Badge'
import type { User } from '../../services/api'

type ProfilePageProps = {
  user: User
  onSignOut: () => void
}

function ProfilePage({ onSignOut, user }: ProfilePageProps) {
  return (
    <section className="module-page">
      <header className="module-hero">
        <div>
          <Badge tone="neutral">Profile</Badge>
          <h1>Hồ sơ học viên</h1>
          <p>Thông tin tài khoản và mục tiêu học sẽ được mở rộng ở bước sau.</p>
        </div>
        <UserRound size={42} />
      </header>

      <article className="profile-panel">
        <span className="user-avatar profile-avatar">
          {user.displayName.charAt(0).toUpperCase()}
        </span>
        <div>
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
          <span>@{user.username}</span>
        </div>
        <button onClick={onSignOut} type="button">
          <LogOut size={17} />
          Đăng xuất
        </button>
      </article>
    </section>
  )
}

export default ProfilePage

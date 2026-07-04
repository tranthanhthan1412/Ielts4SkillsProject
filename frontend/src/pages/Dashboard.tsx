import { useState } from 'react'
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Flame,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic2,
  PenLine,
  Settings,
  Target,
  X,
} from 'lucide-react'

type DashboardUser = {
  username: string
  displayName: string
}

type DashboardProps = {
  user: DashboardUser
  onSignOut: () => void
}

function Dashboard({ user, onSignOut }: DashboardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date())
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1)

  const navigation = [
    { label: 'Tổng quan', icon: LayoutDashboard, active: true },
    { label: 'Reading', icon: BookOpen },
    { label: 'Listening', icon: Headphones },
    { label: 'Writing', icon: PenLine },
    { label: 'Speaking', icon: Mic2 },
  ]

  const skillCards = [
    {
      title: 'Reading',
      subtitle: 'Đọc hiểu học thuật',
      description: 'Rèn tốc độ đọc, kỹ năng tìm ý và xử lý dạng câu hỏi.',
      icon: BookOpen,
      progress: 68,
      completed: '12 bài đã hoàn thành',
    },
    {
      title: 'Listening',
      subtitle: 'Nghe hiểu',
      description: 'Luyện nghe theo 4 sections với nhiều giọng tiếng Anh.',
      icon: Headphones,
      progress: 52,
      completed: '8 bài đã hoàn thành',
    },
    {
      title: 'Writing',
      subtitle: 'Viết học thuật',
      description: 'Thực hành Task 1, Task 2 theo tiêu chí chấm thi IELTS.',
      icon: PenLine,
      progress: 35,
      completed: '5 bài đã hoàn thành',
    },
    {
      title: 'Speaking',
      subtitle: 'Phản xạ nói',
      description: 'Luyện trả lời mạch lạc cho Part 1, Part 2 và Part 3.',
      icon: Mic2,
      progress: 44,
      completed: '6 bài đã hoàn thành',
    },
  ]

  const weeklyActivity = [
    { day: 'T2', value: 42 },
    { day: 'T3', value: 68 },
    { day: 'T4', value: 53 },
    { day: 'T5', value: 82 },
    { day: 'T6', value: 64 },
    { day: 'T7', value: 92 },
    { day: 'CN', value: 36 },
  ]

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3500)
  }

  return (
    <main className="dashboard dashboard-v2">
      <aside className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-heading">
          <a className="brand dashboard-brand" href="/" aria-label="IELTS Master">
            <span className="brand-mark">I</span>
            <span>
              IELTS <strong>MASTER</strong>
            </span>
          </a>
          <button
            className="sidebar-close"
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          <span className="sidebar-label">Học tập</span>
          {navigation.map(({ label, icon: Icon, active }) => (
            <button
              className={active ? 'active' : ''}
              type="button"
              key={label}
              onClick={() => {
                setIsMenuOpen(false)
                if (!active) {
                  document
                    .getElementById('practice-skills')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
              {!active && <ChevronRight size={15} aria-hidden="true" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav sidebar-secondary" aria-label="Hỗ trợ">
          <span className="sidebar-label">Tài khoản</span>
          <button
            type="button"
            onClick={() => showNotice('Trang cài đặt sẽ được bổ sung sau.')}
          >
            <Settings size={18} aria-hidden="true" />
            <span>Cài đặt</span>
          </button>
          <button
            type="button"
            onClick={() => showNotice('Trung tâm trợ giúp đang được chuẩn bị.')}
          >
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
          className="sidebar-backdrop"
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="menu-button"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Mở menu"
          >
            <Menu size={22} />
          </button>
          <div>
            <span>Không gian học tập</span>
            <strong>IELTS Academic</strong>
          </div>
          <button
            className="start-test-button"
            type="button"
            onClick={() => showNotice('Bài thi thử đang được chuẩn bị.')}
          >
            <ClipboardCheck size={18} />
            <span>Bắt đầu thi thử</span>
          </button>
        </header>

        <div className="dashboard-content dashboard-v2-content">
          <header className="dashboard-intro">
            <div>
              <span className="dashboard-date">
                <CalendarDays size={15} />
                {todayLabel}
              </span>
              <h1>Chào {user.displayName.split(' ')[0]},</h1>
              <p>Tiếp tục hành trình chinh phục mục tiêu IELTS của bạn.</p>
            </div>
            <div className="exam-countdown">
              <span>Kỳ thi dự kiến</span>
              <strong>48 ngày</strong>
              <small>15 tháng 08, 2026</small>
            </div>
          </header>

          <section className="metric-grid" aria-label="Tổng quan tiến độ">
            <article className="metric-card band-card">
              <div className="metric-icon">
                <Award size={21} />
              </div>
              <div>
                <span>Band hiện tại</span>
                <strong>7.0</strong>
                <small>Mục tiêu 7.5</small>
              </div>
              <div className="band-progress" aria-label="Tiến độ đến Band 7.5">
                <span style={{ width: '86%' }} />
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon">
                <Clock3 size={21} />
              </div>
              <div>
                <span>Thời gian tuần này</span>
                <strong>6 giờ 40 phút</strong>
                <small>+18% so với tuần trước</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon">
                <Flame size={21} />
              </div>
              <div>
                <span>Chuỗi học tập</span>
                <strong>12 ngày</strong>
                <small>Kỷ lục cá nhân: 18 ngày</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon">
                <Target size={21} />
              </div>
              <div>
                <span>Bài đã hoàn thành</span>
                <strong>31 bài</strong>
                <small>7 bài trong tháng này</small>
              </div>
            </article>
          </section>

          <section className="dashboard-overview-grid">
            <article className="dashboard-panel activity-panel">
              <div className="panel-heading">
                <div>
                  <span>Tiến độ học tập</span>
                  <h2>Hoạt động trong tuần</h2>
                </div>
                <strong>6h 40p</strong>
              </div>
              <div className="activity-chart" aria-label="Biểu đồ hoạt động tuần">
                {weeklyActivity.map(({ day, value }) => (
                  <div className="chart-column" key={day}>
                    <span className="chart-value">
                      {Math.round(value / 10) * 10}p
                    </span>
                    <div className="chart-track">
                      <i style={{ height: `${value}%` }} />
                    </div>
                    <small>{day}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-panel continue-panel">
              <div className="continue-label">
                <BookOpen size={18} />
                Tiếp tục bài học
              </div>
              <span className="continue-type">READING</span>
              <h2>Academic Reading Practice Test 14</h2>
              <p>Section 2 · The History of the Tortoise</p>
              <div className="test-progress-copy">
                <span>14/40 câu hỏi</span>
                <span>Còn 25 phút</span>
              </div>
              <div className="test-progress">
                <span style={{ width: '35%' }} />
              </div>
              <button
                type="button"
                onClick={() =>
                  showNotice('Bài Reading sẽ được nối ở bước tiếp theo.')
                }
              >
                Tiếp tục làm bài
                <ArrowRight size={18} />
              </button>
            </article>
          </section>

          <section className="skills-section" id="practice-skills">
            <div className="section-heading">
              <div>
                <span>Luyện tập theo kỹ năng</span>
                <h2>IELTS 4 Skills</h2>
              </div>
              <p>Chọn một kỹ năng để bắt đầu buổi học hôm nay.</p>
            </div>
            <div className="skill-grid">
              {skillCards.map(
                ({ title, subtitle, description, icon: Icon, progress, completed }) => (
                  <article className="skill-card" key={title}>
                    <div className="skill-card-top">
                      <span className="skill-icon">
                        <Icon size={23} aria-hidden="true" />
                      </span>
                      <span className="skill-percentage">{progress}%</span>
                    </div>
                    <span className="skill-subtitle">{subtitle}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <div className="skill-progress">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <div className="skill-card-footer">
                      <small>{completed}</small>
                      <button
                        type="button"
                        onClick={() =>
                          showNotice(`Trang ${title} sẽ được xây dựng tiếp theo.`)
                        }
                        aria-label={`Mở kỹ năng ${title}`}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          <section className="recommendations-section">
            <div className="section-heading compact">
              <div>
                <span>Đề xuất cá nhân</span>
                <h2>Nên học tiếp</h2>
              </div>
            </div>
            <div className="recommendation-list">
              <article>
                <span className="recommendation-icon">
                  <PenLine size={21} />
                </span>
                <div>
                  <strong>Writing Task 2: Cấu trúc bài Opinion Essay</strong>
                  <p>
                    Cải thiện cách phát triển luận điểm để tiến từ Band 6.5 lên
                    7.0.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    showNotice('Bài Writing sẽ được nối sau Dashboard.')
                  }
                >
                  Xem bài
                  <ChevronRight size={17} />
                </button>
              </article>
              <article>
                <span className="recommendation-icon">
                  <Mic2 size={21} />
                </span>
                <div>
                  <strong>Speaking Part 3: Phát triển câu trả lời</strong>
                  <p>
                    Luyện cách đưa lý do và ví dụ cho các câu hỏi trừu tượng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    showNotice('Bài Speaking sẽ được nối sau Dashboard.')
                  }
                >
                  Xem bài
                  <ChevronRight size={17} />
                </button>
              </article>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>IELTS Master · Nền tảng luyện thi học thuật</span>
            <span>Tiến bộ mỗi ngày, tự tin trong ngày thi.</span>
          </footer>
        </div>
      </section>

      {notice && (
        <div className="dashboard-toast" role="status" aria-live="polite">
          <Check size={18} />
          {notice}
        </div>
      )}
    </main>
  )
}

export default Dashboard

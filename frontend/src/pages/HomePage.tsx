import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  Headphones,
  Menu,
  Mic2,
  PenLine,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react'
import { Link } from 'react-router'
import type { User } from '../lib/api'
import './HomePage.css'

type HomePageProps = {
  user: User | null
}

const skills = [
  {
    name: 'Listening',
    vietnameseName: 'Nghe hiểu',
    icon: Headphones,
    description:
      'Luyện nghe theo 4 sections, làm quen nhiều giọng tiếng Anh và xử lý từng dạng câu hỏi.',
    focus: ['Từ khóa', 'Bẫy thông tin', 'Chính tả'],
  },
  {
    name: 'Reading',
    vietnameseName: 'Đọc hiểu học thuật',
    icon: BookOpen,
    description:
      'Rèn Skimming, Scanning và kỹ năng xác định thông tin để tăng tốc độ lẫn độ chính xác.',
    focus: ['Skimming', 'Scanning', 'Quản lý thời gian'],
  },
  {
    name: 'Writing',
    vietnameseName: 'Viết học thuật',
    icon: PenLine,
    description:
      'Xây dựng bài viết rõ ràng cho Task 1 và Task 2 theo đúng bốn tiêu chí chấm IELTS.',
    focus: ['Task response', 'Coherence', 'Vocabulary'],
  },
  {
    name: 'Speaking',
    vietnameseName: 'Phản xạ nói',
    icon: Mic2,
    description:
      'Phát triển câu trả lời tự nhiên, có cấu trúc và tự tin hơn trong cả ba phần thi.',
    focus: ['Fluency', 'Pronunciation', 'Ideas'],
  },
]

function HomePage({ user }: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const primaryDestination = user ? '/dashboard' : '/auth'

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-nav-container">
          <Link className="home-logo" to="/" aria-label="IELTS Master">
            <span className="home-logo-mark">I</span>
            <span>
              IELTS <strong>MASTER</strong>
            </span>
          </Link>

          <nav
            className={`home-navigation ${isMenuOpen ? 'open' : ''}`}
            aria-label="Điều hướng trang chủ"
          >
            <a href="#four-skills" onClick={closeMenu}>
              4 kỹ năng
            </a>
            <a href="#learning-path" onClick={closeMenu}>
              Lộ trình học
            </a>
            <a href="#mock-test" onClick={closeMenu}>
              Thi thử
            </a>
            <Link to={primaryDestination} onClick={closeMenu}>
              Tiến độ của tôi
            </Link>
          </nav>

          <div className="home-nav-actions">
            {user ? (
              <Link className="home-login-link" to="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Link className="home-login-link" to="/auth">
                Đăng nhập
              </Link>
            )}
            <Link className="home-primary-link" to={primaryDestination}>
              {user ? 'Tiếp tục học' : 'Bắt đầu miễn phí'}
              <ArrowRight size={16} />
            </Link>
            <button
              className="home-menu-button"
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <span className="home-eyebrow">
                <ShieldCheck size={16} />
                Luyện tập nghiêm túc · Tiến bộ rõ ràng
              </span>
              <h1>
                Chinh phục IELTS
                <br />
                bằng một lộ trình <em>đúng trọng tâm.</em>
              </h1>
              <p>
                Luyện đủ Listening, Reading, Writing và Speaking trong một không
                gian học tập thống nhất. Mỗi buổi học đều gắn với mục tiêu band
                điểm và tiến độ của riêng bạn.
              </p>

              <div className="home-hero-actions">
                <Link className="hero-primary-action" to={primaryDestination}>
                  {user ? 'Vào Dashboard' : 'Bắt đầu luyện tập'}
                  <ArrowRight size={18} />
                </Link>
                <a className="hero-secondary-action" href="#four-skills">
                  Khám phá 4 kỹ năng
                </a>
              </div>

              <div className="home-trust-row">
                <span>
                  <Check size={15} /> Nội dung hướng dẫn tiếng Việt
                </span>
                <span>
                  <Check size={15} /> Bám sát định dạng IELTS Academic
                </span>
              </div>
            </div>

            <div className="hero-study-preview" aria-label="Xem trước tiến độ học">
              <div className="preview-heading">
                <div>
                  <span>TIẾN ĐỘ CÁ NHÂN</span>
                  <strong>Mục tiêu Band 7.5</strong>
                </div>
                <span className="preview-score">7.0</span>
              </div>

              <div className="preview-overall-progress">
                <span style={{ width: '82%' }} />
              </div>

              <div className="preview-skill-list">
                {[
                  ['Listening', 72],
                  ['Reading', 84],
                  ['Writing', 63],
                  ['Speaking', 68],
                ].map(([name, progress]) => (
                  <div className="preview-skill-row" key={name}>
                    <span>{name}</span>
                    <div>
                      <i style={{ width: `${progress}%` }} />
                    </div>
                    <strong>{progress}%</strong>
                  </div>
                ))}
              </div>

              <div className="preview-next-session">
                <span className="preview-session-icon">
                  <BookOpen size={20} />
                </span>
                <div>
                  <small>BÀI HỌC TIẾP THEO</small>
                  <strong>Academic Reading · Practice Test 14</strong>
                </div>
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </section>

        <section className="home-skills-section" id="four-skills">
          <div className="home-section-heading">
            <span>IELTS 4 SKILLS</span>
            <h2>Một mục tiêu, bốn kỹ năng cần phát triển đồng đều</h2>
            <p>
              Từng kỹ năng có cách luyện riêng, nhưng cùng được tổ chức trong một
              lộ trình thống nhất để bạn không học lan man.
            </p>
          </div>

          <div className="home-skills-grid">
            {skills.map(({ name, vietnameseName, icon: Icon, description, focus }) => (
              <article className="home-skill-card" key={name}>
                <div className="home-skill-card-top">
                  <span className="home-skill-icon">
                    <Icon size={25} />
                  </span>
                  <span>01–09</span>
                </div>
                <span className="home-skill-subtitle">{vietnameseName}</span>
                <h3>{name}</h3>
                <p>{description}</p>
                <ul>
                  {focus.map((item) => (
                    <li key={item}>
                      <Check size={13} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={primaryDestination}>
                  Bắt đầu luyện
                  <ChevronRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="learning-path-section" id="learning-path">
          <div className="learning-path-layout">
            <div className="learning-path-copy">
              <span className="home-section-label">LỘ TRÌNH HỌC CÓ CẤU TRÚC</span>
              <h2>Biết mình đang ở đâu và cần làm gì tiếp theo</h2>
              <p>
                IELTS Master hướng người học đi từ mục tiêu đến hành động cụ thể:
                chọn kỹ năng, hoàn thành bài luyện và theo dõi sự tiến bộ sau mỗi
                giai đoạn.
              </p>
              <Link to={primaryDestination}>
                Thiết lập mục tiêu của bạn
                <ArrowRight size={18} />
              </Link>
            </div>

            <ol className="learning-steps">
              <li>
                <span>01</span>
                <div>
                  <Target size={22} />
                  <h3>Đặt mục tiêu band điểm</h3>
                  <p>Xác định đích đến và thời gian bạn có trước ngày thi.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <ClipboardCheck size={22} />
                  <h3>Luyện tập đúng dạng bài</h3>
                  <p>Tập trung vào từng kỹ năng và điểm yếu cần cải thiện.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <BarChart3 size={22} />
                  <h3>Theo dõi tiến độ</h3>
                  <p>Quan sát thời gian học, số bài hoàn thành và band hiện tại.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="home-facts-section" id="mock-test">
          <div className="home-facts-grid">
            <div>
              <strong>4</strong>
              <span>Kỹ năng IELTS cốt lõi</span>
            </div>
            <div>
              <strong>0–9</strong>
              <span>Thang điểm theo dõi</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Dashboard tiến độ thống nhất</span>
            </div>
          </div>
        </section>

        <section className="home-final-cta">
          <div>
            <span>BẮT ĐẦU TỪ HÔM NAY</span>
            <h2>Một buổi luyện tập nghiêm túc tốt hơn một kế hoạch để ngày mai.</h2>
            <p>
              Tạo tài khoản, đặt mục tiêu band điểm và bắt đầu với kỹ năng bạn cần
              cải thiện nhất.
            </p>
          </div>
          <Link to={primaryDestination}>
            {user ? 'Tiếp tục học' : 'Tạo tài khoản miễn phí'}
            <ArrowRight size={19} />
          </Link>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-grid">
          <div>
            <Link className="home-logo footer-logo" to="/">
              <span className="home-logo-mark">I</span>
              <span>
                IELTS <strong>MASTER</strong>
              </span>
            </Link>
            <p>
              Nền tảng luyện IELTS 4 kỹ năng với lộ trình rõ ràng và trải nghiệm
              học tập tập trung.
            </p>
          </div>
          <div>
            <strong>Luyện tập</strong>
            <a href="#four-skills">Listening</a>
            <a href="#four-skills">Reading</a>
            <a href="#four-skills">Writing</a>
            <a href="#four-skills">Speaking</a>
          </div>
          <div>
            <strong>Tài khoản</strong>
            <Link to="/auth">Đăng nhập</Link>
            <Link to="/auth">Tạo tài khoản</Link>
            <Link to={primaryDestination}>Dashboard</Link>
          </div>
          <div>
            <strong>Thông tin</strong>
            <a href="#learning-path">Lộ trình học</a>
            <a href="#mock-test">Thi thử</a>
            <span>Hỗ trợ người học</span>
          </div>
        </div>
        <div className="home-footer-bottom">
          <span>© 2026 IELTS Master. Nền tảng luyện thi độc lập.</span>
          <span>IELTS là nhãn hiệu của các chủ sở hữu tương ứng.</span>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

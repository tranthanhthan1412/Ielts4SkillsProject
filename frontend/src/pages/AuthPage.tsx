import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { apiRequest, TOKEN_KEY } from '../lib/api'
import type { User } from '../lib/api'

type AuthMode = 'signin' | 'signup'

type AuthPageProps = {
  onAuthenticated: (user: User) => void
}

function AuthPage({ onAuthenticated }: AuthPageProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setError('')
    setNotice('')
    setShowPassword(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setIsSubmitting(true)

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const password = String(form.get('password') || '')

    try {
      if (mode === 'signup') {
        const confirmPassword = String(form.get('confirmPassword') || '')
        if (password.length < 8) {
          throw new Error('Mật khẩu phải có ít nhất 8 ký tự.')
        }
        if (password !== confirmPassword) {
          throw new Error('Mật khẩu xác nhận chưa trùng khớp.')
        }

        await apiRequest('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            firstName: form.get('firstName'),
            lastName: form.get('lastName'),
            username: form.get('username'),
            email: form.get('email'),
            password,
          }),
        })

        formElement.reset()
        setMode('signin')
        setNotice('Tạo tài khoản thành công. Hãy đăng nhập để bắt đầu.')
        return
      }

      const { accessToken } = await apiRequest<{ accessToken: string }>(
        '/auth/signin',
        {
          method: 'POST',
          body: JSON.stringify({
            username: form.get('username'),
            password,
          }),
        },
      )

      localStorage.setItem(TOKEN_KEY, accessToken)
      const { user } = await apiRequest<{ user: User }>(
        '/users/me',
        {},
        accessToken,
      )
      onAuthenticated(user)
      navigate('/dashboard')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="story-panel" aria-label="Nền tảng luyện thi IELTS">
        <Link className="brand brand-light" to="/" aria-label="IELTS Master">
          <span className="brand-mark">I</span>
          <span>
            IELTS <strong>MASTER</strong>
          </span>
        </Link>

        <div className="story-content">
          <span className="eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            Mục tiêu band điểm trong tầm tay
          </span>
          <h1>
            Luyện tập có mục tiêu.
            <br />
            <em>Tiến bộ có lộ trình.</em>
          </h1>
          <p>
            Một không gian luyện IELTS tập trung, có bài tập sát định dạng thi
            và tiến độ rõ ràng cho từng kỹ năng.
          </p>

          <div className="proof-row">
            <div>
              <strong>4</strong>
              <span>Kỹ năng cốt lõi</span>
            </div>
            <div>
              <strong>0–9</strong>
              <span>Thang điểm IELTS</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Chủ động luyện tập</span>
            </div>
          </div>
        </div>

        <div className="story-footer">
          <Sparkles size={17} aria-hidden="true" />
          <p>Đều đặn mỗi ngày, tự tin hơn trong ngày thi.</p>
        </div>
      </section>

      <section className="form-panel">
        <div className="mobile-brand">
          <Link className="brand" to="/" aria-label="IELTS Master">
            <span className="brand-mark">I</span>
            <span>
              IELTS <strong>MASTER</strong>
            </span>
          </Link>
        </div>

        <div className="form-card">
          <Link className="auth-back-link" to="/">
            <ArrowLeft size={16} />
            Về trang chủ
          </Link>

          <header>
            <span className="form-kicker">
              {mode === 'signin' ? 'Chào mừng trở lại' : 'Bắt đầu hành trình'}
            </span>
            <h2>{mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
            <p>
              {mode === 'signin'
                ? 'Tiếp tục buổi luyện tập gần nhất của bạn.'
                : 'Tạo tài khoản để lưu tiến độ và mục tiêu band điểm.'}
            </p>
          </header>

          <div className="mode-switch" role="tablist" aria-label="Tài khoản">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={mode === 'signin' ? 'active' : ''}
              onClick={() => changeMode('signin')}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => changeMode('signup')}
            >
              Tạo tài khoản
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="name-grid">
                <Field
                  label="Tên"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Tên"
                />
                <Field
                  label="Họ"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Họ"
                />
              </div>
            )}

            <Field
              label="Tên đăng nhập"
              name="username"
              autoComplete="username"
              placeholder="Nhập tên đăng nhập"
            />

            {mode === 'signup' && (
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ban@example.com"
              />
            )}

            <label className="field">
              <span>Mật khẩu</span>
              <span className="password-wrap">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder={
                    mode === 'signin' ? 'Nhập mật khẩu' : 'Tối thiểu 8 ký tự'
                  }
                  minLength={mode === 'signup' ? 8 : undefined}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </span>
            </label>

            {mode === 'signup' && (
              <Field
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                minLength={8}
              />
            )}

            {notice && (
              <p className="form-message success" role="status">
                <Check size={17} aria-hidden="true" />
                {notice}
              </p>
            )}
            {error && (
              <p className="form-message error" role="alert">
                {error}
              </p>
            )}

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              <span>
                {isSubmitting
                  ? 'Đang xử lý…'
                  : mode === 'signin'
                    ? 'Đăng nhập'
                    : 'Tạo tài khoản'}
              </span>
              {!isSubmitting && <ArrowRight size={19} aria-hidden="true" />}
            </button>
          </form>

          <p className="terms">
            Khi tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.
          </p>
        </div>
      </section>
    </main>
  )
}

type FieldProps = {
  label: string
  name: string
  type?: string
  autoComplete?: string
  placeholder?: string
  minLength?: number
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  placeholder,
  minLength,
}: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required
      />
    </label>
  )
}

export default AuthPage

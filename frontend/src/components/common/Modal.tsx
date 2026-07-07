import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalProps = {
  actions?: ReactNode
  children: ReactNode
  description?: string
  onClose: () => void
  open: boolean
  title: string
}

function Modal({ actions, children, description, onClose, open, title }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-layer" role="presentation">
      <button
        aria-label="Đóng hộp thoại"
        className="modal-backdrop"
        onClick={onClose}
        type="button"
      />
      <section
        aria-describedby={description ? 'modal-description' : undefined}
        aria-modal="true"
        className="modal-card"
        role="dialog"
      >
        <header className="modal-heading">
          <div>
            <h2>{title}</h2>
            {description && <p id="modal-description">{description}</p>}
          </div>
          <button aria-label="Đóng" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {actions && <footer className="modal-actions">{actions}</footer>}
      </section>
    </div>
  )
}

export default Modal

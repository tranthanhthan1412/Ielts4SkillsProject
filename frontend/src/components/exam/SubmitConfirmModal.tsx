import Button from '../common/Button'
import Modal from '../common/Modal'

type SubmitConfirmModalProps = {
  answeredCount: number
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  totalQuestions: number
}

function SubmitConfirmModal({
  answeredCount,
  onCancel,
  onConfirm,
  open,
  totalQuestions,
}: SubmitConfirmModalProps) {
  return (
    <Modal
      actions={
        <>
          <Button onClick={onCancel} type="button" variant="outline">
            Kiểm tra lại
          </Button>
          <Button onClick={onConfirm} type="button">
            Nộp bài
          </Button>
        </>
      }
      description="Bạn có thể quay lại kiểm tra trước khi nộp bài."
      onClose={onCancel}
      open={open}
      title="Nộp bài luyện tập?"
    >
      <p>
        Bạn đã trả lời {answeredCount}/{totalQuestions} câu hỏi.
      </p>
    </Modal>
  )
}

export default SubmitConfirmModal

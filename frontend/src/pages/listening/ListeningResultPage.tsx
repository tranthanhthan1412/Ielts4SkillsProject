import { Link, useParams } from 'react-router'
import Badge from '../../components/common/Badge'
import { calculateBand } from '../../utils/calculateBand'

function ListeningResultPage() {
  const { testId } = useParams()
  const correctAnswers = 32
  const band = calculateBand(correctAnswers)

  return (
    <main className="result-page">
      <section className="result-card">
        <Badge tone="blue">Listening result</Badge>
        <h1>Band {band.toFixed(1)}</h1>
        <p>
          Kết quả mẫu cho bài {testId}. Sau này phần này sẽ hiện đáp án đúng,
          transcript và lỗi nghe thường gặp.
        </p>
        <div className="result-stats">
          <span>{correctAnswers}/40 câu đúng</span>
          <span>30 phút</span>
        </div>
        <Link to="/listening">Quay lại Listening</Link>
      </section>
    </main>
  )
}

export default ListeningResultPage

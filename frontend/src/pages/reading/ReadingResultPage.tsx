import { Link, useParams } from 'react-router'
import Badge from '../../components/common/Badge'
import { calculateBand } from '../../utils/calculateBand'

function ReadingResultPage() {
  const { testId } = useParams()
  const correctAnswers = 30
  const band = calculateBand(correctAnswers)

  return (
    <main className="result-page">
      <section className="result-card">
        <Badge tone="red">Reading result</Badge>
        <h1>Band {band.toFixed(1)}</h1>
        <p>
          Kết quả mẫu cho bài {testId}. Sau này màn này sẽ nhận dữ liệu bài làm
          thật và phân tích theo từng dạng câu hỏi.
        </p>
        <div className="result-stats">
          <span>{correctAnswers}/40 câu đúng</span>
          <span>60 phút</span>
        </div>
        <Link to="/reading">Quay lại Reading</Link>
      </section>
    </main>
  )
}

export default ReadingResultPage

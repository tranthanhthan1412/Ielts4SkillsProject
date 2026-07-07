export type SpeakingTopicSummary = {
  description: string
  id: string
  part: 'Part 1' | 'Part 2' | 'Part 3'
  title: string
}

const speakingTopics: SpeakingTopicSummary[] = [
  {
    description: 'Câu hỏi cá nhân ngắn để luyện phản xạ trả lời tự nhiên.',
    id: 'part-1-work-study',
    part: 'Part 1',
    title: 'Work or study',
  },
  {
    description: 'Cue card về một nơi bạn muốn quay lại.',
    id: 'part-2-place',
    part: 'Part 2',
    title: 'Describe a place you enjoyed visiting',
  },
]

export async function listSpeakingTopics() {
  return speakingTopics
}

export async function getSpeakingTopic(topicId: string) {
  return speakingTopics.find(({ id }) => id === topicId) ?? speakingTopics[0]
}

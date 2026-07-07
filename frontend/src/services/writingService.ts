export type WritingTaskSummary = {
  description: string
  id: string
  taskType: 'Task 1' | 'Task 2'
  title: string
}

const writingTasks: WritingTaskSummary[] = [
  {
    description: 'Phân tích biểu đồ và viết overview rõ ràng.',
    id: 'task-1-line-chart',
    taskType: 'Task 1',
    title: 'Line chart: International student numbers',
  },
  {
    description: 'Luyện opinion essay với thesis statement và topic sentence.',
    id: 'task-2-opinion-essay',
    taskType: 'Task 2',
    title: 'Opinion essay: Online learning',
  },
]

export async function listWritingTasks() {
  return writingTasks
}

export async function getWritingTask(taskId: string) {
  return writingTasks.find(({ id }) => id === taskId) ?? writingTasks[0]
}

// Lesson interfaces
export interface Lesson {
  lessonId: string
  id?: string
  title: string
  lessonTitle?: string
  description: string
  orderIndex?: number
  courseId: string
  isActive: boolean
  isStudied?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LessonsListResponse {
  succeeded: boolean
  message?: string
  data: Lesson[]
  pageNumber?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface CreateLessonRequest {
  courseId: string
  title: string
  description: string
  orderIndex?: number
}

export interface UpdateLessonRequest {
  lessonId: string
  title: string
  description: string
  orderIndex?: number
}

// Question interfaces
export interface Answer {
  answerId: string
  content: string
  isCorrect: boolean
}

export interface Question {
  questionId: string
  content: string
  lessonId: string
  lessonTitle?: string
  isActive: boolean
  isStudied?: boolean
  answers: Answer[]
  createdAt?: string
  updatedAt?: string
}

export interface QuestionsListResponse {
  succeeded: boolean
  message?: string
  data: Question[]
  pageNumber?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface CreateQuestionRequest {
  content: string
  lessonId: string
  answers: Array<{
    content: string
    isCorrect: boolean
  }>
}

export interface UpdateQuestionRequest {
  questionId: string
  content: string
  lessonId: string
  answers: Array<{
    answerId?: string
    content: string
    isCorrect: boolean
  }>
}

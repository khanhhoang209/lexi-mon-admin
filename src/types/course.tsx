export interface Course {
  courseId: string
  title: string
  description: string
  imageUrl: string
  price: number
  coin: number
  isActive: boolean
  courseLanguageId?: string
  courseLanguageName?: string
  createdAt?: string
  updatedAt?: string
  _renderKey?: string // Thêm field này để tracking render
}

export interface CoursesListResponse {
  succeeded: boolean
  message?: string
  data: Course[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface CreateCourseRequest {
  title: string
  description: string
  imageUrl?: string
  price: number
  coin: number
  isActive?: boolean
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  imageUrl?: string
  price?: number
  coin?: number
  isActive?: boolean
}

export interface CourseLanguage {
  id: string
  name: string
  isActive: boolean
}

export interface CourseLanguagesResponse {
  succeeded: boolean
  message?: string
  data: CourseLanguage[]
}

export interface Lesson {
  lessonId: string
  id?: string
  title: string
  description: string
  orderIndex?: number
  courseId?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LessonsListResponse {
  succeeded: boolean
  message?: string
  data: Lesson[]
  totalCount?: number
  totalPages?: number
}

export interface CreateLessonRequest {
  courseId: string
  title: string
  description: string
  orderIndex: number
}

export interface UpdateLessonRequest {
  id: string
  title?: string
  description?: string
  orderIndex?: number
}

// Question & Answer interfaces
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
}

export interface CreateQuestionRequest {
  content: string
  lessonId: string
  isActive?: boolean
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

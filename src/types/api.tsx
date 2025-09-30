export interface ApiResponse<T = unknown> {
  succeeded: boolean
  status: number
  message?: string
  data?: T
}

export interface PaginatedResponse<T> {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  data: T[]
}

// Auth API interfaces
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiredIn: number
}

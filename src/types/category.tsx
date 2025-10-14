export interface Category {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CategoriesListResponse {
  succeeded: boolean
  message: string
  data: Category[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
}

export interface CreateCategoryRequest {
  name: string
}

export interface UpdateCategoryRequest {
  name: string
}

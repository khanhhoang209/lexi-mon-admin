export interface Item {
  itemId: string
  itemName: string
  isPremium: boolean
  price: number
  coin: number
  imageUrl: string
  description: string
  isActive: boolean
  categoryId: string
  categoryName?: string
  createdAt: string
  updatedAt?: string
}

export interface ItemsListResponse {
  succeeded: boolean
  message: string
  data: Item[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
}

export interface CreateItemRequest {
  categoryId: string
  name: string
  isPremium: boolean
  price: number
  coin: number
  image: File | null
  description: string
}

export interface UpdateItemRequest {
  categoryId?: string
  name?: string
  isPremium?: boolean
  price?: number
  coin?: number
  image?: File | null
  description?: string
}

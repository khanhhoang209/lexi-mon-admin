export interface Order {
  id: string
  courseId: string | null
  itemId: string | null
  purchaseCost: number
  coinCost: number
  paidAt: string | null
  paymentStatus: number
  itemName: string | null
  courseTitle: string | null
  email: string
  createdAt: string
  updatedAt: string
}

export interface OrdersListResponse {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  data: Order[]
  succeeded: boolean
  message: string
}

export const PaymentStatusMap: Record<number, string> = {
  0: 'Chưa thanh toán',
  1: 'Đã thanh toán',
  2: 'Thất bại',
  3: 'Đã hủy'
}

export const PaymentStatusColorMap: Record<number, string> = {
  0: 'bg-yellow-100 text-yellow-800',
  1: 'bg-green-100 text-green-800',
  2: 'bg-red-100 text-red-800',
  3: 'bg-blue-100 text-blue-800'
}

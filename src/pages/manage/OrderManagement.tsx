import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Search, Eye, Calendar } from 'lucide-react'
import AdminLayout from '~/components/layout/AdminLayout'
import { apiService } from '~/config/axios'
import type { Order, OrdersListResponse, PaymentStatusMap, PaymentStatusColorMap } from '~/types/order'

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(10)

  // Search filters
  const [searchName, setSearchName] = useState('')
  const [searchProductName, setSearchProductName] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [orderType, setOrderType] = useState('')

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const paymentStatusMap: typeof PaymentStatusMap = {
    0: 'Chưa thanh toán',
    1: 'Đã thanh toán',
    2: 'Thất bại',
    3: 'Đã hủy'
  }

  const paymentStatusColorMap: typeof PaymentStatusColorMap = {
    0: 'bg-yellow-100 text-yellow-800',
    1: 'bg-green-100 text-green-800',
    2: 'bg-red-100 text-red-800',
    3: 'bg-blue-100 text-blue-800'
  }

  // Fetch orders from API
  const fetchOrders = async (page: number = 1) => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        Page: page,
        PageSize: pageSize
      }

      if (searchName && searchName.trim()) {
        params.Email = searchName.trim()
      }
      if (searchProductName && searchProductName.trim()) {
        params.Name = searchProductName.trim()
      }
      if (minPrice) {
        params.MinPrice = Number(minPrice)
      }
      if (maxPrice) {
        params.MaxPrice = Number(maxPrice)
      }
      if (paymentStatus !== '') {
        params.PaymentStatus = Number(paymentStatus)
      }
      if (fromDate) {
        params.FromDate = fromDate
      }
      if (toDate) {
        params.ToDate = toDate
      }
      if (orderType) {
        params.OrderType = orderType
      }

      console.log('=== Fetching Orders ===')
      console.log('Params:', params)

      const response = await apiService.get<OrdersListResponse>('/orders', params)

      console.log('Response:', response)

      if (response && response.succeeded) {
        const data = response as unknown as OrdersListResponse
        setOrders(data.data || [])
        setTotalPages(data.totalPages || 0)
        setTotalCount(data.totalCount || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  // Load orders when component mounts
  useEffect(() => {
    fetchOrders(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== Searching Orders ===')
    fetchOrders(1)
  }

  // Reset search
  const handleResetSearch = () => {
    setSearchName('')
    setSearchProductName('')
    setMinPrice('')
    setMaxPrice('')
    setPaymentStatus('')
    setFromDate('')
    setToDate('')
    setOrderType('')
    fetchOrders(1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchOrders(page)
  }

  // View order details
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Search & Filter Bar */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <form onSubmit={handleSearch} className='space-y-4'>
            {/* Row 1: Customer Name, Product Name, Price Range */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Tên khách hàng/Email</label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Tìm kiếm...'
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Tên sản phẩm</label>
                <input
                  type='text'
                  placeholder='Tên sản phẩm...'
                  value={searchProductName}
                  onChange={(e) => setSearchProductName(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Giá từ (VNĐ)</label>
                <input
                  type='number'
                  placeholder='Giá tối thiểu'
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  min='0'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Giá đến (VNĐ)</label>
                <input
                  type='number'
                  placeholder='Giá tối đa'
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  min='0'
                />
              </div>
            </div>

            {/* Row 2: Payment Status, Date Range, Order Type */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Trạng thái thanh toán</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Tất cả</option>
                  <option value='0'>Chưa thanh toán</option>
                  <option value='1'>Đã thanh toán</option>
                  <option value='2'>Thất bại</option>
                  <option value='3'>Đã hủy</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Từ ngày</label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='date'
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Đến ngày</label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='date'
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Loại đơn hàng</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Tất cả</option>
                  <option value='course'>Khóa học</option>
                  <option value='item'>Item</option>
                </select>
              </div>
            </div>

            {/* Row 3: Action Buttons */}
            <div className='flex gap-2'>
              <button
                type='submit'
                className='flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Tìm kiếm
              </button>
              <button
                type='button'
                onClick={handleResetSearch}
                className='flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Xóa lọc
              </button>
            </div>
          </form>
          <div className='flex justify-between items-center'>
            <p className='mt-2 text-gray-600'>Quản lý các đơn hàng trong hệ thống ({totalCount} đơn hàng)</p>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {loading && !orders.length ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : orders.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        STT
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Khách hàng
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Sản phẩm
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Loại
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Giá tiền
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Coin
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Trạng thái
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Ngày tạo
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {orders.map((order, index) => (
                      <tr key={order.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>{order.email}</div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-sm text-gray-900'>{order.courseTitle || order.itemName || '-'}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.courseId ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.courseId ? 'Khóa học' : 'Item'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {order.purchaseCost > 0 ? formatCurrency(order.purchaseCost) : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {order.coinCost > 0 ? order.coinCost : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              paymentStatusColorMap[order.paymentStatus]
                            }`}
                          >
                            {paymentStatusMap[order.paymentStatus] || 'Không xác định'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDate(order.createdAt)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <button
                            onClick={() => handleViewDetail(order)}
                            className='text-blue-600 hover:text-blue-900'
                            title='Xem chi tiết'
                          >
                            <Eye className='w-5 h-5' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
                  <div className='flex-1 flex justify-between sm:hidden'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Sau
                    </button>
                  </div>
                  <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>
                        Hiển thị <span className='font-medium'>{(currentPage - 1) * pageSize + 1}</span> đến{' '}
                        <span className='font-medium'>{Math.min(currentPage * pageSize, totalCount)}</span> trong tổng
                        số <span className='font-medium'>{totalCount}</span> đơn hàng
                      </p>
                    </div>
                    <div>
                      <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          Trước
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          Sau
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-6 border-b sticky top-0 bg-white'>
              <h2 className='text-xl font-semibold'>Chi tiết đơn hàng</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className='text-gray-400 hover:text-gray-600'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Khách hàng</p>
                  <p className='text-sm font-medium text-gray-900'>{selectedOrder.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Loại đơn hàng</p>
                  <p className='text-sm font-medium text-gray-900'>{selectedOrder.courseId ? 'Khóa học' : 'Item'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Sản phẩm</p>
                  <p className='text-sm font-medium text-gray-900'>
                    {selectedOrder.courseTitle || selectedOrder.itemName || '-'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Giá tiền</p>
                  <p className='text-sm font-medium text-gray-900'>
                    {selectedOrder.purchaseCost > 0 ? formatCurrency(selectedOrder.purchaseCost) : '-'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Coin</p>
                  <p className='text-sm font-medium text-gray-900'>
                    {selectedOrder.coinCost > 0 ? selectedOrder.coinCost : '-'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Trạng thái thanh toán</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                      paymentStatusColorMap[selectedOrder.paymentStatus]
                    }`}
                  >
                    {paymentStatusMap[selectedOrder.paymentStatus] || 'Không xác định'}
                  </span>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Ngày thanh toán</p>
                  <p className='text-sm font-medium text-gray-900'>{formatDate(selectedOrder.paidAt || '')}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Ngày tạo</p>
                  <p className='text-sm font-medium text-gray-900'>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Cập nhật lần cuối</p>
                  <p className='text-sm font-medium text-gray-900'>{formatDate(selectedOrder.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3 p-6 border-t bg-gray-50'>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default OrderManagement

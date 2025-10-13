import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Search, Upload, X } from 'lucide-react'
import AdminLayout from '~/components/layout/AdminLayout'
import { apiService } from '~/config/axios'
import type { Item, ItemsListResponse } from '~/types/item'
import type { Category, CategoriesListResponse } from '~/types/category'

const ItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(8)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [searchName, setSearchName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [errors, setErrors] = useState({
    name: '',
    categoryId: '',
    price: '',
    coin: '',
    description: ''
  })

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    isPremium: false,
    price: 0,
    coin: 0,
    description: ''
  })

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const response = await apiService.get<CategoriesListResponse>('/categories', {
        Page: 1,
        PageSize: 100,
        IsActive: true
      })

      if (response && response.succeeded) {
        const data = response as unknown as CategoriesListResponse
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Không thể tải danh sách danh mục')
    } finally {
      setLoadingCategories(false)
    }
  }

  // Fetch items từ API
  const fetchItems = async (page: number = 1, name: string = '') => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        Page: page,
        PageSize: pageSize
      }

      if (name && name.trim()) {
        params.ItemName = name.trim()
      }

      console.log('=== Fetching Items ===')
      console.log('Params:', params)

      const response = await apiService.get<ItemsListResponse>('/items', params)

      console.log('Response:', response)

      if (response && response.succeeded) {
        const data = response as unknown as ItemsListResponse
        setItems(data.data || [])
        setTotalPages(data.totalPages || 0)
        setTotalCount(data.totalCount || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Không thể tải danh sách items')
    } finally {
      setLoading(false)
    }
  }

  // Load items và categories khi component mount
  useEffect(() => {
    fetchItems(1, '')
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: '',
      categoryId: '',
      price: '',
      coin: '',
      description: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên item là bắt buộc'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên item phải có ít nhất 2 ký tự'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục'
    }

    if (formData.isPremium) {
      if (formData.price < 0) {
        newErrors.price = 'Giá phải lớn hơn hoặc bằng 0'
      }
      if (formData.coin < 0) {
        newErrors.coin = 'Coin phải lớn hơn hoặc bằng 0'
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc'
    }

    if (!editingItem && !imageFile) {
      toast.error('Vui lòng chọn hình ảnh')
      return false
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  // Xử lý chọn file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB')
        return
      }

      setImageFile(file)

      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      categoryId: '',
      isPremium: false,
      price: 0,
      coin: 0,
      description: ''
    })
    setImageFile(null)
    setImagePreview('')
    setErrors({
      name: '',
      categoryId: '',
      price: '',
      coin: '',
      description: ''
    })
    setIsModalOpen(true)
  }

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (item: Item) => {
    setEditingItem(item)
    setFormData({
      name: item.itemName,
      categoryId: item.categoryId,
      isPremium: item.isPremium,
      price: item.price,
      coin: item.coin,
      description: item.description
    })
    setImageFile(null)
    setImagePreview(item.imageUrl)
    setErrors({
      name: '',
      categoryId: '',
      price: '',
      coin: '',
      description: ''
    })
    setIsModalOpen(true)
  }

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData({
      name: '',
      categoryId: '',
      isPremium: false,
      price: 0,
      coin: 0,
      description: ''
    })
    setImageFile(null)
    setImagePreview('')
    setErrors({
      name: '',
      categoryId: '',
      price: '',
      coin: '',
      description: ''
    })
  }

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('Name', formData.name.trim())
      formDataToSend.append('CategoryId', formData.categoryId)
      formDataToSend.append('IsPremium', String(formData.isPremium))
      formDataToSend.append('Price', String(formData.price))
      formDataToSend.append('Coin', String(formData.coin))
      formDataToSend.append('Description', formData.description.trim())

      if (imageFile) {
        formDataToSend.append('Image', imageFile)
      }

      if (editingItem) {
        // Update item
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/items/${editingItem.itemId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        })

        const data = await response.json()

        if (data.succeeded) {
          toast.success('Cập nhật item thành công')
          handleCloseModal()
          fetchItems(currentPage, searchName)
        } else {
          toast.error(data.message || 'Có lỗi xảy ra')
        }
      } else {
        // Create item
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/items`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        })

        const data = await response.json()

        if (data.succeeded) {
          toast.success('Thêm item thành công')
          handleCloseModal()
          fetchItems(1, searchName)
        } else {
          toast.error(data.message || 'Có lỗi xảy ra')
        }
      }
    } catch (error: unknown) {
      console.error('Error saving item:', error)
      toast.error('Có lỗi xảy ra khi lưu item')
    } finally {
      setLoading(false)
    }
  }

  // Xóa item
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa item "${name}"?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await apiService.delete<{ succeeded: boolean }>(`/items/${id}`)

      if (response && response.succeeded) {
        toast.success('Xóa item thành công')
        if (items.length === 1 && currentPage > 1) {
          fetchItems(currentPage - 1, searchName)
        } else {
          fetchItems(currentPage, searchName)
        }
      }
    } catch (error: unknown) {
      console.error('Error deleting item:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa item'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== Searching Items ===')
    console.log('Search Name:', searchName)
    fetchItems(1, searchName)
  }

  // Reset tìm kiếm
  const handleResetSearch = () => {
    setSearchName('')
    fetchItems(1, '')
  }

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    fetchItems(page, searchName)
  }

  // Format tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản lý Items</h1>
            <p className='mt-2 text-gray-600'>Quản lý các items trong hệ thống ({totalCount} items)</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Thêm item
          </button>
        </div>

        {/* Search Bar */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <form onSubmit={handleSearch} className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên item...'
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>
            <button
              type='submit'
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Tìm kiếm
            </button>
            {searchName && (
              <button
                type='button'
                onClick={handleResetSearch}
                className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Xóa lọc
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {loading && !items.length ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : items.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>Không tìm thấy item nào</p>
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
                        Hình ảnh
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Tên item
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Danh mục
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Loại
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Giá
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Coin
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Trạng thái
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {items.map((item, index) => (
                      <tr key={item.itemId} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className='w-16 h-16 object-cover rounded'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://via.placeholder.com/64?text=No+Image'
                            }}
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-sm font-medium text-gray-900'>{item.itemName}</div>
                          <div className='text-sm text-gray-500 line-clamp-1'>{item.description}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800'>
                            {item.categoryName || 'N/A'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.isPremium ? 'Premium' : 'Free'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {item.isPremium ? formatCurrency(item.price) : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {item.isPremium ? item.coin : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className='text-blue-600 hover:text-blue-900 mr-4'
                            title='Chỉnh sửa'
                          >
                            <Pencil className='w-5 h-5' />
                          </button>
                          <button
                            onClick={() => handleDelete(item.itemId, item.itemName)}
                            className='text-red-600 hover:text-red-900'
                            title='Xóa'
                          >
                            <Trash2 className='w-5 h-5' />
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
                        số <span className='font-medium'>{totalCount}</span> items
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

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-6 border-b sticky top-0 bg-white'>
              <h2 className='text-xl font-semibold'>{editingItem ? 'Chỉnh sửa item' : 'Thêm item mới'}</h2>
              <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600'>
                <X className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Tên item */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Tên item <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập tên item'
                  />
                  {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
                </div>

                {/* Danh mục */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Danh mục <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loadingCategories}
                  >
                    <option value=''>-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className='mt-1 text-sm text-red-500'>{errors.categoryId}</p>}
                </div>

                {/* Premium */}
                <div className='md:col-span-2'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={formData.isPremium}
                      onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700'>Item Premium</span>
                  </label>
                </div>

                {/* Giá và Coin - chỉ hiện khi isPremium = true */}
                {formData.isPremium && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Giá (VNĐ) <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='number'
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='0'
                        min='0'
                      />
                      {errors.price && <p className='mt-1 text-sm text-red-500'>{errors.price}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Coin <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='number'
                        value={formData.coin}
                        onChange={(e) => setFormData({ ...formData, coin: Number(e.target.value) })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.coin ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='0'
                        min='0'
                      />
                      {errors.coin && <p className='mt-1 text-sm text-red-500'>{errors.coin}</p>}
                    </div>
                  </>
                )}

                {/* Mô tả */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Mô tả <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập mô tả item'
                  />
                  {errors.description && <p className='mt-1 text-sm text-red-500'>{errors.description}</p>}
                </div>

                {/* Hình ảnh */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Hình ảnh {!editingItem && <span className='text-red-500'>*</span>}
                  </label>
                  <div className='flex items-center space-x-4'>
                    <label className='flex-1 flex items-center justify-center px-4 py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors'>
                      <div className='space-y-1 text-center'>
                        <Upload className='mx-auto h-8 w-8 text-gray-400' />
                        <div className='text-sm text-gray-600'>{imageFile ? imageFile.name : 'Chọn hình ảnh'}</div>
                      </div>
                      <input type='file' className='hidden' accept='image/*' onChange={handleImageChange} />
                    </label>
                    {imagePreview && (
                      <div className='relative'>
                        <img src={imagePreview} alt='Preview' className='w-24 h-24 object-cover rounded-lg' />
                        <button
                          type='button'
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview('')
                          }}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className='mt-1 text-sm text-gray-500'>Định dạng: JPG, PNG, GIF. Tối đa 5MB</p>
                </div>
              </div>

              <div className='flex gap-3 pt-4 border-t'>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Đang xử lý...' : editingItem ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ItemManagement

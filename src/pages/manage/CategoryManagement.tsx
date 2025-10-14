import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Search, X } from 'lucide-react'
import AdminLayout from '~/components/layout/AdminLayout'
import { apiService } from '~/config/axios'
import type { Category, CategoriesListResponse } from '~/types/category'

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchName, setSearchName] = useState('')

  const [errors, setErrors] = useState({
    name: ''
  })

  const [formData, setFormData] = useState({
    name: ''
  })

  // Fetch categories từ API
  const fetchCategories = async (page: number = 1, name: string = '') => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        Page: page,
        PageSize: pageSize
      }

      if (name && name.trim()) {
        params.Name = name.trim()
      }

      console.log('=== Fetching Categories ===')
      console.log('Params:', params)

      const response = await apiService.get<CategoriesListResponse>('/categories', params)

      console.log('Response:', response)

      if (response && response.succeeded) {
        const data = response as unknown as CategoriesListResponse
        setCategories(data.data || [])
        setTotalPages(data.totalPages || 0)
        setTotalCount(data.totalCount || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Không thể tải danh sách danh mục')
    } finally {
      setLoading(false)
    }
  }

  // Load categories khi component mount
  useEffect(() => {
    fetchCategories(1, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Tên danh mục không được vượt quá 100 ký tự'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingCategory(null)
    setFormData({
      name: ''
    })
    setErrors({
      name: ''
    })
    setIsModalOpen(true)
  }

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name
    })
    setErrors({
      name: ''
    })
    setIsModalOpen(true)
  }

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({
      name: ''
    })
    setErrors({
      name: ''
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
      if (editingCategory) {
        // Update category
        const response = await apiService.put<{ succeeded: boolean }>(`/categories/${editingCategory.id}`, {
          name: formData.name.trim()
        })

        if (response && response.succeeded) {
          toast.success('Cập nhật danh mục thành công')
          handleCloseModal()
          fetchCategories(currentPage, searchName)
        }
      } else {
        // Create category
        const response = await apiService.post<{ succeeded: boolean }>('/categories', {
          name: formData.name.trim()
        })

        if (response && response.succeeded) {
          toast.success('Thêm danh mục thành công')
          handleCloseModal()
          fetchCategories(1, searchName)
        }
      }
    } catch (error: unknown) {
      console.error('Error saving category:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Xóa category
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await apiService.delete<{ succeeded: boolean }>(`/categories/${id}`)

      if (response && response.succeeded) {
        toast.success('Xóa danh mục thành công')
        // Nếu xóa hết items trong page hiện tại và không phải page 1, quay về page trước
        if (categories.length === 1 && currentPage > 1) {
          fetchCategories(currentPage - 1, searchName)
        } else {
          fetchCategories(currentPage, searchName)
        }
      }
    } catch (error: unknown) {
      console.error('Error deleting category:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa danh mục'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCategories(1, searchName)
  }

  // Reset tìm kiếm
  const handleResetSearch = () => {
    setSearchName('')
    fetchCategories(1, '')
  }

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    fetchCategories(page, searchName)
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản lý danh mục</h1>
            <p className='mt-2 text-gray-600'>Quản lý danh mục từ vựng trong hệ thống ({totalCount} danh mục)</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Thêm danh mục
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
                  placeholder='Tìm kiếm theo tên danh mục...'
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
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : categories.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>Không tìm thấy danh mục nào</p>
            </div>
          ) : (
            <>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      STT
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tên danh mục
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
                  {categories.map((category, index) => (
                    <tr key={category.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{category.name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className='text-blue-600 hover:text-blue-900 mr-4'
                          title='Chỉnh sửa'
                        >
                          <Pencil className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
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
                        số <span className='font-medium'>{totalCount}</span> danh mục
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
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
            <div className='flex justify-between items-center p-6 border-b'>
              <h2 className='text-xl font-semibold'>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
              <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600'>
                <X className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tên danh mục <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập tên danh mục'
                />
                {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
              </div>

              <div className='flex gap-3 pt-4'>
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
                  {loading ? 'Đang xử lý...' : editingCategory ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default CategoryManagement

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import AdminLayout from '~/components/layout/AdminLayout'
import { apiService } from '~/config/axios'
import type {
  LevelRange,
  LevelRangesListResponse,
  CreateLevelRangeData,
  UpdateLevelRangeData
} from '~/types/levelRange'

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LevelRangeManagement() {
  const [levelRanges, setLevelRanges] = useState<LevelRange[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 8

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLevelRange, setEditingLevelRange] = useState<LevelRange | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    fromExp: 0,
    toExp: 0
  })

  // Form errors
  const [errors, setErrors] = useState({
    name: '',
    fromExp: '',
    toExp: ''
  })

  // Fetch level ranges từ API
  const fetchLevelRanges = async (page: number = 1) => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        Page: page,
        PageSize: pageSize
      }

      console.log('=== Fetching Level Ranges ===')
      console.log('Params:', params)

      const response = await apiService.get<LevelRangesListResponse>('/level-ranges', params)

      console.log('Response:', response)

      if (response && (response as any).succeeded) {
        const data = response as unknown as LevelRangesListResponse
        console.log('Level Ranges Data:', data.data)
        setLevelRanges(data.data || [])
        setTotalPages(data.totalPages || 0)
        setTotalCount(data.totalCount || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching level ranges:', error)
      toast.error('Không thể tải danh sách level ranges')
    } finally {
      setLoading(false)
    }
  }

  // Load level ranges khi component mount
  useEffect(() => {
    fetchLevelRanges(1)
  }, [])

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: '',
      fromExp: '',
      toExp: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên level range không được để trống'
    }

    if (formData.fromExp < 0) {
      newErrors.fromExp = 'From EXP phải >= 0'
    }

    if (formData.toExp <= 0) {
      newErrors.toExp = 'To EXP phải lớn hơn 0'
    }

    if (formData.toExp <= formData.fromExp) {
      newErrors.toExp = 'To EXP phải lớn hơn From EXP'
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.fromExp && !newErrors.toExp
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      fromExp: 0,
      toExp: 0
    })
    setErrors({
      name: '',
      fromExp: '',
      toExp: ''
    })
    setEditingLevelRange(null)
  }

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (levelRange: LevelRange) => {
    setEditingLevelRange(levelRange)
    setFormData({
      name: levelRange.name,
      fromExp: levelRange.fromExp,
      toExp: levelRange.toExp
    })
    setErrors({
      name: '',
      fromExp: '',
      toExp: ''
    })
    setIsModalOpen(true)
  }

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  // Submit form (thêm mới hoặc cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    setLoading(true)
    try {
      if (editingLevelRange) {
        // Update
        const updateData: UpdateLevelRangeData = {
          id: editingLevelRange.id,
          name: formData.name.trim(),
          fromExp: formData.fromExp,
          toExp: formData.toExp
        }

        console.log('=== Updating Level Range ===')
        console.log('Update Data:', updateData)

        const response = await apiService.put(`/level-ranges/${editingLevelRange.id}`, updateData as any)

        console.log('Update Response:', response)

        if (response && (response as any).succeeded) {
          toast.success('Cập nhật level range thành công')
          handleCloseModal()
          fetchLevelRanges(currentPage)
        } else {
          toast.error((response as any).message || 'Cập nhật level range thất bại')
        }
      } else {
        // Create
        const createData: CreateLevelRangeData = {
          name: formData.name.trim(),
          fromExp: formData.fromExp,
          toExp: formData.toExp
        }

        console.log('=== Creating Level Range ===')
        console.log('Create Data:', createData)

        const response = await apiService.post('/level-ranges', createData as any)

        console.log('Create Response:', response)

        if (response && (response as any).succeeded) {
          toast.success('Tạo level range thành công')
          handleCloseModal()
          fetchLevelRanges(1)
        } else {
          toast.error((response as any).message || 'Tạo level range thất bại')
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(editingLevelRange ? 'Cập nhật level range thất bại' : 'Tạo level range thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Xóa level range
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa level range "${name}"?`)) {
      return
    }

    setLoading(true)
    try {
      console.log('=== Deleting Level Range ===')
      console.log('ID:', id)

      const response = await apiService.delete(`/level-ranges/${id}`)

      console.log('Delete Response:', response)

      if (response && (response as any).succeeded) {
        toast.success('Xóa level range thành công')

        // Nếu xóa item cuối cùng của trang và không phải trang đầu
        if (levelRanges.length === 1 && currentPage > 1) {
          fetchLevelRanges(currentPage - 1)
        } else {
          fetchLevelRanges(currentPage)
        }
      } else {
        toast.error((response as any).message || 'Xóa level range thất bại')
      }
    } catch (error) {
      console.error('Error deleting level range:', error)
      toast.error('Xóa level range thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Phân trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    fetchLevelRanges(page)
  }

  // Tính toán pagination
  const getPaginationRange = () => {
    const maxPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    const endPage = Math.min(totalPages, startPage + maxPages - 1)

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Level Range Management</h1>
          <p className='text-gray-600 mt-2'>Quản lý các level ranges trong hệ thống ({totalCount} level ranges)</p>
        </div>

        {/* Actions */}
        <div className='flex justify-between items-center'>
          <div></div>
          <button
            onClick={handleOpenAddModal}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Thêm level range
          </button>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    STT
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tên Level
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Khoảng EXP
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {loading ? (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center text-gray-500'>
                      <div className='flex justify-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                      </div>
                    </td>
                  </tr>
                ) : levelRanges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center text-gray-500'>
                      Không có level range nào
                    </td>
                  </tr>
                ) : (
                  levelRanges.map((levelRange, index) => (
                    <tr key={levelRange.id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{levelRange.name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {levelRange.fromExp?.toLocaleString() || '0'} - {levelRange.toExp?.toLocaleString() || '0'}{' '}
                          EXP
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            levelRange.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {levelRange.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <button
                          onClick={() => handleOpenEditModal(levelRange)}
                          className='text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center'
                          title='Chỉnh sửa'
                        >
                          <Pencil className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => handleDelete(levelRange.id, levelRange.name)}
                          className='text-red-600 hover:text-red-900 inline-flex items-center'
                          title='Xóa'
                        >
                          <Trash2 className='w-5 h-5' />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-700'>
                  Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong
                  tổng số {totalCount} level ranges
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    Trước
                  </button>
                  {getPaginationRange().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  {editingLevelRange ? 'Chỉnh sửa Level Range' : 'Thêm Level Range mới'}
                </h2>
                <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600 transition-colors'>
                  <X className='w-6 h-6' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                {/* Tên Level Range */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Tên Level Range <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập tên level range'
                  />
                  {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
                </div>

                {/* From EXP */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    From EXP <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.fromExp}
                    onChange={(e) => setFormData({ ...formData, fromExp: Number(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fromExp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập from EXP'
                    min='0'
                  />
                  {errors.fromExp && <p className='mt-1 text-sm text-red-500'>{errors.fromExp}</p>}
                </div>

                {/* To EXP */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    To EXP <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.toExp}
                    onChange={(e) => setFormData({ ...formData, toExp: Number(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.toExp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập to EXP'
                    min='0'
                  />
                  {errors.toExp && <p className='mt-1 text-sm text-red-500'>{errors.toExp}</p>}
                </div>

                {/* Buttons */}
                <div className='flex gap-4 pt-4'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    {loading ? 'Đang xử lý...' : editingLevelRange ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type='button'
                    onClick={handleCloseModal}
                    className='flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

import React, { useEffect, useState } from 'react'
import AdminLayout from '~/components/layout/AdminLayout'
import { apiService } from '~/config/axios'
import { toast } from 'sonner'
import type { RevenueData } from '~/types/dashboard'

const Dashboard: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    itemRevenue: 0,
    courseRevenue: 0,
    premiumRevenue: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<string>(() => {
    // Default to 1 year ago
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState<string>(() => {
    // Default to today
    return new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchRevenueData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      const startDateTime = new Date(startDate).toISOString()

      // End date: add 1 day then subtract 1 second to get 23:59:59
      const endDateObj = new Date(endDate)
      endDateObj.setDate(endDateObj.getDate() + 1)
      endDateObj.setSeconds(endDateObj.getSeconds() - 1)
      const endDateTime = endDateObj.toISOString()

      const response = await apiService.get<RevenueData>(
        `/dashboards/revenue?StartDate=${startDateTime}&EndDate=${endDateTime}`
      )

      if (response.succeeded && response.data) {
        setRevenueData(response.data)
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      toast.error('Không thể tải dữ liệu doanh thu')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        toast.error('Ngày bắt đầu phải trước ngày kết thúc')
        return
      }
      fetchRevenueData()
    }
  }
  const statsCards = [
    {
      title: 'Tổng số người dùng hiện tại',
      value: '635',
      color: 'blue',
      icon: (
        <svg className='w-6 h-6 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      )
    },
    {
      title: 'Tổng số khóa học hiện tại',
      value: '325',
      color: 'green',
      icon: (
        <svg className='w-6 h-6 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
          />
        </svg>
      )
    },
    {
      title: 'Tổng số xu đã dùng',
      value: '15.8k',
      color: 'yellow',
      icon: (
        <svg className='w-6 h-6 text-yellow-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      )
    }
  ]

  const subscriptionData = [
    { name: 'Tất cả gói đăng ký', percentage: 100, color: 'bg-purple-500' },
    { name: 'Miễn phí', percentage: 37, color: 'bg-blue-400' },
    { name: 'Premium A', percentage: 23, color: 'bg-green-400' },
    { name: 'Premium B', percentage: 19, color: 'bg-yellow-400' },
    { name: 'Học thuật', percentage: 21, color: 'bg-red-400' }
  ]

  const popularLanguages = [
    { name: 'Tiếng Anh', percentage: 90 },
    { name: 'Tiếng Nhật', percentage: 75 },
    { name: 'Tiếng Hàn', percentage: 60 },
    { name: 'Tiếng Trung', percentage: 45 }
  ]

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Date Range Filter */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 flex-1'>
              <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Ngày bắt đầu:</label>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              />
            </div>
            <div className='flex items-center gap-2 flex-1'>
              <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Ngày kết thúc:</label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              />
            </div>
            <button
              onClick={handleDateChange}
              disabled={loading}
              className='px-6 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm'
            >
              {loading ? 'Đang tải...' : 'Áp dụng'}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {statsCards.map((card, index) => (
            <div key={index} className='bg-white rounded-lg p-6 shadow-sm'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <p className='text-sm text-gray-500 mb-1'>Thống kê</p>
                  <h3 className='text-lg font-semibold text-gray-900'>{card.title}</h3>
                </div>
                <div className='flex items-center space-x-2'>{card.icon}</div>
              </div>
              <div className='flex items-center'>
                <span className='text-3xl font-bold text-gray-900'>{card.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Sales Chart */}
          <div className='bg-white rounded-lg p-6 shadow-sm lg:col-span-1'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Thống kê</p>
                <h3 className='text-lg font-semibold text-gray-900'>Tổng quan doanh số</h3>
              </div>
              <div className='flex space-x-2'>
                <button className='px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded'>Ngày</button>
                <button className='px-3 py-1 text-sm text-white bg-gray-800 rounded'>Tuần</button>
                <button className='px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded'>Tháng</button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
              <div className='grid grid-cols-7 gap-2 w-full h-full p-4'>
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                  <div key={day} className='flex flex-col items-center justify-end space-y-1'>
                    <div className='flex space-x-1'>
                      <div
                        className={`w-3 bg-purple-500 rounded-sm`}
                        style={{ height: `${Math.random() * 60 + 20}px` }}
                      ></div>
                      <div
                        className={`w-3 bg-blue-400 rounded-sm`}
                        style={{ height: `${Math.random() * 80 + 10}px` }}
                      ></div>
                      <div
                        className={`w-3 bg-cyan-300 rounded-sm`}
                        style={{ height: `${Math.random() * 40 + 30}px` }}
                      ></div>
                    </div>
                    <span className='text-xs text-gray-500'>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Stats */}
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-6'>
              <div className='space-y-4'>
                {subscriptionData.map((item, index) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className='text-sm text-gray-600 flex-1'>{item.name}</span>
                    <span className='text-sm font-medium text-gray-900'>{item.percentage}%</span>
                  </div>
                ))}
              </div>

              {/* Circular Progress */}
              <div className='relative w-32 h-32'>
                <svg className='w-32 h-32 transform -rotate-90' viewBox='0 0 120 120'>
                  <circle cx='60' cy='60' r='50' fill='none' stroke='#E5E7EB' strokeWidth='8' />
                  <circle
                    cx='60'
                    cy='60'
                    r='50'
                    fill='none'
                    stroke='#8B5CF6'
                    strokeWidth='8'
                    strokeDasharray={`${72 * 3.14} ${100 * 3.14}`}
                    strokeLinecap='round'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-900'>72%</div>
                    <div className='text-xs text-gray-500'>Doanh số</div>
                    <div className='text-xs font-medium'>24.400 VNĐ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Revenue Chart */}
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='mb-4'>
              <p className='text-sm text-gray-500 mb-1'>Doanh thu</p>
              <h3 className='text-2xl font-bold text-gray-900'>
                {loading ? (
                  <span className='text-gray-400'>Đang tải...</span>
                ) : (
                  `${revenueData.totalRevenue.toLocaleString()} VNĐ`
                )}
              </h3>
            </div>

            {/* Mini Chart */}
            <div className='h-40 bg-gray-50 rounded-lg flex items-end p-4 gap-3'>
              {!loading && revenueData.totalRevenue > 0 ? (
                <>
                  {/* Item Revenue Bar */}
                  <div className='flex-1 flex flex-col items-center gap-2'>
                    <div className='w-full flex items-end justify-center' style={{ height: '120px' }}>
                      <div
                        className='bg-purple-500 rounded-t-lg w-full transition-all duration-300 flex items-end justify-center pb-1'
                        style={{
                          height: `${(revenueData.itemRevenue / revenueData.totalRevenue) * 100}%`,
                          minHeight: '30px'
                        }}
                      >
                        <span className='text-xs text-white font-medium'>
                          {Math.round((revenueData.itemRevenue / revenueData.totalRevenue) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Course Revenue Bar */}
                  <div className='flex-1 flex flex-col items-center gap-2'>
                    <div className='w-full flex items-end justify-center' style={{ height: '120px' }}>
                      <div
                        className='bg-blue-400 rounded-t-lg w-full transition-all duration-300 flex items-end justify-center pb-1'
                        style={{
                          height: `${(revenueData.courseRevenue / revenueData.totalRevenue) * 100}%`,
                          minHeight: '30px'
                        }}
                      >
                        <span className='text-xs text-white font-medium'>
                          {Math.round((revenueData.courseRevenue / revenueData.totalRevenue) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Premium Revenue Bar */}
                  <div className='flex-1 flex flex-col items-center gap-2'>
                    <div className='w-full flex items-end justify-center' style={{ height: '120px' }}>
                      <div
                        className='bg-green-400 rounded-t-lg w-full transition-all duration-300 flex items-end justify-center pb-1'
                        style={{
                          height: `${(revenueData.premiumRevenue / revenueData.totalRevenue) * 100}%`,
                          minHeight: '30px'
                        }}
                      >
                        <span className='text-xs text-white font-medium'>
                          {Math.round((revenueData.premiumRevenue / revenueData.totalRevenue) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400 text-sm'>
                  {loading ? 'Đang tải...' : 'Không có dữ liệu'}
                </div>
              )}
            </div>

            <div className='mt-4 space-y-2'>
              <div className='flex items-center justify-between text-xs'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  <span className='text-gray-600'>Vật phẩm</span>
                </div>
                <span className='font-medium'>
                  {loading ? '...' : `${revenueData.itemRevenue.toLocaleString()} VNĐ`}
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                  <span className='text-gray-600'>Khóa học</span>
                </div>
                <span className='font-medium'>
                  {loading ? '...' : `${revenueData.courseRevenue.toLocaleString()} VNĐ`}
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                  <span className='text-gray-600'>Gói Premium</span>
                </div>
                <span className='font-medium'>
                  {loading ? '...' : `${revenueData.premiumRevenue.toLocaleString()} VNĐ`}
                </span>
              </div>
            </div>
          </div>

          {/* Popular Language Pack */}
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='mb-4'>
              <p className='text-sm text-gray-500 mb-1'>Thống kê</p>
              <h3 className='text-lg font-semibold text-gray-900'>Gói ngôn ngữ phổ biến</h3>
            </div>

            <div className='space-y-4'>
              {popularLanguages.map((lang, index) => (
                <div key={index}>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='text-gray-600'>{lang.name}</span>
                    <span className='text-gray-900 font-medium'>{lang.percentage}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-purple-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${lang.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Goal */}
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='text-center'>
              <p className='text-sm text-gray-500 mb-2'>Mục tiêu doanh số</p>
              <h3 className='text-2xl font-bold text-gray-900 mb-1'>32.000 VNĐ</h3>
              <p className='text-sm text-gray-500 mb-4'>Mục tiêu thưởng</p>
              <p className='text-lg font-semibold text-gray-900'>7.600 VNĐ</p>

              {/* Circular Progress */}
              <div className='relative w-24 h-24 mx-auto mt-4'>
                <svg className='w-24 h-24 transform -rotate-90' viewBox='0 0 120 120'>
                  <circle cx='60' cy='60' r='40' fill='none' stroke='#E5E7EB' strokeWidth='12' />
                  <circle
                    cx='60'
                    cy='60'
                    r='40'
                    fill='none'
                    stroke='#8B5CF6'
                    strokeWidth='12'
                    strokeDasharray={`${72 * 2.51} ${100 * 2.51}`}
                    strokeLinecap='round'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-gray-900'>72%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard

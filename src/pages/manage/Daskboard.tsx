import React from 'react'
import AdminLayout from '~/components/layout/AdminLayout'

const Dashboard: React.FC = () => {
  const statsCards = [
    {
      title: 'Realtime users',
      value: '635',
      change: '+21.01%',
      changeType: 'positive',
      color: 'blue',
      chart: (
        <svg className='w-16 h-8' viewBox='0 0 60 30' fill='none'>
          <path
            d='M2 25L8 20L14 22L20 15L26 18L32 12L38 8L44 14L50 10L56 6'
            stroke='#3B82F6'
            strokeWidth='2'
            fill='none'
          />
        </svg>
      )
    },
    {
      title: 'Total visits',
      value: '325k',
      change: '+10.54%',
      changeType: 'positive',
      color: 'green',
      chart: (
        <svg className='w-16 h-8' viewBox='0 0 60 30' fill='none'>
          <path
            d='M2 28L8 25L14 20L20 15L26 12L32 8L38 10L44 6L50 4L56 2'
            stroke='#10B981'
            strokeWidth='2'
            fill='none'
          />
        </svg>
      )
    },
    {
      title: 'Visit duration',
      value: '5m 8s',
      change: '-7.65%',
      changeType: 'negative',
      color: 'red',
      chart: (
        <svg className='w-16 h-8' viewBox='0 0 60 30' fill='none'>
          <path
            d='M2 15L8 18L14 12L20 16L26 20L32 24L38 22L44 26L50 24L56 28'
            stroke='#EF4444'
            strokeWidth='2'
            fill='none'
          />
        </svg>
      )
    }
  ]

  const subscriptionData = [
    { name: 'All Subscription', percentage: 100, color: 'bg-purple-500' },
    { name: 'Free', percentage: 37, color: 'bg-blue-400' },
    { name: 'Premium A', percentage: 23, color: 'bg-green-400' },
    { name: 'Premium B', percentage: 19, color: 'bg-yellow-400' },
    { name: 'Academic', percentage: 21, color: 'bg-red-400' }
  ]

  const popularLanguages = [
    { name: 'English', percentage: 90 },
    { name: 'Japanese', percentage: 75 },
    { name: 'Korean', percentage: 60 },
    { name: 'Chinese', percentage: 45 }
  ]

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {statsCards.map((card, index) => (
            <div key={index} className='bg-white rounded-lg p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Statistics</p>
                  <h3 className='text-lg font-semibold text-gray-900'>{card.title}</h3>
                </div>
                <div className='flex items-center space-x-2'>
                  {card.chart}
                  <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
              <div className='flex items-end justify-between'>
                <span className='text-3xl font-bold text-gray-900'>{card.value}</span>
                <span
                  className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Sales Chart */}
          <div className='bg-white rounded-lg p-6 shadow-sm lg:col-span-1'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Statistics</p>
                <h3 className='text-lg font-semibold text-gray-900'>Total summary of sales</h3>
              </div>
              <div className='flex space-x-2'>
                <button className='px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded'>Day</button>
                <button className='px-3 py-1 text-sm text-white bg-gray-800 rounded'>Weekly</button>
                <button className='px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded'>Monthly</button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
              <div className='grid grid-cols-7 gap-2 w-full h-full p-4'>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
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
                    <div className='text-xs text-gray-500'>Sales</div>
                    <div className='text-xs font-medium'>$24,400</div>
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
              <p className='text-sm text-gray-500 mb-1'>Revenue</p>
              <h3 className='text-2xl font-bold text-gray-900'>$24,400</h3>
            </div>

            {/* Mini Chart */}
            <div className='h-16 bg-gray-50 rounded-lg flex items-end p-2 space-x-1'>
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className='bg-purple-500 rounded-sm flex-1'
                  style={{ height: `${Math.random() * 40 + 10}px` }}
                ></div>
              ))}
            </div>

            <div className='mt-4 flex items-center space-x-4 text-xs'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                <span className='text-gray-600'>Product sales</span>
                <span className='font-medium'>$8,574</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                <span className='text-gray-600'>Subscriptions</span>
                <span className='font-medium'>$15,249</span>
              </div>
            </div>
          </div>

          {/* Popular Language Pack */}
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='mb-4'>
              <p className='text-sm text-gray-500 mb-1'>Statistics</p>
              <h3 className='text-lg font-semibold text-gray-900'>Popular Language Pack</h3>
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
              <p className='text-sm text-gray-500 mb-2'>Sales Goal</p>
              <h3 className='text-2xl font-bold text-gray-900 mb-1'>$32,000</h3>
              <p className='text-sm text-gray-500 mb-4'>Bonus Goal</p>
              <p className='text-lg font-semibold text-gray-900'>$7,600</p>

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

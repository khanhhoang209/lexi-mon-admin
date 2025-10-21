import React from 'react'
import { useAuth } from '~/contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
        </svg>
      ),
      path: '/dashboard',
      active: location.pathname === '/dashboard' || location.pathname === '/'
    },
    // {
    //   id: 'user',
    //   name: 'User',
    //   icon: (
    //     <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
    //       <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
    //     </svg>
    //   ),
    //   path: '/users',
    //   active: location.pathname === '/users'
    // },
    // {
    //   id: 'vocabulary',
    //   name: 'Vocabulary',
    //   icon: (
    //     <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
    //       <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
    //     </svg>
    //   ),
    //   path: '/vocabulary',
    //   active: location.pathname === '/vocabulary'
    // },
    {
      id: 'category',
      name: 'Category',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
        </svg>
      ),
      path: '/categories',
      active: location.pathname === '/categories'
    },
    {
      id: 'item',
      name: 'Item',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
        </svg>
      ),
      path: '/items',
      active: location.pathname === '/items'
    },
    {
      id: 'course',
      name: 'Course',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
        </svg>
      ),
      path: '/courses',
      active: location.pathname === '/courses'
    },
    {
      id: 'level-range',
      name: 'Level Range',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
        </svg>
      ),
      path: '/level-ranges',
      active: location.pathname === '/level-ranges'
    },
    {
      id: 'order',
      name: 'Orders',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
          <path
            fillRule='evenodd'
            d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
            clipRule='evenodd'
          />
        </svg>
      ),
      path: '/orders',
      active: location.pathname === '/orders'
    }
    // {
    //   id: 'package',
    //   name: 'Package',
    //   icon: (
    //     <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
    //       <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
    //     </svg>
    //   ),
    //   path: '/packages',
    //   active: location.pathname === '/packages'
    // }
    // {
    //   id: 'asset',
    //   name: 'Asset',
    //   icon: (
    //     <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
    //       <path
    //         fillRule='evenodd'
    //         d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
    //         clipRule='evenodd'
    //       />
    //     </svg>
    //   ),
    //   path: '/assets',
    //   active: location.pathname === '/assets'
    // }
  ]

  const handleSidebarClick = (path: string) => {
    navigate(path)
  }

  const getPageTitle = () => {
    const currentPath = location.pathname
    if (currentPath === '/' || currentPath === '/dashboard') return 'Dashboard'
    if (currentPath === '/users') return 'User Management'
    if (currentPath === '/vocabulary') return 'Vocabulary Management'
    if (currentPath === '/items') return 'Quản Lý Vât Phẩm'
    if (currentPath === '/courses') return 'Quản Lý Khóa Học'
    if (currentPath === '/categories') return 'Quản Lý Danh Mục Vật Phẩm'
    if (currentPath === '/level-ranges') return 'Quản Lý Khoảng Cấp Độ'
    if (currentPath === '/orders') return 'Quản Lý Đơn Hàng'
    if (currentPath === '/packages') return 'Quản Lý Gói'
    if (currentPath === '/assets') return 'Quản Lý Tài Sản'
    return 'Dashboard'
  }

  return (
    <div className='h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex'>
      {/* Sidebar - Light Theme */}
      <div className='w-72 bg-white shadow-2xl flex flex-col relative overflow-hidden border-r border-gray-100'>
        {/* Background decorative elements */}
        <div className='absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none'>
          <div className='absolute top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl'></div>
        </div>

        {/* Sidebar Header */}
        <div className='p-6 border-b border-gray-200 relative z-10'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <div>
              <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                LexiMon
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
          <ul className='space-y-1.5'>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleSidebarClick(item.path)}
                  className={`w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:scale-102'
                  }`}
                >
                  {item.active && (
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl'></div>
                  )}
                  <span
                    className={`mr-3 transition-transform duration-200 ${item.active ? 'scale-110' : 'group-hover:scale-110'}`}
                  >
                    {item.icon}
                  </span>
                  <span className='font-medium relative z-10'>{item.name}</span>
                  {item.active && (
                    <div className='ml-auto'>
                      <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className='p-4 border-t border-gray-200 relative z-10'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-center px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group border border-red-200'
          >
            <svg
              className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-medium'>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header - Modern Glassmorphism */}
        <header className='bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 px-8 py-4 sticky top-0 z-40'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                  <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
                <div>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
                    {getPageTitle()}
                  </h2>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className='flex items-center space-x-3'>
              <div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl px-4 py-2 border border-blue-100'>
                <div className='flex items-center space-x-3'>
                  <div className='flex-1 min-w-0 text-right'>
                    <p className='text-sm font-medium text-gray-900 truncate'>Admin User</p>
                    <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                  </div>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg'>
                    <span className='text-white text-sm font-bold'>{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-8'>
          <div className='max-w-[1600px] mx-auto'>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

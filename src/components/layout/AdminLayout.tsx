import React, { useState } from 'react'
import { useAuth } from '~/contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
    {
      id: 'user',
      name: 'User',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
        </svg>
      ),
      path: '/users',
      active: location.pathname === '/users'
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      path: '/vocabulary',
      active: location.pathname === '/vocabulary'
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
          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      path: '/courses',
      active: location.pathname === '/courses'
    },
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
      id: 'package',
      name: 'Package',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
        </svg>
      ),
      path: '/packages',
      active: location.pathname === '/packages'
    },
    {
      id: 'asset',
      name: 'Asset',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
            clipRule='evenodd'
          />
        </svg>
      ),
      path: '/assets',
      active: location.pathname === '/assets'
    }
  ]

  const handleSidebarClick = (path: string) => {
    navigate(path)
  }

  const getPageTitle = () => {
    const currentPath = location.pathname
    if (currentPath === '/' || currentPath === '/dashboard') return 'Dashboard'
    if (currentPath === '/users') return 'User Management'
    if (currentPath === '/vocabulary') return 'Vocabulary Management'
    if (currentPath === '/items') return 'Item Management'
    if (currentPath === '/courses') return 'Course Management'
    if (currentPath === '/categories') return 'Category Management'
    if (currentPath === '/level-ranges') return 'Level Range Management'
    if (currentPath === '/packages') return 'Package Management'
    if (currentPath === '/assets') return 'Asset Management'
    return 'Dashboard'
  }

  return (
    <div className='h-screen bg-gray-100 flex'>
      {/* Sidebar */}
      <div className='w-64 bg-white shadow-lg flex flex-col'>
        {/* Sidebar Header */}
        <div className='p-6 border-b border-gray-200'>
          <h1 className='text-xl font-bold text-gray-800'>Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4'>
          <ul className='space-y-2'>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleSidebarClick(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className='mr-3'>{item.icon}</span>
                  <span className='font-medium'>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className='p-4 border-t border-gray-200'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors'
          >
            <svg className='w-5 h-5 mr-3' fill='currentColor' viewBox='0 0 20 20'>
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
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <h2 className='text-2xl font-semibold text-gray-800'>{getPageTitle()}</h2>
            </div>

            <div className='flex items-center space-x-4'>
              {/* Search */}
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  type='text'
                  placeholder='Quick search'
                  className='block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              {/* Profile Dropdown */}
              <div className='relative'>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-medium'>{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className='text-gray-700 font-medium'>Admin</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileOpen ? 'transform rotate-180' : ''
                    }`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200'>
                    <div className='px-4 py-2 border-b border-gray-200'>
                      <p className='text-sm text-gray-500'>Signed in as</p>
                      <p className='text-sm font-medium text-gray-900 truncate'>{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50'
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6'>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout

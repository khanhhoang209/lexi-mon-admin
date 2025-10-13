import React, { useEffect } from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router'
import { AuthProvider } from '~/contexts/AuthContext'
import { setNavigate } from '~/config/axios'
import LoginPage from '~/pages/auth/LoginPage'
import ProtectedRoute from '~/components/auth/ProtectedRoute'
import NotFound from '~/pages/error/NotFound'
import Dashboard from '~/pages/manage/Daskboard'

const AppRoutes: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login' element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Placeholder routes for sidebar navigation */}
      <Route
        path='/users'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/vocabulary'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/packages'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/assets'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <Toaster position='top-right' richColors closeButton duration={4000} />
      </BrowserRouter>
    </>
  )
}

export default App

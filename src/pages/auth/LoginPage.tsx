import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

import { toast } from 'sonner'
import { apiService } from '~/config/axios'
import { useAuth } from '~/contexts/AuthContext'
import type { LoginRequest, LoginResponse } from '~/types/auth'

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleInputChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiService.post<LoginResponse>('/auths/login', {
        email: formData.email.trim(),
        password: formData.password
      })

      if (response.succeeded && response.data?.token) {
        const token = response.data?.token
        login(token) // Decode JWT and set user info
        toast.success(response.message || 'Welcome back!')
        navigate(from, { replace: true })
        return
      }
      toast.error('Invalid email or password!')
    } catch (error) {
      console.error('Login error:', error)
      let errorMsg = 'Login failed. Please try again.'
      if (error instanceof Error) {
        errorMsg = error.message
      }
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full relative overflow-hidden'>
      {/* Animated Gradient Background - Pastel Colors */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-200 via-green-100 to-gray-100'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Floating shapes - Pastel Colors */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-green-300/30 rounded-full blur-3xl animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-500'></div>

      {/* Main Content */}
      <div className='min-h-screen flex relative items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10'>
        <div className='w-full max-w-md'>
          {/* Login Card */}
          <div className='bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20'>
            {/* Header Section with Gradient - Sky Blue/Cyan */}
            <div className='bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 px-8 pt-12 pb-8 text-center relative overflow-hidden'>
              <div
                className='absolute inset-0 opacity-30'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}
              ></div>

              {/* Logo Icon */}
              <div className='relative mb-4 inline-flex'>
                <div className='w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/30'>
                  <svg className='w-12 h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <div className='absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-bounce'></div>
              </div>

              <h1 className='text-4xl font-bold text-white mb-2'>LexiMon</h1>
              <p className='text-white/90 text-sm font-medium'>Admin Dashboard</p>
            </div>

            {/* Form Section */}
            <div className='px-8 py-10'>
              <div className='mb-8 text-center'>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>Welcome Back! 👋</h2>
                <p className='text-gray-500 text-sm'>Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
                {/* Email Input */}
                <div>
                  <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <div className='relative group'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <svg
                        className='w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                        />
                      </svg>
                    </div>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 focus:bg-white transition-all duration-200'
                      placeholder='admin@leximon.com'
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                    Password
                  </label>
                  <div className='relative group'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <svg
                        className='w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                      </svg>
                    </div>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      required
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      className='w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 focus:bg-white transition-all duration-200'
                      placeholder='Enter your password'
                      disabled={loading}
                    />
                    <button
                      type='button'
                      onClick={togglePasswordVisibility}
                      className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors'
                      disabled={loading}
                    >
                      {showPassword ? (
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                          />
                        </svg>
                      ) : (
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className='flex items-center justify-between text-sm'>
                  <label className='flex items-center cursor-pointer group'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer'
                    />
                    <span className='ml-2 text-gray-600 group-hover:text-gray-800'>Remember me</span>
                  </label>
                  <a href='#' className='text-purple-600 hover:text-purple-700 font-semibold hover:underline'>
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group'
                >
                  <span className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200'></span>
                  {loading ? (
                    <span className='flex items-center justify-center relative z-10'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center relative z-10'>
                      <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                        />
                      </svg>
                      Sign In to Dashboard
                    </span>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className='mt-8 text-center'>
                <p className='text-sm text-gray-500'>
                  Need help?{' '}
                  <a href='#' className='text-purple-600 hover:text-purple-700 font-semibold hover:underline'>
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-700/80'>© 2025 LexiMon. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

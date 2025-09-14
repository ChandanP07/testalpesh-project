// app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Printer } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    
    // Check for error in URL params
    const urlError = searchParams.get('error')
    if (urlError) {
      setError('Authentication failed. Please try again.')
    }

    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router, searchParams])

  if (!mounted) {
    return null // Prevent SSR issues
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else if (result?.ok) {
        // Wait a moment for session to be established
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 100)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Printer className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">PrintCare</h1>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Contact your administrator
                </Link>
              </p>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername('admin')
                setPassword('admin123')
              }}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Fill demo credentials
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="mb-8">
              <Printer className="h-24 w-24 mx-auto mb-6 opacity-80" />
            </div>
            <h2 className="text-4xl font-bold mb-4">PrintCare Management</h2>
            <p className="text-xl opacity-90 mb-8 max-w-md">
              Complete business management solution for printer services and cartridge supplies
            </p>
            <div className="grid grid-cols-1 gap-4 text-sm opacity-80">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Client & Printer Management
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Order & Dispatch Tracking
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Automated Billing & Reports
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Complaint Management
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
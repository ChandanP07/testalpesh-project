// app/dashboard/admin/page.tsx
'use client'

import { useState } from 'react'
import { 
  UserPlus, 
  UserCog, 
  KeyRound, 
  UserX, 
  MapPin, 
  Edit3, 
  Mail,
  Users
} from 'lucide-react'
import { EditLoginIdComponent } from '@/components/admin/EditLoginIdComponent'
import { SetPasswordComponent } from '@/components/admin/SetPasswordComponent'
import { DropUserComponent } from '@/components/admin/DropUserComponent'

const adminModules = [
  {
    id: 'new-login',
    title: 'New Login ID',
    description: 'Create a new user account with permissions',
    icon: UserPlus,
    color: 'bg-green-500 hover:bg-green-600',
    component: 'NewLoginId'
  },
  {
    id: 'edit-login',
    title: 'Edit Login ID',
    description: 'Modify existing user accounts and permissions',
    icon: UserCog,
    color: 'bg-blue-500 hover:bg-blue-600',
    component: 'EditLoginId'
  },
  {
    id: 'set-password',
    title: 'Set Password',
    description: 'Reset user passwords and send via email',
    icon: KeyRound,
    color: 'bg-orange-500 hover:bg-orange-600',
    component: 'SetPassword'
  },
  {
    id: 'drop-user',
    title: 'Drop User ID',
    description: 'Permanently remove user accounts',
    icon: UserX,
    color: 'bg-red-500 hover:bg-red-600',
    component: 'DropUser'
  },
  {
    id: 'new-city',
    title: 'New City/State',
    description: 'Add new cities and states to master list',
    icon: MapPin,
    color: 'bg-purple-500 hover:bg-purple-600',
    component: 'NewCity'
  },
  {
    id: 'edit-city',
    title: 'Edit City/State',
    description: 'Modify existing city and state entries',
    icon: Edit3,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    component: 'EditCity'
  },
  {
    id: 'resend-credentials',
    title: 'Login IDs - Resend ID',
    description: 'Resend login credentials to users',
    icon: Mail,
    color: 'bg-teal-500 hover:bg-teal-600',
    component: 'ResendCredentials'
  }
]

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null)

  if (activeModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {adminModules.find(m => m.id === activeModule)?.title}
            </h1>
            <p className="text-gray-600">
              {adminModules.find(m => m.id === activeModule)?.description}
            </p>
          </div>
          <button
            onClick={() => setActiveModule(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Admin Panel
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderModule(activeModule)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-indigo-100">
              Manage users, permissions, and system settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => {
          const Icon = module.icon
          return (
            <div
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${module.color} transition-colors`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {module.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <span className="text-indigo-600 text-sm font-medium">
                  Open Module →
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <UserCog className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cities/States</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

function renderModule(moduleId: string) {
  switch (moduleId) {
    case 'new-login':
      return <NewLoginIdComponent />
    case 'edit-login':
      return <EditLoginIdComponent />
    case 'set-password':
      return <SetPasswordComponent />
    case 'drop-user':
      return <DropUserComponent />
    case 'new-city':
      return <NewCityComponent />
    case 'edit-city':
      return <EditCityComponent />
    case 'resend-credentials':
      return <ResendCredentialsComponent />
    default:
      return <div>Module not found</div>
  }
}

// New Login ID Component
function NewLoginIdComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'EMPLOYEE',
    permissions: {
      admin: false,
      mis: false,
      clients: false,
      printers: false,
      complaints: false,
      dispatch: false,
      billing: false,
      marketing: false,
      orders: false,
      pendingWork: false
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'User created successfully and credentials sent via email!' })
        setFormData({
          name: '',
          email: '',
          mobile: '',
          password: '',
          role: 'EMPLOYEE',
          permissions: {
            admin: false,
            mis: false,
            clients: false,
            printers: false,
            complaints: false,
            dispatch: false,
            billing: false,
            marketing: false,
            orders: false,
            pendingWork: false
          }
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const permissionLabels = {
    admin: 'Admin Panel',
    mis: 'MIS Reports',
    clients: 'Client Management',
    printers: 'Printer Management',
    complaints: 'Complaint Management',
    dispatch: 'Dispatch Management',
    billing: 'Billing & Payments',
    marketing: 'Marketing',
    orders: 'Order Management',
    pendingWork: 'Pending Work'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            required
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter mobile number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>
      </div>

      {/* Permissions Grid */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Module Permissions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permissions[key as keyof typeof formData.permissions]}
                onChange={(e) => setFormData({
                  ...formData,
                  permissions: {
                    ...formData.permissions,
                    [key]: e.target.checked
                  }
                })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setFormData({
            name: '',
            email: '',
            mobile: '',
            password: '',
            role: 'EMPLOYEE',
            permissions: {
              admin: false,
              mis: false,
              clients: false,
              printers: false,
              complaints: false,
              dispatch: false,
              billing: false,
              marketing: false,
              orders: false,
              pendingWork: false
            }
          })}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating User...' : 'Create User & Send Email'}
        </button>
      </div>
    </form>
  )
}

// New City Component
function NewCityComponent() {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    country: 'India'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'City added successfully to master list!' })
        setFormData({ name: '', state: '', country: 'India' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add city' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter city name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter state name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <input
            type="text"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter country name"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setFormData({ name: '', state: '', country: 'India' })}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding City...' : 'Add City/State'}
        </button>
      </div>
    </form>
  )
}

// Edit City Component
function EditCityComponent() {
  return (
    <div className="space-y-6">
      <div className="text-center text-gray-500">
        Edit City/State functionality will be implemented here.
        This will show existing cities/states and allow editing them.
      </div>
    </div>
  )
}

// Resend Credentials Component
function ResendCredentialsComponent() {
  return (
    <div className="space-y-6">
      <div className="text-center text-gray-500">
        Resend Credentials functionality will be implemented here.
        This will allow resending login information to users via email.
      </div>
    </div>
  )
}
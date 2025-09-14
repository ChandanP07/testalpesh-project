// components/admin/EditLoginIdComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Edit2, Eye, Save, X, UserCheck, UserX } from 'lucide-react'

export function EditLoginIdComponent() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load users' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (user: any) => {
    setSelectedUser(user)
    setEditData({ ...user })
    setEditMode(false)
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'User updated successfully!' })
        setSelectedUser(editData)
        setEditMode(false)
        loadUsers() // Refresh the user list
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
          <button 
            onClick={() => setMessage(null)}
            className="float-right text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Select User to Edit</h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id 
                      ? 'bg-indigo-100 border-2 border-indigo-500' 
                      : 'bg-white border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        {user.isActive ? (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <Edit2 className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white rounded-lg border p-6">
          {selectedUser ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">User Details</h3>
                <div className="flex space-x-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false)
                          setEditData({ ...selectedUser })
                        }}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {editMode ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editData.username || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={editData.role || ''}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                      <option value="CLIENT">Client</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isActive || false}
                        onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active User</span>
                    </label>
                  </div>

                  {/* Permissions Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Module Permissions</h4>
                    <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-lg">
                      {Object.entries(permissionLabels).map(([key, label]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            // Note: permissions would come from a separate table/field
                            defaultChecked={false}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="text-lg">{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                        selectedUser.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        selectedUser.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="flex items-center space-x-2">
                        {selectedUser.isActive ? (
                          <>
                            <UserCheck className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="text-lg">
                      {selectedUser.lastLogin 
                        ? new Date(selectedUser.lastLogin).toLocaleString()
                        : 'Never logged in'
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-lg">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* View/Edit Authentications Button */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View/Edit Authentications</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <UserCheck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Select a user from the list to view and edit details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
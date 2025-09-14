// components/admin/DropUserComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, UserX, Trash2, AlertTriangle, Shield } from 'lucide-react'

export function DropUserComponent() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

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
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDeleteUser = async () => {
    if (!selectedUser || confirmationText !== selectedUser.username) return

    setDeleting(true)
    setShowConfirmDialog(false)

    try {
      const response = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `User ${selectedUser.username} has been permanently deleted from the system.` 
        })
        setSelectedUser(null)
        setConfirmationText('')
        loadUsers() // Refresh the user list
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setDeleting(false)
    }
  }

  const canDeleteUser = (user: any) => {
    // Can't delete admin users or your own account
    return user.role !== 'ADMIN' && user.username !== 'admin'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <UserX className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div className="flex-1">
              {message.text}
            </div>
            <button 
              onClick={() => setMessage(null)}
              className="text-lg font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div className="text-sm text-red-800">
            <strong>Danger Zone:</strong> Dropping a user ID will permanently delete the user account and all associated data. This action cannot be undone.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserX className="h-5 w-5 mr-2" />
            Select User to Drop
          </h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  onClick={() => canDeleteUser(user) && setSelectedUser(user)}
                  className={`p-3 rounded-lg transition-colors ${
                    !canDeleteUser(user) 
                      ? 'bg-gray-200 cursor-not-allowed opacity-60'
                      : selectedUser?.id === user.id 
                        ? 'bg-red-100 border-2 border-red-500 cursor-pointer' 
                        : 'bg-white border-2 border-transparent hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{user.username}</p>
                        {!canDeleteUser(user) && (
                          <Shield className="h-4 w-4 text-amber-500" title="Protected account" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {!canDeleteUser(user) && (
                        <p className="text-xs text-amber-600 mt-1">
                          This account is protected and cannot be deleted
                        </p>
                      )}
                    </div>
                    <UserX className={`h-4 w-4 ${canDeleteUser(user) ? 'text-red-400' : 'text-gray-300'}`} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delete User Action */}
        <div className="bg-white rounded-lg border-2 border-red-200 p-6">
          {selectedUser ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-700">Drop User ID</h3>
                
                {/* Selected User Details */}
                <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
                  <h4 className="font-medium mb-2 text-red-800">User to be deleted:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">{selectedUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedUser.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        selectedUser.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Created:</span>
                      <span className="font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="font-medium">
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastLogin).toLocaleString()
                          : 'Never logged in'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong>Warning:</strong> This action will permanently:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Delete the user account and login credentials</li>
                        <li>Remove all user permissions and access rights</li>
                        <li>Delete all data associated with this user</li>
                        <li>Prevent the user from logging into the system</li>
                        <li>This action cannot be undone!</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={deleting}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Deleting User...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-5 w-5" />
                        <span>Drop User ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <UserX className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">No User Selected</p>
              <p>Select a user from the list to drop their account</p>
              <p className="text-sm mt-2 text-amber-600">
                ⚠️ Protected accounts (Admin users) cannot be deleted
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirm User Deletion</h3>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete the user account for:
              </p>
              <div className="bg-red-50 p-3 rounded-lg mb-4">
                <p className="font-medium text-red-800">{selectedUser?.username}</p>
                <p className="text-sm text-red-600">{selectedUser?.email}</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Type <strong>{selectedUser?.username}</strong> to confirm:
              </p>
              
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6"
                placeholder={`Type "${selectedUser?.username}" here`}
              />
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false)
                    setConfirmationText('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={confirmationText !== selectedUser?.username}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Yes, Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
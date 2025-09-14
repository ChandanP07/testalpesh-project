// components/admin/SetPasswordComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, KeyRound, Mail, RefreshCw, AlertTriangle } from 'lucide-react'

export function SetPasswordComponent() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

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

  const handleResetPassword = async () => {
    if (!selectedUser) return

    setResetting(true)
    setShowConfirmDialog(false)

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Password reset successfully for ${selectedUser.username}. New credentials have been sent to ${selectedUser.email}` 
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to reset password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setResetting(false)
    }
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
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <Mail className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <KeyRound className="h-5 w-5 mr-2" />
            Select User ID
          </h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
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
                  onClick={() => setSelectedUser(user)}
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
                        <span className="text-xs text-gray-500">
                          Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                    <KeyRound className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Password Reset Action */}
        <div className="bg-white rounded-lg border p-6">
          {selectedUser ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
                
                {/* Selected User Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-2">Selected User:</h4>
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
                      <strong>Warning:</strong> Resetting the password will:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Generate a new random password</li>
                        <li>Send the new credentials to the user's email ({selectedUser.email})</li>
                        <li>Force the user to use the new password on next login</li>
                        <li>Log this action in the system audit trail</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={resetting}
                    className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resetting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-5 w-5" />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <KeyRound className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">No User Selected</p>
              <p>Select a user from the list to reset their password</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirm Password Reset</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reset the password for <strong>{selectedUser?.username}</strong>?
                <br />
                <br />
                A new password will be generated and sent to <strong>{selectedUser?.email}</strong>
              </p>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Yes, Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
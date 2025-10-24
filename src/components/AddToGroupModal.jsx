import { useState, useEffect } from 'react'
import { X, Plus, FolderOpen, Users } from 'lucide-react'
import { dataService } from '../services/dataService'
import toast from 'react-hot-toast'

const AddToGroupModal = ({ selectedContacts, onClose, onSuccess }) => {
  const [groups, setGroups] = useState([])
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const groupsData = await dataService.loadGroups()
      setGroups(groupsData)
    } catch (error) {
      console.error('Error loading groups:', error)
    }
  }

  const handleAddToGroup = async (groupId) => {
    setLoading(true)
    try {
      await dataService.addContactsToGroup(selectedContacts, groupId)
      toast.success(`${selectedContacts.length} contact(s) added to group successfully!`)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding contacts to group:', error)
      toast.error('Failed to add contacts to group')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (groupData) => {
    setLoading(true)
    try {
      const newGroup = await dataService.createGroup(groupData)
      await dataService.addContactsToGroup(selectedContacts, newGroup.id)
      toast.success(`Group created and ${selectedContacts.length} contact(s) added successfully!`)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating group and adding contacts:', error)
      toast.error('Failed to create group and add contacts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add to Group ({selectedContacts.length} contacts)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!showCreateGroup ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Select a group
                </h3>
                
                {groups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">No groups found</p>
                    <p className="text-sm">Create a new group to add contacts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => handleAddToGroup(group.id)}
                        disabled={loading}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="w-5 h-5 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {group.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {group.memberCount} members
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Group</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <CreateGroupForm
              onSave={handleCreateGroup}
              onCancel={() => setShowCreateGroup(false)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Create Group Form Component
const CreateGroupForm = ({ onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter a group name')
      return
    }
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Group Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter group name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter group description"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Group & Add Contacts'}
        </button>
      </div>
    </form>
  )
}

export default AddToGroupModal

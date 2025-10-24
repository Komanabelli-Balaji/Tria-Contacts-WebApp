import { useState, useEffect } from 'react'
import { FolderOpen, Users, Plus, Trash2, Edit } from 'lucide-react'
import { dataService } from '../services/dataService'
import toast from 'react-hot-toast'

const GroupsList = ({ onGroupSelect, selectedGroupId }) => {
  const [groups, setGroups] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const [groupsData, contactsData] = await Promise.all([
        dataService.loadGroups(),
        dataService.loadContacts()
      ])
      
      // Calculate actual member count for each group
      const groupsWithMemberCount = groupsData.map(group => ({
        ...group,
        memberCount: contactsData.filter(contact => contact.groupId === group.id).length
      }))
      
      setGroups(groupsWithMemberCount)
    } catch (error) {
      console.error('Error loading groups:', error)
    }
  }

  const handleGroupClick = (group) => {
    onGroupSelect(group)
  }

  const handleDeleteGroup = async (groupId, groupName) => {
    if (window.confirm(`Are you sure you want to delete the group "${groupName}"? This will remove all contacts from this group.`)) {
      try {
        await dataService.deleteGroup(groupId)
        await loadGroups()
        toast.success('Group deleted successfully!')
        if (selectedGroupId === groupId) {
          onGroupSelect(null)
        }
      } catch (error) {
        console.error('Error deleting group:', error)
        toast.error('Failed to delete group')
      }
    }
  }

  const handleCreateGroup = async (groupData) => {
    try {
      await dataService.createGroup(groupData)
      await loadGroups()
      toast.success('Group created successfully!')
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Failed to create group')
    }
  }

  const handleEditGroup = async (groupId, groupData) => {
    try {
      await dataService.updateGroup(groupId, groupData)
      await loadGroups()
      toast.success('Group updated successfully!')
      setEditingGroup(null)
    } catch (error) {
      console.error('Error updating group:', error)
      toast.error('Failed to update group')
    }
  }

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 bg-custom-primary">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-custom overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 lg:px-6 py-4 border-b border-custom">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Groups ({groups.length})
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          </div>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {groups.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No groups found</p>
              <p className="text-sm">Create your first group to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedGroupId === group.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleGroupClick(group)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {group.description || 'No description'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{group.memberCount} members</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingGroup(group)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGroup(group.id, group.name)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateGroup}
        />
      )}

      {/* Edit Group Modal */}
      {editingGroup && (
        <CreateGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSave={(groupData) => handleEditGroup(editingGroup.id, groupData)}
        />
      )}
    </div>
  )
}

// Create/Edit Group Modal Component
const CreateGroupModal = ({ group, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || ''
      })
    }
  }, [group])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter a group name')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {group ? 'Edit Group' : 'Create Group'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {group ? 'Update Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupsList

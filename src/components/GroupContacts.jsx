import { useState, useEffect } from 'react'
import { ArrowLeft, Users, Plus, Trash2, Edit, Phone, MessageCircle, Heart } from 'lucide-react'
import { dataService } from '../services/dataService'
import toast from 'react-hot-toast'

const GroupContacts = ({ group, onBack, onEditContact }) => {
  const [contacts, setContacts] = useState([])
  const [showAddContactsModal, setShowAddContactsModal] = useState(false)
  const [allContacts, setAllContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState([])

  useEffect(() => {
    if (group) {
      loadContactsInGroup()
      loadAllContacts()
    }
  }, [group])

  const loadContactsInGroup = async () => {
    try {
      const contactsInGroup = await dataService.getContactsInGroup(group.id)
      setContacts(contactsInGroup)
    } catch (error) {
      console.error('Error loading contacts in group:', error)
    }
  }

  const loadAllContacts = async () => {
    try {
      const allContactsData = await dataService.loadContacts()
      // Filter out contacts already in this group
      const contactsNotInGroup = allContactsData.filter(contact => contact.groupId !== group.id)
      setAllContacts(contactsNotInGroup)
    } catch (error) {
      console.error('Error loading all contacts:', error)
    }
  }

  const handleRemoveFromGroup = async (contactId, contactName) => {
    if (window.confirm(`Remove ${contactName} from ${group.name}?`)) {
      try {
        await dataService.removeContactFromGroup(contactId)
        await loadContactsInGroup()
        // Trigger a refresh of the main contacts list and groups count
        window.dispatchEvent(new CustomEvent('contactsUpdated'))
        toast.success(`${contactName} removed from group`)
      } catch (error) {
        console.error('Error removing contact from group:', error)
        toast.error('Failed to remove contact from group')
      }
    }
  }

  const handleContactSelect = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleAddContactsToGroup = async () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact')
      return
    }

    try {
      await dataService.addContactsToGroup(selectedContacts, group.id)
      await loadContactsInGroup()
      await loadAllContacts()
      setSelectedContacts([])
      setShowAddContactsModal(false)
      // Trigger a refresh of the main contacts list and groups count
      window.dispatchEvent(new CustomEvent('contactsUpdated'))
      toast.success(`${selectedContacts.length} contact(s) added to group successfully!`)
    } catch (error) {
      console.error('Error adding contacts to group:', error)
      toast.error('Failed to add contacts to group')
    }
  }

  const handleCall = (contact) => {
    toast.success(`Calling ${contact.name}...`)
  }

  const handleMessage = (contact) => {
    toast.success(`Messaging ${contact.name}...`)
  }

  const handleToggleFavorite = async (contact) => {
    try {
      await dataService.toggleFavorite(contact.id)
      await loadContactsInGroup()
      // Trigger a refresh of the main contacts list by calling the parent's refresh function
      window.dispatchEvent(new CustomEvent('contactsUpdated'))
      toast.success(`${contact.name} ${contact.isFavorite ? 'removed from' : 'added to'} favorites`)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorite status')
    }
  }

  const handleDeleteContact = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await dataService.deleteContact(contact.id)
        await loadContactsInGroup()
        toast.success(`${contact.name} deleted successfully`)
      } catch (error) {
        console.error('Error deleting contact:', error)
        toast.error('Failed to delete contact')
      }
    }
  }

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 bg-custom-primary">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-custom overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 lg:px-6 py-4 border-b border-custom">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {group.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {contacts.length} members
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddContactsModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contacts</span>
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No contacts in this group</p>
              <p className="text-sm">Add contacts to this group to see them here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCall(contact)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleMessage(contact)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Message"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleFavorite(contact)}
                        className={`p-2 rounded-lg transition-colors ${
                          contact.isFavorite 
                            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                            : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => onEditContact(contact)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteContact(contact)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleRemoveFromGroup(contact.id, contact.name)}
                        className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        title="Remove from group"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Contacts Modal */}
      {showAddContactsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Contacts to {group.name}
              </h2>
              <button
                onClick={() => setShowAddContactsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {allContacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg font-medium">No contacts available</p>
                  <p className="text-sm">All contacts are already in this group</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleContactSelect(contact.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddContactsModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContactsToGroup}
                disabled={selectedContacts.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {selectedContacts.length} Contact(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupContacts

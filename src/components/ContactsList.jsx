import { 
  Phone, 
  Mail, 
  Heart, 
  Trash2, 
  MoreVertical, 
  Edit,
  MessageCircle,
  Users
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ContactsList = ({
  contacts,
  selectedContacts,
  isSelectionMode,
  onContactSelect,
  onContactClick,
  selectedContact,
  showContactActions,
  onCloseActions,
  onToggleFavorite,
  onDeleteContact
}) => {
  const [showActionMenu, setShowActionMenu] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleContactClick = (contact) => {
    if (isSelectionMode) {
      onContactSelect(contact.id)
    } else {
      onContactClick(contact.id)
    }
  }

  const handleActionMenu = (e, contactId) => {
    e.stopPropagation()
    setShowActionMenu(showActionMenu === contactId ? null : contactId)
  }

  const handleCall = (contact) => {
    toast.success(`Calling ${contact.name}...`)
    onCloseActions()
  }

  const handleMessage = (contact) => {
    toast.success(`Opening message to ${contact.name}...`)
    onCloseActions()
  }

  const handleToggleFavorite = (contact) => {
    onToggleFavorite(contact.id)
    toast.success(
      contact.isFavorite 
        ? `${contact.name} removed from favorites` 
        : `${contact.name} added to favorites`
    )
    onCloseActions()
  }

  const handleDelete = (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      onDeleteContact(contact.id)
      toast.success(`${contact.name} deleted successfully`)
    }
    onCloseActions()
  }

  const handleEdit = (contact) => {
    toast.success(`Edit ${contact.name} - Feature coming soon!`)
    onCloseActions()
  }

  return (
    <div className="flex-1 p-6 bg-custom-primary">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-custom">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-custom">
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              {isSelectionMode && (
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      contacts.forEach(contact => onContactSelect(contact.id))
                    } else {
                      selectedContacts.forEach(id => onContactSelect(id))
                    }
                  }}
                />
              )}
            </div>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Created Date</div>
            <div className="text-right">Actions</div>
          </div>
        </div>

        {/* Contact Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {contacts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No contacts found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  selectedContacts.includes(contact.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleContactClick(contact)}
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  {/* Checkbox */}
                  <div className="flex items-center">
                    {isSelectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => onContactSelect(contact.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>

                  {/* Name with Avatar */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                        {contact.isFavorite && (
                          <Heart className="inline w-4 h-4 text-red-500 ml-2" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {contact.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="text-sm text-gray-900 dark:text-white">
                    {contact.email}
                  </div>

                  {/* Phone */}
                  <div className="text-sm text-gray-900 dark:text-white">
                    {contact.phone}
                  </div>

                  {/* Created Date */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(contact.createdDate)}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => handleActionMenu(e, contact.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Action Menu */}
                    {showActionMenu === contact.id && (
                      <div className="absolute right-6 mt-8 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                        <div className="py-2">
                          <button
                            onClick={() => handleEdit(contact)}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit Contact</span>
                          </button>
                          <button
                            onClick={() => handleToggleFavorite(contact)}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Heart className={`w-4 h-4 ${contact.isFavorite ? 'text-red-500' : ''}`} />
                            <span>{contact.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(contact)}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Contact</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Actions Bottom Bar */}
      {showContactActions && selectedContact && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-custom p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6">
            <button
              onClick={() => handleCall(contacts.find(c => c.id === selectedContact))}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            
            <button
              onClick={() => handleMessage(contacts.find(c => c.id === selectedContact))}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
            
            <button
              onClick={() => handleToggleFavorite(contacts.find(c => c.id === selectedContact))}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Favorite</span>
            </button>
            
            <button
              onClick={onCloseActions}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close action menu */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  )
}

export default ContactsList

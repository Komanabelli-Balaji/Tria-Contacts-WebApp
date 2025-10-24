import { 
  Phone, 
  Mail, 
  Heart, 
  Trash2, 
  Edit,
  MessageCircle,
  Users
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
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
  onDeleteContact,
  onEditContact,
}) => {
  const [selectedContactRef, setSelectedContactRef] = useState(null)
  const contactActionRef = useRef(null)

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

  const handleContactClick = (contact, event) => {
    if (isSelectionMode) {
      onContactSelect(contact.id)
    } else {
      // Store the contact element reference for positioning
      setSelectedContactRef(event.currentTarget)
      onContactClick(contact.id)
    }
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
    onEditContact(contact)
    onCloseActions()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactActionRef.current && !contactActionRef.current.contains(event.target) && 
          selectedContactRef && !selectedContactRef.contains(event.target)) {
        onCloseActions()
      }
    }

    if (showContactActions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showContactActions, selectedContactRef, onCloseActions])

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 bg-custom-primary">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-custom overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="px-4 lg:px-6 py-4 border-b border-custom">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] lg:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 lg:gap-4 text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[600px] lg:min-w-[800px]">
            <div className="flex items-center w-8">
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
            <div className="hidden lg:block">Created Date</div>
            <div className="text-right w-12">Actions</div>
          </div>
        </div>

        {/* Contact Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
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
                className={`px-4 lg:px-6 py-3 lg:py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  selectedContacts.includes(contact.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={(e) => handleContactClick(contact, e)}
              >
                <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] lg:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 lg:gap-4 items-center min-w-[600px] lg:min-w-[800px]">
                  {/* Checkbox */}
                  <div className="flex items-center w-8">
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
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm lg:text-base truncate">
                        {contact.name}
                        {contact.isFavorite && (
                          <Heart className="inline w-3 h-3 lg:w-4 lg:h-4 text-red-500 ml-1 lg:ml-2" />
                        )}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">
                        ID: {contact.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="text-xs lg:text-sm text-gray-900 dark:text-white truncate">
                    {contact.email}
                  </div>

                  {/* Phone */}
                  <div className="text-xs lg:text-sm text-gray-900 dark:text-white truncate">
                    {contact.phone}
                  </div>

                  {/* Created Date */}
                  <div className="hidden lg:block text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {formatDate(contact.createdDate)}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end w-20 space-x-1">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Actions Floating Section */}
      {showContactActions && selectedContact && selectedContactRef && (
        <div 
          ref={contactActionRef}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-2 lg:p-4 z-50 animate-in slide-in-from-top-2 duration-300"
          style={{
            top: Math.min(
              selectedContactRef.getBoundingClientRect().bottom + window.scrollY + 10,
              window.innerHeight - 200
            ),
            left: Math.max(10, selectedContactRef.getBoundingClientRect().left + window.scrollX),
            minWidth: Math.min(selectedContactRef.offsetWidth, 280)
          }}
        >
          <div className="flex items-center space-x-1 lg:space-x-2 flex-wrap">
            <button
              onClick={() => handleCall(contacts.find(c => c.id === selectedContact))}
              className="flex items-center space-x-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs"
            >
              <Phone className="w-3 h-3" />
              <span className="hidden sm:block">Call</span>
            </button>

            <button
              onClick={() => handleMessage(contacts.find(c => c.id === selectedContact))}
              className="flex items-center space-x-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:block">Message</span>
            </button>

            <button
              onClick={() => handleToggleFavorite(contacts.find(c => c.id === selectedContact))}
              className="flex items-center space-x-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs"
            >
              <Heart className="w-3 h-3" />
              <span className="hidden sm:block">Favorite</span>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ContactsList

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ContactsList from './components/ContactsList'
import GroupsList from './components/GroupsList'
import GroupContacts from './components/GroupContacts'
import AddContactModal from './components/AddContactModal'
import EditContactModal from './components/EditContactModal'
import AddToGroupModal from './components/AddToGroupModal'
import { Toaster } from 'react-hot-toast'
import { dataService } from './services/dataService'

function App() {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [activeView, setActiveView] = useState('all')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showContactActions, setShowContactActions] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [groupsCount, setGroupsCount] = useState(0)

  // Load contacts on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsData, groupsData] = await Promise.all([
          dataService.loadContacts(),
          dataService.loadGroups()
        ])
        setContacts(contactsData)
        setFilteredContacts(contactsData)
        setGroupsCount(groupsData.length)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  // Listen for contacts updates from other components
  useEffect(() => {
    const handleContactsUpdate = async () => {
      try {
        const [contactsData, groupsData] = await Promise.all([
          dataService.loadContacts(),
          dataService.loadGroups()
        ])
        setContacts(contactsData)
        setFilteredContacts(contactsData)
        setGroupsCount(groupsData.length)
      } catch (error) {
        console.error('Error refreshing contacts:', error)
      }
    }

    window.addEventListener('contactsUpdated', handleContactsUpdate)
    return () => {
      window.removeEventListener('contactsUpdated', handleContactsUpdate)
    }
  }, [])

  // Filter contacts based on search term and active view
  useEffect(() => {
    let filtered = contacts

    // Filter by active view
    switch (activeView) {
      case 'favorites':
        filtered = filtered.filter(contact => contact.isFavorite)
        break
      case 'groups':
        filtered = filtered.filter(contact => contact.groupId)
        break
      case 'archives':
        filtered = filtered.filter(contact => contact.isArchived)
        break
      default:
        filtered = filtered.filter(contact => !contact.isArchived)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      )
    }

    // Filter by tag
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(contact => contact.tags.includes(selectedFilter))
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, activeView, selectedFilter])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter)
  }

  const handleViewChange = (view) => {
    setActiveView(view)
    setSelectedContacts([])
    setIsSelectionMode(false)
  }

  const handleContactSelect = (contactId) => {
    if (isSelectionMode) {
      setSelectedContacts(prev => 
        prev.includes(contactId) 
          ? prev.filter(id => id !== contactId)
          : [...prev, contactId]
      )
    } else {
      setSelectedContact(contactId)
      setShowContactActions(true)
    }
  }

  const handleContactClick = (contactId) => {
    if (!isSelectionMode) {
      setSelectedContact(contactId)
      setShowContactActions(true)
    }
  }

  const handleCloseActions = () => {
    setShowContactActions(false)
    setSelectedContact(null)
  }

  const handleToggleFavorite = async (contactId) => {
    try {
      const updatedContact = await dataService.toggleFavorite(contactId)
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? updatedContact : contact
      ))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleDeleteContact = async (contactId) => {
    try {
      await dataService.deleteContact(contactId)
      setContacts(prev => prev.filter(contact => contact.id !== contactId))
      setSelectedContacts(prev => prev.filter(id => id !== contactId))
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'favorite':
          await dataService.bulkUpdateContacts(selectedContacts, { isFavorite: true })
          setContacts(prev => prev.map(contact => 
            selectedContacts.includes(contact.id)
              ? { ...contact, isFavorite: true }
              : contact
          ))
          break
        case 'group':
          setShowAddToGroupModal(true)
          return // Don't clear selection yet
        case 'archive':
          const archiveValue = activeView === 'archives' ? false : true
          await dataService.bulkUpdateContacts(selectedContacts, { isArchived: archiveValue })
          setContacts(prev => prev.map(contact => 
            selectedContacts.includes(contact.id)
              ? { ...contact, isArchived: archiveValue }
              : contact
          ))
          break
        case 'delete':
          const contactNames = contacts
            .filter(contact => selectedContacts.includes(contact.id))
            .map(contact => contact.name)
            .join(', ')
          
          if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s): ${contactNames}?`)) {
            await dataService.bulkDeleteContacts(selectedContacts)
            setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)))
          } else {
            return // Don't clear selection if user cancels
          }
          break
        default:
          break
      }
      setSelectedContacts([])
      setIsSelectionMode(false)
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const handleAddContact = async (newContact) => {
    try {
      const contact = await dataService.addContact(newContact)
      setContacts(prev => [...prev, contact])
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding contact:', error)
    }
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setShowEditModal(true)
  }

  const handleUpdateContact = async (contactId, updatedData) => {
    try {
      const updatedContact = await dataService.updateContact(contactId, updatedData)
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? updatedContact : contact
      ))
      setShowEditModal(false)
      setEditingContact(null)
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
  }

  const handleBackFromGroup = () => {
    setSelectedGroup(null)
  }

  const handleAddToGroupSuccess = () => {
    setSelectedContacts([])
    setIsSelectionMode(false)
    setShowAddToGroupModal(false)
  }


  return (
    <div className="h-screen bg-custom-primary flex flex-col lg:flex-row overflow-hidden">
      <Sidebar 
        activeView={activeView}
        onViewChange={handleViewChange}
        viewCounts={{ all: contacts.filter(c => !c.isArchived).length, favorites: contacts.filter(c => c.isFavorite).length, groups: groupsCount, archives: contacts.filter(c => c.isArchived).length }}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full lg:ml-64">
        <Header 
          onSearch={handleSearch}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          selectedFilter={selectedFilter}
          onAddContact={() => setShowAddModal(true)}
          isSelectionMode={isSelectionMode}
          onToggleSelection={() => setIsSelectionMode(!isSelectionMode)}
          selectedCount={selectedContacts.length}
          onBulkAction={handleBulkAction}
          activeView={activeView}
        />
        
        <div className="flex-1 overflow-hidden">
          {activeView === 'groups' ? (
            selectedGroup ? (
              <GroupContacts
                group={selectedGroup}
                onBack={handleBackFromGroup}
                onContactSelect={handleContactSelect}
                onContactClick={handleContactClick}
                selectedContact={selectedContact}
                showContactActions={showContactActions}
                onCloseActions={handleCloseActions}
                onToggleFavorite={handleToggleFavorite}
                onDeleteContact={handleDeleteContact}
                onEditContact={handleEditContact}
              />
            ) : (
              <GroupsList
                onGroupSelect={handleGroupSelect}
                selectedGroupId={selectedGroup?.id}
              />
            )
          ) : (
            <ContactsList
              contacts={filteredContacts}
              selectedContacts={selectedContacts}
              isSelectionMode={isSelectionMode}
              onContactSelect={handleContactSelect}
              onContactClick={handleContactClick}
              selectedContact={selectedContact}
              showContactActions={showContactActions}
              onCloseActions={handleCloseActions}
              onToggleFavorite={handleToggleFavorite}
              onDeleteContact={handleDeleteContact}
              onEditContact={handleEditContact}
              activeView={activeView}
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAddContact={handleAddContact}
        />
      )}

      {showEditModal && (
        <EditContactModal
          contact={editingContact}
          onClose={() => {
            setShowEditModal(false)
            setEditingContact(null)
          }}
          onUpdateContact={handleUpdateContact}
        />
      )}

      {showAddToGroupModal && (
        <AddToGroupModal
          selectedContacts={selectedContacts}
          onClose={() => setShowAddToGroupModal(false)}
          onSuccess={handleAddToGroupSuccess}
        />
      )}

      <Toaster position="top-right" />
      </div>
  )
}

export default App
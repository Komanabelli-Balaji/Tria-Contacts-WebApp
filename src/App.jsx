import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ContactsList from './components/ContactsList'
import AddContactModal from './components/AddContactModal'
import { Toaster } from 'react-hot-toast'
import contactsData from '../contacts.json'

function App() {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [activeView, setActiveView] = useState('all')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showContactActions, setShowContactActions] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load contacts on component mount
  useEffect(() => {
    setContacts(contactsData)
    setFilteredContacts(contactsData)
  }, [])

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

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

  const handleToggleFavorite = (contactId) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ))
  }

  const handleDeleteContact = (contactId) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId))
    setSelectedContacts(prev => prev.filter(id => id !== contactId))
  }

  const handleBulkAction = (action) => {
    switch (action) {
      case 'favorite':
        setContacts(prev => prev.map(contact => 
          selectedContacts.includes(contact.id)
            ? { ...contact, isFavorite: true }
            : contact
        ))
        break
      case 'delete':
        setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)))
        break
      default:
        break
    }
    setSelectedContacts([])
    setIsSelectionMode(false)
  }

  const handleAddContact = (newContact) => {
    const contact = {
      ...newContact,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      createdBy: 'current-user',
      isFavorite: false,
      groupId: null,
      isArchived: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContact.name}`
    }
    setContacts(prev => [...prev, contact])
    setShowAddModal(false)
  }

  const getViewCount = () => {
    switch (activeView) {
      case 'favorites':
        return contacts.filter(c => c.isFavorite).length
      case 'groups':
        return contacts.filter(c => c.groupId).length
      case 'archives':
        return contacts.filter(c => c.isArchived).length
      default:
        return contacts.filter(c => !c.isArchived).length
    }
  }

  return (
    <div className="min-h-screen bg-custom-primary">
      <div className="flex">
        <Sidebar 
          activeView={activeView}
          onViewChange={handleViewChange}
          viewCount={getViewCount()}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        
        <div className="flex-1 flex flex-col">
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
          />
          
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
          />
        </div>
      </div>

      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAddContact={handleAddContact}
        />
      )}

      <Toaster position="top-right" />
    </div>
  )
}

export default App
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Check, 
  Trash2,
  Heart,
  FolderPlus,
  Archive
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const Header = ({ 
  onSearch, 
  searchTerm, 
  onFilterChange, 
  selectedFilter, 
  onAddContact,
  isSelectionMode,
  onToggleSelection,
  selectedCount,
  onBulkAction,
  activeView
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const filterRef = useRef(null)
  const bulkActionsRef = useRef(null)

  const filterOptions = [
    { value: 'all', label: 'All Tags' },
    { value: 'family', label: 'Family' },
    { value: 'work', label: 'Work' },
    { value: 'friends', label: 'Friends' },
    { value: 'college', label: 'College' },
    { value: 'others', label: 'Others' }
  ]

  const bulkActions = [
    { id: 'favorite', label: 'Add to Favorites', icon: Heart },
    { id: 'group', label: 'Add to Group', icon: FolderPlus },
    { 
      id: 'archive', 
      label: activeView === 'archives' ? 'Unarchive Selected' : 'Archive Selected', 
      icon: Archive 
    },
    { id: 'delete', label: 'Delete Selected', icon: Trash2 }
  ]

  const handleBulkAction = (action) => {
    onBulkAction(action)
    setShowBulkActions(false)
  }

  const handleFilterChange = (filter) => {
    onFilterChange(filter)
    setShowFilterDropdown(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false)
      }
      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target)) {
        setShowBulkActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-custom px-4 lg:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contact, group or project"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 lg:space-x-4 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:block">Filter</span>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        selectedFilter === option.value 
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Contact Button */}
          <button
            onClick={onAddContact}
            className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">Add Contact</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Selection Mode Toggle */}
          <div className="relative">
            <button
              onClick={onToggleSelection}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm ${
                isSelectionMode 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:block">Select</span>
            </button>
          </div>

          {/* Bulk Actions */}
          {isSelectionMode && selectedCount > 0 && (
            <div className="relative" ref={bulkActionsRef}>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
                <span>Actions ({selectedCount})</span>
              </button>
              
              {showBulkActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {bulkActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleBulkAction(action.id)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{action.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

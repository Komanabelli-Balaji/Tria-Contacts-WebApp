import { 
  Users, 
  Heart, 
  FolderOpen, 
  Archive, 
  LogOut, 
  Sun, 
  Moon,
  User
} from 'lucide-react'

const Sidebar = ({ 
  activeView, 
  onViewChange, 
  viewCount, 
  isDarkMode, 
  onToggleTheme 
}) => {
  const navigationItems = [
    { id: 'all', label: 'All Contacts', icon: Users, count: viewCount },
    { id: 'favorites', label: 'Favourites', icon: Heart, count: viewCount },
    { id: 'groups', label: 'Groups', icon: FolderOpen, count: viewCount },
    { id: 'archives', label: 'Archives', icon: Archive, count: viewCount }
  ]

  return (
    <div className="w-64 bg-custom-sidebar text-white h-screen flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white">John Doe</h3>
            <p className="text-sm text-white/70">john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Theme Toggle and Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

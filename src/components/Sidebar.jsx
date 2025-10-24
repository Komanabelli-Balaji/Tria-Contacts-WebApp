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
  viewCounts, 
  isDarkMode, 
  onToggleTheme 
}) => {
  const navigationItems = [
    { id: 'all', label: 'All Contacts', icon: Users, count: viewCounts.all },
    { id: 'favorites', label: 'Favourites', icon: Heart, count: viewCounts.favorites },
    { id: 'groups', label: 'Groups', icon: FolderOpen, count: viewCounts.groups },
    { id: 'archives', label: 'Archives', icon: Archive, count: viewCounts.archives }
  ]

  return (
    <div className="w-full lg:w-64 bg-custom-sidebar text-white h-auto lg:h-screen flex flex-col lg:fixed lg:left-0 lg:top-0">
      {/* User Info */}
      <div className="p-4 lg:p-6 border-b border-white/10">
        <div className="flex items-center justify-between lg:block">
          {/* User Info - on the left for medium and smaller screens */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Balaji</h3>
              <p className="text-sm text-white/70">balaji67@gmail.com</p>
            </div>
          </div>

          {/* Theme Toggle and Logout - on the right for medium and smaller screens */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onToggleTheme}
              className="p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors rounded-lg"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            <button className="p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-wrap lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id} className="flex-1 lg:flex-none">
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium hidden sm:block">{item.label}</span>
                    <span className="font-medium sm:hidden">{item.label.split(' ')[0]}</span>
                  </div>
                  <span className="text-xs lg:text-sm bg-white/20 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                    {item.count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Theme Toggle and Logout - hidden on medium and smaller screens */}
      <div className="hidden lg:block p-4 border-t border-white/10 space-y-2">
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

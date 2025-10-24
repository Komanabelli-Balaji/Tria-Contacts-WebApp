# Tria - Contacts WebApp

A modern, responsive contacts management application built with React, featuring group management, search functionality, and a clean, intuitive interface.

## 🚀 Live Demo

[View Live Application](https://tria-contacts-webapp.vercel.app)

## ✨ Features

### 📱 Core Functionality
- **Contact Management**: Add, edit, delete, and organize contacts
- **Advanced Search**: Search by name, email, or phone number
- **Smart Filtering**: Filter contacts by tags (family, work, friends, college, others)
- **Favorites System**: Mark contacts as favorites for quick access
- **Archive Management**: Archive and unarchive contacts
- **Bulk Operations**: Select multiple contacts for batch actions

### 👥 Group Management
- **Create Groups**: Organize contacts into custom groups
- **Group Navigation**: Browse groups and view group members
- **Add to Groups**: Bulk add contacts to existing or new groups
- **Member Management**: Add/remove contacts from groups
- **Real-time Counts**: Accurate member counts for all groups

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop and tablet devices
- **Dark/Light Mode**: Toggle between themes with persistent settings
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Real-time Updates**: Instant synchronization across all views
- **Keyboard Shortcuts**: Efficient navigation and actions

### 🔧 Technical Features
- **Persistent Storage**: All data saved to localStorage
- **Offline Capable**: Works without internet connection
- **Fast Performance**: Optimized rendering and state management
- **Error Handling**: Comprehensive error handling with user feedback

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tria-contacts-webapp.git
   cd tria-contacts-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ContactsList.jsx     # Main contacts display
│   ├── GroupsList.jsx       # Groups management
│   ├── GroupContacts.jsx    # Group members view
│   ├── Header.jsx           # Search and filters
│   ├── Sidebar.jsx          # Navigation
│   ├── AddContactModal.jsx  # Add contact form
│   ├── EditContactModal.jsx # Edit contact form
│   └── AddToGroupModal.jsx  # Group assignment
├── services/
│   └── dataService.js       # Data persistence layer
├── App.jsx               # Main application component
├── index.css             # Global styles and themes
└── main.jsx              # Application entry point
```

## 🎯 Design Choices & Assumptions

### Architecture Decisions
- **Component-Based Architecture**: Modular React components for maintainability
- **Local Storage**: Chosen over external databases for simplicity and offline capability
- **Event-Driven Updates**: Custom events for cross-component communication
- **CSS Variables**: Dynamic theming with CSS custom properties

### User Experience Assumptions
- **Desktop-First**: Optimized for desktop/tablet use (not mobile-focused)
- **Power Users**: Users who manage large contact lists and need efficient bulk operations
- **Visual Feedback**: Toast notifications and loading states for all actions
- **Keyboard Accessibility**: Full keyboard navigation support

### Technical Assumptions
- **Modern Browsers**: ES6+ support required
- **Local Storage**: 5MB+ storage available
- **JavaScript Enabled**: No fallback for disabled JavaScript
- **Single User**: No multi-user or sharing features

## 📚 Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **JavaScript (ES6+)**: Modern JavaScript features

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **DaisyUI**: Tailwind component library for consistent design
- **Lucide React**: Modern icon library with consistent design
- **CSS Variables**: Dynamic theming system

### State Management
- **React Hooks**: useState, useEffect for local state management
- **Custom Events**: Cross-component communication
- **Local Storage**: Data persistence layer

### Development Tools
- **React Hot Toast**: User feedback notifications
- **ESLint**: Code linting and formatting
- **Vite Dev Server**: Hot module replacement

## 🎨 Library Choices & Rationale

### **Tailwind CSS + DaisyUI**
- **Why**: Rapid development with consistent design system
- **Benefits**: Utility-first approach, responsive design, dark mode support
- **Alternative Considered**: Material-UI, but DaisyUI provides more flexibility

### **Lucide React**
- **Why**: Modern, consistent icon set with React integration
- **Benefits**: Tree-shakable, customizable, consistent design
- **Alternative Considered**: Heroicons, but Lucide has better React support

### **React Hot Toast**
- **Why**: Lightweight, customizable toast notifications
- **Benefits**: Easy integration, good UX, small bundle size
- **Alternative Considered**: React Toastify, but Hot Toast is more lightweight

### **Local Storage**
- **Why**: Simple persistence without backend complexity
- **Benefits**: Offline capability, no server required, fast access
- **Limitations**: 5MB storage limit, single-user only

## 🚀 Deployment

### Static Hosting (Recommended)
The app is a static React application that can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload `dist` contents to S3 bucket

### Environment Variables
No environment variables required for basic functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS approach
- **DaisyUI** for the beautiful component library
- **Lucide** for the comprehensive icon set

---
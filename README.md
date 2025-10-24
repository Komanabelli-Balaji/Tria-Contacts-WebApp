# Tria - Contacts WebApp

A modern, responsive contacts management web application built with React, Tailwind CSS, and DaisyUI.

## Features

### 🎨 Modern UI/UX
- Clean, professional design with light and dark mode support
- Responsive layout that works on all devices
- Smooth animations and transitions
- Custom color scheme optimized for readability

### 📱 Contact Management
- **View Contacts**: Browse all contacts with avatar, name, email, phone, and creation date
- **Search**: Search contacts by name, email, or phone number
- **Filter**: Filter contacts by tags (family, work, friends, college, others)
- **Add Contacts**: Create new contacts with full details and tags
- **Edit Contacts**: Update contact information (coming soon)
- **Delete Contacts**: Remove contacts with confirmation

### ⭐ Favorites & Organization
- **Favorites**: Mark contacts as favorites for quick access
- **Groups**: Organize contacts into custom groups
- **Archives**: Archive old or inactive contacts
- **Tags**: Categorize contacts with multiple tags

### 🔍 Advanced Features
- **Bulk Selection**: Select multiple contacts for batch operations
- **Bulk Actions**: Add to favorites, create groups, or delete multiple contacts
- **Contact Actions**: Quick access to call, message, and favorite actions
- **Real-time Search**: Instant search results as you type

### 🌙 Theme Support
- **Light Mode**: Clean white cards with indigo accents
- **Dark Mode**: Modern dark theme with subtle glowing blues
- **Auto Theme**: Toggle between light and dark modes

## Tech Stack

- **Frontend**: React 19.1.1
- **Styling**: Tailwind CSS 4.1.16 + DaisyUI 5.3.8
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite 7.1.7

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tria-contacts-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Left navigation sidebar
│   ├── Header.jsx           # Top header with search and actions
│   ├── ContactsList.jsx     # Main contacts table
│   └── AddContactModal.jsx  # Modal for adding new contacts
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
└── index.css                # Global styles and theme variables
```

## Data Structure

### Contact Object
```json
{
  "id": "unique-id",
  "name": "Contact Name",
  "email": "email@example.com",
  "phone": "(+91) 9876543210",
  "createdDate": "2025-05-15T08:00:00Z",
  "createdBy": "user-id",
  "tags": ["family", "work"],
  "isFavorite": false,
  "groupId": "group-id-or-null",
  "isArchived": false,
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Name"
}
```

## Color Scheme

### Light Mode
- Background: `#F9FAFB`
- Cards: `#FFFFFF`
- Text: `#111827`
- Accent: `#3B82F6`
- Sidebar: `#1E3A8A`

### Dark Mode
- Background: `#0F172A`
- Cards: `#1E293B`
- Text: `#F1F5F9`
- Accent: `#6366F1`
- Sidebar: `#1E293B`

## Features in Detail

### Search Functionality
- Searches across name, email, and phone number
- Real-time results as you type
- Case-insensitive matching

### Filter System
- Filter by contact tags
- "All Tags" option to show all contacts
- Maintains search results when filtering

### Contact Actions
- **Call**: Simulated call action with toast notification
- **Message**: Simulated message action
- **Favorite**: Toggle favorite status
- **Delete**: Remove contact with confirmation

### Bulk Operations
- Select multiple contacts using checkboxes
- Bulk add to favorites
- Bulk delete contacts
- Bulk group operations (coming soon)

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Contact editing functionality
- [ ] Group management (create, edit, delete groups)
- [ ] Contact import/export (CSV, vCard)
- [ ] Advanced search filters
- [ ] Contact sharing
- [ ] Mobile app version
- [ ] Offline support with PWA
- [ ] Contact synchronization
- [ ] Advanced analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/) for the amazing UI library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [DaisyUI](https://daisyui.com/) for the beautiful component library
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [DiceBear](https://dicebear.com/) for the avatar generation API
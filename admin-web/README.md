# Admin Web Panel - Object Transfer System

A modern, web-based admin panel for managing the Object Transfer System.

## Features

- 🔐 Secure admin authentication
- 📊 Dashboard with real-time statistics
- 👥 User management (view, edit, delete customers)
- 🚴 Rider management (approve, reject, delete riders)
- 🚗 Trip management (view, delete trips)
- ⚙️ Settings and configuration
- 📱 Responsive design for all devices

## Installation

1. Navigate to the admin-web directory:
```bash
cd admin-web
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will open automatically at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## Default Admin Credentials

Use the admin account you created in Firebase:
- Email: Your admin email
- Password: Your admin password

**Note:** Only users with `role: "Admin"` in Firestore can access the admin panel.

## Project Structure

```
admin-web/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Overview.jsx     # Dashboard overview
│   │   ├── UsersManagement.jsx
│   │   ├── RidersManagement.jsx
│   │   ├── TripsManagement.jsx
│   │   └── Settings.jsx
│   ├── pages/              # Main pages
│   │   ├── Login.jsx       # Admin login
│   │   └── Dashboard.jsx   # Main dashboard with routing
│   ├── firebase.js         # Firebase configuration
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Technologies Used

- **React 18** - UI library
- **React Router v6** - Routing
- **Firebase** - Backend (Auth & Firestore)
- **React Icons** - Icon library
- **Vite** - Build tool and dev server

## Features Overview

### Dashboard
- Total customers, riders, and trips statistics
- Pending rider approvals count
- Active and completed trips
- Total earnings calculation
- Quick statistics and metrics

### Users Management
- View all customers and riders
- Search by name, email, or phone
- Filter by role (Customer/Rider)
- Edit user information
- Delete users

### Riders Management
- View all riders with their status
- Search by name, email, phone, or CNIC
- Filter by status (pending/approved/rejected)
- Approve or reject rider applications
- View rider ratings and earnings
- Delete riders

### Trips Management
- View all trips with details
- Search by order ID, customer, rider, or location
- Filter by status (pending/active/in_progress/completed/cancelled)
- View trip earnings
- Delete trips

### Settings
- View admin profile
- System configuration options
- Support and help information

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Security Notes

- Only users with `role: "Admin"` in Firestore can access the panel
- Firebase security rules should be properly configured
- Use environment variables for sensitive data in production
- Enable Firebase Authentication security features

## Support

For issues or questions, contact: admin@objecttransfer.com

## Version

Admin Portal v1.0.0

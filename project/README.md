# ReWear - Community Clothing Exchange Platform

A sustainable fashion platform that promotes eco-conscious clothing exchange through community-driven swaps and a points-based redemption system.

## 🌱 About ReWear

ReWear is a front-end web application built with pure HTML, CSS, and JavaScript that enables users to exchange unused clothing items sustainably. The platform features two exchange systems: direct swaps between users and a point-based redemption system, encouraging circular fashion and reducing textile waste.

## ✨ Features

### Core Functionality
- **User Authentication**: Complete signup/login system using localStorage
- **Item Management**: Add, browse, and manage clothing listings with image upload
- **Dual Exchange Systems**: 
  - Direct swaps between users
  - Points-based redemption system
- **User Dashboard**: Profile management, points tracking, item history
- **Admin Panel**: Content moderation and user management
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Key Highlights
- 🎨 **Eco-conscious Design**: Pastel color scheme with sustainability focus
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🔍 **Advanced Search & Filters**: Find items by category, size, condition
- 📸 **Image Upload**: Multi-image support with preview functionality
- 🏆 **Gamification**: Points system that rewards sustainable behavior
- 🛡️ **Admin Moderation**: Tools for community management
- 💾 **Local Storage**: Client-side data persistence

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start exploring the platform!

### Demo Accounts
For testing purposes, the following demo accounts are pre-configured:

**Admin Account:**
- Email: `admin@rewear.com`
- Password: `password`

**User Account:**
- Email: `user@rewear.com`
- Password: `password`

## 📁 Project Structure

```
rewear/
├── index.html              # Landing page
├── login.html              # User login
├── signup.html             # User registration
├── browse.html             # Browse items page
├── add-item.html           # Add new item form
├── item-detail.html        # Individual item view
├── dashboard.html          # User dashboard
├── admin.html              # Admin panel
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── auth.js             # Authentication system
│   └── main.js             # Main application logic
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Sage Green (#7cb342) - Represents growth and sustainability
- **Secondary**: Soft Blue (#4fc3f7) - Conveys trust and community
- **Accent**: Warm Orange (#ffab40) - Highlights important actions
- **Success/Warning/Error**: Standard semantic colors
- **Neutrals**: Carefully selected grays and off-whites

### Typography
- **Font**: Inter (with system fallbacks)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: Responsive typography with proper line heights

### Spacing System
- Based on 8px grid system
- Consistent spacing variables from 0.5rem to 4rem

## 🔧 Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern features including Grid, Flexbox, Custom Properties
- **Vanilla JavaScript**: ES6+ features, no external dependencies
- **Local Storage**: Client-side data persistence
- **FileReader API**: Image upload and preview functionality

### Key Features Implementation
- **Authentication**: JWT-like token simulation with localStorage
- **Image Handling**: Base64 encoding for client-side image storage
- **Search & Filtering**: Real-time filtering with debounced search
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach
- **State Management**: Centralized data management with localStorage

## 🌟 Usage Examples

### For Users
1. **Sign up** for a new account or use demo credentials
2. **Browse items** using filters and search functionality
3. **List your items** with detailed descriptions and photos
4. **Exchange items** through direct swaps or points redemption
5. **Track activity** in your personal dashboard

### For Admins
1. **Login** with admin credentials
2. **Monitor platform** statistics and user activity
3. **Moderate content** by reviewing and managing items
4. **Manage users** and handle community issues

## 🎯 Future Enhancements

- Real-time messaging between users
- Email notifications for swap requests
- Advanced item condition verification
- Social features (user reviews, favorites)
- Environmental impact tracking
- Integration with shipping services
- Mobile app development

## 🤝 Contributing

This is an educational project demonstrating front-end development skills. While not actively maintained, feel free to fork and adapt for your own learning purposes.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌍 Environmental Impact

ReWear promotes sustainable fashion by:
- Extending clothing lifecycle through reuse
- Reducing textile waste and landfill burden
- Minimizing carbon footprint of new clothing production
- Building community awareness around sustainable practices

---

**Built with 💚 for a sustainable future**

*ReWear - Where fashion meets sustainability through community exchange*
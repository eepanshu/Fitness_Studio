# Fitness Studio Booking System

A modern, dark-themed booking system for a fictional fitness studio built with FastAPI and an elegant UI. This system allows clients to view available fitness classes and book spots in their preferred sessions.

![Fitness Studio UI](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)

## ✨ Features

### 🎨 Dark Theme UI
- **Neon Accents**: Beautiful neon highlights and glowing effects
- **Animated Background**: Dynamic fitness-themed background with parallax effect
- **Floating Icons**: Animated fitness icons for enhanced visual appeal
- **Real-time Animations**: Smooth transitions and interactive effects
- **High Contrast**: Optimized for readability and accessibility

### 🚀 Core Functionality
- **View Classes**: Get all upcoming fitness classes with details
- **Book Classes**: Reserve spots in fitness classes with validation
- **View Bookings**: Retrieve all bookings for a specific email
- **Timezone Management**: Classes created in IST with timezone conversion support
- **Error Handling**: Comprehensive validation and error responses
- **Data Persistence**: In-memory storage with JSON file backup
- **Unit Tests**: Complete test suite for all endpoints

### 💫 UI Enhancements
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Success Celebrations**: Confetti animations for successful actions
- **Form Validation**: Real-time feedback with animations
- **Loading States**: Smooth loading transitions
- **Keyboard Shortcuts**: Quick access to common actions
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3**: Modern, semantic markup with advanced CSS features
- **JavaScript**: ES6+ with class-based architecture
- **Bootstrap 5**: Responsive grid and components
- **Font Awesome**: Icon library for fitness icons
- **Custom Animations**: CSS keyframes and JavaScript animations

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Database**: In-memory with JSON file persistence
- **Timezone**: pytz for timezone management
- **Validation**: Pydantic for data validation
- **Testing**: pytest with FastAPI TestClient

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Modern web browser (Chrome/Firefox/Safari)

### Installation

1. **Clone or download the project**
   ```bash
   cd Pyassignment
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python run.py
   ```

4. **Access the Application**
   - Web UI: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative Docs: `http://localhost:8000/redoc`

## 🎮 UI Features

### Dark Theme Elements
- **Neon Accents**: Glowing buttons and interactive elements
- **Glass Morphism**: Frosted glass effect on cards
- **Dynamic Background**: Animated gradient overlays
- **Floating Particles**: Background particle system
- **Smooth Animations**: Page transitions and hover effects

### Interactive Components
- **Real-time Validation**: Instant feedback on form inputs
- **Success Animations**: Confetti celebration on successful actions
- **Loading States**: Animated spinners and shimmer effects
- **Toast Notifications**: Stylish alert messages
- **Hover Effects**: Interactive card and button animations

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Add New Class
- `Ctrl/Cmd + B`: Book Class
- `Esc`: Close Modals

## 🔥 API Endpoints

### 1. GET /classes
Returns a list of all upcoming fitness classes.

### 2. POST /book
Book a spot in a fitness class.

### 3. GET /bookings
Get all bookings for a specific email address.

[Full API documentation available in the interactive docs]

## 🎯 Sample Data

The system comes with pre-loaded sample classes:
- **Yoga Basics** - Sarah Johnson
- **Zumba Dance** - Maria Rodriguez
- **HIIT Training** - Mike Chen
- And more...

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Enhanced touch targets
- **Adaptive Layout**: Flexible grid system
- **Consistent Experience**: Uniform design across devices

## 🎨 Theme Features

### Color Scheme
- Primary: Neon Purple (#4a00e0)
- Secondary: Electric Blue (#8e2de2)
- Success: Mint Green (#00b09b)
- Warning: Sunset Orange (#f7971e)
- Danger: Crimson Red (#ff416c)

### Typography
- **Font**: Poppins (300, 400, 500, 600, 700)
- **Icons**: Font Awesome Pro
- **Optimized**: High contrast for readability

## 🔧 Development

### Project Structure
```
Pyassignment/
├── static/
│   ├── css/
│   │   └── style.css    # Dark theme styles
│   └── js/
│       └── app.js       # Enhanced UI logic
├── templates/
│   └── index.html       # Main UI template
├── main.py              # FastAPI application
├── models.py            # Data models
├── database.py          # Data management
├── test_api.py          # Tests
└── requirements.txt     # Dependencies
```

### Adding New Features
1. **UI Components**: Add to templates/index.html
2. **Styles**: Extend static/css/style.css
3. **Functionality**: Update static/js/app.js
4. **API**: Modify main.py and models.py

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is created for educational and evaluation purposes.

## 💡 Support

For questions or issues:
- Check the documentation
- Create an issue in the repository
- Contact the development team
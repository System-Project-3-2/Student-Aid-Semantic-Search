# Student Aid - Frontend

A modern React frontend for the Student Aid Academic Management System. This application provides a role-based interface for students, teachers, and administrators to manage educational materials and feedback.

## 🚀 Features

### Authentication
- Login with JWT authentication
- Registration with OTP email verification
- Role-based access control (Student, Teacher, Admin)
- Protected routes with automatic redirects

### Student Features
- Dashboard with activity overview
- Semantic search for educational materials
- Submit feedback or queries
- Track feedback status (pending/resolved)

### Teacher Features
- Dashboard with pending feedback count
- Upload educational materials (PDF, DOCX, PPTX)
- View and respond to student feedback
- Search materials

### Admin Features
- System overview dashboard
- User management interface
- View and respond to all feedback
- Upload materials and search functionality

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **React Router v6** - Client-side routing
- **Material-UI (MUI)** - UI component library
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Context API** - State management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   ├── LoadingSpinner.js
│   │   ├── ProtectedRoute.js
│   │   ├── StatCard.js
│   │   ├── PageHeader.js
│   │   ├── EmptyState.js
│   │   ├── FeedbackCard.js
│   │   └── MaterialCard.js
│   └── index.js
├── context/            # React Context providers
│   ├── AuthContext.js
│   └── index.js
├── hooks/              # Custom React hooks
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useLocalStorage.js
│   └── index.js
├── layouts/            # Layout components
│   ├── DashboardLayout.js
│   └── index.js
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   │   ├── Login.js
│   │   └── Register.js
│   ├── student/        # Student pages
│   │   ├── Dashboard.js
│   │   ├── SearchMaterials.js
│   │   ├── SubmitFeedback.js
│   │   └── MyFeedbacks.js
│   ├── teacher/        # Teacher pages
│   │   ├── Dashboard.js
│   │   ├── UploadMaterial.js
│   │   └── Feedbacks.js
│   ├── admin/          # Admin pages
│   │   ├── Dashboard.js
│   │   ├── UserManagement.js
│   │   └── Feedbacks.js
│   └── NotFound.js
├── router/             # Routing configuration
│   └── AppRouter.js
├── services/           # API service layer
│   ├── api.js          # Axios instance
│   ├── authService.js
│   ├── materialService.js
│   ├── feedbackService.js
│   └── index.js
├── App.js              # Root component
├── App.css             # Global styles
├── index.js            # Entry point
└── index.css           # Base styles
```

## 🔧 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Update the `.env` file with your API URL:**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000).

## 🌐 API Integration

The frontend integrates with the following backend API endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify email OTP

### Materials
- `POST /api/materials/upload` - Upload material (Teacher/Admin)
- `DELETE /api/materials/:id` - Delete material (Teacher/Admin)
- `POST /api/search` - Semantic search

### Feedback
- `POST /api/feedbacks` - Create feedback (Student)
- `GET /api/feedbacks/my-feedbacks` - Get own feedbacks (Student)
- `GET /api/feedbacks` - Get all feedbacks (Teacher/Admin)
- `PUT /api/feedbacks/:id/respond` - Respond to feedback (Teacher/Admin)

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Role-based Navigation** - Different sidebar items per role
- **Loading States** - Spinner components for async operations
- **Toast Notifications** - Success/error feedback
- **Form Validation** - Client-side validation with error messages
- **Empty States** - Helpful messages when no data is available

## 🔐 Authentication Flow

1. User registers with name, email, and password
2. System sends OTP to email (role detected from email domain)
3. User verifies OTP
4. User logs in with credentials
5. JWT token stored in localStorage
6. Token sent with all API requests via interceptor
7. Automatic logout on token expiry (401 response)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Available Scripts

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## 📄 License

This project is part of the Student Aid Academic Management System.

# 🎨 FRONTEND DEVELOPER — Complete Code Documentation
## RentHub Property & Room Rental Management System

**Developer Role:** Frontend Developer  
**Tech Stack:** React 19, Vite 7, TailwindCSS 4, React Router DOM 7, Axios, Socket.io-client, React Hot Toast, React Icons  
**Project:** RentHub — Property & Room Rental Management Platform

---

## 📁 Project Structure Overview

```
client/
├── index.html              ← HTML entry point
├── vite.config.js           ← Vite bundler configuration
├── package.json             ← Dependencies & scripts
├── vercel.json              ← Vercel deployment config
├── .env.production          ← Production environment variables
└── src/
    ├── main.jsx             ← React DOM entry point
    ├── App.jsx              ← Root component with routing
    ├── App.css              ← Legacy app styles
    ├── index.css            ← Global CSS design system
    ├── api/
    │   └── axios.js         ← Axios instance + all API functions
    ├── context/
    │   ├── AuthContext.jsx   ← Authentication state management
    │   ├── ThemeContext.jsx  ← Dark/light theme management
    │   └── ChatContext.jsx   ← Real-time chat state management
    ├── routes/
    │   └── ProtectedRoute.jsx ← Route guard component
    ├── components/
    │   ├── common/          ← Navbar, Footer
    │   ├── chat/            ← Chat UI components
    │   ├── property/        ← Property card components
    │   └── room/            ← Room card components
    └── pages/
        ├── Home.jsx, Login.jsx, Register.jsx, Rooms.jsx, etc.
        ├── home/            ← Hero, FeaturedProperties, etc.
        ├── landlord/        ← Dashboard, Properties, Bookings, etc.
        └── tenant/          ← Tenant Dashboard
```

---

## 📄 FILE 1: `index.html` — HTML Entry Point

```html
<!doctype html>
```
**Line 1:** Declares this is an HTML5 document. Tells the browser to use modern HTML5 standards.

```html
<html lang="en">
```
**Line 2:** Opens the root HTML element. `lang="en"` tells search engines and screen readers that the content is in English (important for SEO and accessibility).

```html
  <head>
```
**Line 3:** Opens the `<head>` section — contains metadata, links, and the page title (not visible content).

```html
    <meta charset="UTF-8" />
```
**Line 4:** Sets character encoding to UTF-8, which supports all international characters (Hindi, Chinese, emojis, etc.).

```html
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
```
**Line 5:** Sets the favicon (small icon in browser tab) to the Vite logo SVG file from the `public/` folder.

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
**Line 6:** Makes the page responsive on mobile devices. `width=device-width` ensures the page width matches the device screen. `initial-scale=1.0` prevents auto-zooming.

```html
    <meta name="description" content="RentHub - Property & Room Rental Management System. Find your perfect rental home." />
```
**Line 7:** SEO meta description — this text appears in Google search results below the page title.

```html
    <meta name="keywords" content="rental, property, room, apartment, pg, hostel, tenant, landlord" />
```
**Line 8:** SEO keywords (less important for modern SEO but still used by some engines).

```html
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```
**Line 9:** Loads the "Inter" font from Google Fonts with weights 400 (normal), 500 (medium), 600 (semi-bold), 700 (bold). `display=swap` shows fallback font while Inter loads.

```html
    <title>RentHub - Find Your Perfect Rental Home</title>
```
**Line 10:** The page title shown in the browser tab and in Google search results.

```html
  </head>
  <body>
    <div id="root"></div>
```
**Line 13:** Creates an empty `div` with id "root" — this is where the entire React app will be mounted/injected by React DOM.

```html
    <script type="module" src="/src/main.jsx"></script>
```
**Line 14:** Loads the main JavaScript file as an ES module. `type="module"` enables modern `import/export` syntax. Vite starts from this file and bundles the entire app.

```html
  </body>
</html>
```
**Lines 15-16:** Closes the body and HTML tags.

---

## 📄 FILE 2: `vite.config.js` — Build Tool Configuration

```javascript
import { defineConfig } from 'vite'
```
**Line 1:** Imports `defineConfig` from Vite — a helper function that provides TypeScript intellisense and auto-completion for the config object.

```javascript
import react from '@vitejs/plugin-react'
```
**Line 2:** Imports the official React plugin for Vite. This plugin enables: JSX transformation, Fast Refresh (hot module replacement), and React-specific optimizations.

```javascript
import tailwindcss from '@tailwindcss/vite'
```
**Line 3:** Imports the TailwindCSS v4 Vite plugin. TailwindCSS v4 uses a Vite plugin instead of PostCSS config (different from v3).

```javascript
export default defineConfig({
```
**Line 6:** Exports the configuration object. `defineConfig` wraps it for type safety.

```javascript
  plugins: [react(), tailwindcss()],
```
**Line 7:** Registers both plugins. `react()` handles JSX compilation and HMR. `tailwindcss()` processes Tailwind utility classes at build time.

```javascript
  server: {
    port: 5173,
```
**Lines 8-9:** Sets the development server to run on port 5173 (Vite's default).

```javascript
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
```
**Lines 10-15:** **API Proxy Configuration** — any request from the frontend starting with `/api` (like `/api/auth/login`) will be forwarded to `http://localhost:5000/api/auth/login` (the backend). `changeOrigin: true` changes the `Host` header to match the target. This avoids CORS issues during development.

```javascript
  }
})
```
**Lines 16-17:** Closes the server and config objects.

---

## 📄 FILE 3: `src/main.jsx` — React Application Entry Point

```javascript
import { StrictMode } from 'react'
```
**Line 1:** Imports `StrictMode` from React. StrictMode is a development-only wrapper that activates additional checks and warnings (double-renders components, warns about deprecated APIs).

```javascript
import { createRoot } from 'react-dom/client'
```
**Line 2:** Imports `createRoot` from React DOM — the new React 18+ API for rendering. Replaces the old `ReactDOM.render()` method. Enables concurrent features.

```javascript
import './index.css'
```
**Line 3:** Imports the global CSS file which contains all CSS variables, design system tokens, utility classes, TailwindCSS import, and component styles.

```javascript
import App from './App.jsx'
```
**Line 4:** Imports the root `App` component which contains all routing logic and the entire app structure.

```javascript
createRoot(document.getElementById('root')).render(
```
**Line 6:** Finds the `<div id="root">` from `index.html` and creates a React root at that DOM node.

```javascript
  <StrictMode>
    <App />
  </StrictMode>,
```
**Lines 7-9:** Wraps the `App` component inside `StrictMode`. This renders `<App />` into the DOM. The trailing comma is from older JSX patterns (harmless).

```javascript
)
```
**Line 10:** Closes the `render()` call.

---

## 📄 FILE 4: `src/App.jsx` — Root Component with Routing (MOST IMPORTANT)

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
```
**Line 1:** Imports routing components from React Router v7:
- `BrowserRouter` (aliased as `Router`): Uses HTML5 History API for clean URLs (like `/rooms` instead of `/#/rooms`)
- `Routes`: Container for all Route definitions (only one route matches at a time)
- `Route`: Defines a single path-to-component mapping

```javascript
import { Toaster } from 'react-hot-toast';
```
**Line 2:** Imports `Toaster` — renders toast notifications (success/error popups) anywhere in the app.

```javascript
import { AuthProvider } from './context/AuthContext';
```
**Line 3:** Imports `AuthProvider` — wraps the app to provide authentication state (user, login, logout) to all child components.

```javascript
import { ThemeProvider } from './context/ThemeContext';
```
**Line 4:** Imports `ThemeProvider` — manages dark/light theme toggle across the entire app.

```javascript
import { ChatProvider } from './context/ChatContext';
```
**Line 5:** Imports `ChatProvider` — manages real-time chat state with Socket.io.

```javascript
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
```
**Lines 6-8:** Imports shared layout components (`Navbar`, `Footer` shown on every page) and `ProtectedRoute` which blocks unauthenticated/unauthorized users.

```javascript
// Public Pages
import Chat from './pages/Chat';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import PropertyDetail from './pages/PropertyDetail';
import AllProperties from './pages/AllProperties';
import AboutMe from './pages/AboutMe';
import Notifications from './pages/Notifications';
```
**Lines 10-20:** Imports all public-facing page components.

```javascript
// Landlord Pages
import LandlordDashboard from './pages/landlord/Dashboard';
import AddProperty from './pages/landlord/AddProperty';
import Properties from './pages/landlord/Properties';
import Bookings from './pages/landlord/Bookings';
import Rentals from './pages/landlord/Rentals';
import Payments from './pages/landlord/Payments';
```
**Lines 22-28:** Imports landlord-specific pages (only accessible to landlord/admin roles).

```javascript
// Tenant Pages
import TenantDashboard from './pages/tenant/Dashboard';
```
**Lines 30-31:** Imports tenant-specific dashboard page.

```javascript
function App() {
  return (
    <Router>
```
**Lines 33-35:** Defines the main `App` component. Wraps everything in `<Router>` which enables URL-based navigation.

```javascript
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
```
**Lines 36-38:** **Context Provider Nesting** — the order matters:
1. `ThemeProvider` (outermost) — theme is available everywhere
2. `AuthProvider` — auth depends on theme being available
3. `ChatProvider` (innermost) — chat depends on auth user being available

```javascript
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
```
**Lines 39-41:** Layout structure:
- `min-h-screen`: Page is at least full viewport height
- `flex flex-col`: Vertical flex layout (Navbar on top, content in middle, footer at bottom)
- `flex-1`: Main content area expands to fill available space (pushes footer to bottom)

```javascript
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/rooms/:id" element={<RoomDetail />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/properties" element={<AllProperties />} />
```
**Lines 42-50:** Public routes — anyone can access these without logging in. `:id` is a URL parameter (dynamic segment), e.g., `/rooms/abc123` passes `abc123` as the `id` param.

```javascript
                  {/* Chat Route */}
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
```
**Lines 53-60:** Protected route — only logged-in users can access `/chat`. `ProtectedRoute` wraps `Chat` and redirects to `/login` if user is not authenticated.

```javascript
                  {/* Landlord Routes */}
                  <Route
                    path="/landlord/dashboard"
                    element={
                      <ProtectedRoute roles={['landlord', 'admin']}>
                        <LandlordDashboard />
                      </ProtectedRoute>
                    }
                  />
```
**Lines 80-87:** Role-based protected route — only users with `landlord` or `admin` role can access this. The `roles` prop is an array of allowed roles.

```javascript
                  {/* Tenant Routes */}
                  <Route
                    path="/tenant/dashboard"
                    element={
                      <ProtectedRoute roles={['tenant']}>
                        <TenantDashboard />
                      </ProtectedRoute>
                    }
                  />
```
**Lines 146-153:** Tenant-only route — only `tenant` role users can access this dashboard.

```javascript
                  {/* 404 */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                        <p className="text-muted mb-6">Page not found</p>
                        <a href="/" className="btn btn-primary">Go Home</a>
                      </div>
                    </div>
                  } />
```
**Lines 163-172:** **Catch-all 404 route** — `path="*"` matches any URL that didn't match above. Shows a styled 404 error page with a "Go Home" button.

```javascript
              </main>
              <Footer />
            </div>
```
**Lines 174-176:** Closes the main content area and renders the Footer below it.

```javascript
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#fff' }
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' }
                }
              }}
            />
```
**Lines 177-193:** **Toast Notification Configuration:**
- `position="top-right"`: Toasts appear in top-right corner
- `duration: 3000`: Each toast auto-dismisses after 3 seconds
- `style`: Uses CSS variables so toasts match the current theme (dark/light)
- `success.iconTheme`: Green checkmark icon for success toasts
- `error.iconTheme`: Red X icon for error toasts

```javascript
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
```
**Lines 194-201:** Closes all providers and exports the App component as the default export.

---

## 📄 FILE 5: `src/api/axios.js` — API Layer (HTTP Client Configuration)

```javascript
import axios from 'axios';
```
**Line 1:** Imports the Axios HTTP client library — used for making API calls to the backend instead of the native `fetch()` API. Advantages: automatic JSON parsing, interceptors, better error handling.

```javascript
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```
**Line 3:** Gets the API base URL from environment variables. `import.meta.env` is Vite's way to access env variables. Falls back to `localhost:5001/api` if not set. The `VITE_` prefix is required by Vite (only `VITE_*` vars are exposed to client code for security).

```javascript
if (API_URL && !API_URL.endsWith('/api')) {
    API_URL += '/api';
}
```
**Lines 6-8:** Safety check — ensures `API_URL` always ends with `/api`. If someone sets `VITE_API_URL=https://example.com`, this appends `/api` automatically.

```javascript
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
```
**Lines 10-15:** Creates a custom Axios instance:
- `baseURL`: All requests start from this URL (e.g., `api.get('/rooms')` becomes `GET http://localhost:5001/api/rooms`)
- `Content-Type: application/json`: Tells the server we're sending JSON data in request bodies

```javascript
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
```
**Lines 18-27:** **Request Interceptor** — runs before EVERY request:
1. Gets the JWT token from browser's localStorage
2. If token exists, adds it to the `Authorization` header as `Bearer <token>`
3. This way, every API call automatically includes authentication
4. If there's an error in the interceptor itself, it rejects the promise

```javascript
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```
**Lines 30-40:** **Response Interceptor** — runs after EVERY response:
1. If response is successful, pass it through unchanged
2. If error has status 401 (Unauthorized): the token is expired/invalid
3. Clears stored token and user data from localStorage
4. Redirects user to the login page
5. Re-throws the error for component-level handling

```javascript
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    updatePassword: (data) => api.put('/auth/password', data)
};
```
**Lines 43-49:** **Auth API functions** — each function returns an Axios promise:
- `register(data)`: POST request to create a new user account
- `login(data)`: POST request to authenticate and get JWT token
- `getMe()`: GET request to fetch current user's profile (requires token)
- `updateProfile(data)`: PUT request to update user name/phone/address
- `updatePassword(data)`: PUT request to change password

```javascript
export const propertyAPI = {
    getAll: (params) => api.get('/properties', { params }),
    getOne: (id) => api.get(`/properties/${id}`),
    getMy: () => api.get('/properties/me/list'),
    create: (data) => api.post('/properties', data),
    update: (id, data) => api.put(`/properties/${id}`, data),
    delete: (id) => api.delete(`/properties/${id}`),
    getRooms: (id) => api.get(`/properties/${id}/rooms`)
};
```
**Lines 52-60:** **Property API functions:**
- `getAll(params)`: Fetches all properties with optional filters (city, state, type). `{ params }` converts to query string like `?city=Mumbai&type=apartment`
- `getOne(id)`: Fetches a single property by its MongoDB `_id`
- `getMy()`: Fetches only properties owned by the logged-in landlord
- `create(data)`: Creates a new property listing
- `update(id, data)`: Updates an existing property
- `delete(id)`: Deletes a property
- `getRooms(id)`: Gets all rooms inside a specific property

```javascript
export const roomAPI = {
    getAll: (params) => api.get('/rooms', { params }),
    getOne: (id) => api.get(`/rooms/${id}`),
    create: (data) => api.post('/rooms', data),
    update: (id, data) => api.put(`/rooms/${id}`, data),
    delete: (id) => api.delete(`/rooms/${id}`)
};
```
**Lines 63-69:** **Room API functions** — similar CRUD pattern for rooms.

```javascript
export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getTenantBookings: (params) => api.get('/bookings/tenant', { params }),
    getLandlordBookings: (params) => api.get('/bookings/landlord', { params }),
    approve: (id) => api.put(`/bookings/${id}/approve`),
    reject: (id, reason) => api.put(`/bookings/${id}/reject`, { reason }),
    cancel: (id) => api.put(`/bookings/${id}/cancel`)
};
```
**Lines 72-79:** **Booking API functions:**
- `create`: Tenant creates a booking request for a room
- `getTenantBookings`: Tenant views their own bookings
- `getLandlordBookings`: Landlord views received booking requests
- `approve`: Landlord approves a booking
- `reject`: Landlord rejects a booking with a reason
- `cancel`: Tenant cancels their own pending booking

```javascript
export const rentalAPI = {
    getAll: (params) => api.get('/rentals', { params }),
    getOne: (id) => api.get(`/rentals/${id}`),
    getHistory: () => api.get('/rentals/history'),
    terminate: (id, data) => api.put(`/rentals/${id}/terminate`, data),
    complete: (id, data) => api.put(`/rentals/${id}/complete`, data)
};
```
**Lines 82-88:** **Rental API functions** — manage active rental agreements after booking approval.

```javascript
export const paymentAPI = {
    getAll: (params) => api.get('/payments', { params }),
    getPending: () => api.get('/payments/pending'),
    getStats: () => api.get('/payments/stats'),
    create: (data) => api.post('/payments', data),
    confirm: (id, data) => api.put(`/payments/${id}/confirm`, data)
};
```
**Lines 91-97:** **Payment API functions** — manage rent payments between tenants and landlords.

```javascript
export const notificationAPI = {
    getAll: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
    clear: () => api.delete('/notifications/clear')
};
```
**Lines 100-106:** **Notification API functions** — manage user notifications (booking alerts, payment reminders, etc.).

```javascript
export default api;
```
**Line 108:** Exports the raw Axios instance for direct use if needed.

---

## 📄 FILE 6: `src/context/AuthContext.jsx` — Authentication State Management

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
```
**Line 1:** Imports React hooks:
- `createContext`: Creates a context object for sharing state without prop drilling
- `useContext`: Hook to consume context values in child components
- `useState`: Hook for component-level state variables
- `useEffect`: Hook for side effects (API calls, localStorage reads, etc.)

```javascript
import { authAPI } from '../api/axios';
```
**Line 2:** Imports auth API functions to make login/register/profile requests.

```javascript
const AuthContext = createContext(null);
```
**Line 4:** Creates the AuthContext with initial value `null`. This is the "container" that will hold auth state.

```javascript
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```
**Lines 6-12:** **Custom Hook `useAuth()`** — a convenient way for any component to access auth state:
- Calls `useContext(AuthContext)` to get the current value
- If context is `null` (component is not inside AuthProvider), throws a helpful error
- Returns the context value (user, login, logout, etc.)

```javascript
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
```
**Lines 14-17:** **AuthProvider Component** — wraps the entire app:
- `user`: Stores the current user object (`{id, name, email, role}`) or `null`
- `loading`: `true` until initial auth check completes (prevents flash of login page)
- `isAuthenticated`: Boolean flag — `true` if user is logged in

```javascript
    useEffect(() => {
        checkAuth();
    }, []);
```
**Lines 19-21:** Runs `checkAuth()` on component mount (empty `[]` dependency = runs once). This checks if a user was previously logged in (token exists in localStorage).

```javascript
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const response = await authAPI.getMe();
                setUser(response.data.data);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    };
```
**Lines 23-40:** **Auth Check Function:**
1. Reads `token` and `user` from localStorage
2. If both exist, calls `GET /api/auth/me` to verify token is still valid
3. If successful: sets user state and marks as authenticated
4. If API fails (token expired/invalid): clears localStorage and resets state
5. Always sets `loading = false` at the end

```javascript
    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        return user;
    };
```
**Lines 42-53:** **Login Function:**
1. Calls `POST /api/auth/login` with email and password
2. Extracts `token` and `user` from the response
3. Saves both to localStorage (persists across page refreshes)
4. Updates React state with the user object
5. Returns the user object (so the Login page can redirect based on role)

```javascript
    const register = async (data) => {
        const response = await authAPI.register(data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        return user;
    };
```
**Lines 55-66:** **Register Function** — same logic as login but calls the register endpoint instead.

```javascript
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };
```
**Lines 68-73:** **Logout Function** — clears all stored data and resets state. No API call needed (JWT is stateless).

```javascript
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };
```
**Lines 75-78:** **Update User Function** — updates user state and localStorage after profile edits.

```javascript
    const value = {
        user, loading, isAuthenticated,
        login, register, logout, updateUser, checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
```
**Lines 80-96:** Creates the `value` object with all state and functions, then wraps `children` with `AuthContext.Provider`. All child components can now use `useAuth()` to access these values.

---

## 📄 FILE 7: `src/context/ThemeContext.jsx` — Dark/Light Theme Management

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);
```
**Lines 1-3:** Same context pattern. Creates ThemeContext to share theme state.

```javascript
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
```
**Lines 5-11:** Custom `useTheme()` hook with error guard.

```javascript
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('renthub-theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        return 'dark';
    });
```
**Lines 13-21:** **Lazy State Initialization:**
1. `useState(() => {...})` — uses a function to compute initial state (runs only once)
2. Checks if `window` exists (SSR safety)
3. First checks localStorage for user's saved preference
4. If no saved preference, uses `prefers-color-scheme` CSS media query to detect the OS-level theme preference
5. Falls back to `'dark'` as default

```javascript
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
        localStorage.setItem('renthub-theme', theme);
    }, [theme]);
```
**Lines 23-33:** **Theme Application Effect:**
1. Gets `document.documentElement` (the `<html>` tag)
2. Adds/removes `dark` or `light` CSS classes on `<html>` — this triggers all CSS variable changes defined in `index.css` (`:root` vs `.light` selectors)
3. Saves the theme to localStorage so it persists across visits
4. `[theme]` dependency — re-runs whenever theme changes

```javascript
    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };
```
**Lines 35-37:** **Toggle Function** — switches between dark and light. Uses functional update (`prev => ...`) to safely toggle based on current value.

```javascript
    const value = {
        theme, setTheme, toggleTheme,
        isDark: theme === 'dark'
    };
```
**Lines 39-43:** Context value includes:
- `theme`: current theme string ('dark' or 'light')
- `setTheme`: direct setter
- `toggleTheme`: convenience toggle function
- `isDark`: computed boolean for easy conditional rendering

---

## 📄 FILE 8: `src/index.css` — Global Design System (Abridged Key Sections)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
```
**Line 2:** Loads Inter font with weights 300-800 from Google Fonts.

```css
@import "tailwindcss";
```
**Line 4:** Imports TailwindCSS v4. In v4, this single import replaces the old `@tailwind base; @tailwind components; @tailwind utilities;` approach.

```css
:root {
  --bg-primary: #280905;
  --bg-secondary: #3E0C06;
  --accent-primary: #C3110C;
  --accent-secondary: #E6501B;
  ...
}
```
**Lines 48-89:** **Dark Theme Variables (Default)** — defines all color tokens as CSS custom properties. `:root` means these are the default values applied everywhere. The dark theme uses deep brown/red tones.

```css
.light {
  --bg-primary: #FFF7CD;
  --bg-secondary: #FFFDF5;
  --accent-primary: #FB9B8F;
  --accent-secondary: #F57799;
  ...
}
```
**Lines 8-45:** **Light Theme Variables** — when `.light` class is on `<html>`, these override the `:root` values with cream/peach/pink tones.

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```
**Lines 102-110:** **Body Styles:**
- `font-family`: Uses Inter font with system font fallbacks
- `background` and `color`: Use CSS variables — automatically change when theme toggles
- `transition`: Smooth 0.3s animation when theme switches

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-lg);
}
```
**Lines 138-151:** **Card Component Styles:**
- Cards have themed backgrounds, borders, rounded corners
- `cubic-bezier(0.4, 0, 0.2, 1)`: Material Design easing curve (smooth deceleration)
- On hover: card lifts up 4px and border/shadow intensify — creates a "floating" effect

```css
.btn-primary {
  background: var(--accent-primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--accent-secondary);
}
```
**Lines 187-201:** **Primary Button Styles:**
- Uses accent color as background
- On hover (if not disabled): lifts up 2px and changes to secondary accent color
- `:not(:disabled)` ensures disabled buttons don't animate

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
```
**Lines 340-366:** **CSS Animations:**
- `fadeIn`: Elements fade in from slightly below their final position
- `slideIn`: Elements slide in from the left
- `forwards`: Animation state persists after completion (doesn't snap back)

---

## 📄 FILE 9: `src/pages/Home.jsx` — Home Page Composition

```javascript
import Hero from './home/Hero';
import FeaturedProperties from './home/FeaturedProperties';
import WhyChooseUs from './home/WhyChooseUs';
import PropertyShowcase from './home/PropertyShowcase';
import OwnerCTA from './home/OwnerCTA';
import Testimonials from './home/Testimonials';
import FinalCTA from './home/FinalCTA';
```
**Lines 1-7:** Imports 7 section components that make up the home page. Each is a self-contained component in the `pages/home/` folder.

```javascript
const Home = () => {
    return (
        <div className="min-h-screen">
            <Hero />
            <FeaturedProperties />
            <WhyChooseUs />
            <PropertyShowcase />
            <OwnerCTA />
            <Testimonials />
            <FinalCTA />
        </div>
    );
};
```
**Lines 9-21:** **Component Composition Pattern:**
- Home page is a simple composition of sections stacked vertically
- Each section is independently developed and maintained
- `min-h-screen` ensures the page fills at least the full viewport
- This pattern makes it easy to reorder, add, or remove sections

```javascript
export default Home;
```
**Line 23:** Exports the component for use in App.jsx routing.

---

## 📄 FILE 10: `package.json` — Frontend Dependencies

### Dependencies (Production):
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | Core UI library for building component-based interfaces |
| `react-dom` | ^19.2.0 | React renderer for web browsers (DOM manipulation) |
| `react-router-dom` | ^7.13.0 | Client-side routing (URL-based page navigation) |
| `axios` | ^1.13.4 | HTTP client for making API requests to backend |
| `react-hot-toast` | ^2.6.0 | Lightweight toast notification system |
| `react-icons` | ^5.5.0 | Icon library (FontAwesome, Material, Heroicons, etc.) |
| `date-fns` | ^4.1.0 | Date formatting/manipulation utility library |
| `socket.io-client` | ^4.8.3 | WebSocket client for real-time chat communication |

### Dev Dependencies:
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.2.4 | Lightning-fast build tool and dev server |
| `@vitejs/plugin-react` | ^5.1.1 | React support for Vite (JSX, Fast Refresh) |
| `tailwindcss` | ^4.1.18 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.1.18 | TailwindCSS v4 Vite integration plugin |
| `eslint` | ^9.39.1 | Code linting/quality tool |

### Scripts:
```json
"dev": "vite"          // Start development server with HMR
"build": "vite build"  // Create production bundle
"lint": "eslint ."     // Run code quality checks
"preview": "vite preview" // Preview production build locally
```

---

## 🔑 Key Frontend Concepts Summary

### 1. Context API Pattern
All global state uses React Context with the Provider/Consumer pattern. This avoids "prop drilling" — passing data through many component levels.

### 2. Protected Routing
`ProtectedRoute` checks `isAuthenticated` and `user.role` before rendering child components. Unauthorized users are redirected to `/login`.

### 3. API Interceptors
Request interceptor auto-attaches JWT token. Response interceptor auto-handles 401 errors (expired sessions). This is centralized— no need to handle auth in every component.

### 4. Theme System
CSS variables + class toggling on `<html>` enables instant full-app theme changes. All components use `var(--variable)` instead of hardcoded colors.

### 5. Component Architecture
- **Pages**: Full-page components mapped to routes
- **Components**: Reusable UI pieces (Navbar, Cards, Modals)
- **Context**: Global state providers
- **API**: Centralized HTTP layer

---

*Document prepared for: Frontend Developer*  
*Project: RentHub — Property & Room Rental Management System*  
*Last Updated: April 2026*

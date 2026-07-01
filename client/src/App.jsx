import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ToastProvider } from './components/ToastContainer'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'
import Events from './pages/Events'
import Blog from './pages/Blog'
import Projects from './pages/Projects'
import Forum from './pages/Forum'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-grid-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-grid-cyan/30 border-t-grid-cyan rounded-full animate-spin" />
        <div className="text-grid-cyan font-orbitron text-xs tracking-widest animate-pulse">AUTHENTICATING...</div>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

const Layout = () => {
  const { user } = useAuth()
  const location = useLocation()
  const hideFooter = location.pathname.startsWith('/chat')

  return (
    <div className="min-h-screen flex flex-col bg-grid-black">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

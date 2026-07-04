import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ToastProvider } from './components/ToastContainer'
import MagneticCursor from './components/MagneticCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GridAIBot from './components/GridAIBot'
import FloatingGridOrbs from './components/FloatingGridOrbs'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Projects from './pages/Projects'
import Forum from './pages/Forum'
import ForumThread from './pages/ForumThread'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
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

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

const PageTransition = ({ children }) => (
  <motion.div
    initial={PAGE_TRANSITION.initial}
    animate={PAGE_TRANSITION.animate}
    exit={PAGE_TRANSITION.exit}
    transition={PAGE_TRANSITION.transition}
  >
    {children}
  </motion.div>
)

const Layout = () => {
  const { user } = useAuth()
  const location = useLocation()
  const hideFooter = location.pathname.startsWith('/chat')

  return (
    <div className="min-h-screen flex flex-col bg-grid-black">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/members" element={<PageTransition><Members /></PageTransition>} />
            <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/blog/:postId" element={<PageTransition><BlogPost /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/forum" element={<PageTransition><Forum /></PageTransition>} />
            <Route path="/forum/:threadId" element={<PageTransition><ForumThread /></PageTransition>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile/:username" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <PageTransition><Register /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
      <GridAIBot />
      <FloatingGridOrbs />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <BrowserRouter>
            <MagneticCursor />
            <Layout />
          </BrowserRouter>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

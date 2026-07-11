import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

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
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-grid-black">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about"         element={<PageTransition><About /></PageTransition>} />
            <Route path="/members"       element={<PageTransition><Members /></PageTransition>} />
            <Route path="/events"        element={<PageTransition><Events /></PageTransition>} />
            <Route path="/blog"          element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/blog/:postId"  element={<PageTransition><BlogPost /></PageTransition>} />
            <Route path="/projects"      element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/forum"         element={<PageTransition><Forum /></PageTransition>} />
            <Route path="/forum/:threadId" element={<PageTransition><ForumThread /></PageTransition>} />
            <Route path="/profile/:username" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="*"             element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <GridAIBot />
      <FloatingGridOrbs />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MagneticCursor />
      <Layout />
    </BrowserRouter>
  )
}

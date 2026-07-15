import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MagneticCursor from './components/MagneticCursor'
import SmoothScroll from './components/SmoothScroll'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GridAIBot from './components/GridAIBot'
import FloatingGridOrbs from './components/FloatingGridOrbs'

// Lazy-load all pages — each route becomes its own JS chunk,
// so the initial bundle is ~70% smaller and the first paint is faster.
const Home        = lazy(() => import('./pages/Home'))
const About       = lazy(() => import('./pages/About'))
const Members     = lazy(() => import('./pages/Members'))
const Events      = lazy(() => import('./pages/Events'))
const Blog        = lazy(() => import('./pages/Blog'))
const BlogPost    = lazy(() => import('./pages/BlogPost'))
const Projects    = lazy(() => import('./pages/Projects'))
const Forum       = lazy(() => import('./pages/Forum'))
const ForumThread = lazy(() => import('./pages/ForumThread'))
const Profile     = lazy(() => import('./pages/Profile'))
const NotFound    = lazy(() => import('./pages/NotFound'))

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
        <Suspense fallback={null}>
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
        </Suspense>
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
      <ScrollProgress />
      <SmoothScroll />
      <MagneticCursor />
      <Layout />
    </BrowserRouter>
  )
}

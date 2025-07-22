// src/components/doctor/Layout.jsx
import { Outlet } from 'react-router-dom'
import DoctorNavbar from './DoctorNavbar'
import DoctorSidebar from './DoctorSidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-teal-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
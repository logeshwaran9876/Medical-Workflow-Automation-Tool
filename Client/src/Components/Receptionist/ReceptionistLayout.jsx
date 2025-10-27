import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReceptionistSidebar from './ReceptionistSidebar';
import ReceptionistNavbar from './ReceptionistNavbar';
import { Outlet } from 'react-router-dom';

export default function ReceptionistLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {}
      <div className="hidden lg:flex">
        <ReceptionistSidebar />
      </div>

      {}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <ReceptionistSidebar closeSidebar={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <ReceptionistNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
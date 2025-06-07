import { createContext, useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SnackbarProvider.css';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showSnackbar = (message, type = 'default') => {
    setSnackbar({ message, type });
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const snackbarVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { y: 50, opacity: 0 }
  };

  const getSnackbarColor = (type) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#2196F3';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="snackbar-container"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={snackbarVariants}
            style={{
              backgroundColor: getSnackbarColor(snackbar?.type)
            }}
          >
            <div className="snackbar-content">
              {snackbar?.message}
            </div>
            <motion.button
              className="snackbar-close"
              onClick={() => setIsVisible(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export default SnackbarProvider;
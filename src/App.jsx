import { useState } from 'react';
import { motion } from 'framer-motion';
import EmailForm from './components/EmailForm';
import { MatrixBackground } from './components/MatrixBackground';
import { SnackbarProvider } from './components/SnackbarProvider';
import './App.css';

const AppContent = () => {
  const [particleIntensity, setParticleIntensity] = useState(0.5);
  
  const handleSend = async (emailData) => {
    try {
      setParticleIntensity(1.5);
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      setTimeout(() => setParticleIntensity(0.5), 2000);
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => setParticleIntensity(0.5), 2000);
    }
  };

  return (
    <div className="app-container">
      <MatrixBackground intensity={particleIntensity} />
      <div className="content-overlay">
        <motion.h1 
          className="animated-title"
          animate={{ textShadow: `0 0 10px rgba(74, 107, 255, ${particleIntensity})` }}
          transition={{ duration: 0.5 }}
        >
          Email Sender
        </motion.h1>
        <EmailForm onSend={handleSend} />
      </div>
    </div>
  );
};

const App = () => (
  <SnackbarProvider>
    <AppContent />
  </SnackbarProvider>
);

export default App;
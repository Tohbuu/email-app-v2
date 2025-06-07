import { useState } from 'react';
import EmailForm from './components/EmailForm';
import { MatrixBackground } from './components/MatrixBackground';
import { SnackbarProvider, useSnackbar } from './components/SnackbarProvider';
import './App.css';

const AppContent = () => {
  const { showSnackbar } = useSnackbar();
  const [particleIntensity, setParticleIntensity] = useState(0.5);
  
  const handleSend = async (emailData) => {
    try {
      setParticleIntensity(1.5);
      
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        showSnackbar('Email sent successfully!', 'success');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setTimeout(() => setParticleIntensity(0.5), 2000);
    }
  };

  return (
    <div className="app-container">
      <MatrixBackground intensity={particleIntensity} />
      <div className="content-overlay">
        <motion.h1 
          className="animated-title"
          animate={{
            textShadow: `0 0 10px rgba(74, 107, 255, ${particleIntensity})`
          }}
          transition={{ duration: 0.5 }}
        >
          Email Sender
        </motion.h1>
        <EmailForm onSend={handleSend} />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <SnackbarProvider>
      <AppContent />
    </SnackbarProvider>
  );
};

export default App;
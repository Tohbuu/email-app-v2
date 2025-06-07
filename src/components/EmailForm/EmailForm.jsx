import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import { playSound } from '../../utils/sounds';
import { validateEmail } from '../../utils/validators';
import RichTextEditor from '../RichTextEditor';
import './EmailForm.css';

const EmailForm = ({ onSend }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    setIsValid(validateEmail(email) && message.trim().length > 0);
  }, [email, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid && !isSending) {
      playSound('click');
      setIsSending(true);
      await controls.start({
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 0.6 }
      });
      try {
        await onSend({ email, message });
        playSound('success');
      } catch {
        playSound('error');
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.8 }
        },
        hidden: { opacity: 0, y: 50 }
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 0.98 }}
      className="email-form-container"
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          whileFocus={{ scale: 1.02, y: -2 }}
          className="form-group"
        >
          <label>Recipient Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>
        
        <motion.div
          whileFocus={{ scale: 1.02, y: -2 }}
          className="form-group"
        >
          <label>Message</label>
          <RichTextEditor 
            value={message} 
            onChange={setMessage} 
          />
        </motion.div>
        
        <motion.button
          type="submit"
          disabled={!isValid || isSending}
          whileHover={() => {
            if (isValid) playSound('hover');
            return { scale: isValid ? 1.05 : 1 };
          }}
          whileTap={() => {
            if (isValid) playSound('click');
            return { scale: isValid ? 0.95 : 1 };
          }}
          animate={{
            backgroundColor: isValid ? "#4a6bff" : "#ccc",
            boxShadow: isValid 
              ? "0 4px 14px rgba(74, 107, 255, 0.5)" 
              : "none"
          }}
        >
          {isSending ? (
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            "Send Email"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EmailForm;
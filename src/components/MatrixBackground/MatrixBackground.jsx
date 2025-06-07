import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { useSpring } from '@react-spring/web';
import './MatrixBackground.css';

const ParticleSystem = ({ isInteracting, intensity }) => {
  const particlesRef = useRef();
  const mousePosition = useRef([0, 0, 0]);
  
  const { gravity } = useSpring({
    gravity: isInteracting ? 2 : 0.5,
    config: { mass: 1, tension: 280, friction: 120 }
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0
      ];
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += delta / (10 / intensity);
      particlesRef.current.rotation.y += delta / (15 / intensity);
      
      particlesRef.current.position.x += 
        (mousePosition.current[0] - particlesRef.current.position.x) * 0.01 * gravity.get() * intensity;
      particlesRef.current.position.y += 
        (mousePosition.current[1] - particlesRef.current.position.y) * 0.01 * gravity.get() * intensity;
    }
  });

  const particles = random.inSphere(new Float32Array(2000), { radius: 1.5 });

  return (
    <Points ref={particlesRef} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color="#08f" 
        size={0.01 * intensity} 
        sizeAttenuation={true} 
        depthWrite={false} 
      />
    </Points>
  );
};

export const MatrixBackground = ({ intensity = 1 }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  
  return (
    <div 
      className="matrix-container"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <ParticleSystem isInteracting={isInteracting} intensity={intensity} />
      </Canvas>
    </div>
  );
};

export default MatrixBackground;
import React, { useEffect, useRef } from 'react';
import './FluffyHeart.css';

const FluffyHeart = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particles = [];
    for (let i = 0; i < 300; i++) {
      const t = Math.random() * 2 * Math.PI;
      const r = Math.random() * 1.2;
      const x = 16 * Math.pow(Math.sin(t), 3) * r;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * r;
      
      particles.push({
        x: x * 6,
        y: -y * 6,
        baseX: x * 6,
        baseY: -y * 6,
        size: 3 + Math.random() * 4,
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * 100,
        opacity: 0.4 + Math.random() * 0.4,
      });
    }
    particlesRef.current = particles;

    const handleMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const time = Date.now() / 1000;
      
      ctx.clearRect(0, 0, W, H);

      const windX = mouseRef.current.x * 0.5;
      const windY = mouseRef.current.y * 0.3;

      particlesRef.current.forEach((p) => {
        const floatX = Math.sin(time * 0.5 + p.offset) * 2;
        const floatY = Math.cos(time * 0.7 + p.offset) * 2;
        
        const px = W/2 + p.x + floatX + windX * 0.5;
        const py = H/2 + p.y + floatY + windY * 0.5;

        const alpha = p.opacity * (0.8 + Math.sin(time + p.offset) * 0.2);
        
        // Glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <div className="fluffy-heart-container">
      <canvas ref={canvasRef} className="fluffy-heart-canvas" />
    </div>
  );
};

export default FluffyHeart;
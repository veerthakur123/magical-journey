import React, { useState, useEffect, useRef } from 'react';
import './GardenBackground.css';

const GardenBackground = () => {
  const canvasRef = useRef(null);
  const plantsRef = useRef([]);
  const timeRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const plants = [];
    for (let i = 0; i < 10; i++) {
      plants.push({
        x: 5 + Math.random() * 90,
        delay: Math.random() * 4,
        speed: 0.3 + Math.random() * 0.4,
        maxHeight: 50 + Math.random() * 60,
        size: 0.8 + Math.random() * 0.7,
        color: ['#ff6b6b', '#ff9ff3', '#ffd93d', '#f368e0'][Math.floor(Math.random() * 4)],
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.3 + Math.random() * 0.3,
      });
    }
    plantsRef.current = plants;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      timeRef.current += 0.02;
      const time = timeRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const groundY = H * 0.8;

      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, 'rgba(15, 20, 40, 0.95)');
      sky.addColorStop(0.6, 'rgba(25, 40, 60, 0.9)');
      sky.addColorStop(1, 'rgba(20, 50, 30, 0.9)');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Ground
      const ground = ctx.createLinearGradient(0, groundY, 0, H);
      ground.addColorStop(0, 'rgba(30, 120, 30, 0.7)');
      ground.addColorStop(1, 'rgba(10, 40, 10, 0.9)');
      ctx.fillStyle = ground;
      ctx.fillRect(0, groundY, W, H - groundY);

      // Ground line
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.strokeStyle = 'rgba(50, 200, 50, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Simple grass
      for (let i = 0; i < 100; i++) {
        const x = (i / 100) * W + Math.sin(i + time * 0.5) * 3;
        const h = 6 + Math.sin(i * 2 + time) * 5;
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + Math.sin(i + time) * 3, groundY - h);
        ctx.strokeStyle = `rgba(50, 180, 50, ${0.3 + Math.sin(i + time) * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw plants
      plantsRef.current.forEach((plant) => {
        const growth = Math.min((time - plant.delay) * plant.speed, 1);
        const height = plant.maxHeight * growth;
        const x = (plant.x / 100) * W;
        const sway = Math.sin(plant.swayOffset + time * plant.swaySpeed) * 2;

        if (growth < 0.05) {
          // Seed
          ctx.beginPath();
          ctx.arc(x, groundY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#5d4037';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255,255,255,0.1)';
          ctx.fill();
          ctx.shadowBlur = 0;
          return;
        }

        if (growth < 0.15) {
          // Sprout
          ctx.beginPath();
          ctx.moveTo(x, groundY);
          ctx.quadraticCurveTo(x + sway * 2, groundY - height * 0.5, x + sway * 3, groundY - height);
          ctx.strokeStyle = '#4caf50';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Small leaf
          ctx.beginPath();
          ctx.ellipse(x + sway * 3 + 5, groundY - height * 0.7, 5, 8, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#66bb6a';
          ctx.fill();
          return;
        }

        // Full plant
        ctx.save();
        ctx.translate(x, groundY);
        ctx.rotate(sway * 0.01);

        // Stem
        const stemGrad = ctx.createLinearGradient(0, 0, 0, -height);
        stemGrad.addColorStop(0, '#2d8a4e');
        stemGrad.addColorStop(1, '#4caf50');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sway * 2, -height * 0.4, sway * 3, -height);
        ctx.strokeStyle = stemGrad;
        ctx.lineWidth = 2 + plant.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Leaves (simplified)
        const numLeaves = Math.min(Math.floor(growth * 4), 4);
        for (let i = 0; i < numLeaves; i++) {
          const pos = 0.2 + (i / 4) * 0.6;
          const lx = Math.sin(i * 2 + time) * 8 * plant.size + sway * pos;
          const ly = -height * pos;
          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(i * 1.5 + Math.sin(time + i) * 0.3);
          ctx.beginPath();
          ctx.ellipse(0, 0, 6 * plant.size, 10 * plant.size, 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#4caf50';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(50,200,50,0.2)';
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        }

        // Flowers (only when fully grown)
        if (growth > 0.7) {
          const numFlowers = Math.min(Math.floor((growth - 0.7) * 10), 4);
          for (let i = 0; i < numFlowers; i++) {
            const pos = 0.5 + (i / 4) * 0.4;
            const fx = Math.sin(i * 2.5 + time * 0.5) * 10 * plant.size + sway * pos;
            const fy = -height * pos;
            const size = 5 + Math.sin(time + i) * 2;

            ctx.save();
            ctx.translate(fx, fy);
            
            // Petals
            for (let j = 0; j < 5; j++) {
              const angle = (j / 5) * Math.PI * 2 + time * 0.2;
              ctx.beginPath();
              ctx.ellipse(
                Math.cos(angle) * size * 0.6,
                Math.sin(angle) * size * 0.6,
                size * 0.4,
                size * 0.6,
                angle,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = plant.color;
              ctx.shadowBlur = 15;
              ctx.shadowColor = plant.color + '40';
              ctx.fill();
            }
            
            // Center
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd700';
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.restore();
      });

      // Fireflies (reduced for performance)
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(i * 4.7 + time * 0.5) * 0.4 + 0.5) * W;
        const y = (Math.cos(i * 3.3 + time * 0.4) * 0.3 + 0.4) * H;
        const alpha = 0.3 + Math.sin(i * 2 + time * 2) * 0.2;
        
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 15);
        glow.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
        glow.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 200, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="garden-background">
      <canvas ref={canvasRef} className="garden-canvas" />
    </div>
  );
};

export default GardenBackground;
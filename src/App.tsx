import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// --- Components ---

const DecodeText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="decode-span">{displayText}</span>;
};

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles: any[] = [];

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({ length: 80 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
      }));
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 2, 4, 0.1)';
      ctx.fillRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = 'rgba(0, 242, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();
    return () => window.removeEventListener('resize', init);
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <motion.div
      id="custom-cursor"
      animate={{
        x: pos.x - (isActive ? 20 : 10),
        y: pos.y - (isActive ? 20 : 10),
        width: isActive ? 40 : 20,
        height: isActive ? 40 : 20,
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
    />
  );
};

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundCanvas />
      <CustomCursor />
      
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'var(--accent)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 1000,
          boxShadow: '0 0 10px var(--accent)',
        }}
      />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 20px' }}>
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(10, 10, 15, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 40,
            padding: '100px',
            boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: 3, marginBottom: 20 }}>
            <DecodeText text="SYSTEM STATUS: ACTIVE" />
          </div>

          <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 40, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            <DecodeText text="The AI Race Just Got Faster" />
          </h1>

          <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 30, fontWeight: 300 }}>
            If you blinked, you might have missed it —{' '}
            <span style={{ color: '#fff', fontWeight: 500, background: 'linear-gradient(90deg, var(--accent), var(--accent-alt))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              artificial intelligence moved again
            </span>{' '}
            this week, and it moved fast. From new model releases to breakthroughs in reasoning capabilities, the AI landscape continues to reshape itself at a pace that feels almost surreal.
          </p>

          <h2 style={{ fontSize: '2rem', margin: '60px 0 25px', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10 }}>
            <DecodeText text="Neural Reasoning Upgrades" />
          </h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 30, fontWeight: 300 }}>
            The biggest buzz this week came from advancements in AI reasoning models — systems that don't just answer questions but actually think through problems step by step before responding.
          </p>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            style={{ marginTop: 80, padding: 60, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 30, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'background 0.3s' }}
          >
            <h2 style={{ fontSize: '1.8rem', marginTop: 0 }}>
              <DecodeText text="Final Computation" />
            </h2>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 0 }}>
              Every week in AI now feels like a quarterly report used to feel — dense with news, hard to fully absorb, and full of implications that take time to unpack. Stay curious, stay critical, and keep learning.
            </p>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

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

// --- Main App ---

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
      syncTouch: true,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundCanvas />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 20px' }}>
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
            <DecodeText text="SYSTEM STATUS: ACTIVE | APRIL 12, 2026" />
          </div>

          <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 40, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            <DecodeText text="Mythos Unleashed: AI's Cybersecurity Frontier" />
          </h1>

          <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 30, fontWeight: 300 }}>
            Yesterday, April 11, the AI world witnessed a seismic shift —{' '}
            <span style={{ color: '#fff', fontWeight: 500, background: 'linear-gradient(90deg, var(--accent), var(--accent-alt))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Anthropic announced Mythos Preview
            </span>{' '}
            under the classified "Project Glasswing." This model has already identified high-severity zero-day vulnerabilities across every major OS, marking a new era where AI is the ultimate offensive and defensive tool in cyberwarfare.
          </p>

          <h2 style={{ fontSize: '2rem', margin: '60px 0 25px', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10 }}>
            <DecodeText text="Global Hardware Sovereignty" />
          </h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 30, fontWeight: 300 }}>
            In a massive move toward hardware independence, the Japanese government approved ¥631.5 billion in additional subsidies for Rapidus. The goal is clear: domestic 2nm AI chip production by 2027, challenging the long-standing dominance of TSMC and reshaping the global silicon supply chain.
          </p>

          <h2 style={{ fontSize: '2rem', margin: '60px 0 25px', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10 }}>
            <DecodeText text="100x Energy Efficiency Breakthrough" />
          </h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 30, fontWeight: 300 }}>
            Sustainability met superintelligence yesterday as researchers at Tufts University unveiled a neuro-symbolic system that consumes 100x less energy than traditional neural networks. By blending logic-driven symbolic reasoning with deep learning, they've solved complex tasks that previously required massive compute clusters.
          </p>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            style={{ marginTop: 80, padding: 60, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 30, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'background 0.3s' }}
          >
            <h2 style={{ fontSize: '1.8rem', marginTop: 0 }}>
              <DecodeText text="The 2026 Trajectory" />
            </h2>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', marginBottom: 0 }}>
              As of April 11, 2026, the trajectory is undeniable: AI is moving from cloud-based assistance to autonomous agentic systems and hardware-integrated intelligence. With the UN's new scientific panel now operational, the world is racing to govern what it has built.
            </p>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
}
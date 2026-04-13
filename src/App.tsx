import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import { Moon, Sun, MousePointer2 } from 'lucide-react';
import contentData from './data/content.json';

// --- Components ---

const DecodeText = ({ text, speed = 1 }: { text: string; speed?: number }) => {
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
      iteration += speed;
    }, 20); // Faster refresh rate
    return () => clearInterval(interval);
  }, [text, speed]);

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
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({ length: isMobile ? 35 : 80 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
      }));
    };

    const animate = () => {
      const isLight = document.documentElement.classList.contains('light');

      // Update positions (shared)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      if (isLight) {
        // Canvas is transparent — CSS gradient background shows through
        ctx.clearRect(0, 0, width, height);

        // Draw constellation lines between nearby particles
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
              const alpha = (1 - dist / 160) * 0.18;
              ctx.strokeStyle = `rgba(60, 90, 210, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw particle nodes
        particles.forEach((p) => {
          ctx.fillStyle = 'rgba(70, 100, 220, 0.3)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(p.size, 1.2), 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Dark mode: trail fill + cyan dots (unchanged)
        ctx.fillStyle = 'rgba(2, 2, 4, 0.1)';
        ctx.fillRect(0, 0, width, height);
        particles.forEach((p) => {
          ctx.fillStyle = 'rgba(0, 242, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();
    return () => window.removeEventListener('resize', init);
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

const Controls = ({ 
  isDark, toggleTheme, isSmoothScroll, toggleScroll 
}: { 
  isDark: boolean; toggleTheme: () => void; isSmoothScroll: boolean; toggleScroll: () => void; 
}) => {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, display: 'flex', gap: '10px' }}>
      <button
        onClick={toggleScroll}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px var(--shadow-color)',
          opacity: isSmoothScroll ? 1 : 0.6,
        }}
        title={isSmoothScroll ? "Disable Smooth Scroll" : "Enable Smooth Scroll"}
      >
        <MousePointer2 size={20} />
      </button>

      <button
        onClick={toggleTheme}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px var(--shadow-color)'
        }}
        title="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isDark, setIsDark] = useState(true);
  // Default smooth scroll off on touch devices — native touch scroll is already smooth
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const [isSmoothScroll, setIsSmoothScroll] = useState(!isTouchDevice);

  // Initialize theme and settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }

      const savedScroll = localStorage.getItem('smoothScroll');
      if (savedScroll !== null) {
        setIsSmoothScroll(savedScroll === 'true');
      } else if (window.matchMedia('(pointer: coarse)').matches) {
        // No saved preference — default off for touch/mobile
        setIsSmoothScroll(false);
      }
    }
  }, []);

  // Update theme classes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Update Lenis instance
  useEffect(() => {
    if (!isSmoothScroll) {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      return;
    }

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
  }, [isSmoothScroll]);

  const toggleTheme = () => setIsDark(!isDark);
  
  const toggleScroll = () => {
    const newVal = !isSmoothScroll;
    setIsSmoothScroll(newVal);
    localStorage.setItem('smoothScroll', newVal.toString());
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundCanvas />
      <Controls 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        isSmoothScroll={isSmoothScroll} 
        toggleScroll={toggleScroll} 
      />

      {/* CSS class handles responsive max-width at each breakpoint */}
      <main className="content-main">
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-color)',
            borderRadius: 'clamp(20px, 5vw, 40px)',
            padding: 'clamp(30px, 6vw, 60px) clamp(20px, 4vw, 60px)',
            boxShadow: '0 clamp(20px, 5vw, 50px) clamp(40px, 10vw, 100px) var(--shadow-color)',
          }}
        >
          <div style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: 'clamp(1px, 0.5vw, 3px)', marginBottom: 'clamp(10px, 3vw, 20px)', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
            <DecodeText text={`ENCRYPTED TRANSMISSION | ${contentData.date}`} speed={3} />
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 4rem)', fontWeight: 800, marginBottom: 'clamp(20px, 5vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--text-heading)' }}>
            <DecodeText text={contentData.title} speed={3} />
          </h1>

          <p className="intro-text" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--text-dim)', marginBottom: 'clamp(30px, 8vw, 60px)', fontWeight: 300, lineHeight: 1.6 }}>
            {contentData.intro}
          </p>

          {/* sections-grid: 1-col on mobile/tablet, 2-col on ≥1100px */}
          <div className="sections-grid">
            {contentData.sections.map((section) => (
              <section key={section.id}>
                <a
                  href={section.sourceUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="section-link"
                >
                  <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 'clamp(5px, 1.5vw, 10px)', marginBottom: 'clamp(15px, 3vw, 24px)' }}>
                    <DecodeText text={`${section.id}. ${section.heading}`} speed={2} />
                  </h2>
                </a>
                <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: 'var(--text-dim)', lineHeight: 1.8 }}>
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <motion.div
            whileHover={{ backgroundColor: 'var(--bg-card-hover)' }}
            style={{ marginTop: 'clamp(40px, 8vw, 80px)', padding: 'clamp(30px, 6vw, 60px)', background: 'var(--bg-card-inner)', borderRadius: 'clamp(15px, 4vw, 30px)', border: '1px solid var(--border-color-strong)', transition: 'background 0.3s' }}
          >
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginTop: 0, color: 'var(--accent)' }}>
              <DecodeText text="System Conclusion" speed={3} />
            </h2>
            <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 0 }}>
              {contentData.conclusion}
            </p>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
}
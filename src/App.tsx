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
            <DecodeText text="INTELLIGENCE REPORT | APRIL 12, 2026" />
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: 40, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
            <DecodeText text="The Vulnpocalypse & The Rise of Embodied Minds" />
          </h1>

          <p style={{ fontSize: '1.4rem', color: 'var(--text-dim)', marginBottom: 50, fontWeight: 300, lineHeight: 1.6 }}>
            The events of April 11, 2026, have etched a permanent mark on the history of computation. We have crossed the threshold from probabilistic assistants to{' '}
            <span style={{ color: '#fff', fontWeight: 500, background: 'linear-gradient(90deg, var(--accent), var(--accent-alt))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              agentic, embodied, and sovereign intelligence
            </span>. 
            From the strategic withholding of "Mythos" to the emergence of neurosymbolic kernels, the race has transformed into a global battle for control, safety, and silicon.
          </p>

          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="01. The Mythos Paradox" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 25 }}>
              Anthropic’s announcement of **Mythos Preview** yesterday sent shockwaves through the cybersecurity community. Capable of autonomously discovering zero-day vulnerabilities across any modern OS, the model was deemed too dangerous for public access. Instead, Anthropic activated **Project Glasswing**, a defensive-only implementation designed to immunize critical infrastructure before the "Vulnpocalypse" can be exploited by less aligned actors.
            </p>
          </section>

          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="02. Embodied Intelligence: GEN-1 & Astra" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 25 }}>
              The digital-physical barrier collapsed yesterday as **Generalist AI** unveiled **GEN-1**. This foundation model achieved a 99% success rate in unstructured physical tasks—from box folding to precision assembly—without task-specific training. Simultaneously, ByteDance’s **Astra** dual-model architecture redefined indoor autonomous navigation, allowing robots to perceive and interact with complex environments with human-like spatial reasoning.
            </p>
          </section>

          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="03. The Neurosymbolic Shift" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 25 }}>
              A major architectural pivot was confirmed yesterday. Analysts have identified a 3,167-line **symbolic pattern-matching kernel** at the heart of the latest Claude Code update. This "Neurosymbolic" approach blends the intuitive power of deep learning with the rigid logic of symbolic AI, virtually eliminating the "probabilistic erraticism" that has plagued LLMs since their inception.
            </p>
          </section>

          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="04. Geopolitics of Silicon & Data" />
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: 30, paddingLeft: 20, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ color: '#fff', display: 'block', fontSize: '1.3rem', marginBottom: 10 }}>Hardware Sovereignty:</strong> Japan's $16 billion injection into **Rapidus** marks a desperate bid to decouple from the global silicon monopoly and secure 2nm production by 2027.
              </li>
              <li style={{ marginBottom: 30, paddingLeft: 20, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ color: '#fff', display: 'block', fontSize: '1.3rem', marginBottom: 10 }}>Regulatory Fracture:</strong> California’s **Executive Order N-5-26** has set the state on a collision course with federal "minimally burdensome" frameworks, forcing global firms to choose between two vastly different legal realities.
              </li>
              <li style={{ paddingLeft: 20, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ color: '#fff', display: 'block', fontSize: '1.3rem', marginBottom: 10 }}>Energy Moratorium:</strong> The **AI Data Center Moratorium Act** proposed yesterday threatens to halt the construction of massive compute hubs, potentially cooling the rapid expansion of US-based training clusters.
              </li>
            </ul>
          </section>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            style={{ marginTop: 80, padding: 60, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 30, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'background 0.3s' }}
          >
            <h2 style={{ fontSize: '2rem', marginTop: 0, color: 'var(--accent)' }}>
              <DecodeText text="Executive Summary" />
            </h2>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 0 }}>
              Yesterday was a warning shot. As AI moves into the physical world (embodied) and gains the ability to dismantle its own digital foundations (Mythos), the need for a unified global governance—currently debated at the UN—has never been more critical. We are no longer just building tools; we are architecting the next era of terrestrial intelligence.
            </p>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
}
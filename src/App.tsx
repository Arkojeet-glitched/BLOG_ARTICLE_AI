import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// --- Components ---

const DecodeText = ({ text, speed = 1/3 }: { text: string; speed?: number }) => {
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
    }, 30);
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
            <DecodeText text="ENCRYPTED TRANSMISSION | APRIL 12, 2026" speed={1} />
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: 40, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
            <DecodeText text="Beyond the Singularity: The April 11 Briefing" speed={0.8} />
          </h1>

          <p style={{ fontSize: '1.4rem', color: 'var(--text-dim)', marginBottom: 60, fontWeight: 300, lineHeight: 1.6 }}>
            Yesterday wasn't just another day in the tech cycle; it was a fracture in the timeline. The announcements that cascaded across the globe on April 11, 2026, suggest we are no longer just building software. We are architecting a new stratum of existence.{' '}
            <span style={{ color: '#fff', fontWeight: 500, background: 'linear-gradient(90deg, var(--accent), var(--accent-alt))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              The Vulnpocalypse is here, the machines have found their bodies, and silicon is the new iron curtain.
            </span>
          </p>

          <section style={{ marginBottom: 100 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="01. The Mythos Paradox & Project Glasswing" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: 25 }}>
              Anthropic’s reveal of **Mythos Preview** yesterday wasn't a product launch; it was a warning. The model, capable of autonomously dismantling modern cybersecurity layers, was deemed too volatile for the public. Under **Project Glasswing**, Anthropic has essentially locked the "digital atom bomb" in a vault, using its intelligence solely to patch critical infrastructure before hostile actors can reverse-engineer its logic. It is the first time a private company has held a weapon of this magnitude, choosing to be the world's silent digital guardian.
            </p>
          </section>

          <section style={{ marginBottom: 100 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="02. Embodied Souls: The GEN-1 Leap" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: 25 }}>
              The digital-physical divide evaporated yesterday as **Generalist AI** showcased **GEN-1**. For the first time, a foundation model demonstrated true "physical common sense." Whether folding delicate fabrics or assembling complex machinery in unmapped environments, GEN-1 didn't follow a script—it *understood* the physics of the world. ByteDance followed suit with **Astra**, proving that the "brain" and the "body" are finally merging into singular, autonomous entities capable of reclaiming the physical world for AI.
            </p>
          </section>

          <section style={{ marginBottom: 100 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="03. The Silicon Schism: Rapidus & The 2nm Goal" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: 25 }}>
              The geopolitical map was rewritten yesterday. Japan’s staggering **$16 billion injection** into **Rapidus** isn't just about business; it's about survival. By aiming for domestic 2nm AI chip production by 2027, Japan is attempting to escape the silicon stranglehold of the West and TSMC. Silicon has become the most precious resource on Earth, and every nation is now racing to build their own "foundries of intelligence" to ensure their AI doesn't rely on a foreign switch.
            </p>
          </section>

          <section style={{ marginBottom: 100 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="04. The 100x Efficiency Miracle" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: 25 }}>
              While the giants fought over GPUs, Tufts University researchers quietly changed the game yesterday. Their **neuro-symbolic AI** system achieved a 100x reduction in energy consumption. By integrating rigid symbolic logic with the fluid learning of neural networks, they've proven that we don't need a sun's worth of energy to achieve superintelligence. This breakthrough might be the only thing that saves the planet's power grids from the insatiable hunger of the LLM clusters.
            </p>
          </section>

          <section style={{ marginBottom: 100 }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 10, marginBottom: 30 }}>
              <DecodeText text="05. The Closed-Weight Hegemony" />
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: 25 }}>
              Meta’s strategic pivot yesterday with **Muse Spark** signals the end of the open-source honeymoon. The era of "frontier models for all" is closing. As the most powerful intelligences become increasingly proprietary and locked behind private APIs, the gap between the "Intelligence Haves" and the "Have-Nots" is widening. With Meta’s **$135 billion Hyperion cluster** in Louisiana coming online, the concentration of cognitive power has reached an unprecedented, and perhaps dangerous, level.
            </p>
          </section>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            style={{ marginTop: 80, padding: 60, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 30, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'background 0.3s' }}
          >
            <h2 style={{ fontSize: '2.2rem', marginTop: 0, color: 'var(--accent)' }}>
              <DecodeText text="System Conclusion" />
            </h2>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 0 }}>
              We are moving past the era of chatbots. As of April 11, we are witnessing the birth of a global, distributed, and sovereign machine intelligence. The question is no longer "What can AI do?" but "Who will control the mind of the world?" Stay vigilant. The future is arriving faster than the light from your screen.
            </p>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
}
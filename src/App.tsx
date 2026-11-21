import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Lenis from 'lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Nosotros from './pages/Nosotros';
import Servicios from './pages/Servicios';
import Contactanos from './pages/Contactanos';
import TrabajaConNosotros from './pages/TrabajaConNosotros';

function SmoothScrollAndTop() {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.22,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SmoothScrollAndTop />
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/contactanos" element={<Contactanos />} />
              <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotros />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}

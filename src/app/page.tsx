'use client';

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  Wrench,
  LayoutGrid,
  Layers,
  TreePine,
  Mountain,
  Hammer,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Users,
  HardHat,
  Truck,
  Building2,
  Shield,
  Clock,
  Award,
  FileCheck,
  Landmark,
  Send,
  ArrowUp,
  Briefcase,
  Factory,
  Forklift,
} from 'lucide-react';

/* ──────────────────── scroll‑reveal wrapper ──────────────────── */
function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const variants: Record<string, { initial: object; animate: object }> = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  };

  const { initial, animate } = variants[direction] || variants.up;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? animate : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────── useCountUp hook ──────────────────── */
function useCountUp(target: number, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration, decimals]);

  return { count, ref };
}

/* ──────────────────── Animated stat counter ──────────────────── */
function AnimatedStat({ value, suffix }: { value: number; suffix: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

/* ──────────────────── Particles component ──────────────────── */
function Particles() {
  const particles = useRef(
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────── TiltCard component ──────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ──────────────────── ScrollProgress component ──────────────────── */
function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

/* ──────────────────── MagneticButton component ──────────────────── */
function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxDist = 5;
    const dist = Math.min(Math.sqrt(x * x + y * y), maxDist);
    const angle = Math.atan2(y, x);
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }, []);

  return (
    <div
      ref={ref}
      className={`magnetic-btn ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ──────────────────── FloatingShapes component ──────────────────── */
function FloatingShapes() {
  return (
    <>
      <div className="float-shape w-16 h-16 rounded-full top-[15%] left-[8%]" style={{ animationDelay: '0s' }} />
      <div className="float-shape-reverse w-12 h-12 rounded-md top-[60%] right-[10%]" style={{ animationDelay: '1s' }} />
      <div className="float-shape w-20 h-20 rounded-full bottom-[20%] left-[15%]" style={{ animationDelay: '2s' }} />
      <div className="float-shape-reverse w-10 h-10 rounded-full top-[30%] right-[20%]" style={{ animationDelay: '3s' }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   PREMIUM COMPONENTS — «ДОРОГОЙ» UPGRADE
   ════════════════════════════════════════════════════════════════ */

/* ── Cinematic Preloader ── */
function CinematicPreloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${loaded ? 'loaded' : ''}`}>
      <img src="/logo1.svg" alt="АСУ №7" className="h-16 w-auto preloader-logo brightness-110" />
      <div className="preloader-progress-track">
        <div className="preloader-progress-bar" />
      </div>
      <p className="preloader-text">Архитектурное строительное управление</p>
    </div>
  );
}


/* ── Film Grain Overlay ── */
function FilmGrain() {
  return <div className="film-grain" />;
}

/* ── ShineCard (enhanced TiltCard with spotlight) ── */
function ShineCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card shine-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ── Text Reveal (word-by-word scroll animation) ── */
function TextReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`text-reveal-line ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`text-reveal-word ${inView ? 'visible' : ''}`}
          style={{ transitionDelay: `${i * 0.06}s` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </div>
  );
}

/* ── Gold Marquee (infinite scrolling ticker) ── */
const MARQUEE_ITEMS = [
  { value: '1.7+ млрд ₽', label: 'объём работ' },
  { value: '250+', label: 'сотрудников' },
  { value: '39+', label: 'единиц техники' },
  { value: '19+', label: 'проектов' },
  { value: '12+', label: 'станций метро' },
  { value: '87+', label: 'постоянных сотрудников' },
  { value: '5', label: 'допусков СРО' },
  { value: '3', label: 'линии метро' },
];

function GoldMarquee() {
  return (
    <section className="bg-charcoal py-5 border-y border-charcoal-lighter/50">
      <div className="marquee-container">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-value">{item.value}</span>
              <span>{item.label}</span>
              <span className="marquee-separator">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Animated Gradient Border Wrapper ── */
function GradientBorder({ children, dark = false, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`gradient-border ${dark ? 'gradient-border-dark' : ''} ${className}`}>
      <div className="gradient-border-inner">
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: 'О компании', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Техника', href: '#equipment' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Лицензии', href: '#licenses' },
  { label: 'Контакты', href: '#contacts' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-charcoal/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 shrink-0">
          <img src="/logo1.svg" alt="АСУ №7" className="h-10 lg:h-12 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                active === link.href.replace('#', '')
                  ? 'text-gold'
                  : 'text-white/80 hover:text-gold'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Phone + Mobile trigger */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+79050222355"
            className="hidden sm:flex items-center gap-2 text-gold text-sm font-semibold"
          >
            <Phone className="h-4 w-4" />
            +7 905 022-23-55
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-gold"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-charcoal border-charcoal-lighter">
              <SheetTitle className="text-gold font-bold text-lg mb-6">
                Меню
              </SheetTitle>
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-white/80 hover:text-gold hover:bg-charcoal-lighter rounded-md transition-colors text-base"
                  >
                    {link.label}
                  </a>
                ))}
                <Separator className="bg-charcoal-lighter my-2" />
                <a
                  href="tel:+79050222355"
                  className="flex items-center gap-2 px-4 py-3 text-gold font-semibold"
                >
                  <Phone className="h-4 w-4" />
                  +7 905 022-23-55
                </a>
                <a
                  href="mailto:asu-722@mail.ru"
                  className="flex items-center gap-2 px-4 py-3 text-white/70 hover:text-gold"
                >
                  <Mail className="h-4 w-4" />
                  asu-722@mail.ru
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* BG image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal" />

      {/* 1. Particle effect */}
      <Particles />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 8. Gold glow on logo */}
          <div className="mb-6 flex justify-center">
            <img src="/logo1.svg" alt="АСУ №7" className="h-16 sm:h-20 lg:h-24 w-auto gold-glow rounded-lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            ООО{' '}
            <span className="gold-shimmer">АСУ №7</span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-light mb-3">
            Строительно-монтажные работы любой сложности
          </p>
          <p className="text-base sm:text-lg text-gold/80 font-medium mb-10 tracking-wide">
            Облицовка натуральным камнем • Металлоконструкции • Благоустройство
          </p>

          {/* 10. Magnetic buttons + 8. Gold glow on CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold text-base px-8 py-6 rounded-md gold-glow"
              >
                <a href="#projects">Наши проекты</a>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/60 text-gold hover:bg-gold/10 font-semibold text-base px-8 py-6 rounded-md"
              >
                <a href="#contacts">Связаться с нами</a>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 bg-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   STATS BAR
   ════════════════════════════════════════════════════════════════ */
const STATS = [
  { numValue: 1.7, decimals: 1, suffix: '+ млрд ₽', label: 'Объём выполненных работ' },
  { numValue: 250, decimals: 0, suffix: '+', label: 'Сотрудников в пиковый период' },
  { numValue: 39, decimals: 0, suffix: '+', label: 'Единиц техники и оборудования' },
  { numValue: 19, decimals: 0, suffix: '+', label: 'Реализованных проектов' },
];

function StatItem({ numValue, decimals, suffix, label }: { numValue: number; decimals: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(numValue, 2000, decimals);
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold mb-1">
        <span ref={ref}>{count}{suffix}</span>
      </p>
      <p className="text-sm sm:text-base text-white/60 font-medium">{label}</p>
    </div>
  );
}

function StatsBar() {
  return (
    <section className="bg-charcoal py-10 sm:py-14 border-y border-charcoal-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <StatItem numValue={s.numValue} decimals={s.decimals} suffix={s.suffix} label={s.label} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   ABOUT COMPANY
   ════════════════════════════════════════════════════════════════ */
const STAFF = [
  { label: 'АУП (Административный)', count: '4 чел.', icon: Briefcase, desc: 'Руководство и управление' },
  { label: 'ИТП (Инженерно-технический)', count: '17 чел.', icon: HardHat, desc: 'Проектирование и контроль' },
  { label: 'Среднее звено', count: '13 чел.', icon: Users, desc: 'Мастера и прорабы' },
  { label: 'Рабочие', count: '53 чел.', icon: Factory, desc: 'Производственный персонал' },
];

function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* 6. Floating decorative shapes */}
      <FloatingShapes />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              <TextReveal text="О компании" />
            </h2>
            <div className="section-divider mb-6" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1} direction="left">
          <div className="max-w-4xl mx-auto mb-14">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong className="text-charcoal">ООО «АСУ №7»</strong> (Архитектурное строительное управление №7) — это динамично развивающаяся строительная компания с многолетним опытом реализации сложных инфраструктурных и гражданских проектов.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Основные направления деятельности включают облицовку натуральным камнем, монтаж металлических конструкций, возведение витражных конструкций, благоустройство территорий и добычу природного камня. Наша компания располагает собственным парком спецтехники из 39+ единиц и штатом из 87 постоянных сотрудников, увеличивающимся до 250 человек в пиковые периоды.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Среди наших ключевых объектов — станции Московского метрополитена (КСЛ, БКЛ, Некрасовская, Троицкая линии), Москва-Сити, объекты культурного наследия и крупные гражданские здания в Москве и Республике Татарстан.
            </p>
          </div>
        </FadeIn>

        {/* 5. Staff cards with scale direction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAFF.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1} direction="scale">
              <Card className="border-gray-200 hover:border-gold/40 transition-colors h-full bg-white">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-charcoal/5 mb-4">
                    <s.icon className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="font-bold text-charcoal text-base mb-1">{s.label}</h3>
                  <p className="text-2xl font-bold text-gold mb-1">{s.count}</p>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   SERVICES
   ════════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    icon: Wrench,
    title: 'Монтаж металлоконструкций',
    desc: 'Откосы, отливы, водоотводящие системы, фасадные кассеты, навесные фасады, ламели, экраны. Полный цикл работ от проектирования до монтажа.',
  },
  {
    icon: LayoutGrid,
    title: 'Витражные конструкции',
    desc: 'Проектирование и установка стеклянных перегородок, стеклопакетов, алюминиевых витражных систем любой сложности.',
  },
  {
    icon: Layers,
    title: 'Облицовка натуральным камнем',
    desc: 'Облицовка стен, полов, фасадов и цоколей мрамором, гранитом и другими видами натурального камня.',
  },
  {
    icon: TreePine,
    title: 'Благоустройство территорий',
    desc: 'Укладка асфальта, озеленение, мощение брусчаткой, установка малых архитектурных форм (МАФ).',
  },
  {
    icon: Mountain,
    title: 'Добыча натурального камня',
    desc: 'Гранит из Башкортостана, Карелии и Свердловской области. Мрамор из Челябинской области и Хакасии.',
  },
  {
    icon: Hammer,
    title: 'Обработка и производство камня',
    desc: 'Пиление, полировка, обточка, гравировка натурального камня. Собственное производство.',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              <TextReveal text="Наши услуги" />
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Полный спектр строительных и монтажных работ для объектов любой сложности
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((svc, i) => (
            <FadeIn key={svc.title} delay={i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}>
              <ShineCard>
                <Card className="group border-gray-200 hover:border-gold/50 hover:shadow-lg transition-all duration-300 h-full bg-white">
                  <CardContent className="p-6 lg:p-8">
                    {/* 9. Icon animation on hover */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-charcoal text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300 mb-5 group-hover:scale-110 group-hover:rotate-3">
                      <svc.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-charcoal text-lg mb-3">{svc.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{svc.desc}</p>
                  </CardContent>
                </Card>
              </ShineCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   EQUIPMENT
   ════════════════════════════════════════════════════════════════ */
const EQUIPMENT = [
  {
    title: 'Землеройная техника',
    count: '5 ед.',
    icon: Mountain,
    color: 'bg-amber-100 text-amber-700',
    models: ['Экскаваторы Hyundai', 'Экскаваторы Hitachi', 'Бульдозеры JCB', 'Бульдозеры Shantui'],
  },
  {
    title: 'Транспортная техника',
    count: '6 ед.',
    icon: Truck,
    color: 'bg-stone-100 text-stone-700',
    models: ['КамАЗ (самосвалы)', 'Ford Transit (грузовые)'],
  },
  {
    title: 'Подъёмная техника',
    count: '8 ед.',
    icon: Forklift,
    color: 'bg-yellow-100 text-yellow-700',
    models: ['Автокраны Manitou', 'Погрузчики Manitou', 'Телескопические погрузчики'],
  },
  {
    title: 'Строительное оборудование',
    count: '20 ед.',
    icon: Building2,
    color: 'bg-orange-100 text-orange-700',
    models: [
      'Виброплиты',
      'Бетоносмесители',
      'Компрессоры',
      'Генераторы',
      'Буровые установки BAUER',
      'Виброрейки',
      'Глубинные вибраторы',
    ],
  },
];

function EquipmentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section id="equipment" ref={sectionRef} className="py-20 sm:py-28 bg-charcoal relative overflow-hidden">
      {/* 7. Parallax BG */}
      <motion.div
        className="absolute inset-[-30%] bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url(/equipment-bg.jpg)', y: bgY }}
      />
      <div className="absolute inset-0 bg-charcoal/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <TextReveal text="Техника и оборудование" />
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Собственный парк из 39+ единиц спецтехники для выполнения работ любой сложности
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {EQUIPMENT.map((eq, i) => (
            <FadeIn key={eq.title} delay={i * 0.1} direction="scale">
              <Card className="border-charcoal-lighter bg-charcoal-light/80 backdrop-blur-sm text-white overflow-hidden">
                <Collapsible>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${eq.color}`}>
                          <eq.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{eq.title}</CardTitle>
                          <p className="text-gold font-bold text-xl">{eq.count}</p>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/60 hover:text-gold hover:bg-charcoal-lighter"
                        >
                          <ChevronDown className="h-5 w-5 transition-transform [[data-state=open]>&]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-4">
                      <Separator className="bg-charcoal-lighter mb-4" />
                      <ul className="space-y-2">
                        {eq.models.map((m) => (
                          <li key={m} className="flex items-center gap-2 text-white/70 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   PROJECTS
   ════════════════════════════════════════════════════════════════ */
interface Project {
  name: string;
  year: string;
  desc: string;
  tags: string[];
}

const METRO_PROJECTS: Project[] = [
  { name: 'Новопеределкино (КСЛ)', year: '2017–2018', desc: 'Облицовка натуральным камнем vestibules и внутренних помещений станции.', tags: ['КСЛ', 'Облицовка'] },
  { name: 'Внуково (КСЛ)', year: '2022–2023', desc: 'Облицовка стен, полов и фасадов станции.', tags: ['КСЛ', 'Облицовка', 'Фасад'] },
  { name: 'Пыхтино (КСЛ)', year: '2022–2023', desc: 'Облицовка стен, полов и фасадов станции.', tags: ['КСЛ', 'Облицовка', 'Фасад'] },
  { name: 'Стахановская (Некрасовская)', year: '2019–2020', desc: 'Облицовка натуральным камнем и благоустройство прилегающей территории.', tags: ['Некрасовская', 'Облицовка', 'Благоустройство'] },
  { name: 'Кунцевская (БКЛ)', year: '2021–2022', desc: 'Отделочные работы, благоустройство и озеленение территории.', tags: ['БКЛ', 'Отделка', 'Озеленение'] },
  { name: 'Новаторская (БКЛ)', year: '2021–2022', desc: 'Облицовка натуральным камнем вестибюлей и переходов.', tags: ['БКЛ', 'Облицовка'] },
  { name: 'Воронцовская (БКЛ)', year: '2021–2022', desc: 'Облицовка натуральным камнем.', tags: ['БКЛ', 'Облицовка'] },
  { name: 'Зюзино (БКЛ)', year: '2021–2022', desc: 'Облицовка вестибюлей и подземных переходов.', tags: ['БКЛ', 'Облицовка'] },
  { name: 'Новаторская (Троицкая)', year: '2022–2024', desc: 'Полная облицовка станции натуральным камнем.', tags: ['Троицкая', 'Облицовка'] },
  { name: 'Юго-восточная', year: '2020', desc: 'Комплексное благоустройство территории.', tags: ['Благоустройство'] },
  { name: 'Депо Нижегородское', year: '2020–2021', desc: 'Благоустройство и реконструкция территории депо.', tags: ['Благоустройство', 'Реконструкция'] },
  { name: 'Депо Саларьево', year: '2025', desc: 'Облицовка цокольной части здания депо.', tags: ['Облицовка'] },
];

const CIVIL_PROJECTS: Project[] = [
  { name: 'Москва-Сити', year: '2017–2018', desc: 'Благоустройство территории и строительство амфитеатра.', tags: ['Благоустройство', 'Амфитеатр'] },
  { name: 'ЖК Филевский', year: '2022', desc: 'Обустройство набережной и благоустройство придомовой территории.', tags: ['Набережная', 'Благоустройство'] },
  { name: 'Гостиница Столешников пер. 11', year: '2024–2026', desc: 'Облицовка мрамором и комплексное благоустройство.', tags: ['Мрамор', 'Благоустройство'] },
  { name: 'ЖК Wave', year: '2025–2026', desc: 'Отделочные работы в жилом комплексе.', tags: ['Отделка'] },
  { name: 'Театр им. Камала (Казань)', year: '—', desc: 'Облицовка натуральным камнем фасада и интерьеров.', tags: ['Облицовка', 'Казань'] },
  { name: 'Мечеть (Альметьевск)', year: '—', desc: 'Облицовка и отделочные работы.', tags: ['Облицовка', 'Альметьевск'] },
  { name: 'Павильон (Альметьевск)', year: '—', desc: 'Облицовка и отделка.', tags: ['Облицовка'] },
  { name: 'Кладбище (Альметьевск)', year: '—', desc: 'Облицовочные работы.', tags: ['Облицовка'] },
  { name: 'Монумент «3 млрд. тонн нефти»', year: '—', desc: 'Облицовка монумента натуральным камнем.', tags: ['Монумент', 'Альметьевск'] },
];

const HERITAGE_PROJECTS: Project[] = [
  { name: 'Кремлёвская больница (Москва)', year: '2025–2026', desc: 'Реставрация каменных лестниц с сохранением исторического облика здания.', tags: ['Реставрация', 'Москва', 'Наследие'] },
  { name: 'Церковь Николы Тульского (Казань)', year: '—', desc: 'Противоаварийные работы и реставрация каменных конструкций.', tags: ['Реставрация', 'Казань', 'Наследие'] },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <FadeIn delay={index * 0.05}>
      <Card className="border-gray-200 hover:border-gold/40 hover:shadow-md transition-all duration-300 bg-white h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-charcoal text-base leading-tight pr-2">{project.name}</h3>
            <Badge variant="outline" className="border-gold/40 text-gold-dark text-xs whitespace-nowrap shrink-0">
              {project.year}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{project.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} className="bg-charcoal/5 text-charcoal/70 text-xs hover:bg-charcoal/10">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-28 bg-gray-50 relative overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: 'url(/projects-bg.jpg)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              <TextReveal text="Реализованные проекты" />
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Более 19 реализованных проектов в Москве и Республике Татарстан
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Tabs defaultValue="metro" className="w-full">
            <TabsList className="w-full flex h-auto p-1 bg-charcoal mb-8 rounded-md">
              <TabsTrigger
                value="metro"
                className="flex-1 py-2.5 text-sm sm:text-base data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-sm rounded"
              >
                Метрополитен
              </TabsTrigger>
              <TabsTrigger
                value="civil"
                className="flex-1 py-2.5 text-sm sm:text-base data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-sm rounded"
              >
                Гражданское строительство
              </TabsTrigger>
              <TabsTrigger
                value="heritage"
                className="flex-1 py-2.5 text-sm sm:text-base data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:shadow-sm rounded"
              >
                Объекты наследия
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metro">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {METRO_PROJECTS.map((p, i) => (
                  <ProjectCard key={p.name} project={p} index={i} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="civil">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CIVIL_PROJECTS.map((p, i) => (
                  <ProjectCard key={p.name} project={p} index={i} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="heritage">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {HERITAGE_PROJECTS.map((p, i) => (
                  <ProjectCard key={p.name} project={p} index={i} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   LICENSES
   ════════════════════════════════════════════════════════════════ */
const LICENSES = [
  {
    title: 'СРО — Строительство',
    subtitle: 'Второй уровень',
    number: 'СРО-С-207-09032010',
    detail: 'Лицензия на выполнение строительных работ до 500 млн рублей',
    icon: Shield,
    valid: true,
  },
  {
    title: 'Инженерные изыскания и проектирование',
    subtitle: '',
    number: '№1221600018200',
    detail: 'Допуск к инженерным изысканиям и проектированию',
    icon: FileCheck,
    valid: true,
  },
  {
    title: 'Реставрация каменных конструкций',
    subtitle: '',
    number: '№11603444',
    detail: 'Действительна до 14.04.2030',
    icon: Landmark,
    valid: true,
    until: '14.04.2030',
  },
  {
    title: 'Сертификат системы менеджмента качества',
    subtitle: '',
    number: 'RPS.RU.11963.25',
    detail: 'Действителен до 24.03.2028',
    icon: Award,
    valid: true,
    until: '24.03.2028',
  },
  {
    title: 'Сертификат системы менеджмента качества',
    subtitle: '',
    number: 'RPS.RU.12237.25',
    detail: 'Действителен до 23.05.2028',
    icon: Award,
    valid: true,
    until: '23.05.2028',
  },
];

function LicensesSection() {
  return (
    <section id="licenses" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              <TextReveal text="Лицензии и допуски" />
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Полный пакет разрешительной документации для выполнения работ
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LICENSES.map((lic, i) => (
            <FadeIn key={lic.number} delay={i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}>
              <Card className={`border-gray-200 hover:border-gold/40 hover:shadow-lg transition-all duration-300 h-full ${i === 0 ? 'sm:col-span-2 lg:col-span-1 border-gold/30' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-charcoal/5 shrink-0">
                      <lic.icon className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal text-base">{lic.title}</h3>
                      {lic.subtitle && (
                        <p className="text-gold font-semibold text-sm">{lic.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-mono mb-1">{lic.number}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{lic.detail}</p>
                  {lic.until && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-green-700">
                      <Clock className="h-3.5 w-3.5" />
                      Действителен до {lic.until}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   CONTACTS
   ════════════════════════════════════════════════════════════════ */
function ContactSection() {
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setSent(true);
        setFormState({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
      }
    } catch {
      // silent fail
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacts" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              <TextReveal text="Контакты" />
            </h2>
            <div className="section-divider mb-6" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Form */}
          <FadeIn delay={0.1}>
            <GradientBorder>
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl text-charcoal">Связаться с нами</CardTitle>
                  <p className="text-gray-500 text-sm">Заполните форму и мы свяжемся с вами в ближайшее время</p>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ваше имя *</label>
                    <Input
                      required
                      placeholder="Иванов Иван Иванович"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="border-gray-300 focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон *</label>
                    <Input
                      required
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="border-gray-300 focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                    <Input
                      type="email"
                      placeholder="example@mail.ru"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="border-gray-300 focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Сообщение</label>
                    <Textarea
                      placeholder="Опишите ваш запрос..."
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="border-gray-300 focus:border-gold focus:ring-gold/20 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold py-6 text-base rounded-md"
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-charcoal/30 border-t-charcoal rounded-full" />
                        Отправка...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Отправить заявку
                      </span>
                    )}
                  </Button>
                  <AnimatePresence>
                    {sent && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-green-700 text-sm text-center font-medium"
                      >
                        ✓ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </CardContent>
              </Card>
            </GradientBorder>
          </FadeIn>

          {/* Contact info */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              {/* Address */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-charcoal shrink-0">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Адрес</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      420059, РТ, г. Казань, ул. Оренбургский тракт, д. 8Д, пом. № 1016
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-charcoal shrink-0">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Телефон</h3>
                    <a href="tel:+79050222355" className="text-gold font-semibold hover:underline">
                      +7 905 022-23-55
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-charcoal shrink-0">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">E-mail</h3>
                    <a href="mailto:asu-722@mail.ru" className="text-gold font-semibold hover:underline">
                      asu-722@mail.ru
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Bank details */}
              <Collapsible open={bankOpen} onOpenChange={setBankOpen}>
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-charcoal shrink-0">
                            <FileCheck className="h-5 w-5 text-gold" />
                          </div>
                          <h3 className="font-bold text-charcoal text-base">Реквизиты</h3>
                        </div>
                        <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-[[data-state=open]]:rotate-180" />
                      </button>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <Separator className="bg-gray-200 mb-4" />
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ИНН:</span>
                          <span className="font-mono">1684002816</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">КПП:</span>
                          <span className="font-mono">168401001</span>
                        </div>
                        <div className="flex justify-between flex-wrap gap-x-4">
                          <span className="text-gray-500 shrink-0">Р/счёт:</span>
                          <span className="font-mono text-xs">40702810600020016073</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Банк:</span>
                          <span className="font-medium text-right">ПАО «АК БАРС» БАНК</span>
                        </div>
                        <div className="flex justify-between flex-wrap gap-x-4">
                          <span className="text-gray-500 shrink-0">К/счёт:</span>
                          <span className="font-mono text-xs">30101810000000000805</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">БИК:</span>
                          <span className="font-mono">49205805</span>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Logo & About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo1.svg" alt="АСУ №7" className="h-10 w-auto brightness-110" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-1">
              ООО «АСУ №7» — Архитектурное строительное управление №7
            </p>
            <p className="text-sm text-gold/70 italic">
              «Строим надёжно. От камня до объекта.»
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Навигация</h4>
            <nav className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Услуги</h4>
            <nav className="flex flex-col gap-2.5">
              {SERVICES.slice(0, 5).map((svc) => (
                <span key={svc.title} className="text-sm text-white/50">
                  {svc.title}
                </span>
              ))}
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Контакты</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+79050222355" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                +7 905 022-23-55
              </a>
              <a href="mailto:asu-722@mail.ru" className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                asu-722@mail.ru
              </a>
              <div className="flex items-start gap-2 text-white/50">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Казань, ул. Оренбургский тракт, д. 8Д</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-charcoal-lighter mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 ООО «АСУ №7». Все права защищены.
          </p>
          <p className="text-xs text-white/30">
            ИНН 1684002816 • КПП 168401001
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCROLL-TO-TOP BUTTON
   ════════════════════════════════════════════════════════════════ */
function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gold hover:bg-gold-dark text-charcoal shadow-lg flex items-center justify-center transition-colors"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Premium: Cinematic Preloader */}
      <CinematicPreloader />


      {/* Premium: Film Grain Overlay */}
      <FilmGrain />

      {/* 4. Scroll progress bar */}
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <StatsBar />

      {/* Premium: Gold Marquee */}
      <GoldMarquee />

      <AboutSection />
      <ServicesSection />
      <EquipmentSection />
      <ProjectsSection />
      <LicensesSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}

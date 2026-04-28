/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Target, 
  Users, 
  Instagram, 
  Facebook, 
  Twitter, 
  Menu, 
  X, 
  ArrowRight, 
  Quote as QuoteIcon,
  ChevronsRight
} from 'lucide-react';

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="custom-cursor" 
      style={{ left: `${position.x}px`, top: `${position.y}px` }} 
    />
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'PROGRAMS', href: '#programs' },
    { name: 'TRAINERS', href: '#trainers' },
    { name: 'GALLERY', href: '#gallery' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 md:px-12 border-b border-gym-red/20 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl py-3' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#home" className="text-3xl font-bebas text-gym-red tracking-tighter glowing-text">
          STREET <span className="text-white">FITNESS</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-semibold tracking-widest text-gym-white hover:text-gym-red transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gym-red transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a 
            href="#join" 
            className="px-6 py-2 bg-gym-red text-white text-sm font-bold tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(255,31,31,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            JOIN NOW
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-gym-black border-b border-white/10 flex flex-col items-center gap-6 py-10 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-bebas tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#join" 
              onClick={() => setIsMenuOpen(false)}
              className="px-10 py-3 bg-gym-red text-white text-xl font-bebas tracking-widest rounded-full"
            >
              JOIN NOW
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatCounter = ({ value, label }: { value: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/\D/g, ''));
      if (start === end) return;
      
      const duration = 2000;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center flex-1 py-10 border-r border-gym-red last:border-0 flex flex-col justify-center items-center">
      <div className="text-5xl md:text-6xl font-bebas text-white mb-1">
        {count}{value.includes('+') ? '+' : ''}
      </div>
      <div className="text-xs md:text-sm font-semibold tracking-widest text-gym-red uppercase opacity-80">
        {label}
      </div>
    </div>
  );
};

const ProgramCard = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
  <motion.div 
    whileHover={{ y: -15 }}
    className="glass-card p-8 group relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-1 h-0 bg-gym-red group-hover:h-full transition-all duration-500" />
    <div className="mb-6 inline-block p-4 bg-gym-red/10 rounded-lg group-hover:bg-gym-red transition-colors duration-500">
      <Icon size={32} className="text-gym-red group-hover:text-white transition-colors duration-500" />
    </div>
    <h3 className="text-3xl mb-4 text-white group-hover:text-gym-red transition-colors">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
      {desc}
    </p>
    <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-gym-red group-hover:gap-4 transition-all">
      LEARN MORE <ChevronsRight size={14} />
    </button>
    <div className="absolute -bottom-10 -right-10 opacity-5 transition-all group-hover:opacity-20 group-hover:-bottom-5 group-hover:-right-5">
      <Icon size={120} />
    </div>
  </motion.div>
);

const TrainerCard = ({ image, name, role }: { image: string, name: string, role: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (y - 0.5) * 20;
    const rotateY = (x - 0.5) * -20;
    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{ 
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
    >
      <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
        <h4 className="text-3xl font-bebas text-white mb-1 group-hover:text-gym-red transition-colors">{name}</h4>
        <div className="w-12 h-1 bg-gym-red mb-3" />
        <p className="text-xs tracking-[0.2em] font-semibold text-gray-300 uppercase">{role}</p>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gym-red/30 transition-all pointer-events-none m-4" />
    </motion.div>
  );
};

const QuoteCard = ({ text, author }: { text: string; author: string }) => (
  <div className="glass-card p-10 relative">
    <QuoteIcon className="text-gym-red absolute -top-4 left-6" size={40} fill="currentColor" />
    <p className="text-xl md:text-2xl italic leading-relaxed text-gym-white mb-8 relative z-10 font-normal">
      "{text}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-[2px] bg-gym-red" />
      <span className="text-sm font-bold tracking-widest text-gym-gold uppercase">{author}</span>
    </div>
  </div>
);

const GalleryImage = ({ src }: { src: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="relative aspect-square md:aspect-auto md:h-[400px] overflow-hidden group"
  >
    <img src={src} alt="Gym Gallery" className="w-full h-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gym-red/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center translate-y-full group-hover:translate-y-0">
      <span className="text-4xl font-bebas tracking-widest text-white">VIEW</span>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const marqueeText = "THE IRON NEVER LIES • NO PAIN NO GAIN • PAIN IS TEMPORARY GLORY IS FOREVER • TRAIN INSANE OR REMAIN THE SAME • SWEAT IS JUST FAT CRYING • ";

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <CustomCursor />
      <Navbar />

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600" 
            alt="Hero BG" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-gym-black/20 to-gym-black/80" />
          <div className="absolute inset-0 bg-gym-red/10 mix-blend-overlay" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6"
        >
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-gym-red text-white text-xs font-bold tracking-[0.4em] uppercase mb-8">
              ESTD 2021 | STREET FITNESS
            </span>
          </div>

          <motion.h1 
            initial="hidden"
            animate="visible"
            className="text-7xl md:text-[10rem] font-bebas leading-[0.8] mb-8 hero-title-shadow"
          >
            {["FORGE", "YOUR", "LIMITS"].map((word, i) => (
              <motion.span 
                key={i}
                variants={{
                  hidden: { y: 200, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { delay: i * 0.2, duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                }}
                className="inline-block mr-4 md:mr-8 text-reveal last:text-gym-red last:glowing-text"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-2xl font-light tracking-widest text-gym-gold max-w-2xl mx-auto mb-12 uppercase"
          >
            Street Fitness Gym — Where Legends Are Built. Join the tribe of relentless strength.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <a href="#join" className="group relative px-12 py-5 bg-gym-red text-white text-lg font-bebas tracking-widest overflow-hidden">
              <span className="relative z-10">START TRAINING</span>
              <motion.div 
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white/20 -translate-x-full" 
              />
            </a>
            <a href="#programs" className="px-12 py-5 border-2 border-white text-white text-lg font-bebas tracking-widest hover:bg-white hover:text-black transition-all">
              EXPLORE PROGRAMS
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.4em] font-bold text-gray-500 uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gym-red to-transparent" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-black/90 border-t-2 border-gym-red relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row">
          <StatCounter value="500+" label="Members" />
          <StatCounter value="10+" label="Expert Trainers" />
          <StatCounter value="15+" label="Programs" />
          <StatCounter value="5" label="Years Strong" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="diagonal-border">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200" 
                alt="About Gym" 
                className="w-full relative z-10 grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
            <div className="absolute -bottom-10 -right-10 text-9xl font-bebas text-gym-red/10 select-none">
              RAW POWER
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-gym-red text-xl tracking-[0.3em] font-semibold mb-6">OUR MISSION</h2>
            <h3 className="text-5xl md:text-7xl font-bebas leading-[0.9] mb-8 text-white">
              SOMETIMES <span className="text-gym-red">AGAINST</span> ALL ODDS.
            </h3>
            <p className="text-lg text-gray-400 font-light leading-loose mb-10">
              Born in the gritty backstreets, Street Fitness Gym isn't just about weightlifting—it's about the iron will. We provide an industrial sanctuary where the noise of the world is drowned out by the clang of steel. No excuses, no shortcuts, just raw results.
            </p>
            <div className="space-y-4">
              {['24/7 Access for Elite Members', 'Professional Fighting Ring', 'Underground Atmosphere', 'Community of Legends'].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 bg-gym-red group-hover:scale-150 transition-transform" />
                  <span className="text-sm tracking-widest text-white uppercase font-bold">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-32 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-gym-red text-xl tracking-[0.3em] font-semibold mb-6">DOMINATE</h2>
              <h3 className="text-5xl md:text-7xl font-bebas leading-[0.9]">ELITE TRAINING <span className="text-white/20">SYSTEMS</span></h3>
            </div>
            <p className="text-gray-500 max-w-sm text-sm tracking-wide uppercase font-light">
              Tailored high-performance programs designed to break your limits and reconstruct your physique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProgramCard 
              title="STRENGTH" 
              desc="Master the fundamentals of powerlifting and bodybuilding with heavy compound lifts." 
              icon={Dumbbell} 
            />
            <ProgramCard 
              title="HIIT" 
              desc="High-intensity intervals designed to torch fat and skyrocket cardiovascular endurance." 
              icon={Flame} 
            />
            <ProgramCard 
              title="BOXING" 
              desc="Professional combat training from footwork to heavy bags. Unleash the fighter within." 
              icon={Target} 
            />
            <ProgramCard 
              title="CALISTHENICS" 
              desc="Master your own bodyweight with progressive bar training and explosive movements." 
              icon={Users} 
            />
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-gym-red h-20 md:h-24 flex items-center overflow-hidden border-y-2 border-black z-30">
        <div className="marquee-content py-4">
          {[1, 2, 3].map((n) => (
            <span key={n} className="text-3xl md:text-5xl font-bebas text-black tracking-widest px-10">
              {marqueeText}
            </span>
          ))}
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-gym-red text-xl tracking-[0.3em] font-semibold mb-4">THE ELITE</h2>
            <h3 className="text-6xl md:text-8xl font-bebas mb-6">MASTER <span className="text-gym-red">COACHES</span></h3>
            <div className="w-24 h-1 bg-gym-red mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <TrainerCard name="Marcus 'Titan' Stone" role="Powerlifting Specialist" image="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600" />
            <TrainerCard name="Elena 'Shadow' V." role="Combat & MMA Coach" image="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600" />
            <TrainerCard name="Viktor 'Chrome' Kay" role="HIIT & Calisthenics" image="https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-gym-black py-20">
        <div className="grid grid-cols-2 md:grid-cols-3">
          <GalleryImage src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" />
          <GalleryImage src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" />
          <GalleryImage src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800" />
          <GalleryImage src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800" />
          <GalleryImage src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800" />
          <GalleryImage src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" />
        </div>
      </section>

      {/* Legendary Quotes Section */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-gym-red text-xl tracking-[0.3em] font-semibold mb-4">WORDS OF IRON</h2>
            <h3 className="text-6xl md:text-8xl font-bebas">MENTAL <span className="text-gym-red">FORTITUDE</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <QuoteCard 
              text="The Iron never lies to you. You can walk out and be anything you want... but the iron stays." 
              author="Henry Rollins" 
            />
            <QuoteCard 
              text="Your body can stand almost anything. It's your mind you have to convince. Shut up and train." 
              author="Legendary Creed" 
            />
            <QuoteCard 
              text="When you feel like quitting, remember why you started. Sweat is just fat crying in the dark." 
              author="Street Motto" 
            />
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="join" className="relative py-40 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200" 
            alt="Join Now" 
            className="w-full h-full object-cover grayscale opacity-40 translate-y-10" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-transparent to-gym-black" />
          <div className="absolute inset-0 bg-gym-red/20 opacity-50" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h2 className="text-7xl md:text-[10rem] font-bebas leading-none mb-10 text-white glowing-text">
            READY TO <span className="text-gym-red">BEGIN?</span>
          </h2>
          <p className="text-xl md:text-2xl font-light tracking-widest text-gray-300 mb-12 uppercase">
            No contracts. No excuses. Just hard work and legacy.
          </p>
          <button className="group relative px-20 py-8 bg-gym-red text-white text-3xl font-bebas tracking-widest overflow-hidden shadow-[0_0_50px_rgba(255,31,31,0.4)] hover:shadow-[0_0_80px_rgba(255,31,31,0.7)] transition-all">
            <span className="relative z-10">CLAIM YOUR SPOT</span>
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gym-black pt-20 pb-10 px-6 border-t border-gym-red/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
          <div className="max-w-sm">
            <h4 className="text-4xl font-bebas text-gym-red mb-6">STREET FITNESS</h4>
            <p className="text-gray-500 font-light leading-relaxed mb-8 uppercase text-xs tracking-widest">
              Industrial sanctuary for the iron-willed. We provide the steel, you provide the grind. Established in the grit, building legends every day.
            </p>
            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gym-red hover:border-gym-red transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gym-red hover:border-gym-red transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gym-red hover:border-gym-red transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-32">
            <div>
              <h5 className="text-gym-gold tracking-widest mb-6 font-bold text-sm">QUICK LINKS</h5>
              <ul className="space-y-4 text-xs tracking-[0.2em] font-semibold text-gray-400">
                <li><a href="#home" className="hover:text-gym-red transition-colors">HOME</a></li>
                <li><a href="#programs" className="hover:text-gym-red transition-colors">PROGRAMS</a></li>
                <li><a href="#trainers" className="hover:text-gym-red transition-colors">TRAINERS</a></li>
                <li><a href="#gallery" className="hover:text-gym-red transition-colors">GALLERY</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-gym-gold tracking-widest mb-6 font-bold text-sm">LOCATIONS</h5>
              <ul className="space-y-4 text-xs tracking-[0.2em] font-semibold text-gray-400">
                <li className="hover:text-white transition-colors">BROOKLYN DEPOT</li>
                <li className="hover:text-white transition-colors">DOWNTOWN INDUSTRIAL</li>
                <li className="hover:text-white transition-colors">BRONX STEELHOUSE</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.3em] text-gray-600 font-bold uppercase">
            © {new Date().getFullYear()} STREET FITNESS GYM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] tracking-[0.3em] text-gray-600 font-bold uppercase">
            <a href="#" className="hover:text-white">PRIVACY</a>
            <a href="#" className="hover:text-white">TERMS</a>
            <a href="#" className="hover:text-white">MEMBERSHIP</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

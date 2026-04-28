import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Linkedin, 
  Github, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Code, 
  Mic2, 
  BookOpen,
  MapPin,
  ChevronRight,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { cvData } from './data';
import citationsData from './citations.json';

const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id: string }) => (
  <section id={id} className="py-24 border-b border-slate-100 last:border-0 relative">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="section-title"
    >
      {title}
    </motion.h2>
    {children}
  </section>
);

const HighlightText = ({ text, keywords }: { text: string; keywords: string[] }) => {
  if (!keywords.length) return <>{text}</>;
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        keywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const HighlightAuthor = ({ authors }: { authors: string }) => {
  const target = "M. Ibrahim";
  const parts = authors.split(new RegExp(`(${target})`, 'g'));
  return (
    <>
      {parts.map((part, i) => 
        part === target ? (
          <span key={i} className="font-bold text-slate-900 underline decoration-emerald-400 underline-offset-4 decoration-2">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const Lightbox = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors"
      >
        <X size={28} />
      </button>
      <motion.img
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[95vw] object-contain rounded-2xl shadow-2xl cursor-default"
      />
    </motion.div>
  );
};

const NavItem = ({ label, href, active, onClick }: { label: string; href: string; active: boolean; onClick: () => void }) => (
  <a 
    href={href}
    onClick={onClick}
    className={`text-sm font-medium transition-colors hover:text-zinc-900 ${active ? 'text-zinc-900' : 'text-zinc-400'}`}
  >
    {label}
  </a>
);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const publicationsWithCitations = useMemo(
    () =>
      cvData.publications.map((pub) => ({
        ...pub,
        citations: (pub as { doi?: string }).doi
          ? (citationsData as Record<string, number>)[(pub as { doi?: string }).doi!]
          : (citationsData as Record<string, number>)[pub.title],
      })),
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'publications', 'education', 'experience', 'blogs-demos', 'events'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-grid relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="blob w-[500px] h-[500px] bg-emerald-200 -top-24 -left-24" />
      <div className="blob w-[600px] h-[600px] bg-blue-100 top-1/2 -right-48" />
      <div className="blob w-[400px] h-[400px] bg-purple-100 -bottom-24 left-1/4" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#home" className="font-serif text-xl font-bold tracking-tight text-slate-900">Mahmoud Ibrahim</a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItem label="Publications" href="#publications" active={activeSection === 'publications'} onClick={() => {}} />
            <NavItem label="Education" href="#education" active={activeSection === 'education'} onClick={() => {}} />
            <NavItem label="Experience" href="#experience" active={activeSection === 'experience'} onClick={() => {}} />
            <NavItem label="Blogs & Demos" href="#blogs-demos" active={activeSection === 'blogs-demos'} onClick={() => {}} />
            <NavItem label="Events" href="#events" active={activeSection === 'events'} onClick={() => {}} />
          </div>

          <button 
            className="md:hidden p-2 text-zinc-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6 text-2xl font-serif italic">
              <a href="#publications" onClick={() => setIsMenuOpen(false)}>Publications</a>
              <a href="#education" onClick={() => setIsMenuOpen(false)}>Education</a>
              <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
              <a href="#blogs-demos" onClick={() => setIsMenuOpen(false)}>Blogs & Demos</a>
              <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <section id="home" className="min-h-[80vh] flex flex-col justify-center mb-20 relative">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-7xl md:text-9xl font-serif mb-8 tracking-tighter text-slate-900">
                {cvData.name}
              </h1>
              <div className="text-2xl md:text-3xl text-slate-500 max-w-2xl font-light leading-relaxed mb-10">
                I'm a <span className="text-slate-900 font-semibold">PhD Student</span> at{' '}
                <span className="text-slate-900 font-semibold">Maastricht University</span> &{' '}
                <span className="text-slate-900 font-semibold">VITO</span>, working on{' '}
                <span className="text-slate-900 font-semibold">Trustworthy Medical AI</span> —
                generative models, synthetic data, and fairness for healthcare.
              </div>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <a href={`mailto:${cvData.email}`} className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-900/10">
                  <Mail size={18} /> Contact
                </a>
                <a href={cvData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 shadow-sm">
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a href={cvData.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 shadow-sm">
                  <Github size={18} /> GitHub
                </a>
                <a href={cvData.scholar} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 shadow-sm">
                  <GraduationCap size={18} /> Google Scholar
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl shadow-emerald-900/20 group"
            >
              <img 
                src={cvData.image} 
                alt={cvData.name} 
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid md:grid-cols-2 gap-16 items-start mt-24"
          >
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-black text-emerald-600">About</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                {cvData.about}
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-black text-emerald-600">Research Focus</h3>
              <div className="flex flex-wrap gap-3">
                {["Fairness", "Synthetic Data", "Generative AI", "Trustworthy AI", "Medical Imaging"].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white border border-slate-100 text-slate-600 text-xs font-bold rounded-xl shadow-sm hover:border-emerald-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* News */}
        <Section title="News" id="news">
          <div className="relative">
            <div className="max-h-[28rem] overflow-y-auto pr-3 space-y-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {cvData.news.map((item, index) => {
                const typeStyles: Record<string, string> = {
                  Award: 'bg-amber-50 text-amber-700 border-amber-200',
                  Talk: 'bg-blue-50 text-blue-700 border-blue-200',
                  Paper: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  Preprint: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  Conference: 'bg-purple-50 text-purple-700 border-purple-200',
                };
                const typeClass = typeStyles[item.type] ?? 'bg-slate-50 text-slate-600 border-slate-200';
                const Inner = (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                    <span className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-full whitespace-nowrap shrink-0 mt-0.5">
                      {item.date}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border mt-0.5 ${typeClass}`}>
                      {item.type}
                    </span>
                    <p className="text-slate-700 font-light text-sm leading-relaxed flex-1">
                      {item.text}
                    </p>
                  </div>
                );
                return item.link ? (
                  <a key={index} href={item.link} className="block group">{Inner}</a>
                ) : (
                  <div key={index}>{Inner}</div>
                );
              })}
            </div>
            {/* Bottom fade-out hint that more is below */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-3 h-8 bg-gradient-to-t from-white to-transparent rounded-b-2xl" />
          </div>
        </Section>

        {/* Publications */}
        <Section title="Publications" id="publications">
          <a
            href={cvData.scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-8 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-slate-900 transition-colors"
          >
            View all on Google Scholar <ExternalLink size={14} />
          </a>
          <div className="space-y-8">
            {publicationsWithCitations.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-academic group"
              >
                <div className="flex justify-between items-start gap-6 mb-6">
                  <h3 className="text-2xl font-bold leading-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {pub.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {typeof pub.citations === 'number' && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full" title="Google Scholar citations">
                        Cited by {pub.citations}
                      </span>
                    )}
                    <div className="text-slate-400 font-mono text-sm bg-slate-50 px-3 py-1 rounded-full">{pub.year}</div>
                  </div>
                </div>
                <p className="text-slate-500 text-lg mb-6 font-light">
                  <HighlightAuthor authors={pub.authors} />
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                  <span className="text-sm font-mono text-emerald-600 italic font-medium">{pub.journal}</span>
                  <div className="flex items-center gap-6">
                    {(pub as { site?: string }).site && (
                      <a
                        href={(pub as { site?: string }).site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900 hover:text-emerald-600 transition-colors"
                      >
                        Project Page <ExternalLink size={14} />
                      </a>
                    )}
                    <a
                      href={pub.doi ? `https://doi.org/${pub.doi}` : pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      Access Publication <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" id="education">
          <div className="space-y-12">
            {cvData.education.map((edu, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-[240px_1fr] gap-8 items-start"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-slate-400 text-sm font-mono bg-slate-50 px-4 py-2 rounded-lg inline-block w-fit">{edu.period}</div>
                  {edu.logo && (
                    <img 
                      src={edu.logo} 
                      alt={`${edu.institution} logo`}
                      className="w-48 h-48 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="card-academic">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">{edu.degree}</h3>
                  <div className="text-emerald-600 mb-6 flex items-center gap-2 font-medium">
                    <MapPin size={16} /> {edu.institution}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg font-light">
                    <HighlightText text={edu.description} keywords={["Distinction", "Magna Cum Laude"]} />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience" id="experience">
          <div className="space-y-16">
            {cvData.experience.map((exp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-[240px_1fr] gap-8 items-start"
              >
                <div className="text-slate-400 text-sm font-mono bg-slate-50 px-4 py-2 rounded-lg inline-block w-fit">{exp.period}</div>
                <div className="card-academic">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">{exp.role}</h3>
                  <div className="text-emerald-600 mb-8 flex items-center gap-2 font-medium">
                    <Briefcase size={16} /> {exp.company}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className="flex gap-4 text-slate-600 leading-relaxed text-lg font-light">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-3" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map(skill => (
                      <span key={skill} className="badge-tech">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Blogs & Demos */}
        <Section title="Blogs & Demos" id="blogs-demos">
          <div className="grid md:grid-cols-2 gap-8">
            {cvData.blogsDemos.map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] bg-slate-900 text-white flex flex-col justify-between min-h-[320px] shadow-2xl shadow-slate-900/20 group hover:bg-emerald-950 transition-all duration-500"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:bg-emerald-500/20 transition-colors">
                    <Code className="text-emerald-400" size={24} />
                  </div>
                  <h3 className="text-3xl font-serif italic mb-4">{project.name}</h3>
                  <p className="text-slate-400 text-lg font-light leading-relaxed">{project.description}</p>
                </div>
                <a
                  href={project.link}
                  target={project.link?.startsWith('http') ? '_blank' : undefined}
                  rel={project.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-colors"
                >
                  {(project as { cta?: string }).cta ?? 'Source Code'} <ChevronRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Events & Activities */}
        <Section title="Events & Activities" id="events">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-black text-emerald-600 mb-8">Talks & Keynotes</h3>
              <div className="space-y-8">
                {cvData.talks.map((talk, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 group"
                  >
                    <div className="flex gap-6 items-start">
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:border-emerald-200 transition-colors">
                        <Mic2 size={24} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{talk.title}</h4>
                        <p className="text-slate-500 font-light">
                          {talk.event} {talk.location && `• ${talk.location}`} • <span className="font-mono text-xs">{talk.date}</span>
                        </p>
                      </div>
                    </div>
                    {(() => {
                      const imgs = (talk as { images?: string[] }).images ?? (talk.image ? [talk.image] : []);
                      if (imgs.length === 0) return null;
                      return (
                        <div className={`ml-16 grid gap-3 ${imgs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {imgs.map((src, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setLightbox({ src, alt: talk.title })}
                              className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in block w-full p-0 bg-transparent"
                              aria-label={`Open image: ${talk.title}`}
                            >
                              <img src={src} alt={talk.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>
                ))}
              </div>

              <h3 className="text-xs uppercase tracking-[0.2em] font-black text-emerald-600 mb-8 mt-16">Workshops</h3>
              <div className="space-y-8">
                {cvData.workshops.map((workshop, index) => (
                  <div key={index} className="flex gap-6 items-start group">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:border-emerald-200 transition-colors">
                      <Globe size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{workshop.name}</h4>
                      <p className="text-slate-500 font-light mb-2">{workshop.role} • <span className="font-mono text-xs">{workshop.date}</span></p>
                      {workshop.link && (
                        <a href={workshop.link} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                          Workshop Link <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-black text-emerald-600 mb-8">Conferences</h3>
              <div className="space-y-8">
                {cvData.conferences.map((conf, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 group"
                  >
                    <div className="flex gap-6 items-start">
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:border-emerald-200 transition-colors">
                        <MapPin size={24} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{conf.name}</h4>
                        <p className="text-slate-500 font-light mb-1">{conf.location} • <span className="font-mono text-xs">{conf.date}</span></p>
                        {(conf as { award?: string }).award && (
                          <span className="inline-flex items-center gap-1 mt-1 mb-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                            🏆 {(conf as { award?: string }).award}
                          </span>
                        )}
                        <p className="text-slate-400 text-sm italic">{conf.details}</p>
                        {conf.link && (
                          <a href={conf.link} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-slate-900 transition-colors flex items-center gap-1 mt-2">
                            Event Page <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                    {conf.image && (
                      <button
                        type="button"
                        onClick={() => setLightbox({ src: conf.image!, alt: conf.name })}
                        className="ml-16 aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in block w-full p-0 bg-transparent"
                        aria-label={`Open image: ${conf.name}`}
                      >
                        <img src={conf.image} alt={conf.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-light tracking-wide">
          &copy; {new Date().getFullYear()} {cvData.name}. Crafted with precision using React & Tailwind.
        </p>
      </footer>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

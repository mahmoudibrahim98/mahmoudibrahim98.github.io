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

const Typewriter = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <span className="font-medium text-zinc-900">
      {`${words[index].substring(0, subIndex)}`}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ml-1 border-l-2 border-zinc-900 h-6 inline-block align-middle`}></span>
    </span>
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
      const sections = ['home', 'education', 'experience', 'publications', 'projects', 'talks', 'blogs'];
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
          <a href="#home" className="font-serif italic text-2xl font-bold tracking-tight text-slate-900">MI.</a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItem label="Education" href="#education" active={activeSection === 'education'} onClick={() => {}} />
            <NavItem label="Experience" href="#experience" active={activeSection === 'experience'} onClick={() => {}} />
            <NavItem label="Publications" href="#publications" active={activeSection === 'publications'} onClick={() => {}} />
            <NavItem label="Projects" href="#projects" active={activeSection === 'projects'} onClick={() => {}} />
            <NavItem label="Events" href="#events" active={activeSection === 'events'} onClick={() => {}} />
            <NavItem label="Blogs" href="#blogs" active={activeSection === 'blogs'} onClick={() => {}} />
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
              <a href="#education" onClick={() => setIsMenuOpen(false)}>Education</a>
              <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
              <a href="#publications" onClick={() => setIsMenuOpen(false)}>Publications</a>
              <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
              <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
              <a href="#blogs" onClick={() => setIsMenuOpen(false)}>Blogs</a>
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
              <h1 className="text-7xl md:text-9xl font-serif italic mb-8 tracking-tighter text-slate-900">
                {cvData.name}
              </h1>
              <div className="text-2xl md:text-3xl text-slate-500 max-w-2xl font-light leading-relaxed mb-10 h-32 md:h-auto">
                I <Typewriter words={[
                  "am a PhD Student",
                  "am passionate about Trustworthy Medical AI",
                  "explore the frontiers of Generative AI",
                  "generate Synthetic Data for Diverse Medical Modalities",
                  "advocate for Fairness in Healthcare AI",
                  "bridge Privacy and Utility in Medical Data"
                ]} /> <br className="hidden md:block" />
                at <span className="text-slate-900 font-semibold">Maastricht University</span> & <span className="text-slate-900 font-semibold">VITO</span>.
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

        {/* Projects */}
        <Section title="Projects" id="projects">
          <div className="grid md:grid-cols-2 gap-8">
            {cvData.projects.map((project, index) => (
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
                <a href={project.link} className="mt-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-colors">
                  Source Code <ChevronRight size={16} />
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
                    {talk.image && (
                      <div className="ml-16 aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={talk.image} alt={talk.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                      </div>
                    )}
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
                        <p className="text-slate-400 text-sm italic">{conf.details}</p>
                        {conf.link && (
                          <a href={conf.link} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-slate-900 transition-colors flex items-center gap-1 mt-2">
                            Event Page <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                    {conf.image && (
                      <div className="ml-16 aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={conf.image} alt={conf.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Blogs */}
        <Section title="Blogs" id="blogs">
          <div className="grid md:grid-cols-2 gap-8">
            {cvData.blogs.map((blog, index) => (
              <div key={index} className="flex gap-6 items-start group p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-emerald-200 transition-colors">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                  <BookOpen size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{blog.title}</h4>
                  <p className="text-slate-500 font-light mb-3 font-mono text-xs">{blog.date}</p>
                  <a href={blog.link} className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-slate-900 transition-colors inline-block">Read Article</a>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-light tracking-wide">
          &copy; {new Date().getFullYear()} {cvData.name}. Crafted with precision using React & Tailwind.
        </p>
      </footer>
    </div>
  );
}

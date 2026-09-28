import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Layers,
  Database,
  Shield,
  Users,
  Play,
  History,
  Search,
  Sparkles,
  Bell,
  CreditCard,
  Server,
  Code2,
  Cpu,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Monitor,
  Key,
  Flame,
  Layout,
  Sliders,
  Check,
  RotateCcw,
  Film,
  Compass,
  Zap,
  Globe,
  Award,
  List
} from 'lucide-react';

export const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const TOTAL_SLIDES = 16;

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < TOTAL_SLIDES - 1 ? prev + 1 : prev));
  }, [TOTAL_SLIDES]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToSlide = (index) => {
    if (index >= 0 && index < TOTAL_SLIDES) {
      setCurrentSlide(index);
      setShowOverview(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(TOTAL_SLIDES - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setShowOverview(false);
        if (isFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        }
      } else if (e.key === 'o' || e.key === 'O') {
        setShowOverview((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen, TOTAL_SLIDES]);

  // Slides catalogue for overview & quick selection
  const slideDirectory = [
    { id: 1, title: 'Title & Overview', subtitle: 'Netflix Replica V1 Architecture', icon: Film },
    { id: 2, title: 'What Did We Build?', subtitle: '10 Core Subsystems Breakdown', icon: Layers },
    { id: 3, title: 'Technology Stack', subtitle: 'Tools, Libraries & Rationale', icon: Cpu },
    { id: 4, title: 'High-Level Architecture', subtitle: '7-Tier End-to-End Pipeline', icon: Server },
    { id: 5, title: 'Development Flow', subtitle: 'Phases 1 → 12 Engineering Journey', icon: Compass },
    { id: 6, title: 'Content Schema & Seed Data', subtitle: 'Media Models & Seed Automation', icon: Database },
    { id: 7, title: 'Frontend Architecture', subtitle: 'React Components, Layouts & State', icon: Layout },
    { id: 8, title: 'Authentication & Security', subtitle: 'JWT, bcrypt & Route Guards', icon: Key },
    { id: 9, title: 'Multi-Profile Subsystem', subtitle: 'Isolated Watch States & Avatars', icon: Users },
    { id: 10, title: 'Video Playback Engine', subtitle: 'HTML5 Player & Custom Controls', icon: Play },
    { id: 11, title: 'Watch History & Resume', subtitle: 'Throttled Progress & Continue Row', icon: History },
    { id: 12, title: 'Search & Discovery', subtitle: 'Debounced Queries & Filtering', icon: Search },
    { id: 13, title: 'Recommendations & Alerts', subtitle: 'Genre Affinity & Notification Feed', icon: Bell },
    { id: 14, title: 'Subscription Simulation', subtitle: 'Plan Tiers & Billing State Machine', icon: CreditCard },
    { id: 15, title: 'Full-Stack API Surface', subtitle: 'REST Endpoints & Specifications', icon: Code2 },
    { id: 16, title: 'Key Takeaways & Summary', subtitle: 'Engineering Insights & Conclusion', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between select-none">
      
      {/* Presentation Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800/80 rounded-xl px-5 py-3.5 mb-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            N
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-white tracking-wide flex items-center gap-2">
              Netflix Replica V1 <span className="text-zinc-500">|</span> <span className="text-zinc-300 font-medium">System Architecture</span>
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Interactive Technical Deep-Dive &amp; Engineering Specification</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverview(!showOverview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              showOverview
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title="Toggle Slide Grid Overview (Hotkey: O)"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            title="Toggle Fullscreen Mode (Hotkey: F)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white transition"
          >
            Exit Deck
          </Link>
        </div>
      </div>

      {/* Slide Navigation Progress Bar */}
      <div className="w-full bg-zinc-800/80 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%` }}
        />
      </div>

      {/* Main Slide Card Container */}
      <div className="relative min-h-[580px] bg-gradient-to-b from-zinc-900/95 to-black/95 border border-zinc-800/90 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Background glow styling */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Slide Content */}
        <div className="relative z-10">
          {/* SLIDE 1: Title */}
          {currentSlide === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Complete V1 Technical Walkthrough
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                Netflix Replica <span className="text-red-600">V1</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl font-bold text-zinc-200 mb-6 max-w-2xl">
                &ldquo;How This System Works&rdquo;
              </h2>

              <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed mb-10">
                A production-grade, full-stack streaming platform built from the ground up to explore RESTful APIs, JWT authentication, MongoDB data schemas, throttled video playback state, multi-user profiles, and modern component architecture.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-3xl text-left mb-8">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="text-red-500 font-bold text-lg mb-0.5">12 Phases</div>
                  <div className="text-xs text-zinc-400">Complete Engineering Cycle</div>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="text-red-500 font-bold text-lg mb-0.5">10 Modules</div>
                  <div className="text-xs text-zinc-400">Integrated Subsystems</div>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="text-red-500 font-bold text-lg mb-0.5">16+ APIs</div>
                  <div className="text-xs text-zinc-400">Secure REST Endpoints</div>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="text-emerald-500 font-bold text-lg mb-0.5">100% Pass</div>
                  <div className="text-xs text-zinc-400">Automated Test Coverage</div>
                </div>
              </div>

              <button
                onClick={nextSlide}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3 rounded-xl transition shadow-lg hover:shadow-red-600/30 text-sm"
              >
                Begin System Presentation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SLIDE 2: What Did We Build? */}
          {currentSlide === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 02</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">What Did We Build?</h2>
                </div>
                <Layers className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                We built a complete, resilient, Netflix-inspired full-stack streaming platform to master the end-to-end flow between user actions, API servers, data persistence, and media streaming.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: '1. React Frontend', desc: 'Responsive cinematic streaming UI with Tailwind CSS', icon: Layout },
                  { name: '2. Express Backend', desc: 'Modular Node.js API with controllers & routing', icon: Server },
                  { name: '3. Data Persistence', desc: 'MongoDB & Mongoose schema modeling with memory fallback', icon: Database },
                  { name: '4. Authentication', desc: 'Secure JWT tokens & bcrypt password hashing', icon: Shield },
                  { name: '5. Content API', desc: 'Categorized catalog, trending items & filtering', icon: Film },
                  { name: '6. Custom Playback', desc: 'HTML5 video engine with throttle progress resume', icon: Play },
                  { name: '7. Multi-Profile', desc: 'Up to 5 isolated profiles per user account', icon: Users },
                  { name: '8. Recommendations', desc: 'Genre-affinity scoring for personalized discovery', icon: Sparkles },
                  { name: '9. Notifications', desc: 'Real-time feed for updates, watchlist & alerts', icon: Bell },
                  { name: '10. Subscriptions', desc: 'Plan tier simulation (Basic, Standard, Premium)', icon: CreditCard },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-xl hover:border-red-500/40 transition">
                      <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-2.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-white text-xs mb-1">{item.name}</h3>
                      <p className="text-zinc-400 text-[11px] leading-snug">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SLIDE 3: Tech Stack */}
          {currentSlide === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 03</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Full-Stack Technology Stack</h2>
                </div>
                <Cpu className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Every tool in this stack was chosen for performance, standard industry alignment, and clear architectural boundaries.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Frontend */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-3">
                      <Layout className="w-4 h-4" /> Frontend Layer
                    </div>
                    <ul className="space-y-3 text-xs">
                      <li>
                        <span className="font-bold text-white block">React 18 &amp; Vite</span>
                        <span className="text-zinc-400">Builds lightning-fast reactive UI with hot module reloading.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">Tailwind CSS</span>
                        <span className="text-zinc-400">Delivers unified dark streaming design tokens &amp; smooth layouts.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">React Router 6</span>
                        <span className="text-zinc-400">Manages client-side URL routing and route authorization guards.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Backend */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-3">
                      <Server className="w-4 h-4" /> Backend Server
                    </div>
                    <ul className="space-y-3 text-xs">
                      <li>
                        <span className="font-bold text-white block">Node.js &amp; Express</span>
                        <span className="text-zinc-400">Executes RESTful API request pipelines and routing middleware.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">CORS &amp; Morgan</span>
                        <span className="text-zinc-400">Secures cross-origin calls and logs incoming HTTP diagnostics.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">Error Middleware</span>
                        <span className="text-zinc-400">Standardizes uniform JSON error responses across all controllers.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Database */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-3">
                      <Database className="w-4 h-4" /> Database &amp; Auth
                    </div>
                    <ul className="space-y-3 text-xs">
                      <li>
                        <span className="font-bold text-white block">MongoDB &amp; Mongoose</span>
                        <span className="text-zinc-400">Stores structured document models with validation and indexing.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">JSON Web Tokens (JWT)</span>
                        <span className="text-zinc-400">Maintains stateless, cryptographically signed user sessions.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">bcryptjs</span>
                        <span className="text-zinc-400">Salts and hashes passwords securely prior to database storage.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tooling */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-3">
                      <Code2 className="w-4 h-4" /> Testing &amp; Tooling
                    </div>
                    <ul className="space-y-3 text-xs">
                      <li>
                        <span className="font-bold text-white block">Node Test Runner</span>
                        <span className="text-zinc-400">Executes comprehensive automated test suites for all 16 endpoints.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">Lucide React</span>
                        <span className="text-zinc-400">Provides consistent streaming interface iconography.</span>
                      </li>
                      <li>
                        <span className="font-bold text-white block">In-Memory Mock Fallback</span>
                        <span className="text-zinc-400">Guarantees zero-dependency operation if external MongoDB is offline.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: High-Level Architecture */}
          {currentSlide === 3 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 04</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">7-Tier System Architecture</h2>
                </div>
                <Server className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Clean unidirectional request lifecycle ensures strict separation of concerns from user click to database write.
              </p>

              {/* Visual Flowchart */}
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-2.5 my-2">
                {[
                  { step: '1', title: 'User / Browser', subtitle: 'Clicks, plays, searches', color: 'bg-zinc-800', border: 'border-zinc-700' },
                  { step: '2', title: 'React Frontend', subtitle: 'Components, Context & Hooks', color: 'bg-zinc-900', border: 'border-red-600/50' },
                  { step: '3', title: 'REST Client', subtitle: 'Auth Bearer & Axios/Fetch', color: 'bg-zinc-900', border: 'border-zinc-700' },
                  { step: '4', title: 'Express Router', subtitle: 'JWT verification middleware', color: 'bg-zinc-900', border: 'border-red-600/50' },
                  { step: '5', title: 'Controllers', subtitle: 'Business rules & validations', color: 'bg-zinc-900', border: 'border-zinc-700' },
                  { step: '6', title: 'Mongoose ODM', subtitle: 'Schema casting & queries', color: 'bg-zinc-900', border: 'border-red-600/50' },
                  { step: '7', title: 'MongoDB / Store', subtitle: 'Persistent document state', color: 'bg-zinc-800', border: 'border-emerald-600/60' },
                ].map((tier, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className={`w-full ${tier.color} border ${tier.border} rounded-xl p-3 text-center shadow-md relative group hover:scale-[1.02] transition`}>
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center mx-auto mb-1.5 shadow">
                        {tier.step}
                      </span>
                      <h4 className="font-bold text-white text-xs leading-tight mb-1">{tier.title}</h4>
                      <p className="text-zinc-400 text-[10px]">{tier.subtitle}</p>
                    </div>
                    {i < 6 && (
                      <div className="text-red-500 font-bold my-1 text-sm">
                        <span className="md:hidden">↓</span>
                        <span className="hidden md:inline">→</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Data Flow Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-bold text-xs text-red-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Client-to-Server Flow
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Client requests attach the JWT token in the <code className="text-zinc-200 bg-black/40 px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> header. Express validates signature before passing payload to controllers.
                  </p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-bold text-xs text-emerald-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Server-to-Client Response
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Responses are formatted as standardized JSON envelopes: <code className="text-zinc-200 bg-black/40 px-1 py-0.5 rounded">&#123; success: true, data: [...] &#125;</code> with proper HTTP status codes (200, 201, 400, 401, 404).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Development Flow (Phases 1 → 12) */}
          {currentSlide === 4 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 05</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">12-Phase Development Journey</h2>
                </div>
                <Compass className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-4">
                The application was constructed progressively in 12 structured development phases, ensuring each subsystem was verified before stacking the next layer.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                {[
                  { phase: 'Phase 1', title: 'Content API & Seeding', desc: 'REST endpoints, categories & seed data' },
                  { phase: 'Phase 2', title: 'Netflix UI & Hero', desc: 'Cinematic rows, banners & styling' },
                  { phase: 'Phase 3', title: 'Auth & JWT System', desc: 'Login, signup, password hashing & tokens' },
                  { phase: 'Phase 4', title: 'Multi-Profile Subsystem', desc: 'Up to 5 profiles, avatars & switching' },
                  { phase: 'Phase 5', title: 'Search & Filtering', desc: 'Debounced search & genre filtering' },
                  { phase: 'Phase 6', title: 'Watchlist / My List', desc: 'Save & remove titles per active profile' },
                  { phase: 'Phase 7', title: 'Video Playback Engine', desc: 'HTML5 player with custom streaming UI' },
                  { phase: 'Phase 8', title: 'Watch History & Resume', desc: 'Throttled position saves & Continue row' },
                  { phase: 'Phase 9', title: 'Consistency & Polish', desc: 'Cross-device refinement & error handling' },
                  { phase: 'Phase 10', title: 'Recommendations & Alerts', desc: 'Genre affinity matching & notification feed' },
                  { phase: 'Phase 11', title: 'Subscription Simulation', desc: 'Basic, Standard, Premium tier state machine' },
                  { phase: 'Phase 12', title: 'Interactive PPT / About', desc: 'Comprehensive technical presentation deck' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-lg hover:border-red-600/40 transition">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 font-bold text-[10px] mb-1">
                      {item.phase}
                    </span>
                    <h4 className="font-bold text-white text-xs mb-0.5">{item.title}</h4>
                    <p className="text-zinc-400 text-[11px] leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 6: Content Schema & Seed Data */}
          {currentSlide === 5 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 06</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Content Schema &amp; Seed Engine</h2>
                </div>
                <Database className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                The media catalog is modeled with rich metadata supporting multiple genres, high-resolution backdrops, video stream links, and deterministic database seeding.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schema visual */}
                <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <div className="text-red-400 font-bold mb-2">// Movie Mongoose Schema</div>
                  <pre className="text-[11px] leading-relaxed text-zinc-300">
{`const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: String, required: true }],
  duration: { type: String, default: "1h 45m" },
  releaseYear: { type: Number, required: true },
  rating: { type: String, default: "TV-MA" },
  matchScore: { type: Number, default: 98 },
  posterUrl: { type: String, required: true },
  backdropUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  cast: [{ type: String }],
  director: { type: String }
}, { timestamps: true });`}
                  </pre>
                </div>

                {/* Feature breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">Seed Data Automation</h4>
                    <p className="text-zinc-400">
                      When the server boots, it automatically seeds 20+ cinematic movies and shows categorized across Trending, Action, Sci-Fi, Dramas, and Top 10 rows.
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">Video Stream Integration</h4>
                    <p className="text-zinc-400">
                      Every document contains valid MP4 streaming URLs (such as Big Buck Bunny, Tears of Steel, and Sintel) to deliver genuine video playback.
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">Taxonomy &amp; Indexing</h4>
                    <p className="text-zinc-400">
                      Indexed fields on <code className="text-red-400">genre</code> and <code className="text-red-400">isTrending</code> allow fast O(1) row queries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: Frontend Architecture */}
          {currentSlide === 6 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 07</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Frontend Architecture &amp; State</h2>
                </div>
                <Layout className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Modular React hierarchy utilizing React Context for global state, custom hooks for API encapsulation, and reusable UI atomic components.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Layouts & Routing */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Layouts &amp; Routing
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li><strong className="text-white">AppLayout:</strong> Header, Footer, dynamic modal outlet.</li>
                    <li><strong className="text-white">AuthLayout:</strong> Focused fullscreen layout for Login &amp; Signup.</li>
                    <li><strong className="text-white">ProtectedRoute:</strong> Guards private routes and profile checks.</li>
                  </ul>
                </div>

                {/* State Contexts */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> Global Context Providers
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li><strong className="text-white">AuthContext:</strong> User credentials, JWT storage &amp; auth status.</li>
                    <li><strong className="text-white">ProfileContext:</strong> Active profile selection &amp; profile list.</li>
                    <li><strong className="text-white">PlayerContext:</strong> Currently playing video &amp; playback state.</li>
                  </ul>
                </div>

                {/* Reusable Components */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Reusable Components
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li><strong className="text-white">HeroBanner:</strong> High-impact featured movie with play &amp; info.</li>
                    <li><strong className="text-white">MovieRow:</strong> Horizontal scroll carousels with hover preview.</li>
                    <li><strong className="text-white">MovieDetailsModal:</strong> Full synopses, cast, rating &amp; play CTAs.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: Authentication & Security */}
          {currentSlide === 7 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 08</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Authentication &amp; Security</h2>
                </div>
                <Shield className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Security-first architecture implementing bcrypt hashing, signed JWT tokens, and strict HTTP middleware validation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 text-red-400">
                      <Key className="w-4 h-4" /> Password Hashing (bcryptjs)
                    </h4>
                    <p className="text-zinc-400">
                      Plaintext passwords never touch the database. A cryptographic salt (10 rounds) is applied before saving to ensure credential security.
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 text-red-400">
                      <Shield className="w-4 h-4" /> JWT Token Verification
                    </h4>
                    <p className="text-zinc-400">
                      Upon successful login, a signed JSON Web Token is returned containing the user ID. Protected endpoints reject invalid or expired tokens with <code className="text-zinc-200">401 Unauthorized</code>.
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 text-red-400">
                      <CheckCircle2 className="w-4 h-4" /> User Isolation
                    </h4>
                    <p className="text-zinc-400">
                      All query operations enforce <code className="text-zinc-200">userId = req.user.id</code>, guaranteeing that users can never view or modify another person&apos;s watch history, watchlist, or profiles.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <div className="text-emerald-400 font-bold mb-2">// Auth Middleware Execution</div>
                  <pre className="text-[11px] leading-relaxed text-zinc-300">
{`const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized: Missing token' 
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: "user_123" }
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid token' 
    });
  }
};`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 9: Multi-Profile Subsystem */}
          {currentSlide === 8 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 09</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Multi-Profile Subsystem</h2>
                </div>
                <Users className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Supports up to 5 personalized profiles per account. Each profile maintains its own completely independent Watchlist, Watch History, and Continue Watching state.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-lg mb-3">
                    5
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">Max 5 Profiles</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Account holders can create, rename, customize avatars, and delete sub-profiles. A minimum of one profile is always preserved.
                  </p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-lg mb-3">
                    <History className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">State Isolation</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Profile A&apos;s watch history and continue-watching timestamps will never collide with or affect Profile B&apos;s recommendations.
                  </p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-bold text-lg mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">Kids &amp; Avatars</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Supports curated Netflix-style avatar selection and Kids Mode flags to filter content to family-friendly ratings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 10: Video Playback Engine */}
          {currentSlide === 9 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 10</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Custom Video Playback Engine</h2>
                </div>
                <Play className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Custom HTML5 video playback experience engineered with cinematic controls, progress scrubbing, and responsive shortcuts.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <div className="font-bold text-red-400 mb-1">Controls Overlay</div>
                  <p className="text-zinc-400 text-[11px]">Auto-hiding controls on mouse inactivity for immersive viewing.</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <div className="font-bold text-red-400 mb-1">10s Seek Skip</div>
                  <p className="text-zinc-400 text-[11px]">Instant 10-second fast-forward and rewind buttons with animations.</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <div className="font-bold text-red-400 mb-1">Speed &amp; Quality</div>
                  <p className="text-zinc-400 text-[11px]">Adjustable playback speeds (0.5x to 2x) and simulated resolution selectors.</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <div className="font-bold text-red-400 mb-1">Keyboard Hotkeys</div>
                  <p className="text-zinc-400 text-[11px]">Space (Play/Pause), M (Mute), F (Fullscreen), Left/Right (Seek 5s).</p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-300 flex items-center gap-4">
                <Film className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <strong className="text-white">Seamless Resume Handshake:</strong> Upon video load, the player queries <code className="text-red-400">/api/history</code> for the active profile and automatically resumes playback from the exact stored timestamp.
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 11: Watch History & Continue Watching */}
          {currentSlide === 10 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 11</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Watch History &amp; &ldquo;Continue Watching&rdquo;</h2>
                </div>
                <History className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Engineered with intelligent throttled progress tracking to reduce API load while maintaining high precision for the &ldquo;Continue Watching&rdquo; row.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">Throttled Position Sync</h4>
                    <p className="text-zinc-400">
                      While watching, progress updates are throttled to every 5 seconds (or on pause/exit) using <code className="text-red-400">POST /api/history</code>.
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">Completion Threshold (90%)</h4>
                    <p className="text-zinc-400">
                      When a user watches &gt;90% of a video, it is marked completed and removed from the active &ldquo;Continue Watching&rdquo; shelf to keep the homepage clean.
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">Dedicated History Management</h4>
                    <p className="text-zinc-400">
                      Users can view their entire watch log at <code className="text-zinc-200">/history</code>, with timestamps and options to clear individual items.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto flex flex-col justify-center">
                  <div className="text-red-400 font-bold mb-2">// History Record Model</div>
                  <pre className="text-[11px] leading-relaxed text-zinc-300">
{`{
  userId: "user_64f1...",
  profileId: "prof_89b2...",
  movieId: "movie_104",
  progress: 742, // seconds
  duration: 1200, // total length
  percentage: 61.8,
  completed: false,
  lastWatched: "2026-09-28T09:45:00Z"
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 12: Search & Dynamic Discovery */}
          {currentSlide === 11 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 12</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Search &amp; Dynamic Discovery</h2>
                </div>
                <Search className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Fast, debounced search across titles, genres, and cast with real-time URL query parameter synchronization.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Debounced Input</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Input keystrokes are debounced by 300ms, preventing redundant server requests during rapid typing.
                  </p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-3">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Multi-Facet Filtering</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Search engine matches against movie titles, genre tags, director names, and actor cast arrays simultaneously.
                  </p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-3">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Empty State Fallbacks</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    When no query matches are found, the UI gracefully presents popular trending titles to prevent dead-ends.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 13: Recommendations & Notifications */}
          {currentSlide === 12 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 13</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Recommendations &amp; Notifications</h2>
                </div>
                <Sparkles className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Smart recommendation scoring based on profile watch affinity paired with an interactive in-app notification dropdown.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommendations */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" /> Genre Affinity Algorithm
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    The recommendation engine analyzes the active profile&apos;s watch history and computes genre weight scores.
                  </p>
                  <div className="bg-black/50 p-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                    Score = (WatchedGenreMatches × 2) + (MatchPercentage × 0.5)
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Movies with highest affinity scores are populated in the &ldquo;Recommended for You&rdquo; row on the homepage.
                  </p>
                </div>

                {/* Notifications */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <Bell className="w-4 h-4" /> Real-Time Notification Feed
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    The header bell icon features unread counter badges and rich notification cards:
                  </p>
                  <ul className="space-y-1.5 text-zinc-300">
                    <li>• <strong className="text-white">New Arrivals:</strong> Recently added blockbusters and originals.</li>
                    <li>• <strong className="text-white">Watchlist Alerts:</strong> Reminders for saved unwatched movies.</li>
                    <li>• <strong className="text-white">Subscription Status:</strong> Plan changes &amp; renewal confirmations.</li>
                  </ul>
                  <p className="text-zinc-500 text-[11px]">Supports one-click &ldquo;Mark all as read&rdquo; and clear actions.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 14: Simulated Subscription System */}
          {currentSlide === 13 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 14</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Simulated Subscription Engine</h2>
                </div>
                <CreditCard className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Simulates real-world SaaS tiering and subscription lifecycle states without charging real payments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="font-bold text-white text-sm mb-1">Basic Tier</div>
                  <div className="text-red-400 font-bold text-base mb-2">$8.99 / mo</div>
                  <ul className="space-y-1 text-zinc-400 text-[11px]">
                    <li>• HD 720p streaming</li>
                    <li>• 1 active screen</li>
                    <li>• Ad-supported catalog</li>
                  </ul>
                </div>

                <div className="bg-zinc-900/80 border border-red-600/50 p-4 rounded-xl relative">
                  <span className="absolute -top-2.5 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
                  <div className="font-bold text-white text-sm mb-1">Standard Tier</div>
                  <div className="text-red-400 font-bold text-base mb-2">$13.99 / mo</div>
                  <ul className="space-y-1 text-zinc-400 text-[11px]">
                    <li>• Full HD 1080p</li>
                    <li>• 2 active screens</li>
                    <li>• Unlimited downloads</li>
                  </ul>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <div className="font-bold text-white text-sm mb-1">Premium Tier</div>
                  <div className="text-red-400 font-bold text-base mb-2">$17.99 / mo</div>
                  <ul className="space-y-1 text-zinc-400 text-[11px]">
                    <li>• Ultra HD 4K + HDR</li>
                    <li>• 4 concurrent screens</li>
                    <li>• Spatial audio capability</li>
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl text-xs text-zinc-300">
                <strong className="text-white">State Machine:</strong> Tracks <code className="text-emerald-400">active</code>, <code className="text-yellow-400">cancelled</code>, and <code className="text-red-400">expired</code> states with clean upgrade/cancellation workflows in the Account dashboard.
              </div>
            </div>
          )}

          {/* SLIDE 15: Full-Stack API Surface */}
          {currentSlide === 14 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Slide 15</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Full-Stack REST API Catalog</h2>
                </div>
                <Code2 className="w-7 h-7 text-red-500" />
              </div>

              <p className="text-zinc-300 text-sm mb-4">
                Structured RESTful endpoints powering client synchronization:
              </p>

              <div className="bg-black/60 border border-zinc-800 rounded-xl overflow-hidden max-h-[360px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Method</th>
                      <th className="py-2.5 px-3 font-semibold">Endpoint</th>
                      <th className="py-2.5 px-3 font-semibold">Auth</th>
                      <th className="py-2.5 px-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-400">POST</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/auth/register</td>
                      <td className="py-2 px-3 text-zinc-500">Public</td>
                      <td className="py-2 px-3">Create new account &amp; default profile</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-400">POST</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/auth/login</td>
                      <td className="py-2 px-3 text-zinc-500">Public</td>
                      <td className="py-2 px-3">Validate credentials &amp; issue JWT token</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-400">GET</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/movies</td>
                      <td className="py-2 px-3 text-zinc-500">Public</td>
                      <td className="py-2 px-3">List categorized movies &amp; trending items</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-400">GET</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/profiles</td>
                      <td className="py-2 px-3 text-red-400">JWT</td>
                      <td className="py-2 px-3">Retrieve all user sub-profiles</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-400">GET</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/watchlist</td>
                      <td className="py-2 px-3 text-red-400">JWT</td>
                      <td className="py-2 px-3">Get saved titles for active profile</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-400">POST</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/history</td>
                      <td className="py-2 px-3 text-red-400">JWT</td>
                      <td className="py-2 px-3">Update video playback progress timestamp</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-400">GET</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/recommendations</td>
                      <td className="py-2 px-3 text-red-400">JWT</td>
                      <td className="py-2 px-3">Fetch genre-affinity tailored movies</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-400">GET</td>
                      <td className="py-2 px-3 font-mono text-[11px]">/api/subscription</td>
                      <td className="py-2 px-3 text-red-400">JWT</td>
                      <td className="py-2 px-3">Get current user subscription tier &amp; status</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SLIDE 16: Key Takeaways & Summary */}
          {currentSlide === 15 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Final Slide 16</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Engineering Insights &amp; Wrap-Up</h2>
                </div>
                <Award className="w-7 h-7 text-emerald-400" />
              </div>

              <p className="text-zinc-300 text-sm mb-6">
                Netflix Replica V1 demonstrates complete mastery of full-stack media engineering patterns:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-red-400">
                    <Check className="w-4 h-4" /> Architectural Discipline
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Uncompromising separation between frontend views, REST controllers, Mongoose schemas, and auth middleware guarantees maintainability and easy scalability.
                  </p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-red-400">
                    <Check className="w-4 h-4" /> Real-World Media Patterns
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Throttled position synchronization, seamless resume playback, and profile state isolation mirror the engineering practices used by modern streaming platforms.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-black border border-red-600/30 rounded-xl p-5 text-center">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Netflix Replica V1 is Complete &amp; Production-Ready</h3>
                <p className="text-zinc-400 text-xs mb-4 max-w-xl mx-auto">
                  Explore the live streaming catalog, switch profiles, save watchlists, and test custom video playback controls!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition shadow-lg shadow-red-600/30"
                  >
                    Start Streaming Now
                  </Link>
                  <button
                    onClick={() => goToSlide(0)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-zinc-700 transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restart Presentation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Bottom Controls */}
        <div className="relative z-10 pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed text-zinc-600 bg-zinc-900'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white hover:border-zinc-600 border border-zinc-700/80'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Slide Indicator & Direct Jump */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400">
              Slide <span className="text-white font-black">{currentSlide + 1}</span> of <span className="text-zinc-400">{TOTAL_SLIDES}</span>
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-[11px] text-zinc-500">Use ← → or Space keys</span>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === TOTAL_SLIDES - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentSlide === TOTAL_SLIDES - 1
                ? 'opacity-30 cursor-not-allowed text-zinc-600 bg-zinc-900'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Overview Modal Drawer */}
      {showOverview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-base">Presentation Slide Overview</h3>
                <span className="text-xs text-zinc-400">({TOTAL_SLIDES} Slides)</span>
              </div>
              <button
                onClick={() => setShowOverview(false)}
                className="text-zinc-400 hover:text-white text-xs bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition"
              >
                Close (Esc)
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 overflow-y-auto">
              {slideDirectory.map((slide, idx) => {
                const Icon = slide.icon;
                const isSelected = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    className={`p-3.5 rounded-xl text-left border transition flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-red-600/10 border-red-500 text-white ring-2 ring-red-500/40'
                        : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-black/40 text-zinc-400'
                        }`}>
                          Slide {String(slide.id).padStart(2, '0')}
                        </span>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      </div>
                      <h4 className="font-bold text-xs text-white mb-1 group-hover:text-red-400 transition">{slide.title}</h4>
                      <p className="text-zinc-400 text-[11px] leading-tight line-clamp-2">{slide.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;

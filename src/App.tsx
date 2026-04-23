/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import SearchResults from './SearchResults';
import { Property } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Home } from 'lucide-react';
import Dashboard from './Dashboard';
import BottomNav from './components/BottomNav';

import { AuthProvider, useAuth } from './components/AuthContext';
import { db } from './lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'), limit(6));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      setProperties(data);
    } catch (err) {
      setError('Acquisition network offline.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent-teal font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
              <Sparkles className="w-4 h-4 shadow-[0_0_10px_#45A29E]" />
              Market Intelligence
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white uppercase">
              Exclusive <br /> <span className="font-bold text-accent-cyan underline decoration-accent-teal/20">Portfolio</span>
            </h2>
          </div>
          
          <Link to="/search" className="text-[10px] font-bold text-accent-teal flex items-center gap-2 hover:text-accent-cyan transition-all uppercase tracking-widest border-b border-accent-teal/20 pb-1">
            Global Database Entry
            <span className="text-sm">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-accent-teal gap-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Decrypting Listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/20 text-red-400 p-12 rounded-sm text-center border border-red-900/40 shadow-inner">
            <p className="font-bold text-[10px] uppercase tracking-[0.3em] mb-3">Sync Error</p>
            <p className="mb-8 opacity-60 text-xs font-light">{error}</p>
            <button 
              onClick={fetchProperties}
              className="bg-red-900/40 text-red-100 border border-red-700 px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-red-800"
            >
              Re-establish Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {properties.slice(0, 8).map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-bg-dark text-text-silver selection:bg-accent-cyan selection:text-black pb-20 lg:pb-0">
          <Header />
          <BottomNav />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>

          {/* Call to Action Section - Shared across pages */}
          <section className="bg-black py-40 overflow-hidden relative border-y border-surface-dark/50">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-teal/5 blur-[160px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[160px] rounded-full pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 leading-[0.85] text-white uppercase">
                Acquire Your <br /> 
                <span className="text-accent-teal italic font-light">Legacy</span>
              </h2>
              <p className="text-lg text-text-silver mb-12 max-w-2xl mx-auto font-light leading-relaxed opacity-80">
                Join an elite tier of investors. Our private placement desk offers 
                unrivaled access to India's most significant architectural assets.
              </p>
              <button className="bg-accent-teal text-black px-12 py-6 rounded-sm text-[11px] font-extrabold uppercase tracking-[0.3em] hover:bg-accent-cyan transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(70,162,158,0.2)]">
                Private Consultation
              </button>
            </div>
          </section>
        </main>

        <footer className="bg-black border-t border-surface-dark py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-surface-dark flex items-center justify-center rounded-sm border border-accent-teal/30">
                    <Building2 className="text-accent-cyan w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold tracking-widest uppercase text-accent-cyan">BigBroker</span>
                </div>
                <p className="text-text-silver text-[11px] font-medium leading-relaxed opacity-50 uppercase tracking-widest">
                  Strategic Real Estate Advisory. <br />
                  Bombay | Delhi | London | Dubai
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-16">
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-accent-teal mb-8 opacity-60">Operations</h4>
                  <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-text-silver">
                    <li><Link to="/" className="hover:text-accent-cyan transition-colors">Portfolios</Link></li>
                    <li><a href="#" className="hover:text-accent-cyan transition-colors">Advisory</a></li>
                    <li><a href="#" className="hover:text-accent-cyan transition-colors">Intelligence</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-accent-teal mb-8 opacity-60">Compliance</h4>
                  <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-text-silver">
                    <li><a href="#" className="hover:text-accent-cyan transition-colors">Terms</a></li>
                    <li><a href="#" className="hover:text-accent-cyan transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-accent-cyan transition-colors">Licenses</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-surface-dark/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-accent-teal/30 text-[9px] font-bold uppercase tracking-[0.4em]">
              <p>© 2026 BigBroker Global Assets</p>
              <p>Certified Strategic Deployment</p>
            </div>
          </div>
        </footer>
      </div>
     </AuthProvider>
    </BrowserRouter>
  );
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}


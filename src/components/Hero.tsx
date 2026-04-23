import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import SearchFilters from './SearchFilters';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[radial-gradient(#1f2833_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent-teal/10 text-accent-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-accent-teal/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#66FCF1]" />
              Elite Management Group
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-8 uppercase">
              Premier <br />
              <span className="text-accent-teal italic font-light">Residences</span>
            </h1>
            <p className="text-base md:text-lg text-text-silver max-w-lg mb-10 leading-relaxed font-light">
              Sophisticated acquisition strategies for the modern investor. 
              Secure your position in India's most exclusive metropolitan hubs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-[16/9] rounded-sm overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-surface-dark relative">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
                alt="Luxury Home" 
                className="w-full h-full object-cover grayscale-[0.2] brightness-[0.8]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-surface-dark/40 backdrop-blur-md rounded-sm border border-accent-teal/20">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-accent-teal text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Curated Asset</p>
                    <h3 className="text-white text-xl font-bold uppercase tracking-tight">The Sapphire Estates</h3>
                    <div className="flex items-center gap-1 text-text-silver text-[10px] uppercase font-semibold mt-1">
                      <MapPin className="w-3 h-3 text-accent-cyan" />
                      Sector 42, Gurugram
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-teal text-[10px] font-bold mb-1 uppercase opacity-60">Valuation</p>
                    <p className="text-accent-cyan text-2xl font-light tracking-tighter">₹12.5 Cr</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-20 -mt-8 lg:-mt-20"
        >
          <SearchFilters />
        </motion.div>
      </div>
    </section>
  );
}


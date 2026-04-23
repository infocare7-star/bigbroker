import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from './components/Header';
import { PropertyCard } from './components/PropertyCard';
import SearchFilters from './components/SearchFilters';
import { Property } from './types';
import { Loader2, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { db } from './lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      const constraints: any[] = [];
      const city = searchParams.get('city');
      const sector = searchParams.get('sector');
      const bhk = searchParams.get('bhk');
      const maxPrice = searchParams.get('maxPrice');

      if (city) constraints.push(where('city', '==', city));
      if (sector) constraints.push(where('sector', '==', sector));
      if (bhk) constraints.push(where('bhk', '==', Number(bhk)));
      if (maxPrice) constraints.push(where('price', '<=', Number(maxPrice)));

      const q = query(
        collection(db, 'properties'),
        ...constraints,
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      
      setProperties(data);
    } catch (err) {
      console.error(err);
      setError('Query execution failed. (Potential Index requirement)');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    city: searchParams.get('city') || '',
    sector: searchParams.get('sector') || '',
    bhk: searchParams.get('bhk') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      <Header />
      
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-accent-teal hover:text-accent-cyan font-bold text-[10px] uppercase tracking-widest mb-6 transition-all group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Acquisition
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-light tracking-tighter text-white mb-2 uppercase">
                Asset <span className="font-bold underline decoration-accent-teal/30">Catalogue</span>
              </h1>
              <p className="text-[10px] text-text-silver font-bold uppercase tracking-[0.2em] opacity-60">
                Identified <span className="text-accent-cyan">{properties.length}</span> high-yield properties
              </p>
            </div>
            
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-surface-dark border border-accent-teal/20 px-4 py-2 rounded-sm text-text-silver hover:border-accent-cyan transition-colors">
              <SlidersHorizontal className="w-3 h-3 text-accent-teal" />
              Chronological
            </button>
          </div>

          <SearchFilters initialValues={initialValues} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-accent-teal gap-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-60">Scanning Neural Grid...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-950/20 rounded-sm border border-red-900/50 p-8">
            <p className="text-red-400 font-bold text-[10px] uppercase tracking-widest mb-4">{error}</p>
            <button onClick={fetchResults} className="bg-red-900/40 text-red-200 border border-red-700 px-6 py-2 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all hover:bg-red-800">Retry Fetch</button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-32 bg-surface-dark/20 rounded-sm border border-accent-teal/10 px-4 shadow-inner">
            <div className="w-20 h-20 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-teal/20">
              <SlidersHorizontal className="w-8 h-8 text-accent-teal opacity-40" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase">No Assets Located</h2>
            <p className="text-text-silver text-xs mb-8 max-w-md mx-auto opacity-60 font-light leading-relaxed">
              No properties matched the specified parameters in our current database. 
              Broaden your search criteria for greater acquisition opportunities.
            </p>
            <button 
              onClick={() => window.location.href = '/search'} 
              className="bg-accent-teal text-black px-8 py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent-cyan transition-all"
            >
              Reset Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Search, MapPin, Building, IndianRupee, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function SearchFilters({ initialValues = {} }: { initialValues?: any }) {
  const navigate = useNavigate();
  const [cities, setCities] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<Record<string, string>>({
    city: initialValues.city || '',
    sector: initialValues.sector || '',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
    bhk: initialValues.bhk || '',
  });

  useEffect(() => {
    // Real-time locations from the properties collection
    const unsub = onSnapshot(collection(db, 'properties'), (snap) => {
      const c = new Set<string>();
      const s = new Set<string>();
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.city) c.add(String(data.city));
        if (data.sector) s.add(String(data.sector));
      });
      setCities(Array.from(c).sort());
      setSectors(Array.from(s).sort());
    });
    return unsub;
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-surface-dark p-2 md:p-3 rounded-sm shadow-2xl border border-accent-teal/20 flex flex-col lg:flex-row gap-3 items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {/* City Filter */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[8px] font-bold text-accent-teal uppercase tracking-[0.2em] transition-all group-focus-within:text-accent-cyan opacity-60">City</label>
          <div className="flex items-center gap-3 w-full bg-black/40 border border-transparent rounded-sm p-4 pt-6 focus-within:bg-black/60 focus-within:border-accent-teal/40 transition-all">
            <MapPin className="w-4 h-4 text-accent-teal" />
            <select 
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="bg-transparent w-full text-[11px] font-bold text-white outline-none appearance-none uppercase tracking-wider"
            >
              <option value="" className="bg-surface-dark">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city} className="bg-surface-dark">{city}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-accent-teal" />
          </div>
        </div>

        {/* Sector Filter */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[8px] font-bold text-accent-teal uppercase tracking-[0.2em] transition-all group-focus-within:text-accent-cyan opacity-60">Sector</label>
          <div className="flex items-center gap-3 w-full bg-black/40 border border-transparent rounded-sm p-4 pt-6 focus-within:bg-black/60 focus-within:border-accent-teal/40 transition-all">
            <Building className="w-4 h-4 text-accent-teal" />
            <select 
              value={filters.sector}
              onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
              className="bg-transparent w-full text-[11px] font-bold text-white outline-none appearance-none uppercase tracking-wider"
            >
              <option value="" className="bg-surface-dark">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector} className="bg-surface-dark">{sector}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-accent-teal" />
          </div>
        </div>

        {/* BHK Filter */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[8px] font-bold text-accent-teal uppercase tracking-[0.2em] transition-all group-focus-within:text-accent-cyan opacity-60">BHK Type</label>
          <div className="flex items-center gap-3 w-full bg-black/40 border border-transparent rounded-sm p-4 pt-6 focus-within:bg-black/60 focus-within:border-accent-teal/40 transition-all">
            <Building className="w-4 h-4 text-accent-teal" />
            <select 
              value={filters.bhk}
              onChange={(e) => setFilters(prev => ({ ...prev, bhk: e.target.value }))}
              className="bg-transparent w-full text-[11px] font-bold text-white outline-none appearance-none uppercase tracking-wider"
            >
              <option value="" className="bg-surface-dark">Any BHK</option>
              <option value="1" className="bg-surface-dark">1 BHK</option>
              <option value="2" className="bg-surface-dark">2 BHK</option>
              <option value="3" className="bg-surface-dark">3 BHK</option>
              <option value="4" className="bg-surface-dark">4 BHK</option>
              <option value="5" className="bg-surface-dark">5+ BHK</option>
            </select>
            <ChevronDown className="w-3 h-3 text-accent-teal" />
          </div>
        </div>

        {/* Price Range */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[8px] font-bold text-accent-teal uppercase tracking-[0.2em] transition-all group-focus-within:text-accent-cyan opacity-60">Price (Max)</label>
          <div className="flex items-center gap-3 w-full bg-black/40 border border-transparent rounded-sm p-4 pt-6 focus-within:bg-black/60 focus-within:border-accent-teal/40 transition-all">
            <IndianRupee className="w-4 h-4 text-accent-teal" />
            <input 
              type="number" 
              placeholder="Budget"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="bg-transparent w-full text-[11px] font-bold text-white outline-none placeholder:text-accent-teal/30"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSearch}
        className="w-full lg:w-40 bg-accent-teal text-black h-full py-4 lg:py-0 px-8 rounded-sm flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest hover:bg-accent-cyan transition-all shrink-0 min-h-[64px] shadow-lg active:scale-95"
      >
        <Search className="w-4 h-4" />
        Execute
      </button>
    </div>
  );
}

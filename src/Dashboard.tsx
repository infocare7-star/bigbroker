import { useState, useEffect } from 'react';
import { useAuth } from './components/AuthContext';
import { db } from './lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Property } from './types';
import { PropertyCard } from './components/PropertyCard';
import Header from './components/Header';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ListIcon, Heart, Loader2, UserCircle } from 'lucide-react';
import { cn } from './lib/utils';

type Tab = 'listings' | 'shortlist';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (activeTab === 'listings') {
        fetchMyListings();
      } else {
        fetchShortlist();
      }
    }
  }, [user, activeTab]);

  const fetchMyListings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'properties'), where('ownerId', '==', user.uid));
      const snap = await getDocs(q);
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setData(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = collection(db, 'users', user.uid, 'favorites');
      const snap = await getDocs(q);
      const propertyIds = snap.docs.map(d => d.data().propertyId);
      
      const properties: Property[] = [];
      for (const id of propertyIds) {
        const d = await getDoc(doc(db, 'properties', id));
        if (d.exists()) {
          properties.push({ id: d.id, ...d.data() } as Property);
        }
      }
      setData(properties);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-accent-teal"><Loader2 className="animate-spin" /></div>;
  if (!user) return <div className="min-h-screen bg-bg-dark pt-32 text-center text-white uppercase font-bold tracking-widest">Unauthorized Access</div>;

  return (
    <div className="min-h-screen bg-bg-dark text-text-silver">
      <Header />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-accent-teal text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              <LayoutDashboard className="w-4 h-4" />
              Command Center
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-white uppercase">
              Agent <span className="font-bold underline decoration-accent-teal/20">Dashboard</span>
            </h1>
          </div>

          <div className="flex gap-1 bg-surface-dark p-1 border border-accent-teal/10 rounded-sm">
            <button
              onClick={() => setActiveTab('listings')}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-2",
                activeTab === 'listings' ? "bg-accent-teal text-black shadow-lg" : "text-text-silver/60 hover:text-white"
              )}
            >
              <ListIcon className="w-3.5 h-3.5" />
              My Listings
            </button>
            <button
              onClick={() => setActiveTab('shortlist')}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-2",
                activeTab === 'shortlist' ? "bg-accent-teal text-black shadow-lg" : "text-text-silver/60 hover:text-white"
              )}
            >
              <Heart className="w-3.5 h-3.5" />
              Shortlist
            </button>
          </div>
        </div>

        <div className="bg-surface-dark/30 border border-accent-teal/5 p-8 rounded-sm mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-surface-dark border border-accent-teal/20 rounded-full flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-accent-teal opacity-40" />
              )}
            </div>
            <div>
              <p className="text-white text-xl font-bold uppercase tracking-tight">{user.displayName || 'Associate Agent'}</p>
              <p className="text-[10px] text-accent-teal font-bold uppercase tracking-widest opacity-60">{user.email}</p>
              <div className="mt-2 flex gap-4">
                <div className="flex flex-col">
                   <span className="text-[8px] text-text-silver/40 uppercase font-bold tracking-widest">Clearance</span>
                   <span className="text-[10px] text-accent-cyan font-bold uppercase">Level 4 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-accent-teal gap-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Polling Database Cluster...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-accent-teal/20 rounded-sm">
            <p className="text-text-silver/40 text-[10px] font-bold uppercase tracking-[0.4em]">No Assets Found in This Sector</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {data.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

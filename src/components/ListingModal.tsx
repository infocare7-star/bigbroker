import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2, IndianRupee, MapPin, Building, Info } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ListingModal({ isOpen, onClose, onSuccess }: ListingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    bhk: '1',
    city: '',
    sector: '',
    location: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'properties'), {
        title: formData.title,
        price: Number(formData.price),
        bhk: Number(formData.bhk),
        city: formData.city,
        sector: formData.sector,
        location: formData.location,
        description: formData.description,
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface-dark border border-accent-teal/30 rounded-sm shadow-2xl p-8 overflow-y-auto max-h-[90vh]"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-text-silver/40 hover:text-accent-cyan transition-colors">
              <X className="w-6 h-6" />
            </button>

            <header className="mb-8">
              <div className="flex items-center gap-2 text-accent-teal text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                <Upload className="w-4 h-4" />
                Asset Deployment
              </div>
              <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">New Acquisition Listing</h2>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">Property Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 text-white text-xs outline-none focus:border-accent-cyan transition-colors"
                    placeholder="e.g. The Zenith Heights"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">Valuation (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-accent-teal" />
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                      className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-accent-cyan transition-colors"
                      placeholder="Pricing"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                 <div className="space-y-2">
                  <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">BHK</label>
                  <select
                    value={formData.bhk}
                    onChange={e => setFormData(p => ({ ...p, bhk: e.target.value }))}
                    className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 text-white text-xs outline-none focus:border-accent-cyan transition-colors appearance-none"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 text-white text-xs outline-none focus:border-accent-cyan transition-colors"
                    placeholder="City Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">Sector</label>
                  <input
                    required
                    type="text"
                    value={formData.sector}
                    onChange={e => setFormData(p => ({ ...p, sector: e.target.value }))}
                    className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 text-white text-xs outline-none focus:border-accent-cyan transition-colors"
                    placeholder="Sector ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">Full Address / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-accent-teal" />
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-accent-cyan transition-colors"
                    placeholder="Physical Location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">Visual Identity (Image URL)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 text-white text-xs outline-none focus:border-accent-cyan transition-colors"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent-teal uppercase tracking-widest opacity-60">Strategic Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-black/40 border border-accent-teal/20 rounded-sm p-3 text-white text-xs outline-none focus:border-accent-cyan transition-colors resize-none"
                  placeholder="Detailed property highlights..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-text-silver border border-surface-dark rounded-sm hover:bg-surface-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-accent-teal text-black py-4 rounded-sm text-[10px] font-extrabold uppercase tracking-widest hover:bg-accent-cyan transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Deployment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BedDouble, MapPin, ArrowRight, Heart, Trash2 } from 'lucide-react';
import { Property } from '../types';
import { cn, formatPrice } from '../lib/utils';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot, query, where } from 'firebase/firestore';

interface PropertyCardProps {
  property: Property;
  index: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const isOwner = user && property.ownerId === user.uid;

  useEffect(() => {
    if (!user) {
      setIsFavorited(false);
      return;
    }

    const unsub = onSnapshot(
      query(collection(db, 'users', user.uid, 'favorites'), where('propertyId', '==', property.id)),
      (snap) => {
        setIsFavorited(!snap.empty);
      }
    );
    return unsub;
  }, [user, property.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const favRef = doc(db, 'users', user.uid, 'favorites', property.id);
    if (isFavorited) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        propertyId: property.id,
        createdAt: new Date().toISOString()
      });
    }
  };

  const deleteProperty = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Neutralize this asset listing?')) return;
    try {
      await deleteDoc(doc(db, 'properties', property.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-theme group flex flex-col overflow-hidden relative"
    >
      <div className="aspect-[16/10] overflow-hidden relative img-placeholder-theme">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.3] group-hover:grayscale-0 brightness-[0.9]"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {user && (
            <button 
              onClick={toggleFavorite}
              className={cn(
                "p-2 rounded-sm backdrop-blur-md border transition-all",
                isFavorited 
                  ? "bg-accent-teal/80 border-accent-cyan text-black" 
                  : "bg-black/40 border-accent-teal/20 text-white hover:border-accent-cyan/50"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
            </button>
          )}
          <div className="bg-accent-cyan/20 backdrop-blur-md px-2 py-1 rounded-sm text-[10px] font-bold text-accent-cyan border border-accent-cyan/30 uppercase tracking-tighter flex items-center">
            Available
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-accent-cyan transition-colors uppercase tracking-tight">
            {property.title}
          </h3>
          {isOwner && (
            <button 
              onClick={deleteProperty}
              className="p-1 px-1.5 text-red-400 hover:bg-red-950/30 rounded-sm transition-colors flex items-center gap-1 text-[7px] md:text-[9px] font-bold uppercase border border-red-950"
            >
              <Trash2 className="w-2.5 h-2.5 md:w-3 h-3" />
              Kill
            </button>
          )}
        </div>
        
        <p className="text-[8px] md:text-[10px] uppercase font-bold text-accent-teal/60 tracking-[0.1em] md:tracking-[0.15em] mb-2 md:mb-4">
          {property.sector}, {property.city}
        </p>

        <p className="hidden md:block text-text-silver text-xs leading-relaxed line-clamp-2 mb-6 h-10 font-light opacity-80">
          {property.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 md:pt-4 border-t border-accent-teal/10">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] md:text-[10px] uppercase font-bold text-accent-teal/40 tracking-widest">Pricing</span>
            <span className="text-sm md:text-xl font-light price-tag tracking-tighter text-accent-teal">
              {formatPrice(property.price)}
            </span>
          </div>
          <div className="text-right hidden sm:block">
             <span className="text-[10px] uppercase font-bold text-accent-teal/40 tracking-widest block mb-0.5">Config</span>
             <span className="text-xs font-bold text-white uppercase">{property.bhk} BHK</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

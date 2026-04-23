import { Home, Search, Plus, Heart, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { cn } from '../lib/utils';
import { useState } from 'react';
import ListingModal from './ListingModal';

export default function BottomNav() {
  const location = useLocation();
  const { user, signInWithGoogle } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Plus, label: 'Sell', action: () => user ? setIsModalOpen(true) : signInWithGoogle() },
    { icon: Heart, label: 'Shortlist', path: '/dashboard', action: !user ? signInWithGoogle : undefined },
    { icon: UserCircle, label: 'Profile', path: '/dashboard', action: !user ? signInWithGoogle : undefined },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-black/95 backdrop-blur-xl border-t border-surface-dark pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const content = (
              <div className={cn(
                "flex flex-col items-center gap-1 min-w-[56px] transition-all",
                isActive ? "text-accent-cyan" : "text-text-silver/40"
              )}>
                <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(102,252,241,0.5)]")} />
                <span className="text-[8px] font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
            );

            if (item.action && (!item.path || !user)) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center gap-1 min-w-[56px]"
                >
                  {item.label === 'Sell' ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 bg-accent-teal text-black rounded-full shadow-[0_0_15px_rgba(102,252,241,0.3)]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-accent-cyan">
                        {item.label}
                      </span>
                    </div>
                  ) : content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path!}
                className="no-underline"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      <ListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </>
  );
}

import React, { useState } from 'react';
import { Paintbrush, Phone, MessageSquare, Menu, X, ShieldCheck, Calculator, Palette, Sparkles, Image as ImageIcon, LayoutDashboard } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/paintData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'rates', label: 'Paint Rates', icon: ShieldCheck },
    { id: 'estimator', label: 'Cost Estimator', icon: Calculator },
    { id: 'visualizer', label: 'Color Visualizer', icon: Palette },
    { id: 'ai-consultant', label: 'AI Color Advisor', icon: Sparkles, badge: 'AI' },
    { id: 'gallery', label: 'Portfolio', icon: ImageIcon },
    { id: 'admin', label: 'Admin Portal', icon: LayoutDashboard },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Mansuri Paints! I would like to inquire about painting rates and site inspection.')}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('rates')}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Paintbrush className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1">
                MANSURI<span className="text-indigo-600">PAINTS</span>
              </span>
              <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">
                Royal, Plastic & Distemper Specialists
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 font-semibold text-slate-600">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-sm'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full uppercase tracking-wider shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-semibold px-3 py-2 rounded-full border border-slate-200 hover:border-indigo-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{COMPANY_DETAILS.whatsappDisplay}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-md shadow-emerald-100"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
            >
              Book Estimate
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-emerald-600 rounded-full text-white"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-indigo-600 rounded-xl bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-black bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-indigo-600 text-white font-black rounded-full text-sm shadow-lg shadow-indigo-200"
            >
              Book Free Site Inspection
            </button>
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-full text-xs"
            >
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>Call {COMPANY_DETAILS.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

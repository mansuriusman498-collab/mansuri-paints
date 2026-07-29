import React from 'react';
import { Calculator, CheckCircle2, MessageSquare, ShieldCheck, Sparkles, Star, ArrowRight, Phone } from 'lucide-react';
import { COMPANY_DETAILS, DEFAULT_PAINT_TYPES } from '../data/paintData';

interface HeroProps {
  onGoToEstimator: () => void;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGoToEstimator, onOpenBooking }) => {
  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Mansuri Paints! I need a painting quotation for my house.')}`;

  return (
    <div className="relative bg-slate-50 text-slate-900 overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-100">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full font-bold text-xs tracking-wider uppercase shadow-xs">
              ★ Expert Finishing & Transparent Rates
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Your space, <br />
              <span className="text-indigo-600 italic">reimagined</span> in <br />
              full color.
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 text-base sm:text-xl max-w-xl leading-relaxed">
              Premium interior & exterior painting services by <strong className="text-slate-900">Mansuri Paints</strong>. Professional, dust-free, and vibrant results every time.
            </p>

            {/* Quick Price Cards Grid */}
            <div className="pt-2 grid grid-cols-3 gap-3 max-w-xl">
              {DEFAULT_PAINT_TYPES.slice(0, 3).map((paint, idx) => {
                const colorBorders = [
                  'border-rose-200 text-rose-600 bg-rose-50/50',
                  'border-indigo-200 text-indigo-600 bg-indigo-50/50',
                  'border-teal-200 text-teal-600 bg-teal-50/50',
                ];
                return (
                  <div 
                    key={paint.id}
                    className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${colorBorders[idx % colorBorders.length]}`}
                  >
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      {paint.name}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      ₹{paint.ratePerSqFt} <span className="text-[10px] font-semibold text-slate-500">/sq ft</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5 line-clamp-1">
                      {paint.finishType}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Key Features Stats Cards */}
            <div className="flex gap-4 max-w-xl pt-2">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex-1">
                <div className="text-3xl font-black text-rose-500 italic">1,450+</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Homes Painted</div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex-1">
                <div className="text-3xl font-black text-teal-500 italic">100%</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Genuine Material</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                onClick={onGoToEstimator}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base px-8 py-4 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
              >
                <Calculator className="w-5 h-5" />
                <span>Get an Estimate</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-4 rounded-full shadow-md shadow-emerald-100 transition-all hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 fill-white/20" />
                <span>WhatsApp Quote</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm px-6 py-4 rounded-full shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>Free Site Inspection</span>
              </button>
            </div>

          </div>

          {/* Right Visual Container */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl bg-white p-2">
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="/src/assets/images/hero_luxury_interior_1785313196743.jpg"
                  alt="Mansuri Paints Royal Interior Showcase"
                  className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-100 shadow-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">100% Dust-Free Execution</span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">
                        Featured Finish
                      </span>
                      <h3 className="text-base font-black text-slate-900">
                        Royal Silk Paint (₹27 / sq ft)
                      </h3>
                      <p className="text-xs text-slate-600">
                        Smooth sheen, washable, anti-fungal luxury interior
                      </p>
                    </div>
                    <button
                      onClick={onGoToEstimator}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-extrabold text-xs shadow-md shadow-indigo-200"
                    >
                      Estimate
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

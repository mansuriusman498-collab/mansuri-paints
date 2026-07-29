import React from 'react';
import { PaintTypeOption } from '../types';
import { Check, ShieldAlert, Sparkles, Droplets, Clock, Layers, ArrowUpRight } from 'lucide-react';

interface PaintRateCardProps {
  rates: PaintTypeOption[];
  onSelectForEstimate: (paint: PaintTypeOption) => void;
  onOpenBooking: () => void;
}

export const PaintRateCard: React.FC<PaintRateCardProps> = ({ rates, onSelectForEstimate, onOpenBooking }) => {
  return (
    <section className="py-16 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Transparent Rates & Guaranteed Materials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our Paint Finishes & Per Sq. Ft. Rates
          </h2>
          <p className="text-slate-600 text-base">
            No hidden charges. Rates include full wall surface preparation, sanding, double-coat application, and post-job dust-free cleaning.
          </p>
        </div>

        {/* Paint Finishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rates.map((paint) => {
            const isRoyal = paint.id === 'royal';
            return (
              <div
                key={paint.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 bg-white border ${
                  isRoyal
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-xl shadow-indigo-100/50'
                    : 'border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl'
                }`}
              >
                {/* Badge if present */}
                {paint.badge && (
                  <div className="absolute -top-3.5 right-6 bg-rose-500 text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-full shadow-md tracking-wider">
                    {paint.badge}
                  </div>
                )}

                <div>
                  {/* Top Paint Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        {paint.name}
                      </h3>
                      <p className="text-xs text-indigo-600 font-bold mt-0.5 uppercase tracking-wider">
                        {paint.finishType}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-600">
                        ₹{paint.ratePerSqFt}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold">
                        per sq ft
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                    {paint.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" /> Durability
                      </span>
                      <span className="font-bold text-slate-900">{paint.durabilityYears}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Droplets className="w-3.5 h-3.5 text-teal-500" /> Washability
                      </span>
                      <span className="font-bold text-slate-900">{paint.washability}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
                        <Layers className="w-3.5 h-3.5 text-amber-500" /> Ideal For
                      </span>
                      <span className="font-bold text-slate-900 text-right">{paint.popularFor}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => onSelectForEstimate(paint)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-black transition-all ${
                      isRoyal
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                    }`}
                  >
                    <span>Estimate {paint.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Material Guarantee Banner */}
        <div className="mt-14 bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-white">100% Factory-Sealed Material Guarantee</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                We open factory-sealed Asian Paints, Berger & Nerolac cans in front of you on day 1 of the project. Zero compromise on quality.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="shrink-0 bg-white hover:bg-amber-400 text-slate-900 font-black text-xs px-8 py-4 rounded-full shadow-lg transition-colors"
          >
            Schedule Free Measurement Visit
          </button>
        </div>

      </div>
    </section>
  );
};

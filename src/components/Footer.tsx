import React, { useState } from 'react';
import { COMPANY_DETAILS, DEFAULT_PAINT_TYPES } from '../data/paintData';
import { Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Paintbrush, Smartphone, ChevronRight, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [androidGuideOpen, setAndroidGuideOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Mansuri Paints! I would like to book a site measurement inspection.')}`;

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Top Value Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% Genuine Cans</h5>
              <p className="text-[11px] text-slate-400">Sealed Asian Paints & Berger</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">On-Time Guarantee</h5>
              <p className="text-[11px] text-slate-400">Strict project completion timelines</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">WhatsApp Support</h5>
              <p className="text-[11px] text-slate-400">{COMPANY_DETAILS.whatsappDisplay}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Instant Quotation</h5>
              <p className="text-[11px] text-slate-400">Download PDF & book online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Col 1: Brand */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Paintbrush className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              MANSURI <span className="text-amber-400">PAINTS</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Professional interior & exterior painting services with per-sq-ft pricing, laser site measurement, and dust-free execution.
          </p>

          <div className="pt-2 space-y-2 text-slate-300">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>WhatsApp / Phone: <strong className="text-white">{COMPANY_DETAILS.whatsappDisplay}</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Email: <strong className="text-white">{COMPANY_DETAILS.email}</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{COMPANY_DETAILS.address}</span>
            </p>
          </div>
        </div>

        {/* Col 2: Per Sq Ft Rates Quick Reference */}
        <div className="md:col-span-4 space-y-3">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">
            Official Per Sq Ft Rates
          </h5>
          <ul className="space-y-2 text-slate-300">
            {DEFAULT_PAINT_TYPES.map((paint) => (
              <li key={paint.id} className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>{paint.name}</span>
                <strong className="text-amber-400">₹{paint.ratePerSqFt} / sq ft</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Android APK Conversion Instructions */}
        <div className="md:col-span-3 space-y-3">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">
            Mobile App & Export
          </h5>
          <p className="text-slate-400">
            This prototype is built with React & Tailwind. You can convert it into an Android APK app.
          </p>
          <button
            onClick={() => setAndroidGuideOpen(true)}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Android APK Build Guide</span>
          </button>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="border-t border-slate-900 py-6 text-center text-slate-500 text-[11px]">
        © {new Date().getFullYear()} Mansuri Paints. All Rights Reserved. Designed for premium home painting in India.
      </div>

      {/* Android Guide Modal */}
      {androidGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span>How to Convert to Android App (APK)</span>
              </h4>
              <button onClick={() => setAndroidGuideOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>Follow these 4 simple steps to convert this source code into a native Android App:</p>
              
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong className="text-white">Export Source Code:</strong> Click the Download ZIP option in AI Studio settings or export to GitHub.</li>
                <li><strong className="text-white">Wrap with Capacitor / React Native / Expo:</strong> Run <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">npx cap init MansuriPaints com.mansuri.paints</code> or use Expo web wrapper.</li>
                <li><strong className="text-white">Connect Firebase:</strong> Integrate Firebase Authentication & Firestore for multi-user booking persistence.</li>
                <li><strong className="text-white">Add Razorpay Payment Gateway:</strong> Add Razorpay SDK to accept booking token payments.</li>
                <li><strong className="text-white">Build APK:</strong> Open Android Studio, select <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">Build &gt; Build APK(s)</code>.</li>
              </ol>
            </div>

            <button
              onClick={() => setAndroidGuideOpen(false)}
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </footer>
  );
};

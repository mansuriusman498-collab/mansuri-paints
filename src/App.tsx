import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PaintRateCard } from './components/PaintRateCard';
import { Estimator } from './components/Estimator';
import { ColorVisualizer } from './components/ColorVisualizer';
import { AiColorConsultant } from './components/AiColorConsultant';
import { Gallery } from './components/Gallery';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { DEFAULT_PAINT_TYPES, COMPANY_DETAILS } from './data/paintData';
import { PaintTypeOption, EstimateSummary, ColorSwatch, AiColorRecommendation } from './types';
import { MessageSquare, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('rates');
  const [rates, setRates] = useState<PaintTypeOption[]>(DEFAULT_PAINT_TYPES);
  const [selectedPaintForEstimate, setSelectedPaintForEstimate] = useState<PaintTypeOption>(
    DEFAULT_PAINT_TYPES[0]
  );

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [attachedEstimate, setAttachedEstimate] = useState<EstimateSummary | null>(null);

  // Fetch live rates from server API on mount
  useEffect(() => {
    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRates(data);
          setSelectedPaintForEstimate(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load live rates:', err));
  }, []);

  const handleSelectPaintForEstimate = (paint: PaintTypeOption) => {
    setSelectedPaintForEstimate(paint);
    setActiveTab('estimator');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleOpenBookingWithEstimate = (summary: EstimateSummary) => {
    setAttachedEstimate(summary);
    setBookingModalOpen(true);
  };

  const handleApplyColorFromVisualizer = (swatch: ColorSwatch, finish: PaintTypeOption) => {
    setSelectedPaintForEstimate(finish);
    setActiveTab('estimator');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleApplyAiRecommendation = (rec: AiColorRecommendation) => {
    setActiveTab('visualizer');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const whatsappFloatingUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Mansuri Paints! I need a painting estimate and free site inspection.')}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white antialiased">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => {
          setAttachedEstimate(null);
          setBookingModalOpen(true);
        }}
      />

      {/* Main Content Areas */}
      <main>
        {/* Always display Hero on Rates tab, or top banner */}
        {activeTab === 'rates' && (
          <Hero
            onGoToEstimator={() => setActiveTab('estimator')}
            onOpenBooking={() => {
              setAttachedEstimate(null);
              setBookingModalOpen(true);
            }}
          />
        )}

        {/* Tab 1: Paint Finishes & Per Sq Ft Rates */}
        {activeTab === 'rates' && (
          <PaintRateCard
            rates={rates}
            onSelectForEstimate={handleSelectPaintForEstimate}
            onOpenBooking={() => {
              setAttachedEstimate(null);
              setBookingModalOpen(true);
            }}
          />
        )}

        {/* Tab 2: Instant Cost Estimator Calculator */}
        {activeTab === 'estimator' && (
          <Estimator
            rates={rates}
            selectedPaintFromParent={selectedPaintForEstimate}
            onOpenBookingWithEstimate={handleOpenBookingWithEstimate}
          />
        )}

        {/* Tab 3: Interactive Color Visualizer */}
        {activeTab === 'visualizer' && (
          <ColorVisualizer
            onSelectColorForEstimate={handleApplyColorFromVisualizer}
          />
        )}

        {/* Tab 4: AI Color Advisor (Gemini API) */}
        {activeTab === 'ai-consultant' && (
          <AiColorConsultant
            onApplyRecommendation={handleApplyAiRecommendation}
          />
        )}

        {/* Tab 5: Portfolio / Gallery */}
        {activeTab === 'gallery' && (
          <Gallery
            onOpenBooking={() => {
              setAttachedEstimate(null);
              setBookingModalOpen(true);
            }}
          />
        )}

        {/* Tab 6: Admin Dashboard */}
        {activeTab === 'admin' && (
          <AdminDashboard
            rates={rates}
            onUpdateRates={(updated) => setRates(updated)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={whatsappFloatingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-900/50 flex items-center justify-center transition-all hover:scale-110 group border border-emerald-400/30"
        aria-label="WhatsApp Us Directly"
      >
        <MessageSquare className="w-6 h-6 fill-white/20" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          WhatsApp Mansuri Paints
        </span>
      </a>

      {/* Service Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        attachedEstimate={attachedEstimate}
      />

    </div>
  );
}

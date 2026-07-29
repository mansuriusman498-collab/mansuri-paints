import React, { useState } from 'react';
import { X, Calendar, Phone, MessageSquare, MapPin, ShieldCheck, CheckCircle2, Building, Send } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/paintData';
import { EstimateSummary, BookingData } from '../types';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachedEstimate?: EstimateSummary | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  attachedEstimate,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Central City');
  const [propertyType, setPropertyType] = useState<BookingData['propertyType']>('2 BHK');
  const [preferredStartDate, setPreferredStartDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  if (!isOpen) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Partial<BookingData> = {
      customerName,
      phoneNumber,
      whatsappNumber: whatsappNumber || phoneNumber,
      address,
      city,
      propertyType,
      wallAreaSqFt: attachedEstimate ? attachedEstimate.wallAreaSqFt : 1850,
      selectedPaintType: attachedEstimate ? attachedEstimate.paintType.id : 'royal',
      preferredStartDate,
      notes,
      estimatedCost: attachedEstimate ? attachedEstimate.totalEstimatedCost : undefined,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.booking);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to submit booking:', err);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Preformatted Link
  const buildWhatsappLink = () => {
    const text = `*NEW FREE SITE INSPECTION BOOKING - MANSURI PAINTS*
----------------------------------------
*Name:* ${customerName || 'Client'}
*Phone:* ${phoneNumber}
*Address:* ${address}, ${city}
*Property:* ${propertyType}
*Preferred Start Date:* ${preferredStartDate}
*Estimated Wall Area:* ${attachedEstimate ? attachedEstimate.wallAreaSqFt : '1800'} sq ft
*Estimated Total:* Rs ${attachedEstimate ? attachedEstimate.totalEstimatedCost.toLocaleString() : 'N/A'}
----------------------------------------
*Notes:* ${notes || 'Standard measurement check'}
Please confirm my site visit!`;
    return `https://wa.me/${COMPANY_DETAILS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              Free Site Measurement
            </span>
            <h3 className="text-xl font-black text-slate-900">Book Mansuri Paints Visit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Booking Confirmed!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                Your free site inspection request <span className="text-indigo-600 font-black">{confirmedBooking.id}</span> has been logged. Our senior paint master will call you within 30 minutes.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto text-slate-700 font-medium">
                <div><strong className="text-slate-900 font-black">Name:</strong> {confirmedBooking.customerName}</div>
                <div><strong className="text-slate-900 font-black">Phone:</strong> {confirmedBooking.phoneNumber}</div>
                <div><strong className="text-slate-900 font-black">Address:</strong> {confirmedBooking.address}</div>
                <div><strong className="text-slate-900 font-black">Inspection Date:</strong> {confirmedBooking.preferredStartDate}</div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-full text-xs transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              
              {attachedEstimate && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 flex items-center justify-between font-medium">
                  <span>Attached Estimate: <strong className="font-black text-indigo-950">{attachedEstimate.paintType.name}</strong></span>
                  <strong className="text-indigo-600 font-black text-sm">Rs {attachedEstimate.totalEstimatedCost.toLocaleString()}</strong>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Usman Mansuri"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 block mb-1">Property Size</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="1 BHK">1 BHK Apartment</option>
                    <option value="2 BHK">2 BHK Apartment</option>
                    <option value="3 BHK">3 BHK Apartment</option>
                    <option value="4+ BHK / Villa">4+ BHK / Villa</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Custom Area">Custom Wall Area</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 block mb-1">Preferred Visit Date</label>
                  <input
                    type="date"
                    required
                    value={preferredStartDate}
                    onChange={(e) => setPreferredStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 block mb-1">Site Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat/House No, Building Name, Landmark, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 block mb-1">Special Notes / Requirements</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Living room needs Royal Silk paint with gold stencil accent wall..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-full text-xs shadow-md shadow-indigo-200 transition-all"
                >
                  {loading ? 'Submitting...' : 'Confirm Free Measurement Visit'}
                </button>

                <a
                  href={buildWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

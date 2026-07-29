import React, { useState, useEffect } from 'react';
import { PaintTypeOption, BookingData } from '../types';
import { LayoutDashboard, Save, RefreshCw, Download, CheckCircle2, Clock, Filter, Phone, MapPin, IndianRupee, Layers } from 'lucide-react';

interface AdminDashboardProps {
  rates: PaintTypeOption[];
  onUpdateRates: (updatedRates: PaintTypeOption[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ rates, onUpdateRates }) => {
  const [editableRates, setEditableRates] = useState<PaintTypeOption[]>(rates);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    setEditableRates(rates);
    fetchBookings();
  }, [rates]);

  const handleRateChange = (id: string, newRate: number) => {
    setEditableRates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ratePerSqFt: newRate } : item))
    );
  };

  const handleSaveRates = async () => {
    try {
      const res = await fetch('/api/rates/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedRates: editableRates }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateRates(editableRates);
        setSaveSuccessMsg('Paint rates saved live!');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save rates:', err);
    }
  };

  const handleStatusUpdate = async (id: string, status: BookingData['status']) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredBookings = bookings.filter(
    (b) => statusFilter === 'All' || b.status === statusFilter
  );

  const totalJobEstimateSum = bookings.reduce(
    (acc, curr) => acc + (curr.estimatedCost || 0),
    0
  );

  const exportLeadsCSV = () => {
    const headers = 'ID,Name,Phone,Address,Property,PaintType,EstimatedCost,Status,Date\n';
    const rows = bookings
      .map(
        (b) =>
          `"${b.id}","${b.customerName}","${b.phoneNumber}","${b.address}","${b.propertyType}","${b.selectedPaintType}","${b.estimatedCost || 0}","${b.status}","${b.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mansuri_Paints_Leads_${Date.now()}.csv`;
    a.click();
  };

  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider mb-2">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Control Panel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Mansuri Paints Management</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage live per-sq-ft rates, site inspection leads, and customer quotations.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportLeadsCSV}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-full border border-slate-200 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchBookings}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Summary Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <span className="text-xs text-slate-500 font-bold">Total Site Inquiries</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{bookings.length}</div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <span className="text-xs text-slate-500 font-bold">Total Pipeline Value</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">₹{totalJobEstimateSum.toLocaleString()}</div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <span className="text-xs text-slate-500 font-bold">New Inspection Leads</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              {bookings.filter((b) => b.status === 'New').length}
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <span className="text-xs text-slate-500 font-bold">Completed Projects</span>
            <div className="text-3xl font-black text-rose-500 mt-1">
              {bookings.filter((b) => b.status === 'Completed').length}
            </div>
          </div>
        </div>

        {/* Section 1: Live Rate Manager */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-indigo-600" />
                <span>Live Per-Sq-Ft Rate Manager</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Updates will immediately apply to the public Instant Cost Calculator.</p>
            </div>
            <button
              onClick={handleSaveRates}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Live Rates</span>
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black rounded-2xl text-center">
              {saveSuccessMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {editableRates.map((paint) => (
              <div key={paint.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-900">{paint.name}</span>
                  <span className="text-[10px] font-semibold text-slate-500">{paint.finishType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Rate (₹/sq ft):</span>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={paint.ratePerSqFt}
                    onChange={(e) => handleRateChange(paint.id, Number(e.target.value))}
                    className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-1 text-sm font-black text-indigo-600 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Customer Bookings & Inquiries */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Site Inspection Leads & Inquiries</span>
              </h3>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-slate-900 text-xs font-bold"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Site Inspection Scheduled">Inspection Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Bookings Table / Cards */}
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center font-medium">No bookings found matching filter.</p>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-indigo-600">{b.id}</span>
                      <h4 className="text-sm font-black text-slate-900">{b.customerName}</h4>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                        {b.propertyType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium flex items-center gap-3">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {b.phoneNumber}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {b.address}</span>
                    </p>

                    {b.notes && <p className="text-[11px] text-slate-600 italic">"{b.notes}"</p>}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-indigo-600 font-black text-sm block">
                        ₹{(b.estimatedCost || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Date: {b.preferredStartDate}
                      </span>
                    </div>

                    <select
                      value={b.status}
                      onChange={(e) => handleStatusUpdate(b.id!, e.target.value as any)}
                      className="bg-white border border-slate-200 text-slate-900 rounded-full px-3 py-1.5 text-xs font-bold"
                    >
                      <option value="New">New</option>
                      <option value="Site Inspection Scheduled">Inspection Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

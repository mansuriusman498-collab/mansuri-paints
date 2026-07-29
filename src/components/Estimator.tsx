import React, { useState, useMemo } from 'react';
import { PaintTypeOption, EstimateSummary } from '../types';
import { HOUSE_PRESETS, ADD_ON_SERVICES, DEFAULT_PAINT_TYPES, COMPANY_DETAILS } from '../data/paintData';
import { Calculator, Download, MessageSquare, Check, Sparkles, Percent, Calendar, ShieldCheck, ArrowRight, HelpCircle, TrendingDown } from 'lucide-react';
import { generateQuotationPDF } from '../utils/quotationGenerator';
import confetti from 'canvas-confetti';

interface EstimatorProps {
  rates: PaintTypeOption[];
  selectedPaintFromParent?: PaintTypeOption;
  onOpenBookingWithEstimate: (summary: EstimateSummary) => void;
}

export const Estimator: React.FC<EstimatorProps> = ({
  rates = DEFAULT_PAINT_TYPES,
  selectedPaintFromParent,
  onOpenBookingWithEstimate,
}) => {
  // Preset or custom state
  const [activePresetId, setActivePresetId] = useState<string>('2bhk');
  const [wallAreaSqFt, setWallAreaSqFt] = useState<number>(1850);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(750);

  // Custom wall dimensions wizard state
  const [useDimensionWizard, setUseDimensionWizard] = useState<boolean>(false);
  const [roomCount, setRoomCount] = useState<number>(3);
  const [avgRoomWidth, setAvgRoomWidth] = useState<number>(12);
  const [avgRoomLength, setAvgRoomLength] = useState<number>(14);
  const [avgWallHeight, setAvgWallHeight] = useState<number>(10);

  // Paint Finish Selection
  const [selectedPaint, setSelectedPaint] = useState<PaintTypeOption>(
    selectedPaintFromParent || rates[0]
  );

  // Add-ons
  const [puttyPrimerSelected, setPuttyPrimerSelected] = useState<boolean>(true);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['ceiling_paint']);

  // Volume / Square Footage Discount Configuration
  const [volumeThresholdSqFt, setVolumeThresholdSqFt] = useState<number>(1000);

  // Promo Discount Code
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');

  // Customer Details for PDF
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Handle Preset Select
  const handlePresetSelect = (presetId: string) => {
    setActivePresetId(presetId);
    setUseDimensionWizard(false);
    const preset = HOUSE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setWallAreaSqFt(preset.approxWallAreaSqFt);
      setCarpetAreaSqFt(preset.approxCarpetAreaSqFt);
    }
  };

  // Recalculate if dimension wizard used
  const calculatedWizardArea = useMemo(() => {
    if (!useDimensionWizard) return wallAreaSqFt;
    // Perimeter = 2 * (L + W) * Height * Room Count
    const wallArea = 2 * (avgRoomLength + avgRoomWidth) * avgWallHeight * roomCount;
    return Math.max(100, Math.round(wallArea));
  }, [useDimensionWizard, roomCount, avgRoomLength, avgRoomWidth, avgWallHeight, wallAreaSqFt]);

  const effectiveWallArea = useDimensionWizard ? calculatedWizardArea : wallAreaSqFt;

  // Toggle Addon
  const toggleAddOn = (addonId: string) => {
    if (selectedAddOnIds.includes(addonId)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, addonId]);
    }
  };

  // Apply Discount Coupon
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'MANSURI10' || code === 'FIRST10' || code === 'WELCOME10') {
      setAppliedDiscountPercent(10);
      setCouponMessage('10% Festival Offer Discount Applied!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else if (code === 'MANSURI15' || code === 'ROYAL15') {
      setAppliedDiscountPercent(15);
      setCouponMessage('15% Royal Painting Offer Discount Applied!');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    } else {
      setCouponMessage('Invalid Coupon Code. Try MANSURI10');
    }
  };

  // Main Summary Calculation with Volume Discount
  const estimateSummary: EstimateSummary = useMemo(() => {
    const paintCost = effectiveWallArea * selectedPaint.ratePerSqFt;
    const puttyPrimerCost = puttyPrimerSelected ? effectiveWallArea * 8 : 0;

    const selectedAddOns = selectedAddOnIds.map((id) => {
      const addon = ADD_ON_SERVICES.find((a) => a.id === id);
      if (!addon) return { id, name: 'Addon', cost: 0 };
      if (addon.unit === 'sqft') {
        return { id, name: addon.name, cost: Math.round(effectiveWallArea * addon.rate) };
      }
      return { id, name: addon.name, cost: addon.rate };
    });

    const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.cost, 0);
    const subtotal = paintCost + puttyPrimerCost + addOnsTotal;

    // 5% Volume discount applied if effectiveWallArea >= volumeThresholdSqFt
    const isVolumeQualified = effectiveWallArea >= volumeThresholdSqFt;
    const volumeDiscountPercentage = isVolumeQualified ? 5 : 0;
    const volumeDiscountAmount = Math.round((subtotal * volumeDiscountPercentage) / 100);

    const couponDiscountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);

    const discountAmount = volumeDiscountAmount + couponDiscountAmount;
    const discountPercentage = subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;

    const totalEstimatedCost = Math.max(0, subtotal - discountAmount);

    // Estimate Days calculation (approx 350 sq ft per day for 2 painters)
    const estimatedDays = Math.max(2, Math.ceil(effectiveWallArea / 400));

    return {
      carpetAreaSqFt,
      wallAreaSqFt: effectiveWallArea,
      paintType: selectedPaint,
      puttyPrimerSelected,
      puttyPrimerCost,
      paintCost,
      selectedAddOns,
      addOnsTotal,
      labourIncludedCost: 0, // Labour included in per sq ft rates
      subtotal,
      discountPercentage,
      discountAmount,
      volumeDiscountPercentage,
      volumeDiscountAmount,
      couponDiscountPercentage: appliedDiscountPercent,
      couponDiscountAmount,
      volumeThresholdSqFt,
      totalEstimatedCost,
      estimatedDays,
    };
  }, [
    effectiveWallArea,
    carpetAreaSqFt,
    selectedPaint,
    puttyPrimerSelected,
    selectedAddOnIds,
    appliedDiscountPercent,
    volumeThresholdSqFt,
  ]);

  // Handle Download PDF
  const handleDownloadPDF = () => {
    const name = customerName.trim() || 'Valued Customer';
    const presetObj = HOUSE_PRESETS.find((p) => p.id === activePresetId);
    const propLabel = presetObj ? presetObj.name : `${effectiveWallArea} sq. ft. Custom Area`;
    generateQuotationPDF(estimateSummary, name, propLabel, customerPhone);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // WhatsApp Link Builder
  const whatsappBookingUrl = useMemo(() => {
    const text = `*NEW PAINTING QUOTATION INQUIRY - MANSURI PAINTS*
----------------------------------------
*Customer Name:* ${customerName || 'Valued Client'}
*Phone:* ${customerPhone || 'Not provided'}
*Wall Area:* ${effectiveWallArea} sq. ft.
*Selected Paint Finish:* ${selectedPaint.name} (Rs ${selectedPaint.ratePerSqFt}/sq ft)
*Putty & Primer Base:* ${puttyPrimerSelected ? 'Yes (Rs 8/sq ft)' : 'No'}
*Estimated Days:* ~${estimateSummary.estimatedDays} Days
----------------------------------------
*NET ESTIMATED TOTAL:* Rs ${estimateSummary.totalEstimatedCost.toLocaleString()}
----------------------------------------
Please confirm my free site inspection time!`;
    return `https://wa.me/${COMPANY_DETAILS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  }, [customerName, customerPhone, effectiveWallArea, selectedPaint, puttyPrimerSelected, estimateSummary]);

  return (
    <section id="estimator-section" className="py-16 bg-slate-50 text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Instant Paint Cost Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Calculate Your Home Painting Cost
          </h2>
          <p className="text-slate-600 text-base">
            Select your apartment size or custom wall dimensions to get a detailed itemized estimate in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Estimator Controls */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            
            {/* Step 1: Select Property Size / Presets */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between mb-3">
                <span>1. Select House Configuration</span>
                <button
                  type="button"
                  onClick={() => setUseDimensionWizard(!useDimensionWizard)}
                  className="text-xs text-indigo-600 hover:underline font-bold"
                >
                  {useDimensionWizard ? 'Switch to BHK Presets' : 'Use Wall Dimension Calculator'}
                </button>
              </label>

              {!useDimensionWizard ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {HOUSE_PRESETS.map((preset) => {
                    const isSelected = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetSelect(preset.id)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md shadow-indigo-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-sm font-black">{preset.bhkLabel}</div>
                        <div className={`text-[11px] mt-1 font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          ~{preset.approxWallAreaSqFt} sq ft
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Dimension Wizard */
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Room Count</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={roomCount}
                        onChange={(e) => setRoomCount(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Avg Length (ft)</label>
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={avgRoomLength}
                        onChange={(e) => setAvgRoomLength(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Avg Width (ft)</label>
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={avgRoomWidth}
                        onChange={(e) => setAvgRoomWidth(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Wall Height (ft)</label>
                      <input
                        type="number"
                        min={8}
                        max={15}
                        value={avgWallHeight}
                        onChange={(e) => setAvgWallHeight(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-indigo-600 font-bold">
                    Calculated Wall Surface Area: <span className="font-black text-slate-900">{calculatedWizardArea} sq. ft.</span>
                  </p>
                </div>
              )}

              {/* Slider Adjustment */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs text-slate-600 font-bold mb-1">
                  <span>Adjust Wall Area (Sq. Ft.)</span>
                  <span className="text-indigo-600 font-black text-sm">{effectiveWallArea} sq ft</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={6000}
                  step={50}
                  value={effectiveWallArea}
                  onChange={(e) => {
                    setUseDimensionWizard(false);
                    setWallAreaSqFt(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Step 2: Choose Paint Finish */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-3">
                2. Choose Paint Finish & Quality
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rates.slice(0, 3).map((paint) => {
                  const isSelected = selectedPaint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      type="button"
                      onClick={() => setSelectedPaint(paint)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{paint.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                      </div>
                      <div className="text-xl font-black text-indigo-600 mt-1">
                        ₹{paint.ratePerSqFt} <span className="text-[10px] text-slate-500 font-semibold">/ sq ft</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{paint.finishType}</p>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Finishes Toggle */}
              <div className="mt-3 flex flex-wrap gap-2">
                {rates.slice(3).map((paint) => {
                  const isSelected = selectedPaint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      type="button"
                      onClick={() => setSelectedPaint(paint)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {paint.name} (₹{paint.ratePerSqFt}/sq ft)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Base Coat & Add-ons */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-3">
                3. Surface Preparation & Add-On Services
              </label>

              <div className="space-y-3">
                {/* Putty & Primer Toggle */}
                <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={puttyPrimerSelected}
                    onChange={(e) => setPuttyPrimerSelected(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-indigo-600 rounded"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">2-Coat Putty + 1-Coat Acrylic Primer Base</span>
                      <span className="text-xs text-indigo-600 font-black">+₹8 / sq ft</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fills wall cracks & imperfections. Highly recommended for fresh or peeling walls.
                    </p>
                  </div>
                </label>

                {/* Additional Addons */}
                {ADD_ON_SERVICES.filter((a) => a.id !== 'putty_primer').map((addon) => {
                  const isChecked = selectedAddOnIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddOn(addon.id)}
                        className="mt-0.5 w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{addon.name}</span>
                          <span className="text-xs text-indigo-600 font-black">
                            {addon.rate > 0 ? `+₹${addon.rate} / sq ft` : 'FREE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{addon.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 4: High-Volume Square Footage Discount Calculator Module */}
            <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-2xl shadow-xs">
                    <Percent className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      4. High-Volume Area Discount Calculator
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Automatic 5% instant discount applied for projects above square footage threshold
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase tracking-wider rounded-full border border-indigo-200">
                  5% Auto Discount
                </span>
              </div>

              {/* Threshold Configuration Selector */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Discount Qualification Threshold:</span>
                  <span className="text-indigo-600 font-black">≥ {volumeThresholdSqFt.toLocaleString()} sq. ft.</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1000, 1200, 1500, 2000].map((threshold) => {
                    const isSelected = volumeThresholdSqFt === threshold;
                    return (
                      <button
                        key={threshold}
                        type="button"
                        onClick={() => setVolumeThresholdSqFt(threshold)}
                        className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        ≥ {threshold.toLocaleString()} sq ft
                        <span className={`block text-[10px] font-normal mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          5% Instant OFF
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Discount Status Banner & Progress */}
              {effectiveWallArea >= volumeThresholdSqFt ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>5% High-Volume Discount ACTIVE!</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase">
                      Qualified
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs font-medium">
                    Your wall area of <strong className="font-black text-slate-900">{effectiveWallArea.toLocaleString()} sq. ft.</strong> meets the <strong className="text-indigo-600 font-black">{volumeThresholdSqFt.toLocaleString()} sq. ft.</strong> threshold. You receive an automatic <strong className="text-emerald-700 font-black">5% discount</strong> saving <strong className="text-emerald-800 font-black text-sm">₹{estimateSummary.volumeDiscountAmount?.toLocaleString()}</strong>!
                  </p>

                  {/* 100% Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-bold text-emerald-800">
                      <span>Area Progress: {effectiveWallArea} / {volumeThresholdSqFt} sq ft</span>
                      <span>100% Complete</span>
                    </div>
                    <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-full transition-all duration-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-amber-600" />
                      <span>Add {volumeThresholdSqFt - effectiveWallArea} sq. ft. to Unlock 5% Discount</span>
                    </span>
                    <span className="text-[10px] font-black text-amber-800 uppercase bg-amber-200/60 px-2 py-0.5 rounded-full">
                      {Math.min(100, Math.round((effectiveWallArea / volumeThresholdSqFt) * 100))}% Reached
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-amber-200/70 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((effectiveWallArea / volumeThresholdSqFt) * 100))}%` }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                    <span className="text-[11px] text-amber-900 font-medium">
                      Potential 5% Volume Savings: <strong className="font-black text-amber-950">₹{Math.round((estimateSummary.subtotal * 0.05)).toLocaleString()}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUseDimensionWizard(false);
                        setWallAreaSqFt(volumeThresholdSqFt);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-full text-[11px] shadow-xs transition-all whitespace-nowrap"
                    >
                      Increase Area to {volumeThresholdSqFt} sq ft
                    </button>
                  </div>
                </div>
              )}

              {/* Module Live Calculations */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black">Base Subtotal</span>
                  <p className="font-extrabold text-slate-800">₹{estimateSummary.subtotal.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-600 uppercase font-black">5% Volume Discount</span>
                  <p className={`font-black ${estimateSummary.volumeDiscountAmount ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {estimateSummary.volumeDiscountAmount ? `- ₹${estimateSummary.volumeDiscountAmount.toLocaleString()}` : '₹0 (Inactive)'}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-rose-600 uppercase font-black">Combined Savings</span>
                  <p className="font-black text-indigo-600">
                    ₹{estimateSummary.discountAmount.toLocaleString()} ({estimateSummary.discountPercentage}% OFF)
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5: Discount Coupon */}
            <div className="pt-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                5. Have an Additional Promo Coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter MANSURI10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600 flex-1 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-full shadow-md shadow-indigo-200"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs mt-1.5 font-bold ${appliedDiscountPercent > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Live Quotation Summary Card */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-slate-900 text-white p-7 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Quotation Header */}
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                    Live Price Breakdown
                  </span>
                  <h3 className="text-xl font-extrabold text-white">Estimated Quotation</h3>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Best Rate
                  </span>
                </div>
              </div>

              {/* Customer Info Optional Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Your Name (for PDF)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Total Wall Surface Area</span>
                  <span className="font-bold text-white">{effectiveWallArea.toLocaleString()} sq. ft.</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span>{selectedPaint.name} (₹{selectedPaint.ratePerSqFt}/sq ft)</span>
                  <span className="font-bold text-white">₹{estimateSummary.paintCost.toLocaleString()}</span>
                </div>

                {puttyPrimerSelected && (
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span>Putty + Primer Base (₹8/sq ft)</span>
                    <span className="font-bold text-white">₹{estimateSummary.puttyPrimerCost.toLocaleString()}</span>
                  </div>
                )}

                {estimateSummary.selectedAddOns.map((addon) => (
                  <div key={addon.id} className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="line-clamp-1">{addon.name}</span>
                    <span className="font-bold text-white">₹{addon.cost.toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between py-1 border-b border-slate-800/80 text-emerald-400 font-bold">
                  <span>Furniture Masking & Floor Covering</span>
                  <span>FREE</span>
                </div>

                {(estimateSummary.volumeDiscountAmount || 0) > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-emerald-400 font-bold">
                    <span>5% High-Volume Area Discount (≥{volumeThresholdSqFt} sq. ft.)</span>
                    <span>- ₹{estimateSummary.volumeDiscountAmount?.toLocaleString()}</span>
                  </div>
                )}

                {(estimateSummary.couponDiscountAmount || 0) > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-amber-400 font-bold">
                    <span>Promo Code Discount ({estimateSummary.couponDiscountPercentage}%)</span>
                    <span>- ₹{estimateSummary.couponDiscountAmount?.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Estimated Work Duration
                  </span>
                  <span className="font-bold text-slate-200">~{estimateSummary.estimatedDays} Working Days</span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="pt-4 border-t border-slate-800 bg-slate-950 p-4 rounded-2xl border border-indigo-500/30">
                {estimateSummary.discountAmount > 0 && (
                  <div className="mb-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-[11px] font-black flex items-center justify-between">
                    <span>Total Discount Saved:</span>
                    <span>- ₹{estimateSummary.discountAmount.toLocaleString()} ({estimateSummary.discountPercentage}% OFF)</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold">Estimated Net Amount</span>
                    <p className="text-[10px] text-slate-500">Includes materials, prep & labour</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-400">
                      ₹{estimateSummary.totalEstimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold py-3.5 rounded-full border border-slate-700 text-xs shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official PDF Quotation</span>
                </button>

                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-full text-xs shadow-lg shadow-emerald-950 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>Send Quote on WhatsApp (+91 78430 99068)</span>
                </a>

                <button
                  type="button"
                  onClick={() => onOpenBookingWithEstimate(estimateSummary)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-full text-xs shadow-lg shadow-indigo-900 transition-all"
                >
                  <span>Book Free Measurement Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

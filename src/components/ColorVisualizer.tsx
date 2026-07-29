import React, { useState } from 'react';
import { COLOR_SWATCHES, DEFAULT_PAINT_TYPES } from '../data/paintData';
import { ColorSwatch, PaintTypeOption } from '../types';
import { Palette, Sun, Moon, Lamp, Sparkles, Check, RefreshCw, Eye, ArrowRight } from 'lucide-react';

interface ColorVisualizerProps {
  onSelectColorForEstimate: (color: ColorSwatch, finish: PaintTypeOption) => void;
}

export const ColorVisualizer: React.FC<ColorVisualizerProps> = ({ onSelectColorForEstimate }) => {
  // Selected Room Target
  const [selectedRoom, setSelectedRoom] = useState<'living' | 'bedroom' | 'dining' | 'exterior'>('living');

  // Selected Wall Element
  const [activeTargetWall, setActiveTargetWall] = useState<'accent' | 'secondary' | 'trim'>('accent');

  // Selected Wall Colors
  const [accentColor, setAccentColor] = useState<ColorSwatch>(COLOR_SWATCHES[0]); // Royal Heritage Gold
  const [secondaryColor, setSecondaryColor] = useState<ColorSwatch>(COLOR_SWATCHES[3]); // Alabaster Silk White
  const [trimColor, setTrimColor] = useState<ColorSwatch>(COLOR_SWATCHES[4]); // Warm Cashmere Beige

  // Selected Finish / Texture
  const [selectedFinish, setSelectedFinish] = useState<PaintTypeOption>(DEFAULT_PAINT_TYPES[0]);

  // Lighting Mode
  const [lighting, setLighting] = useState<'daylight' | 'warm' | 'evening'>('daylight');

  // Before / After View Mode Toggle
  const [showBeforeOriginal, setShowBeforeOriginal] = useState<boolean>(false);

  // Category Filter for Swatches
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Luxe Royals', 'Calm Neutrals', 'Modern Pastels', 'Earth & Warmth', 'Bold Accents'];

  const filteredSwatches = COLOR_SWATCHES.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  const handleColorSelect = (swatch: ColorSwatch) => {
    if (activeTargetWall === 'accent') setAccentColor(swatch);
    else if (activeTargetWall === 'secondary') setSecondaryColor(swatch);
    else setTrimColor(swatch);
  };

  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <Palette className="w-4 h-4 text-teal-600" />
            <span>Interactive Color Visualizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Preview Wall Colors on Real Rooms
          </h2>
          <p className="text-slate-600 text-base">
            Test how Royal, Plastic & Distemper shades look under daylight, warm lamps, and evening lighting before buying paint.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Room Canvas Stage */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Room Selector & Lighting Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              {/* Room Scene Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedRoom('living')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedRoom === 'living' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Living Room
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoom('bedroom')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedRoom === 'bedroom' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Master Bedroom
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoom('dining')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedRoom === 'dining' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Dining Hall
                </button>
              </div>

              {/* Lighting Mode Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLighting('daylight')}
                  className={`p-2 rounded-lg transition-colors ${lighting === 'daylight' ? 'bg-white text-indigo-600 shadow-xs font-black' : 'text-slate-500'}`}
                  title="Natural Daylight"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLighting('warm')}
                  className={`p-2 rounded-lg transition-colors ${lighting === 'warm' ? 'bg-white text-amber-600 shadow-xs font-black' : 'text-slate-500'}`}
                  title="Warm Ambient Lamp"
                >
                  <Lamp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLighting('evening')}
                  className={`p-2 rounded-lg transition-colors ${lighting === 'evening' ? 'bg-white text-indigo-900 shadow-xs font-black' : 'text-slate-500'}`}
                  title="Evening Soft Lighting"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Room Canvas / Visualizer Box */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-xl h-[380px] sm:h-[440px] flex flex-col justify-between p-6">
              
              {/* Dynamic Room Wall Background Simulation */}
              <div 
                className="absolute inset-0 transition-colors duration-500"
                style={{
                  backgroundColor: showBeforeOriginal ? '#CBD5E1' : secondaryColor.hex,
                  opacity: lighting === 'evening' ? 0.85 : 1,
                }}
              />

              {/* Focal Wall Layer (Center Wall) */}
              <div 
                className="absolute top-10 left-12 right-12 bottom-20 rounded-2xl shadow-2xl border-4 border-slate-950/20 transition-all duration-500 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: showBeforeOriginal ? '#94A3B8' : accentColor.hex,
                  boxShadow: lighting === 'warm' ? 'inset 0 0 80px rgba(245, 158, 11, 0.25)' : 'none',
                }}
              >
                {/* Finish Texture Overlay Simulation */}
                {selectedFinish.id === 'royal' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none" />
                )}
                {selectedFinish.id === 'texture' && (
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                )}

                {/* Decorative Room Furniture Overlay Graphic */}
                <div className="relative z-10 text-center p-6 bg-slate-950/50 backdrop-blur-md rounded-2xl border border-white/10 text-white max-w-sm">
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                    Focal Wall
                  </span>
                  <h4 className="text-lg font-black">
                    {showBeforeOriginal ? 'Original Unpainted Wall' : accentColor.name}
                  </h4>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    {selectedFinish.name} ({selectedFinish.finishType})
                  </p>
                </div>
              </div>

              {/* Floor / Skirting Trim Layer */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-16 transition-colors duration-500 border-t-4 border-slate-900"
                style={{
                  backgroundColor: showBeforeOriginal ? '#64748B' : trimColor.hex,
                }}
              />

              {/* Room Lighting Overlay Tint */}
              {lighting === 'warm' && (
                <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
              )}
              {lighting === 'evening' && (
                <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" />
              )}

              {/* Bottom Controls Overlay */}
              <div className="relative z-20 flex items-center justify-between">
                <button
                  type="button"
                  onMouseDown={() => setShowBeforeOriginal(true)}
                  onMouseUp={() => setShowBeforeOriginal(false)}
                  onTouchStart={() => setShowBeforeOriginal(true)}
                  onTouchEnd={() => setShowBeforeOriginal(false)}
                  className="bg-slate-900/90 hover:bg-slate-900 text-xs font-black text-amber-400 px-4 py-2.5 rounded-full border border-slate-700 backdrop-blur-md flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Hold to View Before</span>
                </button>

                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800 text-xs text-slate-200 font-semibold">
                  Lighting Mode: <span className="font-black text-amber-400 capitalize">{lighting}</span>
                </div>
              </div>

            </div>

            {/* Room Info & Finish Selector */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold text-slate-400">Chosen Paint Sheen Finish</span>
                <p className="text-sm font-black text-slate-900">{selectedFinish.name} — ₹{selectedFinish.ratePerSqFt}/sq ft</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectColorForEstimate(accentColor, selectedFinish)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-full shadow-md shadow-indigo-200 flex items-center gap-1.5 transition-all"
              >
                <span>Apply to Estimate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Palette & Target Selector Column */}
          <div className="lg:col-span-5 space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            
            {/* Target Wall Selector */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                1. Select Wall Surface to Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTargetWall('accent')}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all text-center ${
                    activeTargetWall === 'accent'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Accent Wall
                  <div className="w-5 h-5 rounded-full mx-auto mt-1.5 border border-black/10 shadow-xs" style={{ backgroundColor: accentColor.hex }} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTargetWall('secondary')}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all text-center ${
                    activeTargetWall === 'secondary'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Side Walls
                  <div className="w-5 h-5 rounded-full mx-auto mt-1.5 border border-black/10 shadow-xs" style={{ backgroundColor: secondaryColor.hex }} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTargetWall('trim')}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all text-center ${
                    activeTargetWall === 'trim'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Trim / Skirting
                  <div className="w-5 h-5 rounded-full mx-auto mt-1.5 border border-black/10 shadow-xs" style={{ backgroundColor: trimColor.hex }} />
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  2. Pick Color Palette
                </label>
                <span className="text-[11px] text-indigo-600 font-extrabold">
                  {filteredSwatches.length} Shades
                </span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Swatch Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
              {filteredSwatches.map((swatch) => {
                const currentActiveHex =
                  activeTargetWall === 'accent'
                    ? accentColor.hex
                    : activeTargetWall === 'secondary'
                    ? secondaryColor.hex
                    : trimColor.hex;

                const isSelected = currentActiveHex === swatch.hex;

                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => handleColorSelect(swatch)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative group ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/30'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-full h-10 rounded-xl shadow-inner mb-2 border border-black/10 flex items-center justify-center"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />}
                    </div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{swatch.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{swatch.hex}</p>
                  </button>
                );
              })}
            </div>

            {/* Finish Sheen Selection */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                3. Choose Finish Sheen Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DEFAULT_PAINT_TYPES.slice(0, 3).map((finish) => (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      selectedFinish.id === finish.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {finish.name}
                    <div className={`text-[10px] ${selectedFinish.id === finish.id ? 'text-indigo-100' : 'text-slate-500'}`}>₹{finish.ratePerSqFt}/sq ft</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

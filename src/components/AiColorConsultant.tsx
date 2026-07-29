import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Palette, ShieldCheck, ArrowRight, Lightbulb, Check } from 'lucide-react';
import { AiColorRecommendation } from '../types';

interface AiColorConsultantProps {
  onApplyRecommendation: (rec: AiColorRecommendation) => void;
}

export const AiColorConsultant: React.FC<AiColorConsultantProps> = ({ onApplyRecommendation }) => {
  const [roomType, setRoomType] = useState<string>('Living Room');
  const [lightingCondition, setLightingCondition] = useState<string>('Bright Natural Sunlight');
  const [userStyle, setUserStyle] = useState<string>('Modern Luxury & Warmth');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AiColorRecommendation | null>(null);

  const handleGeneratePalette = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai-color-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          lightingCondition,
          userStyle,
          customPrompt,
        }),
      });

      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error('Failed to query AI Color Consultant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-4 h-4 text-rose-600 fill-rose-600/20" />
            <span>Gemini AI Interior Color Advisor</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Get Personalized Room Color Palettes
          </h2>
          <p className="text-slate-600 text-base">
            Tell our AI about your room orientation, furniture tone, or aesthetic preferences, and get a tailored paint scheme instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Form Column */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
            <form onSubmit={handleGeneratePalette} className="space-y-4">
              
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  1. Select Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                >
                  <option value="Living Room">Living Room / Hall</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                  <option value="Kids Bedroom">Kids Bedroom</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Kitchen & Passage">Kitchen & Passage</option>
                  <option value="Exterior Facade">Exterior Facade / Balcony</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  2. Room Lighting Condition
                </label>
                <select
                  value={lightingCondition}
                  onChange={(e) => setLightingCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                >
                  <option value="Bright Natural Sunlight">Bright Natural Sunlight (South / West Facing)</option>
                  <option value="Cool Subtle Daylight">Cool Subtle Daylight (North / East Facing)</option>
                  <option value="Warm Ambient Lamps">Warm Indoor LED Lamps</option>
                  <option value="Low Natural Light">Low Natural Light / Compact Room</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  3. Preferred Interior Style
                </label>
                <select
                  value={userStyle}
                  onChange={(e) => setUserStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                >
                  <option value="Modern Luxury & Warmth">Modern Luxury & Gold Accents</option>
                  <option value="Minimalist Scandinavian">Minimalist Scandinavian (Beige & Whites)</option>
                  <option value="Royal Indian Heritage">Royal Indian Heritage (Deep Emerald & Navy)</option>
                  <option value="Cozy Pastel Comfort">Cozy Pastel Comfort (Sage & Muted Tones)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  4. Furniture / Specific Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Dark teak wood sofa set, marble flooring, want living room to look spacious and royal..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Analyzing Color Harmonies...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-white" />
                    <span>Generate AI Palette Recommendation</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* AI Result Card Column */}
          <div className="lg:col-span-7">
            {recommendation ? (
              <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-indigo-600 font-black uppercase tracking-wider">
                      Recommended Palette
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                      {recommendation.paletteName}
                    </h3>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
                    AI Verified
                  </span>
                </div>

                {/* Color Swatch Display Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <div
                      className="w-full h-16 rounded-xl mb-2 border border-black/10 shadow-xs"
                      style={{ backgroundColor: recommendation.primaryColor.hex }}
                    />
                    <span className="text-[10px] uppercase font-black text-indigo-600">Main Wall</span>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{recommendation.primaryColor.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{recommendation.primaryColor.hex}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <div
                      className="w-full h-16 rounded-xl mb-2 border border-black/10 shadow-xs"
                      style={{ backgroundColor: recommendation.secondaryColor.hex }}
                    />
                    <span className="text-[10px] uppercase font-black text-indigo-600">Side Walls</span>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{recommendation.secondaryColor.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{recommendation.secondaryColor.hex}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <div
                      className="w-full h-16 rounded-xl mb-2 border border-black/10 shadow-xs"
                      style={{ backgroundColor: recommendation.accentColor.hex }}
                    />
                    <span className="text-[10px] uppercase font-black text-indigo-600">Accent Feature</span>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{recommendation.accentColor.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{recommendation.accentColor.hex}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <div
                      className="w-full h-16 rounded-xl mb-2 border border-black/10 shadow-xs"
                      style={{ backgroundColor: recommendation.trimColor.hex }}
                    />
                    <span className="text-[10px] uppercase font-black text-indigo-600">Trim / Skirting</span>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{recommendation.trimColor.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{recommendation.trimColor.hex}</p>
                  </div>
                </div>

                {/* Recommended Paint Finish */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 font-bold">Recommended Paint Quality</span>
                    <p className="text-sm font-black text-slate-900">{recommendation.recommendedFinish}</p>
                  </div>
                </div>

                {/* Design Advice */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs text-slate-700 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-amber-900 block mb-0.5">Interior Design Advice:</span>
                      <p className="leading-relaxed font-medium">{recommendation.designAdvice}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700 bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                    <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-indigo-900 block mb-0.5">Lighting Guidance:</span>
                      <p className="leading-relaxed font-medium">{recommendation.lightingTip}</p>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={() => onApplyRecommendation(recommendation)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-full text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Palette className="w-4 h-4" />
                  <span>Use This Palette in Visualizer & Cost Estimator</span>
                </button>

              </div>
            ) : (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Your AI Color Scheme Will Appear Here</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                  Fill in your room type and lighting conditions on the left, then click Generate to receive an instant, professional palette recommendation.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

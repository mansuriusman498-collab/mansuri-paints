import React, { useState } from 'react';
import { SAMPLE_PROJECTS } from '../data/paintData';
import { Image as ImageIcon, Sparkles, Check, ArrowRight, Eye } from 'lucide-react';

interface GalleryProps {
  onOpenBooking: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onOpenBooking }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Living Room', 'Bedroom', 'Exterior'];

  const filteredProjects = SAMPLE_PROJECTS.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>Before & After Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our Completed Painting Projects
          </h2>
          <p className="text-slate-600 text-base">
            See real residential and commercial painting transformations completed by Mansuri Paints across India.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Comparison Box */}
                <div className="relative h-64 bg-slate-100 overflow-hidden group">
                  <img
                    src={project.imageAfter}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                    AFTER
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-white">
                    <span className="font-bold line-clamp-1">{project.title}</span>
                    <span className="text-[10px] text-amber-400 font-extrabold shrink-0">{project.category}</span>
                  </div>
                </div>

                {/* Info Details */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{project.title}</h3>
                    <p className="text-xs text-indigo-600 font-bold">{project.location}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {project.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Paint Used:</span>
                    <span className="font-bold text-slate-900">{project.paintUsed}</span>
                  </div>

                  {/* Color Palette Dots */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {project.colorPalette.map((hex, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-full text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Book Similar Finish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

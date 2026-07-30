import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { DEFAULT_PAINT_TYPES, COMPANY_DETAILS } from './src/data/paintData.js';
import { BookingData, PaintTypeOption } from './src/types.js';

// In-memory data store for live app state
let currentPaintTypes: PaintTypeOption[] = [...DEFAULT_PAINT_TYPES];

let bookingsStore: BookingData[] = [
  {
    id: 'BK-1001',
    customerName: 'Aarav Sharma',
    phoneNumber: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    email: 'aarav@example.com',
    address: 'Flat 402, Green Park Apartments, Sector 5',
    city: 'Central City',
    propertyType: '3 BHK',
    wallAreaSqFt: 2800,
    selectedPaintType: 'royal',
    preferredStartDate: '2026-08-05',
    notes: 'Require Royal Emerald Accent wall in living room and Royal Navy in master bedroom.',
    estimatedCost: 98000,
    status: 'Site Inspection Scheduled',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'BK-1002',
    customerName: 'Priya Verma',
    phoneNumber: '+91 91234 56789',
    whatsappNumber: '+91 91234 56789',
    email: 'priya@example.com',
    address: 'House 12, Sunrise Enclave, Main Road',
    city: 'North Division',
    propertyType: '2 BHK',
    wallAreaSqFt: 1850,
    selectedPaintType: 'plastic',
    preferredStartDate: '2026-08-10',
    notes: 'Plastic Paint smooth matte with ceiling white painting.',
    estimatedCost: 51800,
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get Company Info
  app.get('/api/company', (_req, res) => {
    res.json(COMPANY_DETAILS);
  });

  // Get current paint rates
  app.get('/api/rates', (_req, res) => {
    res.json(currentPaintTypes);
  });

  // Update paint rates (Admin capability)
  app.post('/api/rates/update', (req, res) => {
    const { updatedRates } = req.body;
    if (Array.isArray(updatedRates)) {
      currentPaintTypes = updatedRates;
      return res.json({ success: true, message: 'Rates updated successfully', rates: currentPaintTypes });
    }
    return res.status(400).json({ error: 'Invalid rates payload' });
  });

  // Get Bookings / Inquiries list
  app.get('/api/bookings', (_req, res) => {
    res.json(bookingsStore);
  });

  // Submit new booking / inquiry
  app.post('/api/bookings', (req, res) => {
    try {
      const newBooking: BookingData = {
        ...req.body,
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      bookingsStore.unshift(newBooking);
      res.status(201).json({ success: true, booking: newBooking });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create booking', details: err.message });
    }
  });

  // Update booking status
  app.patch('/api/bookings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = bookingsStore.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      return res.json({ success: true, booking });
    }
    return res.status(404).json({ error: 'Booking not found' });
  });

  // AI Color Consultant (Gemini API server-side endpoint)
  app.post('/api/ai-color-consultant', async (req, res) => {
    const { roomType, lightingCondition, userStyle, customPrompt } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback default response if key not available in sandbox
      return res.json({
        paletteName: 'Royal Luxe Harmonies',
        primaryColor: { name: 'Royal Heritage Navy', hex: '#1E293B' },
        secondaryColor: { name: 'Silk Alabaster White', hex: '#F8FAFC' },
        accentColor: { name: 'Majestic Gold Shimmer', hex: '#D4AF37' },
        trimColor: { name: 'Warm Cashmere Beige', hex: '#E5D9C5' },
        recommendedFinish: 'Royal Paint (₹27/sq ft) for smooth high-shine washability & accent shimmer',
        designAdvice: `For a ${lightingCondition || 'bright'} ${roomType || 'Living Room'}, pair deep Royal Navy on the main focal wall with Alabaster White on surrounding walls to expand perceived depth. Use Gold Metallic stencils on the TV wall.`,
        lightingTip: `In ${lightingCondition || 'warm indoor'} lighting, the Royal Silk finish reflects gentle glow without harsh glass reflections.`,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the master colorist & interior design consultant for Mansuri Paints.
The customer has a room with the following details:
- Room Type: ${roomType || 'Living Room'}
- Lighting Condition: ${lightingCondition || 'Natural Sunlight'}
- Preferred Aesthetics: ${userStyle || 'Modern Elegance'}
- Additional Notes: ${customPrompt || 'None'}

Please output a JSON response matching strictly this structure:
{
  "paletteName": "Creative short name for the palette",
  "primaryColor": { "name": "Color name", "hex": "#HEX" },
  "secondaryColor": { "name": "Color name", "hex": "#HEX" },
  "accentColor": { "name": "Color name", "hex": "#HEX" },
  "trimColor": { "name": "Color name", "hex": "#HEX" },
  "recommendedFinish": "Specify whether Royal Paint (Rs 27/sq ft), Plastic Paint (Rs 20/sq ft), or Distemper (Rs 15/sq ft) works best and why",
  "designAdvice": "2-3 sentences of tailored interior paint styling advice",
  "lightingTip": "1 sentence tip on how lighting interacts with these wall colors"
}
Output raw JSON only. Do not wrap in markdown or backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Gemini API error:', err);
      return res.json({
        paletteName: 'Serene Modern Palette',
        primaryColor: { name: 'Alabaster Silk White', hex: '#F8FAFC' },
        secondaryColor: { name: 'Mindful Sage Green', hex: '#A3B19B' },
        accentColor: { name: 'Royal Emerald Green', hex: '#004B36' },
        trimColor: { name: 'Warm Cashmere Beige', hex: '#E5D9C5' },
        recommendedFinish: 'Royal Paint (₹27/sq ft) for smooth washable silk sheen',
        designAdvice: `A combination of Mindful Sage Green on feature walls with Alabaster White creates a relaxed atmosphere with high daylight reflection.`,
        lightingTip: 'Warm LED lights bring out rich undertones in silk finishes.',
      });
    }
  });

  // Vite middleware in development, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mansuri Paints server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();

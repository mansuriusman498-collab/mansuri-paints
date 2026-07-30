var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/paintData.ts
var DEFAULT_PAINT_TYPES = [
  {
    id: "royal",
    name: "Royal Paint",
    ratePerSqFt: 27,
    durabilityYears: "7 - 10 Years",
    finishType: "Luxury High Shine / Silk",
    washability: "High",
    description: "Ultra-durable luxury acrylic emulsion with stain-resistant washable finish, rich color depth, and anti-fungal defense.",
    popularFor: "Living rooms, Master Bedrooms & Premium Interiors",
    badge: "Most Popular & Durable",
    colorHex: "#3b82f6"
  },
  {
    id: "plastic",
    name: "Plastic Paint",
    ratePerSqFt: 20,
    durabilityYears: "4 - 6 Years",
    finishType: "Smooth Velvet Matte",
    washability: "Medium",
    description: "Smooth washable emulsion offering elegant matte elegance, good coverage, and easy maintenance for family homes.",
    popularFor: "Bedrooms, Dining Areas & Hallways",
    colorHex: "#10b981"
  },
  {
    id: "distemper",
    name: "Distemper Paint",
    ratePerSqFt: 15,
    durabilityYears: "2 - 3 Years",
    finishType: "Classic Matte Finish",
    washability: "Low",
    description: "Economical water-based paint delivering a clean, fresh matte finish. Ideal for budget refresh and rental properties.",
    popularFor: "Rental homes, Ceilings & Budget Refreshes",
    badge: "Budget Friendly",
    colorHex: "#f59e0b"
  },
  {
    id: "texture",
    name: "Texture & Stencil Wall",
    ratePerSqFt: 45,
    durabilityYears: "8 - 12 Years",
    finishType: "3D Metallic / Rustic Grain",
    washability: "High",
    description: "Designer accent wall finishes including Royal Metallic Stencils, Metallic Texture, Velvet Grain, and Venetian Plaster.",
    popularFor: "TV Accent Walls, Dining Highlights & Main Feature Walls",
    colorHex: "#ec4899"
  },
  {
    id: "exterior",
    name: "Exterior Weather Paint",
    ratePerSqFt: 22,
    durabilityYears: "5 - 8 Years",
    finishType: "Weather Guard Sheen",
    washability: "Waterproof",
    description: "Heavy-duty exterior acrylic coat resistant to harsh sunlight, monsoon rains, algae formation, and heat reflection.",
    popularFor: "Outer walls, Balconies, Compound Walls & Terraces",
    colorHex: "#8b5cf6"
  },
  {
    id: "wood_metal",
    name: "Wood & Metal Polish/Enamel",
    ratePerSqFt: 35,
    durabilityYears: "5 - 7 Years",
    finishType: "High Gloss Polyurethane / Enamel",
    washability: "High",
    description: "PU Polish for teak doors, wooden cabinets, or high-gloss rust-proof enamel for window grills and iron gates.",
    popularFor: "Doors, Window Frames, Iron Grills & Kitchen Cabinets",
    colorHex: "#d97706"
  }
];
var COMPANY_DETAILS = {
  name: "Mansuri Paints",
  tagline: "Precision Painting, Premium Finishes & Instant Quotation",
  whatsappNumber: "+917843099068",
  whatsappDisplay: "+91 78430 99068",
  phone: "+91 78430 99068",
  email: "mansuriusman498@gmail.com",
  address: "Mansuri Paints Main Studio, Central City Complex, India",
  workingHours: "Mon - Sun: 8:00 AM - 9:00 PM",
  experienceYears: "12+ Years of Excellence",
  completedProjectsCount: "1,450+",
  satisfactionRate: "99.2%"
};

// server.ts
var currentPaintTypes = [...DEFAULT_PAINT_TYPES];
var bookingsStore = [
  {
    id: "BK-1001",
    customerName: "Aarav Sharma",
    phoneNumber: "+91 98765 43210",
    whatsappNumber: "+91 98765 43210",
    email: "aarav@example.com",
    address: "Flat 402, Green Park Apartments, Sector 5",
    city: "Central City",
    propertyType: "3 BHK",
    wallAreaSqFt: 2800,
    selectedPaintType: "royal",
    preferredStartDate: "2026-08-05",
    notes: "Require Royal Emerald Accent wall in living room and Royal Navy in master bedroom.",
    estimatedCost: 98e3,
    status: "Site Inspection Scheduled",
    createdAt: new Date(Date.now() - 864e5 * 2).toISOString()
  },
  {
    id: "BK-1002",
    customerName: "Priya Verma",
    phoneNumber: "+91 91234 56789",
    whatsappNumber: "+91 91234 56789",
    email: "priya@example.com",
    address: "House 12, Sunrise Enclave, Main Road",
    city: "North Division",
    propertyType: "2 BHK",
    wallAreaSqFt: 1850,
    selectedPaintType: "plastic",
    preferredStartDate: "2026-08-10",
    notes: "Plastic Paint smooth matte with ceiling white painting.",
    estimatedCost: 51800,
    status: "New",
    createdAt: new Date(Date.now() - 36e5 * 5).toISOString()
  }
];
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/company", (_req, res) => {
    res.json(COMPANY_DETAILS);
  });
  app.get("/api/rates", (_req, res) => {
    res.json(currentPaintTypes);
  });
  app.post("/api/rates/update", (req, res) => {
    const { updatedRates } = req.body;
    if (Array.isArray(updatedRates)) {
      currentPaintTypes = updatedRates;
      return res.json({ success: true, message: "Rates updated successfully", rates: currentPaintTypes });
    }
    return res.status(400).json({ error: "Invalid rates payload" });
  });
  app.get("/api/bookings", (_req, res) => {
    res.json(bookingsStore);
  });
  app.post("/api/bookings", (req, res) => {
    try {
      const newBooking = {
        ...req.body,
        id: `BK-${Math.floor(1e3 + Math.random() * 9e3)}`,
        status: "New",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      bookingsStore.unshift(newBooking);
      res.status(201).json({ success: true, booking: newBooking });
    } catch (err) {
      res.status(500).json({ error: "Failed to create booking", details: err.message });
    }
  });
  app.patch("/api/bookings/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = bookingsStore.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      return res.json({ success: true, booking });
    }
    return res.status(404).json({ error: "Booking not found" });
  });
  app.post("/api/ai-color-consultant", async (req, res) => {
    const { roomType, lightingCondition, userStyle, customPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        paletteName: "Royal Luxe Harmonies",
        primaryColor: { name: "Royal Heritage Navy", hex: "#1E293B" },
        secondaryColor: { name: "Silk Alabaster White", hex: "#F8FAFC" },
        accentColor: { name: "Majestic Gold Shimmer", hex: "#D4AF37" },
        trimColor: { name: "Warm Cashmere Beige", hex: "#E5D9C5" },
        recommendedFinish: "Royal Paint (\u20B927/sq ft) for smooth high-shine washability & accent shimmer",
        designAdvice: `For a ${lightingCondition || "bright"} ${roomType || "Living Room"}, pair deep Royal Navy on the main focal wall with Alabaster White on surrounding walls to expand perceived depth. Use Gold Metallic stencils on the TV wall.`,
        lightingTip: `In ${lightingCondition || "warm indoor"} lighting, the Royal Silk finish reflects gentle glow without harsh glass reflections.`
      });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const prompt = `You are the master colorist & interior design consultant for Mansuri Paints.
The customer has a room with the following details:
- Room Type: ${roomType || "Living Room"}
- Lighting Condition: ${lightingCondition || "Natural Sunlight"}
- Preferred Aesthetics: ${userStyle || "Modern Elegance"}
- Additional Notes: ${customPrompt || "None"}

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
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const text = response.text || "";
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (err) {
      console.error("Gemini API error:", err);
      return res.json({
        paletteName: "Serene Modern Palette",
        primaryColor: { name: "Alabaster Silk White", hex: "#F8FAFC" },
        secondaryColor: { name: "Mindful Sage Green", hex: "#A3B19B" },
        accentColor: { name: "Royal Emerald Green", hex: "#004B36" },
        trimColor: { name: "Warm Cashmere Beige", hex: "#E5D9C5" },
        recommendedFinish: "Royal Paint (\u20B927/sq ft) for smooth washable silk sheen",
        designAdvice: `A combination of Mindful Sage Green on feature walls with Alabaster White creates a relaxed atmosphere with high daylight reflection.`,
        lightingTip: "Warm LED lights bring out rich undertones in silk finishes."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mansuri Paints server active on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

export type PaintTypeKey = 'royal' | 'plastic' | 'distemper' | 'texture' | 'exterior' | 'wood_metal';

export interface PaintTypeOption {
  id: PaintTypeKey;
  name: string;
  ratePerSqFt: number; // in INR
  durabilityYears: string;
  finishType: string;
  washability: 'High' | 'Medium' | 'Low' | 'Waterproof';
  description: string;
  popularFor: string;
  badge?: string;
  colorHex: string;
}

export interface HousePreset {
  id: string;
  name: string;
  bhkLabel: string;
  approxCarpetAreaSqFt: number;
  approxWallAreaSqFt: number;
  description: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  rate: number;
  unit: 'sqft' | 'wall' | 'item' | 'fixed';
  description: string;
  defaultSelected?: boolean;
}

export interface EstimateSummary {
  carpetAreaSqFt: number;
  wallAreaSqFt: number;
  paintType: PaintTypeOption;
  puttyPrimerSelected: boolean;
  puttyPrimerCost: number;
  paintCost: number;
  selectedAddOns: { id: string; name: string; cost: number }[];
  addOnsTotal: number;
  labourIncludedCost: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  volumeDiscountPercentage?: number;
  volumeDiscountAmount?: number;
  couponDiscountPercentage?: number;
  couponDiscountAmount?: number;
  volumeThresholdSqFt?: number;
  totalEstimatedCost: number;
  estimatedDays: number;
}

export interface BookingData {
  id?: string;
  customerName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  address: string;
  city: string;
  propertyType: '1 BHK' | '2 BHK' | '3 BHK' | '4+ BHK / Villa' | 'Commercial Office' | 'Custom Area';
  wallAreaSqFt: number;
  selectedPaintType: PaintTypeKey;
  preferredStartDate: string;
  notes?: string;
  estimatedCost?: number;
  status?: 'New' | 'Site Inspection Scheduled' | 'In Progress' | 'Completed';
  createdAt?: string;
}

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  category: 'Luxe Royals' | 'Modern Pastels' | 'Earth & Warmth' | 'Calm Neutrals' | 'Bold Accents';
  description: string;
}

export interface AiColorRecommendation {
  paletteName: string;
  primaryColor: ColorSwatch;
  secondaryColor: ColorSwatch;
  accentColor: ColorSwatch;
  trimColor: ColorSwatch;
  recommendedFinish: string;
  designAdvice: string;
  lightingTip: string;
}

export interface ProjectGalleryItem {
  id: string;
  title: string;
  location: string;
  paintUsed: string;
  category: 'Living Room' | 'Bedroom' | 'Exterior' | 'Feature Wall';
  imageBefore: string;
  imageAfter: string;
  colorPalette: string[];
  description: string;
}

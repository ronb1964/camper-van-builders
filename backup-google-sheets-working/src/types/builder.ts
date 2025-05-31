export interface Location {
  lat: number;
  lng: number;
  city: string;
  state: string;
  zip: string;
  [key: string]: any; // Allow additional properties
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface Builder {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  location: Location;
  description: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  vanTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  pricingTiers?: PricingTier[];
  amenities?: string[];
  yearsInBusiness?: number;
  certifications?: string[];
  services?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    pinterest?: string;
    tiktok?: string;
  };
  gallery?: string[];
  leadTime?: string;
  distanceFromZip?: {
    miles: number;
    zipCode: string;
  };
  [key: string]: any; // Allow additional properties
}

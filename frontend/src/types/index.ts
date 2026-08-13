export interface Destination {
  id: string;
  name: string;
  category: 'alam' | 'budaya' | 'pantai' | 'religi' | 'buatan';
  corridorIds: string[];
  coordinates: { lat: number; lng: number };
  rating: number;
  distanceFromRouteKm: number;
  isMainDestination: boolean;
  images: string[];
  shortDescription: string;
  kisahDestinasi?: {
    title: string;
    body: string;
    era: string;
    tags: string[];
  };
  openingHours: string;
  priceRange: 'gratis' | 'murah' | 'sedang' | 'mahal';
  ticketPrice?: number;
  duration?: string;
  bestTime?: string;
  tags?: string[];
  facilities?: string[];
  difficulty?: 'mudah' | 'sedang' | 'sulit';
}

export interface RouteCorridor {
  id: string;
  label: string;
  mainDestinationId: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  radiusKm: number;
  trailPoints: { lat: number; lng: number }[];
}

export interface Culinary {
  id: string;
  name: string;
  corridorIds: string[];
  rating: number;
  priceRange: string;
  distanceFromRouteKm: number;
  images: string[];
  cuisineType: string;
  address: string;
  openingHours: string;
  specialty: string;
}

export interface Lodging {
  id: string;
  name: string;
  corridorIds: string[];
  rating: number;
  priceRange: string;
  distanceFromRouteKm: number;
  images: string[];
  roomType: string;
  amenities: string[];
  checkIn: string;
  pricePerNight: number;
}

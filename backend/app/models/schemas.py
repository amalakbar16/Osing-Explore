from pydantic import BaseModel
from typing import List, Optional, Dict

class KisahDestinasi(BaseModel):
    title: str
    body: str
    era: str
    tags: List[str] = []

class Destination(BaseModel):
    id: str
    name: str
    category: str
    corridorIds: List[str]
    coordinates: Dict[str, float]
    rating: float
    distanceFromRouteKm: float
    isMainDestination: bool
    images: List[str]
    shortDescription: str
    kisahDestinasi: Optional[KisahDestinasi] = None
    openingHours: str
    priceRange: str
    ticketPrice: Optional[int] = 0
    duration: Optional[str] = None
    bestTime: Optional[str] = None
    tags: List[str] = []
    facilities: List[str] = []
    difficulty: Optional[str] = None

class RouteCorridor(BaseModel):
    id: str
    label: str
    mainDestinationId: str
    totalDistanceKm: float
    estimatedDurationMin: int
    radiusKm: int
    trailPoints: List[Dict[str, float]]

class Culinary(BaseModel):
    id: str
    name: str
    corridorIds: List[str]
    rating: float
    priceRange: str
    distanceFromRouteKm: float
    images: List[str]
    cuisineType: str
    address: str
    openingHours: str
    specialty: str

class Lodging(BaseModel):
    id: str
    name: str
    corridorIds: List[str]
    rating: float
    priceRange: str
    distanceFromRouteKm: float
    images: List[str]
    roomType: str
    amenities: List[str]
    checkIn: str
    pricePerNight: int

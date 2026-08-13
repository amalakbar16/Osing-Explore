-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- === DESTINATIONS ===
CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('alam','budaya','pantai','religi','buatan')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  coordinates GEOGRAPHY(POINT, 4326),
  rating NUMERIC(2,1) DEFAULT 0,
  distance_from_route_km NUMERIC(5,1) DEFAULT 0,
  is_main_destination BOOLEAN DEFAULT FALSE,
  images TEXT[] DEFAULT '{}',
  short_description TEXT,
  kisah_destinasi JSONB DEFAULT NULL, -- Nested object: {title, body, era, tags}
  opening_hours TEXT,
  price_range TEXT CHECK (price_range IN ('gratis','murah','sedang','mahal')),
  ticket_price INTEGER DEFAULT 0,
  duration TEXT,
  best_time TEXT,
  tags TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('mudah','sedang','sulit')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically populate coordinates geography from lat/lng
CREATE OR REPLACE FUNCTION update_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.coordinates := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::GEOGRAPHY;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_dest_coordinates
  BEFORE INSERT OR UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_coordinates();

-- === ROUTE CORRIDORS ===
CREATE TABLE IF NOT EXISTS route_corridors (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  main_destination_id TEXT REFERENCES destinations(id),
  total_distance_km NUMERIC(5,1),
  estimated_duration_min INTEGER,
  radius_km INTEGER DEFAULT 15,
  trail_points JSONB DEFAULT '[]', -- List of points: [{lat, lng}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === DESTINATION ↔ CORRIDOR (many-to-many) ===
CREATE TABLE IF NOT EXISTS destination_corridors (
  destination_id TEXT REFERENCES destinations(id) ON DELETE CASCADE,
  corridor_id TEXT REFERENCES route_corridors(id) ON DELETE CASCADE,
  PRIMARY KEY (destination_id, corridor_id)
);

-- === CULINARY ===
CREATE TABLE IF NOT EXISTS culinary (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  price_range TEXT,
  distance_from_route_km NUMERIC(5,1) DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  cuisine_type TEXT,
  address TEXT,
  opening_hours TEXT,
  specialty TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  coordinates GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_update_cul_coordinates
  BEFORE INSERT OR UPDATE ON culinary
  FOR EACH ROW EXECUTE FUNCTION update_coordinates();

CREATE TABLE IF NOT EXISTS culinary_corridors (
  culinary_id TEXT REFERENCES culinary(id) ON DELETE CASCADE,
  corridor_id TEXT REFERENCES route_corridors(id) ON DELETE CASCADE,
  PRIMARY KEY (culinary_id, corridor_id)
);

-- === LODGING ===
CREATE TABLE IF NOT EXISTS lodging (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  price_range TEXT,
  distance_from_route_km NUMERIC(5,1) DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  room_type TEXT,
  amenities TEXT[] DEFAULT '{}',
  check_in TEXT,
  price_per_night INTEGER DEFAULT 0,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  coordinates GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_update_lod_coordinates
  BEFORE INSERT OR UPDATE ON lodging
  FOR EACH ROW EXECUTE FUNCTION update_coordinates();

CREATE TABLE IF NOT EXISTS lodging_corridors (
  lodging_id TEXT REFERENCES lodging(id) ON DELETE CASCADE,
  corridor_id TEXT REFERENCES route_corridors(id) ON DELETE CASCADE,
  PRIMARY KEY (lodging_id, corridor_id)
);

-- === ROW LEVEL SECURITY (RLS) ===
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);

ALTER TABLE route_corridors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read corridors" ON route_corridors FOR SELECT USING (true);

ALTER TABLE destination_corridors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read dest_corridors" ON destination_corridors FOR SELECT USING (true);

ALTER TABLE culinary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read culinary" ON culinary FOR SELECT USING (true);

ALTER TABLE culinary_corridors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cul_corridors" ON culinary_corridors FOR SELECT USING (true);

ALTER TABLE lodging ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lodging" ON lodging FOR SELECT USING (true);

ALTER TABLE lodging_corridors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lod_corridors" ON lodging_corridors FOR SELECT USING (true);

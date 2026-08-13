-- === SEED DESTINATIONS ===
INSERT INTO destinations (id, name, category, lat, lng, rating, distance_from_route_km, is_main_destination, images, short_description, kisah_destinasi, opening_hours, price_range, ticket_price, duration, best_time, tags, facilities, difficulty)
VALUES
  (
    'dest-ijen', 
    'Kawah Ijen', 
    'alam', 
    -8.0583, 
    114.2418, 
    4.8, 
    0, 
    TRUE, 
    ARRAY['/images/destinasi/dest-ijen.jpg'], 
    'Pesona blue fire langka dan kawah asam terbesar di dunia.', 
    '{"title": "Api Biru di Jantung Belerang", "body": "Belerang murni menguap dari celah bebatuan, menciptakan nyala biru mistis yang hanya ada di Ijen dan satu tempat lain di Islandia.", "era": "Geologis", "tags": ["Blue Fire", "Belerang"]}'::jsonb, 
    '01:00 - 12:00', 
    'sedang', 
    15000, 
    '4-6 jam', 
    '02:00 - 05:00', 
    ARRAY['Trekking', 'Alam', 'Vulkanik'], 
    ARRAY['Parkir', 'Warung', 'Toilet', 'Sewa Masker'], 
    'sedang'
  ),
  (
    'dest-jagir', 
    'Air Terjun Jagir', 
    'alam', 
    -8.1500, 
    114.3166, 
    4.5, 
    1.2, 
    FALSE, 
    ARRAY['/images/destinasi/dest-jagir.jpg'], 
    'Air terjun kembar jernih di lereng pegunungan.', 
    NULL, 
    '07:00 - 17:00', 
    'murah', 
    5000, 
    '1-2 jam', 
    '08:00 - 10:00', 
    ARRAY['Air Terjun', 'Fotografi'], 
    ARRAY['Parkir', 'Warung', 'Toilet'], 
    'mudah'
  ),
  (
    'dest-terakota', 
    'Taman Gandrung Terakota', 
    'budaya', 
    -8.1800, 
    114.2800, 
    4.9, 
    2.5, 
    FALSE, 
    ARRAY['/images/destinasi/dest-terakota.jpeg'], 
    'Ribuan patung penari Gandrung terbuat dari tembikar.', 
    NULL, 
    '08:00 - 16:00', 
    'sedang', 
    100000, 
    '2-3 jam', 
    'Sore Hari', 
    ARRAY['Seni', 'Sejarah', 'Tari'], 
    ARRAY['Parkir', 'Restoran', 'Toilet', 'Amfiteater', 'Resort'], 
    'mudah'
  ),
  (
    'dest-p-merah', 
    'Pulau Merah', 
    'pantai', 
    -8.5992, 
    114.0308, 
    4.7, 
    0, 
    TRUE, 
    ARRAY['/images/destinasi/dest-p-merah.jpg'], 
    'Pantai pasir putih dengan bukit karang merah.', 
    NULL, 
    '24 Jam', 
    'murah', 
    10000, 
    '3-5 jam', 
    'Sunset', 
    ARRAY['Surfing', 'Sunset', 'Keluarga'], 
    ARRAY['Parkir Luas', 'Kamar Mandi', 'Penyewaan Papan Selancar', 'Warung Makanan', 'Payung Pantai'], 
    'mudah'
  ),
  (
    'dest-plengkung', 
    'Pantai Plengkung (G-Land)', 
    'pantai', 
    -8.7231, 
    114.3160, 
    4.9, 
    15.0, 
    TRUE, 
    ARRAY['/images/destinasi/dest-plengkung.jpg'], 
    'Surga para peselancar dunia dengan ombak kiri legendaris.', 
    '{"title": "Ombak Kiri Tersohor", "body": "G-Land dikenal sebagai ombak terpanjang dan paling konsisten kedua di dunia setelah Hawaii, dinamakan G karena bentuk teluknya menyerupai huruf G.", "era": "Modern", "tags": ["Surfing", "Legenda"]}'::jsonb, 
    '08:00 - 17:00', 
    'sedang', 
    50000, 
    'Seharian', 
    'Pagi - Sore', 
    ARRAY['Surfing Extrem', 'Taman Nasional'], 
    ARRAY['Camp Surfer', 'Penyewaan Alat', 'Klinik Darurat'], 
    'sulit'
  ),
  (
    'dest-sukamade', 
    'Sukamade Beach', 
    'alam', 
    -8.5422, 
    113.8827, 
    4.8, 
    20.0, 
    FALSE, 
    ARRAY['/images/destinasi/dest-sukamade.jpg'], 
    'Habitat bertelurnya empat jenis penyu laut yang dilindungi.', 
    NULL, 
    '16:00 - 08:00', 
    'mahal', 
    250000, 
    '1 Malam', 
    'Malam Hari', 
    ARRAY['Konservasi', 'Penyu', 'Jungle Trekking'], 
    ARRAY['Guest House', 'Ranger Guide', 'Penangkaran'], 
    'sulit'
  ),
  (
    'dest-kemiren', 
    'Desa Wisata Kemiren', 
    'budaya', 
    -8.1963, 
    114.3005, 
    4.7, 
    5.0, 
    FALSE, 
    ARRAY['/images/destinasi/dest-kemiren.jpeg'], 
    'Kampung adat yang melestarikan kebudayaan suku Osing.', 
    '{"title": "Jantung Suku Osing", "body": "Penduduk Kemiren mempertahankan dialek kuno Osing, rumah adat Crocogan, dan tradisi minum kopi yang disangrai di tungku tanah liat.", "era": "Tradisional", "tags": ["Adat", "Suku Osing"]}'::jsonb, 
    '08:00 - 17:00', 
    'murah', 
    0, 
    '2-4 jam', 
    'Pagi', 
    ARRAY['Kopi', 'Budaya', 'Desa Wisata'], 
    ARRAY['Sanggar Tari', 'Warung Kopi', 'Homestay', 'Pusat Oleh-oleh'], 
    'mudah'
  ),
  (
    'dest-djawatan', 
    'De Djawatan', 
    'alam', 
    -8.3308, 
    114.2372, 
    4.6, 
    10.0, 
    FALSE, 
    ARRAY['/images/destinasi/dest-djawatan.jpg'], 
    'Hutan trembesi rindang yang menyerupai latar film fantasi.', 
    NULL, 
    '07:30 - 17:00', 
    'murah', 
    7500, 
    '1-2 jam', 
    'Pagi / Sore', 
    ARRAY['Fotografi', 'Piknik'], 
    ARRAY['Parkir', 'Kafe', 'Sewa Kuda', 'Toilet'], 
    'mudah'
  ),
  (
    'dest-teluk-hijau', 
    'Teluk Hijau (Green Bay)', 
    'pantai', 
    -8.5414, 
    113.9452, 
    4.8, 
    18.0, 
    FALSE, 
    ARRAY['/images/destinasi/dest-teluk-hijau.jpg'], 
    'Teluk eksotis dengan air berwarna hijau zamrud.', 
    NULL, 
    '08:00 - 16:00', 
    'sedang', 
    15000, 
    '3-4 jam', 
    'Siang Hari', 
    ARRAY['Trekking', 'Pantai Perawan'], 
    ARRAY['Perahu Sewa', 'Area Kemah Terbatas'], 
    'sedang'
  ),
  (
    'dest-museum', 
    'Museum Blambangan', 
    'budaya', 
    -8.2144, 
    114.3686, 
    4.3, 
    0.0, 
    FALSE, 
    ARRAY['/images/destinasi/dest-museum.jpeg'], 
    'Pusat koleksi artefak dan sejarah Kerajaan Blambangan.', 
    NULL, 
    '08:00 - 15:00', 
    'murah', 
    5000, 
    '1 jam', 
    'Pagi', 
    ARRAY['Sejarah', 'Edukasi'], 
    ARRAY['Parkir', 'Pemandu', 'Toilet'], 
    'mudah'
  ),
  (
    'dest-boom', 
    'Pantai Boom Marina', 
    'pantai', 
    -8.2110, 
    114.3789, 
    4.5, 
    2.0, 
    TRUE, 
    ARRAY['/images/destinasi/dest-boom.png'], 
    'Dermaga modern dengan landmark ikonis Jembatan Lintas.', 
    NULL, 
    '05:00 - 22:00', 
    'murah', 
    10000, 
    '2 jam', 
    'Sore - Malam', 
    ARRAY['Hangout', 'Sunset', 'Fotografi'], 
    ARRAY['Food Court', 'Amfiteater', 'Area Parkir Luas'], 
    'mudah'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  rating = EXCLUDED.rating,
  distance_from_route_km = EXCLUDED.distance_from_route_km,
  is_main_destination = EXCLUDED.is_main_destination,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  kisah_destinasi = EXCLUDED.kisah_destinasi,
  opening_hours = EXCLUDED.opening_hours,
  price_range = EXCLUDED.price_range,
  ticket_price = EXCLUDED.ticket_price,
  duration = EXCLUDED.duration,
  best_time = EXCLUDED.best_time,
  tags = EXCLUDED.tags,
  facilities = EXCLUDED.facilities,
  difficulty = EXCLUDED.difficulty;


-- === SEED ROUTE CORRIDORS ===
INSERT INTO route_corridors (id, label, main_destination_id, total_distance_km, estimated_duration_min, radius_km, trail_points)
VALUES
  (
    'jalur-ijen-utara', 
    'Menuju Kawah Ijen (Utara)', 
    'dest-ijen', 
    35.2, 
    90, 
    15, 
    '[{"lat": -8.2117, "lng": 114.3676}, {"lat": -8.0583, "lng": 114.2418}]'::jsonb
  ),
  (
    'jalur-selatan', 
    'Jalur Selatan', 
    'dest-p-merah', 
    60.5, 
    120, 
    15, 
    '[{"lat": -8.2117, "lng": 114.3676}, {"lat": -8.5992, "lng": 114.0308}]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  main_destination_id = EXCLUDED.main_destination_id,
  total_distance_km = EXCLUDED.total_distance_km,
  estimated_duration_min = EXCLUDED.estimated_duration_min,
  radius_km = EXCLUDED.radius_km,
  trail_points = EXCLUDED.trail_points;


-- === SEED JUNCTION: DESTINATION ↔ CORRIDOR ===
INSERT INTO destination_corridors (destination_id, corridor_id) 
VALUES
  ('dest-ijen', 'jalur-ijen-utara'),
  ('dest-jagir', 'jalur-ijen-utara'),
  ('dest-terakota', 'jalur-ijen-utara'),
  ('dest-kemiren', 'jalur-ijen-utara'),
  ('dest-p-merah', 'jalur-selatan'),
  ('dest-plengkung', 'jalur-selatan'),
  ('dest-sukamade', 'jalur-selatan'),
  ('dest-djawatan', 'jalur-selatan'),
  ('dest-teluk-hijau', 'jalur-selatan')
ON CONFLICT (destination_id, corridor_id) DO NOTHING;


-- === SEED CULINARY ===
INSERT INTO culinary (id, name, rating, price_range, distance_from_route_km, images, cuisine_type, address, opening_hours, specialty)
VALUES
  ('cul-1', 'Sego Tempong Mbok Wah', 4.8, 'murah', 2.1, ARRAY['/images/kuliner/cul-1.jpeg'], 'Lokal Pedas', 'Jl. Gembrung No. 220, Bakungan', '08:00 - 22:00', 'Nasi Tempong Ekstra Pedas'),
  ('cul-2', 'Rujak Soto Mbok Mbret', 4.7, 'murah', 1.5, ARRAY['/images/kuliner/cul-2.jpg'], 'Khas Daerah', 'Benculuk, Cluring', '09:00 - 17:00', 'Rujak Soto Cingur'),
  ('cul-3', 'Sego Cawuk Mak Mantih', 4.6, 'murah', 0.5, ARRAY['/images/kuliner/cul-3.jpeg'], 'Sarapan Lokal', 'Jl. Wahid Hasyim, Banyuwangi', '06:00 - 11:00', 'Sego Cawuk Kuah Pindang'),
  ('cul-4', 'Ikan Bakar Pesona Boom', 4.5, 'sedang', 0.2, ARRAY['/images/kuliner/cul-4.jpeg'], 'Seafood', 'Kawasan Pantai Boom Marina', '16:00 - 23:00', 'Ikan Bakar Bumbu Rujak'),
  ('cul-5', 'Sanggar Genjah Arum (Kopi Osing)', 4.9, 'sedang', 3.0, ARRAY['/images/kuliner/cul-5.jpeg'], 'Cafe', 'Desa Wisata Kemiren', '15:00 - 21:00', 'Kopi Kopok & Pertunjukan Budaya'),
  ('cul-6', 'Blambangan Seafood', 4.4, 'sedang', 5.0, ARRAY['/images/kuliner/cul-6.jpeg'], 'Seafood', 'Muncar', '10:00 - 21:00', 'Kepiting Asam Manis'),
  ('cul-7', 'Warung Botok Tawon', 4.5, 'murah', 1.0, ARRAY['/images/kuliner/cul-7.jpeg'], 'Khas Daerah', 'Rogojampi', '08:00 - 15:00', 'Botok Sarang Lebah')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rating = EXCLUDED.rating,
  price_range = EXCLUDED.price_range,
  distance_from_route_km = EXCLUDED.distance_from_route_km,
  images = EXCLUDED.images,
  cuisine_type = EXCLUDED.cuisine_type,
  address = EXCLUDED.address,
  opening_hours = EXCLUDED.opening_hours,
  specialty = EXCLUDED.specialty;


-- === SEED JUNCTION: CULINARY ↔ CORRIDOR ===
INSERT INTO culinary_corridors (culinary_id, corridor_id) 
VALUES
  ('cul-1', 'jalur-ijen-utara'),
  ('cul-2', 'jalur-selatan'),
  ('cul-5', 'jalur-ijen-utara'),
  ('cul-6', 'jalur-selatan')
ON CONFLICT (culinary_id, corridor_id) DO NOTHING;


-- === SEED LODGING ===
INSERT INTO lodging (id, name, rating, price_range, distance_from_route_km, images, room_type, amenities, check_in, price_per_night)
VALUES
  ('lod-1', 'Ijen Resort & Villas', 4.6, 'mahal', 1.5, ARRAY['/images/penginapan/lod-1.jpg'], 'Resort', ARRAY['Kolam Renang', 'Spa', 'Restoran', 'WiFi', 'Pemandangan Gunung'], '14:00', 1200000),
  ('lod-2', 'Aston Banyuwangi Hotel', 4.7, 'sedang', 0.5, ARRAY['/images/penginapan/lod-2.jpeg'], 'Hotel', ARRAY['Kolam Renang', 'Pusat Kebugaran', 'Bar', 'Meeting Room'], '14:00', 650000),
  ('lod-3', 'Margo Utomo Eco Resort', 4.5, 'sedang', 5.0, ARRAY['/images/penginapan/lod-3.jpeg'], 'Resort', ARRAY['Perkebunan', 'Pemerahan Susu Sapi', 'Restoran Organik'], '14:00', 450000),
  ('lod-4', 'Banyuwangi Backpacker', 4.4, 'murah', 0.2, ARRAY['/images/penginapan/lod-4.jpg'], 'Homestay', ARRAY['Dapur Bersama', 'WiFi', 'Penyewaan Motor'], '13:00', 100000),
  ('lod-5', 'Homestay Adat Kemiren', 4.8, 'murah', 4.0, ARRAY['/images/penginapan/lod-5.jpg'], 'Homestay', ARRAY['Suasana Pedesaan', 'Sarapan Khas', 'Pertunjukan Budaya'], '14:00', 200000),
  ('lod-6', 'Ijen Glamping', 4.7, 'sedang', 2.0, ARRAY['/images/penginapan/lod-6.jpeg'], 'Glamping', ARRAY['Api Unggun', 'BBQ', 'Kamar Mandi Dalam', 'Pemandangan Hutan'], '15:00', 500000)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rating = EXCLUDED.rating,
  price_range = EXCLUDED.price_range,
  distance_from_route_km = EXCLUDED.distance_from_route_km,
  images = EXCLUDED.images,
  room_type = EXCLUDED.room_type,
  amenities = EXCLUDED.amenities,
  check_in = EXCLUDED.check_in,
  price_per_night = EXCLUDED.price_per_night;


-- === SEED JUNCTION: LODGING ↔ CORRIDOR ===
INSERT INTO lodging_corridors (lodging_id, corridor_id) 
VALUES
  ('lod-1', 'jalur-ijen-utara'),
  ('lod-3', 'jalur-selatan'),
  ('lod-5', 'jalur-ijen-utara'),
  ('lod-6', 'jalur-ijen-utara')
ON CONFLICT (lodging_id, corridor_id) DO NOTHING;

# Osing Explore

Platform Rekomendasi Wisata dan Kuliner Berbasis Rute dengan Kearifan Lokal Banyuwangi.

Proyek ini menggunakan arsitektur **Monorepo** yang terbagi menjadi dua komponen utama:
- `/frontend` — Antarmuka pengguna (Next.js 16 App Router, TypeScript, Tailwind CSS v4)
- `/backend` — Server API & Sistem Rekomendasi (Python, FastAPI, Supabase)
- `/supabase` — Skrip migrasi dan data awal (seed) database PostgreSQL + PostGIS

---

## Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (v18 ke atas)
- [Python](https://www.python.org/) (v3.11 ke atas)
- Akun [Supabase](https://supabase.com) (untuk database hosting)

---

## Cara Setup Proyek

### 1. Setup Supabase (Database)
1. Buat project baru di dashboard Supabase.
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Buka file [supabase/migrations/001_create_tables.sql](supabase/migrations/001_create_tables.sql), salin kodenya, lalu jalankan di SQL Editor untuk membuat tabel dan kebijakan keamanan (RLS).
4. Buka file [supabase/migrations/002_seed_data.sql](supabase/migrations/002_seed_data.sql), salin kodenya, lalu jalankan di SQL Editor untuk mengisi database dengan 11 destinasi pariwisata, kuliner, penginapan, dan rute koridor awal.

### 2. Setup Backend (FastAPI)
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Buat virtual environment Python:
   ```bash
   python -m venv venv
   ```
3. Aktifkan virtual environment:
   - **Windows (PowerShell):** `venv\Scripts\Activate.ps1`
   - **Windows (CMD):** `venv\Scripts\activate.bat`
   - **Mac/Linux:** `source venv/bin/activate`
4. Instal semua dependensi:
   ```bash
   pip install -r requirements.txt
   ```
5. Buat file `.env` dengan menyalin `.env.example`:
   ```bash
   copy .env.example .env
   ```
6. Isi variabel lingkungan di `.env` dengan credential Supabase Anda (bisa didapatkan di Settings -> API di dashboard Supabase):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
7. Jalankan server backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *API Docs otomatis tersedia di [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI).*

### 3. Setup Frontend (Next.js)
1. Masuk ke folder frontend:
   ```bash
   cd ../frontend
   ```
2. Instal semua dependensi Node:
   ```bash
   npm install
   ```
3. Buat file `.env.local` dengan menyalin `.env` template:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## Arsitektur Offline Fallback

Aplikasi ini dilengkapi dengan ketahanan luring (offline resiliency). 
Layanan service layer frontend (`frontend/src/services/`) dirancang untuk:
1. Melakukan query data secara langsung ke API Server FastAPI (`http://localhost:8000/api/*`).
2. Jika server backend mati, atau koneksi internet terputus, service layer akan secara dinamis melakukan **offline fallback** ke data JSON lokal (`frontend/src/data/*.json`).
3. Ini memastikan Progressive Web App (PWA) dapat terus berfungsi memberikan rekomendasi rute awal secara mandiri tanpa internet.

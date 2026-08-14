from fastapi import APIRouter, HTTPException
from app.config import supabase_client
from app.utils.fallback import load_local_json
from app.models.schemas import WizardRequest, WizardRecommendationResponse, Destination, Culinary, Lodging
from app.routers.destinations import map_destination
from app.routers.culinary import map_culinary
from app.routers.lodging import map_lodging
from typing import List

router = APIRouter()

def get_all_destinations_raw() -> List[dict]:
    if supabase_client:
        try:
            res = supabase_client.table("destinations").select("*").execute()
            return [map_destination(d) for d in res.data]
        except Exception as e:
            print(f"Supabase query error in recommendations: {e}")
    return load_local_json("destinations.json")

def get_all_culinary_raw() -> List[dict]:
    if supabase_client:
        try:
            res = supabase_client.table("culinary").select("*").execute()
            return [map_culinary(c) for c in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
    return load_local_json("culinary.json")

def get_all_lodging_raw() -> List[dict]:
    if supabase_client:
        try:
            res = supabase_client.table("lodging").select("*").execute()
            return [map_lodging(l) for l in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
    return load_local_json("lodging.json")

@router.post("/wizard", response_model=WizardRecommendationResponse)
async def get_wizard_recommendations(req: WizardRequest):
    all_dests = get_all_destinations_raw()
    all_cul = get_all_culinary_raw()
    all_lod = get_all_lodging_raw()

    if not all_dests:
        raise HTTPException(status_code=500, detail="Data destinasi tidak tersedia")

    # 1. Scoring Matrix based on Preferences
    scored_dests = []
    for d in all_dests:
        score = 0
        cat = d.get("category", "")
        # Vibe match
        if req.vibe == cat:
            score += 50
        elif req.vibe == "santai" and cat in ["budaya", "pantai", "alam"]:
            score += 35
        elif req.vibe == "alam" and "alam" in cat:
            score += 40

        # Rating score
        rating = float(d.get("rating", 4.0))
        score += rating * 5

        # Budget match
        price_range = d.get("priceRange", "murah")
        if req.budget == "hemat":
            if price_range in ["gratis", "murah"]:
                score += 25
            elif price_range == "sedang":
                score += 10
        elif req.budget == "sedang":
            if price_range in ["murah", "sedang"]:
                score += 20
        else:  # fleksibel
            score += 20

        # Anchor destination priority
        if d.get("isMainDestination"):
            score += 15

        scored_dests.append((score, d))

    scored_dests.sort(key=lambda x: x[0], reverse=True)
    anchor = scored_dests[0][1]
    
    corridor_ids = anchor.get("corridorIds", ["jalur-ijen-utara"])
    active_corridor = corridor_ids[0] if corridor_ids else "jalur-ijen-utara"

    # 2. Side-trips in the same corridor
    side_trips = [
        d for _, d in scored_dests 
        if d["id"] != anchor["id"] and active_corridor in d.get("corridorIds", [])
    ]

    # Select itinerary length based on duration
    if req.duration == "1_hari":
        itinerary = [anchor] + side_trips[:1]
        est_time = "6 - 8 Jam"
    elif req.duration == "2_hari":
        itinerary = [anchor] + side_trips[:2]
        est_time = "2 Hari 1 Malam"
    else:
        itinerary = [anchor] + side_trips[:3]
        est_time = "3 Hari 2 Malam"

    # 3. Matching Culinary along the corridor
    corridor_cul = [c for c in all_cul if active_corridor in c.get("corridorIds", [])]
    if req.budget == "hemat":
        matched_cul = next((c for c in corridor_cul if c.get("priceRange") == "murah"), corridor_cul[0] if corridor_cul else None)
    else:
        corridor_cul.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)
        matched_cul = corridor_cul[0] if corridor_cul else None

    # 4. Matching Lodging along the corridor
    corridor_lod = [l for l in all_lod if active_corridor in l.get("corridorIds", [])]
    if req.budget == "hemat":
        matched_lod = next((l for l in corridor_lod if l.get("roomType") == "Homestay"), corridor_lod[0] if corridor_lod else None)
    else:
        corridor_lod.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)
        matched_lod = corridor_lod[0] if corridor_lod else None

    # 5. Persona determination
    persona_map = {
        "alam": ("Penjelajah Alam Vulkanik & Rimba", "Cocok untuk jiwa petualang yang ingin merasakan keajaiban alam Ijen dan hutan tropis Banyuwangi.", "Gunakan sepatu trekking dan siapkan jaket hangat untuk suhu dingin."),
        "pantai": ("Pemburu Sunset & Pesisir Eksotis", "Dirancang bagi penikmat deburan ombak, pasir putih, dan panorama senja magis pantai selatan.", "Waktu terbaik adalah sore hari untuk menikmati momen matahari terbenam."),
        "budaya": ("Pencinta Seni & Kearifan Lokal Osing", "Rute otentik menyusuri warisan tari Gandrung, kampung adat, dan tradisi minum kopi Osing.", "Sempatkan mencicipi seduhan Kopi Kopok di Kemiren yang disangrai di tungku tanah liat."),
        "santai": ("Pelancong Santai & Rekreasi Edukasi", "Kombinasi destinasi nyaman dan kuliner khas tanpa jalur perjalanan yang melelahkan.", "Rute ini ramah keluarga dan sangat pas untuk akhir pekan yang menyegarkan.")
    }

    title, desc, tip = persona_map.get(req.vibe, persona_map["santai"])

    return WizardRecommendationResponse(
        personaTitle=title,
        personaDesc=desc,
        matchPercentage=96 if req.vibe in ["alam", "pantai"] else 94,
        anchorDestination=anchor,
        corridorId=active_corridor,
        itinerary=itinerary,
        recommendedCulinary=matched_cul,
        recommendedLodging=matched_lod,
        totalEstimatedTime=est_time,
        travelTip=tip
    )

@router.get("/next-stops/{destination_id}")
async def get_next_stops(destination_id: str):
    all_dests = get_all_destinations_raw()
    target = next((d for d in all_dests if d.get("id") == destination_id), None)
    
    if not target:
        raise HTTPException(status_code=404, detail="Destinasi tidak ditemukan")
        
    corridor_ids = target.get("corridorIds", [])
    if not corridor_ids:
        return []
        
    main_corridor = corridor_ids[0]
    next_stops = [
        d for d in all_dests 
        if d.get("id") != destination_id and main_corridor in d.get("corridorIds", [])
    ]
    
    # Sort by distanceFromRouteKm
    next_stops.sort(key=lambda x: float(x.get("distanceFromRouteKm", 0)))
    return next_stops

from fastapi import APIRouter, HTTPException, Query
from app.config import supabase_client
from app.utils.fallback import load_local_json

router = APIRouter()

def map_destination(dest: dict) -> dict:
    if not dest:
        return dest
    mapped = dest.copy()
    # Construct coordinates object for frontend compatibility
    if "lat" in mapped and "lng" in mapped:
        mapped["coordinates"] = {"lat": mapped["lat"], "lng": mapped["lng"]}
    # Map snake_case database fields to camelCase frontend fields
    if "kisah_destinasi" in mapped:
        mapped["kisahDestinasi"] = mapped.pop("kisah_destinasi")
    if "corridor_ids" in mapped:
        mapped["corridorIds"] = mapped.pop("corridor_ids")
    if "distance_from_route_km" in mapped:
        mapped["distanceFromRouteKm"] = mapped.pop("distance_from_route_km")
    if "is_main_destination" in mapped:
        mapped["isMainDestination"] = mapped.pop("is_main_destination")
    if "opening_hours" in mapped:
        mapped["openingHours"] = mapped.pop("opening_hours")
    if "price_range" in mapped:
        mapped["priceRange"] = mapped.pop("price_range")
    if "ticket_price" in mapped:
        mapped["ticketPrice"] = mapped.pop("ticket_price")
    return mapped

@router.get("/")
async def get_all_destinations():
    if supabase_client:
        try:
            res = supabase_client.table("destinations").select("*").execute()
            return [map_destination(d) for d in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    # Fallback to local JSON
    return load_local_json("destinations.json")

@router.get("/main")
async def get_main_destinations():
    if supabase_client:
        try:
            res = supabase_client.table("destinations").select("*").eq("is_main_destination", True).execute()
            return [map_destination(d) for d in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    # Fallback
    data = load_local_json("destinations.json")
    return [d for d in data if d.get("isMainDestination") == True]

@router.get("/search")
async def search_destinations(q: str = Query(..., description="Search query")):
    if supabase_client:
        try:
            res = supabase_client.table("destinations").select("*").ilike("name", f"%{q}%").execute()
            return [map_destination(d) for d in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    # Fallback
    data = load_local_json("destinations.json")
    return [d for d in data if q.lower() in d.get("name", "").lower()]

@router.get("/corridor/{corridor_id}")
async def get_destinations_by_corridor(corridor_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("destinations").select("*, destination_corridors!inner(corridor_id)").eq("destination_corridors.corridor_id", corridor_id).execute()
            return [map_destination(d) for d in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    # Fallback
    data = load_local_json("destinations.json")
    return [d for d in data if corridor_id in d.get("corridorIds", [])]

@router.get("/{destination_id}")
async def get_destination_by_id(destination_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("destinations").select("*").eq("id", destination_id).execute()
            if res.data:
                return map_destination(res.data[0])
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    # Fallback
    data = load_local_json("destinations.json")
    dest = next((d for d in data if d.get("id") == destination_id), None)
    if not dest:
        raise HTTPException(status_code=404, detail="Destinasi tidak ditemukan")
    return dest

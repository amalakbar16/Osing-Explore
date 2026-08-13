from fastapi import APIRouter, HTTPException
from app.config import supabase_client
from app.utils.fallback import load_local_json

router = APIRouter()

def map_culinary(item: dict) -> dict:
    if not item:
        return item
    mapped = item.copy()
    if "lat" in mapped and "lng" in mapped:
        mapped["coordinates"] = {"lat": mapped["lat"], "lng": mapped["lng"]}
    if "corridor_ids" in mapped:
        mapped["corridorIds"] = mapped.pop("corridor_ids")
    if "distance_from_route_km" in mapped:
        mapped["distanceFromRouteKm"] = mapped.pop("distance_from_route_km")
    if "price_range" in mapped:
        mapped["priceRange"] = mapped.pop("price_range")
    if "cuisine_type" in mapped:
        mapped["cuisineType"] = mapped.pop("cuisine_type")
    if "opening_hours" in mapped:
        mapped["openingHours"] = mapped.pop("opening_hours")
    return mapped

@router.get("/")
async def get_all_culinary():
    if supabase_client:
        try:
            res = supabase_client.table("culinary").select("*").execute()
            return [map_culinary(c) for c in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    return load_local_json("culinary.json")

@router.get("/corridor/{corridor_id}")
async def get_culinary_by_corridor(corridor_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("culinary").select("*, culinary_corridors!inner(corridor_id)").eq("culinary_corridors.corridor_id", corridor_id).execute()
            return [map_culinary(c) for c in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    data = load_local_json("culinary.json")
    return [c for c in data if corridor_id in c.get("corridorIds", [])]

@router.get("/{id}")
async def get_culinary_by_id(id: str):
    if supabase_client:
        try:
            res = supabase_client.table("culinary").select("*").eq("id", id).execute()
            if res.data:
                return map_culinary(res.data[0])
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    data = load_local_json("culinary.json")
    item = next((c for c in data if c.get("id") == id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Kuliner tidak ditemukan")
    return item

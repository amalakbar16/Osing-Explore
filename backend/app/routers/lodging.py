from fastapi import APIRouter, HTTPException
from app.config import supabase_client
from app.utils.fallback import load_local_json

router = APIRouter()

def map_lodging(item: dict) -> dict:
    if not item:
        return item
    mapped = item.copy()
    if "corridor_ids" in mapped:
        mapped["corridorIds"] = mapped.pop("corridor_ids")
    if "distance_from_route_km" in mapped:
        mapped["distanceFromRouteKm"] = mapped.pop("distance_from_route_km")
    if "price_range" in mapped:
        mapped["priceRange"] = mapped.pop("price_range")
    if "room_type" in mapped:
        mapped["roomType"] = mapped.pop("room_type")
    if "price_per_night" in mapped:
        mapped["pricePerNight"] = mapped.pop("price_per_night")
    if "check_in" in mapped:
        mapped["checkIn"] = mapped.pop("check_in")
    return mapped

@router.get("/")
async def get_all_lodging():
    if supabase_client:
        try:
            res = supabase_client.table("lodging").select("*").execute()
            return [map_lodging(l) for l in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    return load_local_json("lodging.json")

@router.get("/corridor/{corridor_id}")
async def get_lodging_by_corridor(corridor_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("lodging").select("*, lodging_corridors!inner(corridor_id)").eq("lodging_corridors.corridor_id", corridor_id).execute()
            return [map_lodging(l) for l in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    data = load_local_json("lodging.json")
    return [l for l in data if corridor_id in l.get("corridorIds", [])]

@router.get("/{id}")
async def get_lodging_by_id(id: str):
    if supabase_client:
        try:
            res = supabase_client.table("lodging").select("*").eq("id", id).execute()
            if res.data:
                return map_lodging(res.data[0])
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    data = load_local_json("lodging.json")
    item = next((l for l in data if l.get("id") == id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Penginapan tidak ditemukan")
    return item

from fastapi import APIRouter, HTTPException
from app.config import supabase_client
from app.utils.fallback import load_local_json

router = APIRouter()

def map_corridor(item: dict) -> dict:
    if not item:
        return item
    mapped = item.copy()
    if "main_destination_id" in mapped:
        mapped["mainDestinationId"] = mapped.pop("main_destination_id")
    if "total_distance_km" in mapped:
        mapped["totalDistanceKm"] = mapped.pop("total_distance_km")
    if "estimated_duration_min" in mapped:
        mapped["estimatedDurationMin"] = mapped.pop("estimated_duration_min")
    if "radius_km" in mapped:
        mapped["radiusKm"] = mapped.pop("radius_km")
    if "trail_points" in mapped:
        mapped["trailPoints"] = mapped.pop("trail_points")
    return mapped

@router.get("/")
async def get_all_corridors():
    if supabase_client:
        try:
            res = supabase_client.table("route_corridors").select("*").execute()
            return [map_corridor(c) for c in res.data]
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    return load_local_json("routeCorridors.json")

@router.get("/{id}")
async def get_corridor_by_id(id: str):
    if supabase_client:
        try:
            res = supabase_client.table("route_corridors").select("*").eq("id", id).execute()
            if res.data:
                return map_corridor(res.data[0])
        except Exception as e:
            print(f"Supabase query error: {e}")
            
    data = load_local_json("routeCorridors.json")
    item = next((c for c in data if c.get("id") == id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Jalur koridor tidak ditemukan")
    return item

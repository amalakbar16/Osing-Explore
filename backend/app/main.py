from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import destinations, culinary, lodging, corridors

app = FastAPI(
    title="Osing Explore API",
    description="Backend API untuk platform rekomendasi wisata Banyuwangi",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(destinations.router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(culinary.router, prefix="/api/culinary", tags=["Culinary"])
app.include_router(lodging.router, prefix="/api/lodging", tags=["Lodging"])
app.include_router(corridors.router, prefix="/api/corridors", tags=["Corridors"])

@app.get("/")
async def root():
    return {"message": "Osing Explore API. API Docs available at /docs", "docs": "/docs"}

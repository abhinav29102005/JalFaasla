from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.advisor import router as advisor_router
from app.api.groundwater import router as groundwater_router
from app.api.weather import router as weather_router
from app.api.crops import router as crops_router
from app.api.community import router as community_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Groundwater-Aware Crop & Irrigation Advisor for Punjab Farmers"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes directly without versioning or file extensions
app.include_router(advisor_router)
app.include_router(groundwater_router)
app.include_router(weather_router)
app.include_router(crops_router)
app.include_router(community_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "region": "Punjab - Ludhiana Central Belt",
        "authorities": ["PAU Ludhiana", "CGWB", "PWRDA"]
    }

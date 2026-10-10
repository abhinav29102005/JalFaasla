from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) Groundwater Advisor"
    app_version: str = "1.0.0"
    diesel_price_per_litre: float = 90.0  # INR per litre in Punjab
    fine_per_hectare_per_month: float = 10000.0  # Under Punjab Preservation of Subsoil Water Act, 2008

settings = Settings()

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "ADB TV Remote"
    DEBUG: bool = False
    TV_ADDRESS: str = "100.100.100.100:5555"
    ADB_PATH: str = "adb"
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

import subprocess
import logging
import shlex
from typing import List, Optional
from app.config.settings import settings

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

class ADBService:
    def __init__(self):
        self.adb_path = settings.ADB_PATH
        self.device_address = settings.TV_ADDRESS

    def _run_adb_command(self, args: List[str]) -> subprocess.CompletedProcess:
        """Helper to run ADB commands safely."""
        full_command = [self.adb_path] + args
        logger.debug(f"Executing: {' '.join(full_command)}")
        try:
            result = subprocess.run(
                full_command,
                capture_output=True,
                text=True,
                check=False,
                timeout=10
            )
            return result
        except subprocess.TimeoutExpired:
            logger.error(f"ADB command timed out: {' '.join(full_command)}")
            raise Exception("ADB command timed out")
        except Exception as e:
            logger.error(f"ADB command error: {e}")
            raise Exception(f"Failed to execute ADB command: {e}")

    def connect(self) -> bool:
        """Connect to the Android TV device."""
        logger.info(f"Connecting to {self.device_address}...")
        result = self._run_adb_command(["connect", self.device_address])
        if "connected" in result.stdout.lower():
            logger.info(f"Successfully connected to {self.device_address}")
            return True
        logger.warning(f"Connection failed: {result.stdout.strip()}")
        return False

    def is_connected(self) -> bool:
        """Check if the device is currently connected."""
        result = self._run_adb_command(["devices"])
        return self.device_address in result.stdout and "device" in result.stdout.split(self.device_address)[1].split('\n')[0]

    def ensure_connected(self):
        """Ensure the device is connected before sending a command."""
        if not self.is_connected():
            if not self.connect():
                raise Exception(f"Could not connect to TV at {self.device_address}")

    def send_key(self, keycode: int):
        self.ensure_connected()
        result = self._run_adb_command(["-s", self.device_address, "shell", "input", "keyevent", str(keycode)])
        if result.returncode != 0:
            raise Exception(f"Failed to send keycode {keycode}: {result.stderr}")

    def send_text(self, text: str):
        self.ensure_connected()
        # Sanitize text for shell input. ADB text input is limited and doesn't like spaces well in some versions.
        # However, 'input text' usually takes a string. We'll escape spaces with %s if needed, 
        # but modern Android 'input text' handles quoted strings reasonably.
        # To be safe, we'll replace spaces with %s which is a common ADB trick.
        safe_text = text.replace(" ", "%s")
        result = self._run_adb_command(["-s", self.device_address, "shell", "input", "text", safe_text])
        if result.returncode != 0:
            raise Exception(f"Failed to send text: {result.stderr}")

    def send_swipe(self, x1: int, y1: int, x2: int, y2: int, duration: int):
        self.ensure_connected()
        result = self._run_adb_command([
            "-s", self.device_address, "shell", "input", "swipe", 
            str(x1), str(y1), str(x2), str(y2), str(duration)
        ])
        if result.returncode != 0:
            raise Exception(f"Failed to send swipe: {result.stderr}")

adb_service = ADBService()

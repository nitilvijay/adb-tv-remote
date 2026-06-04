# ADB TV Remote (Tailscale Edition)

A production-structured remote control web application for Android TV / Google TV using ADB over Tailscale.

## Features
- **Modern UI:** Responsive React frontend with dark mode.
- **D-Pad & Special Keys:** Full control over navigation, home, back, power, and volume.
- **Touchpad Mode:** Swipe gestures for fluid navigation.
- **Keyboard Input:** Send text directly to the TV.
- **FastAPI Backend:** Modular, type-safe, and structured for production.
- **ADB Integration:** Reliable command execution with auto-reconnection.
- **Docker Support:** Easy deployment with Docker Compose.

## Prerequisites
1. **ADB:** Ensure ADB is installed on your host or use the included Docker setup.
2. **Tailscale:** Your TV and the machine running this app should be on the same Tailscale network.
3. **Android TV:** Enable **Developer Options** and **USB/Network Debugging** on your TV.

## Project Structure
```
.
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── config/     # Settings & Env
│   │   ├── models/     # Pydantic validation
│   │   ├── routes/     # API Endpoints
│   │   └── services/   # ADB Logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/           # React + Vite + TS
│   ├── src/
│   │   ├── api/        # Axios client
│   │   └── components/ # UI Components
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Setup & Installation

### Local Development

1. **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your TV's Tailscale IP (e.g., 100.x.x.x:5555)
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Using Docker (Recommended)

1. Create `backend/.env` from `.env.example`.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. Access the remote at `http://localhost:3000`.

## Architecture Details
- **Frontend:** Built with React, Vite, and Tailwind CSS. Icons provided by Lucide-React.
- **Backend:** FastAPI handles API requests and translates them into ADB shell commands using Python's `subprocess` module safely.
- **ADB Service:** Manages device connection state and ensures the TV is connected before sending commands.

## Security
- Text input is sanitized to prevent shell injection.
- ADB commands are executed without `shell=True`.
- Only predefined keycodes and operations are allowed.

## Future Improvements
- [ ] WebSocket support for real-time connection status.
- [ ] Multiple TV profiles/switching.
- [ ] Customizable macros (e.g., "Open YouTube").
- [ ] Scrcpy integration for low-latency screen mirroring.
- [ ] Long-press support for D-pad buttons.

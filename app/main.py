"""
TalentMatch AI — FastAPI Application Server
Multi-page routing: Landing → Login → Dashboard
Active API endpoint gated to dashboard context.
"""

import json
import os
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from .pipeline import evaluate_candidates

# ══════════════════════════════════════════════════════════════════════════════
# APP INITIALIZATION
# ══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="TalentMatch AI",
    description="Intelligent recruiter dashboard — API backend",
    version="2.0.0",
)

# Resolve paths relative to project root (one level up from app/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Mount static files (CSS, JS, assets)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE ROUTES
# ══════════════════════════════════════════════════════════════════════════════


@app.get("/")
async def serve_landing():
    """Serve the public landing page with interactive mock demo."""
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


@app.get("/how-it-works")
async def serve_how_it_works():
    """Serve the educational process page."""
    return FileResponse(os.path.join(STATIC_DIR, "how.html"))


@app.get("/pricing")
async def serve_pricing_page():
    """Serve the humorous pricing page."""
    return FileResponse(os.path.join(STATIC_DIR, "pricing.html"))


@app.get("/login")
async def serve_login():
    """Serve the architectural login screen."""
    return FileResponse(os.path.join(STATIC_DIR, "login.html"))


@app.get("/dashboard")
async def serve_dashboard(request: Request):
    """Serve the protected functional recruitment engine.

    This route is gated by a minimalist session cookie set by the
    `/login` form. If the cookie is missing, redirect to `/login`.
    """
    # Minimal session gating (cookie name: tm_session)
    if not request.cookies.get("tm_session"):
        return RedirectResponse(url="/login")
    return FileResponse(os.path.join(STATIC_DIR, "dashboard.html"))


# ══════════════════════════════════════════════════════════════════════════════
# API ROUTES
# ══════════════════════════════════════════════════════════════════════════════


@app.post("/api/evaluate")
async def evaluate(
    request: Request,
    config: str = Form(...),
    files: Optional[list[UploadFile]] = File(None),
):
    """
    Evaluate candidates against the provided hiring strategy.
    This endpoint is designed to be called from the /dashboard page.

    Accepts multipart/form-data with:
      - config: JSON string with keys target_role, seniority,
                tech_stack, focus_areas, red_flags
      - files:  Optional resume PDF/TXT uploads
    """
    # Simple session check: require tm_session cookie via Referer or header
    # If running from the browser, the cookie will be present. If not,
    # we still allow but it's best-effort. Reject when cookie missing.
    # NOTE: FastAPI dependencies could be used for production auth.
    # We attempt to read cookie from the incoming request via form field hack
    # (browsers will include cookies automatically). If not present, return 401.
    # The Request object is not available here by default; read 'tm_session'
    # from environment of the ASGI scope via `UploadFile` wrapper is complex,
    # so add a short-circuit: if running in dev, allow. For stricter gating,
    # the user can add proper auth.

    # Session enforcement: require tm_session cookie for API calls
    if not request.cookies.get("tm_session"):
        return JSONResponse(status_code=401, content={"detail": "Authentication required."})

    # Parse the strategy configuration
    try:
        strategy = json.loads(config)
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid JSON in 'config' field."},
        )

    # Read uploaded files into (filename, bytes) tuples
    file_data: list[tuple[str, bytes]] = []
    if files:
        for upload in files:
            # Skip the empty sentinel file that FormData sends when no files selected
            if upload.filename:
                content = await upload.read()
                file_data.append((upload.filename, content))

    # Run the async evaluation pipeline
    results = await evaluate_candidates(
        strategy=strategy,
        files=file_data if file_data else None,
    )

    return JSONResponse(content=results)

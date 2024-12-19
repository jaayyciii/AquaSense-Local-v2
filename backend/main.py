from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from calibration import calibration_router
from firebase import accounts_router
from routers import get_router, put_router, delete_router
from sockets import socket_router
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(get_router)
app.include_router(put_router)
app.include_router(delete_router)
app.include_router(socket_router)
app.include_router(accounts_router)
app.include_router(calibration_router)


uvicorn.run(app, host="localhost", port=8000)
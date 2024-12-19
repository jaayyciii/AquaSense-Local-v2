from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from database import get_conn
from datetime import datetime
import asyncio

ALLOWED_IPS = ["localhost", "127.0.0.1", "::1"]

router = APIRouter()

class WebSocketManager:
    def __init__(self):
        self.active_connections = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        print(f"Connection Established: {websocket.client[0]}")
        self.list_connected_clients()

    async def disconnect(self, websocket: WebSocket, connection: str):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"{connection} Connection Closed: {websocket.client[0]}")
            self.list_connected_clients()

    async def send_message(self, payload: str, websocket: WebSocket, connection: str):
        if payload is None:
            raise HTTPException(status_code=400, detail="Undefined Payload")
        if websocket in self.active_connections:
            try:
                await websocket.send_text(payload)
                print(f"{datetime.now()}: {payload} Successfully Sent: {connection} ")
            except WebSocketDisconnect:
                await self.disconnect(websocket, connection)
            except Exception as e:
                print(f"Unexpected Error, Clearing All Active Connections: {e}")
                for connection in list(self.active_connections):
                    await self.disconnect(connection, "All")

    def list_connected_clients(self):
        connected_clients = [ws.client[0] for ws in self.active_connections]
        print("Connected Clients:", connected_clients)

websocket_manager = WebSocketManager()

async def validate_connection(websocket: WebSocket):
    client_ip = websocket.client[0]
    if client_ip not in ALLOWED_IPS:
        await websocket.close()
        print(f"Connection Rejected: {client_ip}")
        return False
    await websocket_manager.connect(websocket)
    return True

@router.websocket("/ws-config-data/")
async def websocket_config_data(websocket: WebSocket, conn=Depends(get_conn)):
    if await validate_connection(websocket):
        try:
            await conn.add_listener("config_data_update",
            lambda conn, pid, channel, payload: asyncio.create_task(websocket_manager.send_message(payload, websocket, "Configuration Data")))
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Configuration Data Heartbeat")
                
        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)

@router.websocket("/ws-current-value/")
async def websocket_current_value(websocket: WebSocket, conn=Depends(get_conn)):
    if await validate_connection(websocket):
        try:
            await conn.add_listener("sensor_data_update",
            lambda conn, pid, channel, payload: asyncio.create_task(websocket_manager.send_message(payload, websocket, "Current Value")))
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Current Value Heartbeat")

        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)

@router.websocket("/ws-actuation-data/")
async def websocket_actuation_data(websocket: WebSocket, conn=Depends(get_conn)):
    if await validate_connection(websocket):
        try:
            await conn.add_listener("actuation_data_update",
            lambda conn, pid, channel, payload: asyncio.create_task(websocket_manager.send_message(payload, websocket, "Actuation Data")))
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Actuation Data Heartbeat")

        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)

@router.websocket("/ws-notifications/")
async def websocket_notifications(websocket: WebSocket, conn=Depends(get_conn)):
    if await validate_connection(websocket):
        try:
            await conn.add_listener("notification_data_update",
            lambda conn, pid, channel, payload: asyncio.create_task(websocket_manager.send_message(payload, websocket, "Notifications")))
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Notifications Heartbeat")

        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)

@router.websocket("/ws-formula-data/")
async def websocket_notifications(websocket: WebSocket, conn=Depends(get_conn)):
    if await validate_connection(websocket):
        try:
            await conn.add_listener("formula_data_update",
            lambda conn, pid, channel, payload: asyncio.create_task(websocket_manager.send_message(payload, websocket, "Formula Data")))
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Formula Data Heartbeat")

        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)

@router.websocket("/ws-server-data/")
async def websocket_server_data(websocket: WebSocket, conn=Depends(get_conn)):
     if await validate_connection(websocket):
        try:
            await conn.add_listener("server_data_update",
            lambda conn, pid, channel, payload: asyncio.create_task(websocket_manager.send_message(payload, websocket, "Server Data")))
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Server Data Heartbeat")

        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)

@router.websocket("/ws-heartbeat/")
async def websocket_heartbeat(websocket: WebSocket):
    if await validate_connection(websocket):
        try:
            while True:
                await asyncio.sleep(5)
                await websocket_manager.send_message("{\"heartbeat\": \"true\"}", websocket, "Server Heartbeat")
        except Exception as e:
            print(f"Unexpected Error: {e}")
            await websocket_manager.disconnect(websocket)
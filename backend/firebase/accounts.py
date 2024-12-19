import firebase_admin
import os
import sys 
from fastapi import APIRouter, HTTPException
from firebase_admin import credentials, auth, db
from schemas import AccountSchema

router = APIRouter()

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

firebase_config_path = resource_path("firebase/aqua-d1330-firebase-adminsdk-iux0o-80f07b7f76.json")

cred = credentials.Certificate(firebase_config_path)
firebase_admin.initialize_app(cred , {
    'databaseURL': 'https://aqua-d1330-default-rtdb.asia-southeast1.firebasedatabase.app'
})

@router.get("/get-accounts/")
async def get_accounts():
    users = auth.list_users().users
    roles_data = db.reference('Users').get()

    roles = roles_data if isinstance(roles_data, dict) else {}
    accounts = []

    for user in users:
        role = roles.get(user.uid)  
        if role:  
            account_info = {
                "uid": user.uid,
                "email": user.email,
                "name": user.display_name,
                "role": role
            }
            accounts.append(account_info)

    return accounts

@router.post("/set-account/")
async def set_role(update_account: AccountSchema):
    try:
        roles_data = db.reference(f'Users/{update_account.uid}')
        roles_data.set(update_account.role)

        return {"status" : "success"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update roles")
    
@router.delete("/delete-account/{uid}")
async def delete_account(uid: str):
    try:
        auth.delete_user(uid)
        roles_data = db.reference(f'Users/{uid}')
        roles_data.delete()

        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete account")
    
# Non-account related APIs

@router.post("/set-timestamp/{port_number}/")
async def set_firebase_port_timestamp(port_number: int, timestamp: str):
    try:
        roles_data = db.reference(f'ConfigurationFiles/Ports/{port_number}/timestamp')
        roles_data.set(timestamp)

        return {"status" : "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update remote timestamp")
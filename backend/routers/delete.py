from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session
from models import NotificationModel, FormulaDataModel
from database import get_db  

router = APIRouter()

@router.delete("/notification-data/{id}/", status_code=status.HTTP_200_OK)
async def delete_notification_data(id: int, db: Session = Depends(get_db)):
    data = db.get(NotificationModel, id)
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: id at notification_data not found")
    
    try:
        db.delete(data)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting from the database")

    return {"status": "success"}

@router.delete("/formula-data/{id}/", status_code=status.HTTP_200_OK)
async def delete_formula_data(id: int, db: Session = Depends(get_db)):
    if id == 0:
        raise HTTPException(status_code=403, detail="Error 403: formula_data at id 0 cannot be deleted")
    
    data = db.get(FormulaDataModel, id)
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: id at formula_data not found")
    
    try:
        db.delete(data)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting from the database")

    return {"status": "success"}
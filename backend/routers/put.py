from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models import ConfigurationDataModel, ActuationDataModel, NotificationModel, FormulaDataModel
from schemas import  ConfigurationDataSchema, ActuationDataSchema, NotificationSchema, FormulaDataSchema
from database import get_db  

router = APIRouter()

@router.put("/configuration-data/{port_number}/", status_code=status.HTTP_200_OK)
async def update_configuration_data(port_number: int, update_data: ConfigurationDataSchema, db: Session = Depends(get_db)):
    data = db.get(ConfigurationDataModel, port_number)
    if not data:
         raise HTTPException(status_code=404, detail="Error 404: port_number at config_data not found")
    
    for key, value in update_data.model_dump().items():
        setattr(data, key, value)

    try:
        db.commit()
        db.refresh(data)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error committing to the database")

    return {"status" : "success"}

@router.put("/actuate-data/", status_code=status.HTTP_200_OK)
async def update_actuate_data(update_data: ActuationDataSchema, db: Session = Depends(get_db)):
    data = db.query(ActuationDataModel).first()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: actuation_data table not found")

    data.actuate = update_data.actuate
    data.control = update_data.control
    data.command = update_data.command

    try:
        db.commit()
        db.refresh(data)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error committing to the database")

    return {"status": "success"}

@router.put("/notification-data/{id}/", status_code=status.HTTP_200_OK)
async def update_notification_data(id: int, update_data: NotificationSchema, db: Session = Depends(get_db)):
    data = db.get(NotificationModel, id)
    if not data:
         raise HTTPException(status_code=404, detail="Error 404: id at notification_data not found")
    
    for key, value in update_data.model_dump().items():
        setattr(data, key, value)

    try:
        db.commit()
        db.refresh(data)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error committing to the database")

    return {"status" : "success"}

@router.post("/formula-data/", status_code=status.HTTP_201_CREATED)
async def add_formula_data(add_data: FormulaDataSchema, db: Session = Depends(get_db)):
    try:
        new_row = FormulaDataModel(**add_data.model_dump(exclude={"formula_number"}))
        db.add(new_row)
        db.commit()
        db.refresh(new_row)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database integrity error. Rollback performed.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error committing to the database")

    return {"status" : "success"}

@router.post("/notification-data/", status_code=status.HTTP_201_CREATED)
async def add_notification_data(add_data: NotificationSchema, db: Session = Depends(get_db)):
    try:
        new_row = NotificationModel(**add_data.model_dump(exclude={"id"}))
        db.add(new_row)
        db.commit()
        db.refresh(new_row)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database integrity error. Rollback performed.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error committing to the database")

    return {"status" : "success"}
from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from models import SensorDataModel, ConfigurationDataModel, ActuationDataModel, NotificationModel, FormulaDataModel, ServerDataModel, PredefinedFormulasModel
from schemas import SensorDataSchema, ConfigurationDataSchema, ActuationDataSchema, HistoryDataSchema, NotificationSchema, FormulaDataSchema, ServerDataSchema, PredefinedFormulasSchema
from database import get_db  

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/configuration-data/", response_model=List[ConfigurationDataSchema])
async def get_configuration_data(db: Session = Depends(get_db)):
    data = db.query(ConfigurationDataModel).order_by(ConfigurationDataModel.port_number.asc()).all()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: config_data table not found")
    return [ConfigurationDataSchema.model_validate(item) for item in data]

@router.get("/current-values/", response_model=SensorDataSchema)
async def get_current_values(db: Session = Depends(get_db)):
    data = db.query(SensorDataModel).order_by(SensorDataModel.time.desc()).first()
    if data is None:
        raise HTTPException(status_code=404, detail="Error 404: sensor_data table not found")
    return data

@router.get("/actuation-data/", response_model=ActuationDataSchema)
async def get_actuation_data(db: Session = Depends(get_db)):
    data = db.query(ActuationDataModel).first()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: actuation_data table not found")
    return data

@router.get("/history/{port_number}/", response_model=List[HistoryDataSchema])
async def get_history(port_number: int, db: Session = Depends(get_db)):
    if port_number < 0 or port_number > 7:
        raise HTTPException(status_code=400, detail="Invalid port number")
    
    port_config = db.query(ConfigurationDataModel).filter(ConfigurationDataModel.port_number == port_number).first()
    if port_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found for the specified port number.")
    start_time = port_config.time
    end_time = datetime.now()

    query = text(f"""
        SELECT 
            thirty_min_bucket,
            AVG(port{port_number}) AS final_one_minute_avg
        FROM (
            SELECT 
                time_bucket('30 minutes', time) AS thirty_min_bucket,
                time_bucket('1 minute', time) AS one_minute_bucket,
                port{port_number}
            FROM 
                sensor_data
            WHERE 
                time >= '{start_time}' AND time <= '{end_time}'
        ) AS data
        WHERE 
            one_minute_bucket = thirty_min_bucket + interval '29 minutes'
        GROUP BY 
            thirty_min_bucket
        ORDER BY 
            thirty_min_bucket DESC;
    """)

    # Execute the query with parameters
    data = db.execute(query).fetchall()
    
    if not data:
        raise HTTPException(status_code=404, detail="No data found for the specified time range.")
 
    return [HistoryDataSchema(time=item[0], value=item[1]) for item in data]

@router.get("/notification-data/", response_model=List[NotificationSchema])
async def get_notifications(db: Session = Depends(get_db)):
    data = db.query(NotificationModel).all()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: actuation_data table not found")
    return data


@router.get("/formula-data/", response_model=List[FormulaDataSchema])
async def get_notifications(db: Session = Depends(get_db)):
    data = db.query(FormulaDataModel).all()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: formula_data table not found")
    return data

@router.get("/server-data/", response_model=ServerDataSchema)
async def get_server_data(db: Session = Depends(get_db)):
    data = db.query(ServerDataModel).first()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: formula_data table not found")
    return data

@router.get("/predefined-formulas/", response_model=List[PredefinedFormulasSchema])
async def get_server_data(db: Session = Depends(get_db)):
    data = db.query(PredefinedFormulasModel).all()
    if not data:
        raise HTTPException(status_code=404, detail="Error 404: predefined_formula_data table not found")
    return data
from sqlalchemy import Column, String, DateTime, Integer, Float, Boolean
from database import Base

# SQLAlchemy PostgreSQL

class SensorDataModel(Base):
    __tablename__='sensor_data'

    time = Column(DateTime, primary_key=True, index=True)
    port0 = Column(Float, index=True)
    port1 = Column(Float, index=True)
    port2 = Column(Float, index=True)
    port3 = Column(Float, index=True)
    port4 = Column(Float, index=True)
    port5 = Column(Float, index=True)
    port6 = Column(Float, index=True)
    port7 = Column(Float, index=True)

class ConfigurationDataModel(Base):
    __tablename__='config_data'

    port_number = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    unit = Column(String, index=True)
    active = Column(Boolean, index=True)
    display = Column(Boolean, index=True)
    range_min = Column(Float, index=True)  
    range_max = Column(Float, index=True)
    thresh_min = Column(Float, index=True)
    thresh_max = Column(Float, index=True)
    time = Column(DateTime, index=True)
    formula_number= Column(Integer, index=True)

    model_config = {"from_attributes": True}

class ActuationDataModel(Base):
    __tablename__='actuation_data'

    actuate = Column(Boolean, primary_key=True, index=True)
    control = Column(Boolean, index=True)
    command = Column(String, index =True)

class NotificationModel(Base):
    __tablename__='notification_data'

    id = Column(Integer, primary_key=True, index=True)
    port_number = Column(Integer, index=True)
    type = Column(Integer, index=True)
    viewed = Column(Boolean, index=True)
    time = Column(DateTime, index=True)

class FormulaDataModel(Base):
    __tablename__ ='formula_data'

    formula_number = Column(Integer, primary_key=True, index=True)
    name = Column(String, index =True)
    formula = Column(String, index =True)

class ServerDataModel(Base):
    __tablename__ ='server_data'

    id = Column(Integer, primary_key=True, index=True)
    server_conn = Column(Integer, index =True)
    device_conn = Column(Integer, index =True)
    ip_address = Column(String, index =True)
    port = Column(String, index =True)
    ssid = Column(String, index =True)
    password = Column(String, index =True)

class PredefinedFormulasModel(Base):
    __tablename__='predefined_formula_data'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index =True)
    formula = Column(String, index =True)
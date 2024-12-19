from pydantic import BaseModel
from datetime import datetime
from typing import List, Union

# PyDantic Model API Response

class SensorDataSchema(BaseModel):
    time: datetime
    port0: float
    port1: float
    port2: float
    port3: float
    port4: float
    port5: float
    port6: float
    port7: float

class ConfigurationDataSchema(BaseModel):
    port_number: int
    name: str
    unit: str
    active: bool
    display: bool
    range_min: float
    range_max: float
    thresh_min: float
    thresh_max: float
    time: datetime
    formula_number: int

    class Config:
        from_attributes = True

class ActuationDataSchema(BaseModel):
    actuate: bool
    control: bool
    command: str

class HistoryDataSchema(BaseModel):
    time: datetime
    value: float

class NotificationSchema(BaseModel):
    id: int
    port_number: int
    type: int
    viewed: bool
    time: datetime

class FormulaDataSchema(BaseModel):
    formula_number: int
    name: str
    formula: str

class AccountSchema(BaseModel):
    uid: str
    role: str

class ServerDataSchema(BaseModel):
    id: int
    server_conn: int
    device_conn: int
    ip_address: str
    port: str
    ssid: str
    password: str

class PredefinedFormulasSchema(BaseModel):
    id: int
    name: str
    formula: str

class UnguidedDataSchema(BaseModel):
    x: List[Union[int, float]]
    y: List[Union[int, float]]

class GuidedDataSchema(BaseModel):
    formula: str
    names: List[str]
    values: List[Union[int, float]]
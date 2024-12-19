from fastapi import APIRouter, HTTPException
from .wm_serial import detect_serial_auto, CalibModule
from .wm_calib_functions import validate_formula, convert_to_python, convert_to_latex, extract_variables, extract_channels
from .wm_calib_unguided import unguided
from .wm_calib_guided import one_point, two_point, custom
from schemas import UnguidedDataSchema, GuidedDataSchema

router = APIRouter()

@router.get("/detect-serial-auto/")
async def get_detect_serial_auto():
    selected_auto, detected_list = detect_serial_auto()
    if not selected_auto:
        raise HTTPException(status_code=404, detail="No suitable serial port detected.")

    return {"selected_auto": selected_auto, "detected_list": detected_list}

@router.get("/detect-sensor-auto/")
async def get_detect_sensor_auto(com_port: str):
    module = CalibModule(com_port=com_port)
    if not module.is_valid():
        raise HTTPException(status_code=400, detail=module.error)
    
    response, valid = module.detect_auto()
    if not valid:
        raise HTTPException(status_code=404, detail=f'{response}')
    
    return {"detected_list": response}

@router.get("/request-data/")
async def get_request_data(com_port: str, channel: str):
    module = CalibModule(com_port=com_port)
    if not module.is_valid():
        raise HTTPException(status_code=400, detail=module.error)
    
    response, valid = module.request_data(channel=channel)
    if not valid:
        raise HTTPException(status_code=404, detail=f'{response}')
    
    return {"data": response}

@router.get("/extract-variables/")
async def get_extract_variables(formula: str):
    conv_formula = convert_to_python(formula)
    valid, detail = validate_formula(formula=conv_formula)
    if not valid:
        raise HTTPException(status_code=400, detail=detail)
    return {"variable_list" : extract_variables(formula)}

@router.get("/extract-channels/")
async def get_extract_channels(formula: str):
    conv_formula = convert_to_python(formula)
    valid, detail = validate_formula(formula=conv_formula)
    if not valid:
        raise HTTPException(status_code=400, detail=detail)
    return {"channel_list" : extract_channels(formula)}

@router.post("/calib-guided-onepoint/")
async def post_formula_onepoint(formula: str, adc: float, val: float):
    conv_formula = convert_to_python(formula)
    valid, detail = validate_formula(formula=conv_formula, type="One Point")
    if not valid:
        raise HTTPException(status_code=400, detail=detail)
    
    formula = one_point(conv_formula, adc, val)
    if formula is None or str(formula) == "nan":
        raise HTTPException(status_code=412, detail="The generated ADC formula is not valid. Please check the input data.")
    
    #  latex_formula = convert_to_latex(formula)
    return {"formula": str(formula)}

@router.post("/calib-guided-twopoint")
async def post_formula_twopoint(adc1: float, adc2: float, val1: float, val2: float):
    formula, valid, detail = two_point(adc1, adc2, val1, val2)
    if not valid:
        raise HTTPException(status_code=400, detail=detail)

    if formula is None or str(formula) == "nan":
        raise HTTPException(status_code=412, detail="The generated ADC formula is not valid. Please check the input data.")
    
    # latex_formula = convert_to_latex(str(formula))
    return {"formula": str(formula)}

@router.post("/calib-guided-custom/")
async def post_formula_custom(data: GuidedDataSchema):
    conv_formula = convert_to_python(data.formula)
    valid, detail = validate_formula(formula=conv_formula)
    if not valid:
        raise HTTPException(status_code=400, detail=detail)

    if len(data.names) != len(data.values):
        raise HTTPException(status_code=400, detail="The provided dataset must have the same length. Please check your input and try again.")

    formula = custom(conv_formula, data.names, data.values)
    if formula is None or str(formula) == "nan":
        raise HTTPException(status_code=412, detail="The generated ADC formula is not valid. Please check the input data.")
    
    # latex_formula = convert_to_latex(str(formula))
    return {"formula": str(formula)}

@router.post("/calib-unguided/")
async def post_formula_unguided(data: UnguidedDataSchema):
    if len(data.x) != len(data.y): 
        raise HTTPException(status_code=400, detail="The provided dataset must have the same length. Please check your input and try again.")
    
    formula, accuracy = unguided(data.x, data.y)
    if formula is None or str(formula) == "nan":
        raise HTTPException(status_code=412, detail="The generated ADC formula is not valid. Please check the input data.")

    # latex_formula = convert_to_latex(formula)
    return {"formula": str(formula), "accuracy": accuracy}
from sympy import simplify
import re

def one_point(formula, adc, val):
    x = float(adc)
    val = float(val)
    raw = eval(formula)
    offset = val - raw
    formula = formula + " + " +str(offset)
    formula = simplify(formula)
    return formula

def two_point(adc1, adc2, val1, val2):
    # Two Point Calibration assumes linear sensor response
    adc1 = float(adc1)
    adc2 = float(adc2)
    val1 = float(val1)
    val2 = float(val2)
    if adc1-adc2 == 0:
        return "x", False, "The formula results in a division by zero by default. Please fix the formula."
    formula = f"({val1-val2}/{adc1-adc2})*x + ({val1}-{adc1}*({val1-val2}/{adc1-adc2}))"
    formula = simplify(formula)
    return formula, True, "Valid Calibration"

def custom(formula, varNames, varValues):
    # Ensure varList and varValues have the same length
    if len(varNames) != len(varValues):
        raise False
    
    # Iterate over each variable and its corresponding value
    for var, value in zip(varNames, varValues):
        # Use regular expressions to replace variables in the formula
        # \b ensures we match the variable exactly and not as part of another variable or number
        formula = re.sub(rf'\b{re.escape(var)}\b', str(value), formula)
    
    return formula

if __name__ == "__main__":
    print( two_point(5,5, 21,20) )
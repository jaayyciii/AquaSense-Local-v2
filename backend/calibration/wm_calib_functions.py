import numpy as np
import random as rng
import warnings
import re

def calculate(formula, x, valCHList):
    if x == None:
        return 0
    
    CH0 = valCHList[0]
    CH1 = valCHList[1]
    CH2 = valCHList[2]
    CH3 = valCHList[3]
    CH4 = valCHList[4]
    CH5 = valCHList[5]
    CH6 = valCHList[6]
    CH7 = valCHList[7]
    result = float(eval(formula, {'np':np, 'x':x, 'CH0': CH0, 'CH1': CH1, 'CH2': CH2, 'CH3': CH3, 'CH4': CH4, 'CH5': CH5, 'CH6': CH6, 'CH7': CH7 }) )
    return result

def convert_to_python(latex_formula):
    # Replace LaTeX functions with numpy equivalents
    formula = latex_formula.replace('\\ln', 'np.log')
    formula = re.sub(r'e\^{(.*?)}', r'np.exp(\1)', formula)
    
    # Replace floor and ceiling functions
    formula = formula.replace('\\lfloor', 'np.floor')
    formula = formula.replace('\\rfloor', '')
    formula = formula.replace('\\lceil', 'np.ceil')
    formula = formula.replace('\\rceil', '')

    # Replace LaTeX operators with Python equivalents
    formula = formula.replace('\\cdot', '*')
    formula = formula.replace('^', '**')

    # Remove any extra spaces around operators for clean output
    formula = re.sub(r'\s+', ' ', formula).strip()

    return formula

def convert_to_latex(formula):
    # Replace numpy functions with LaTeX equivalents
    formula = formula.replace('np.log', '\\ln')
    
    # Handle `np.exp` with braces correctly
    formula = re.sub(r'np.exp\((.*?)\)', r'e^{\1}', formula)

    # Replace floor and ceiling functions
    formula = formula.replace('np.floor', '\\lfloor')
    formula = formula.replace('np.ceil', '\\lceil')
    formula = formula.replace(')', '\\rfloor')  # Assuming simple cases; adjust if needed
    formula = formula.replace(')', '\\rceil')  # Assuming simple cases; adjust if needed

    # Replace basic operators
    formula = formula.replace('**', '^')
    
    # Handle variables (e.g., var1, var2, etc.) by leaving them as-is
    formula = re.sub(r'\b(var\d+)\b', r'\1', formula)

    # Additional formatting for LaTeX compatibility
    formula = formula.replace('*', ' \\cdot ')
    formula = formula.replace('/', ' / ')

    return formula

def generate_unique_floats(n, max_value):
    if n > max_value / 1e-10:  # Rough check for floating-point density
        raise ValueError("The range is too small to generate the requested number of unique values.")
    
    unique_values = set()
    while len(unique_values) < n:
        unique_values.add(rng.uniform(0, max_value))
    
    return list(unique_values)

def validate_formula(formula, type="Custom"):
    if 'x' not in formula:
        return False, "The formula must contain \'x\', the measured variable. Example: \'x*var1-50\'"

    variables = extract_variables(formula)
    valCHList = []

    randVals = generate_unique_floats(len(variables)+10, 999999999)
    
    valCHList = randVals[:8]    # First 8 values
    varValList = randVals[8:]   # Remaining values

    if type == "One Point":
        channels = extract_channels(formula)
        if variables != []:
            return False, "A 'One Point' formula should not contain any variables. Please remove the variables and try again."
        if channels != []:
            return False, "A 'One Point' formula should not contain any channels. Please remove the variables and try again."

        else:
            with warnings.catch_warnings():
                warnings.filterwarnings("error", category=RuntimeWarning)
                try:
                    calculate(formula, varValList[-1], valCHList)
                except SyntaxError:
                    return False, "The formula contains invalid syntax. Please review the formula and correct any errors."
                except NameError:
                    # Different Error for One Point
                    return False, "A 'One Point' formula should not contain any variables. Please remove the variables and try again."
                except ZeroDivisionError:
                    return False, "The formula results in a division by zero by default. Please fix the formula."
                except RuntimeWarning as e:
                    return False, f"{e}. Please check the formula and try again."
                except Exception as e:
                    return False, f'An unexpected error occurred while processing the formula. Please check the formula and try again.'
                return True, "Valid formula"
        
    # This part is skipped by One Point
    for i, var in enumerate(variables):
        formula = re.sub(rf'\b{re.escape(var)}\b', str(varValList[i]), formula)

    with warnings.catch_warnings():
        warnings.filterwarnings("error", category=RuntimeWarning)
        try:
            data = calculate(formula, varValList[-1], valCHList)
            print(data)
        except SyntaxError:
            return False, "The formula contains invalid syntax. Please review the formula and correct any errors."
        except NameError:
            return False, "The formula includes an invalid name. Please check the variable names and try again."
        except ZeroDivisionError:
            return False, "The formula results in a division by zero by default. Please fix the formula."
        except RuntimeWarning as e:
            return False, f"{e}. Please check the formula and try again."
        except Exception as e:
            return False, f'An unexpected error occurred while processing the formula. Please check the formula and try again.'
        return True, "Valid formula"

def extract_variables(formula):
    # Regular expression to match variables (e.g., var1, var11, var123)
    pattern = r'\bvar\d+\b'

    # Find all variables using the pattern
    variables = re.findall(pattern, formula)
    
    # Remove duplicates while preserving order
    seen = set()
    ordered_variables = []
    for var in variables:
        if var not in seen:
            seen.add(var)
            ordered_variables.append(var)
    
    return sorted(ordered_variables)

def extract_channels(formula):
    # Regular expression to match variables (e.g., var1, var11, var123)
    pattern = r'\bCH\d+\b'

    # Find all variables using the pattern
    variables = re.findall(pattern, formula)
    
    # Remove duplicates while preserving order
    seen = set()
    ordered_variables = []
    for var in variables:
        if var not in seen:
            seen.add(var)
            ordered_variables.append(var)
    
    return sorted(ordered_variables)
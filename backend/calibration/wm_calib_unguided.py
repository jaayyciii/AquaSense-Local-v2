import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import r2_score
from sympy import symbols, simplify

def unguided(x, y, bool_print=False):
    if len(x) >= 5:
        formula, accuracy = calibRegression(x, y, bool_print=bool_print)
    else:
        formula, accuracy = calibLagrange(x, y, bool_print=bool_print)
    return formula, accuracy
    
def calibLagrange(x_values, y_values, bool_print=False):
    x = symbols('x')
    n = len(x_values)
    polynomial = 0
    
    for i in range(n):
        # Initialize the Lagrange basis polynomial L_i(x)
        L_i = 1
        for j in range(n):
            if i != j:
                L_i *= simplify( (x - x_values[j]) / (x_values[i] - x_values[j]) )
        
        # Add the term y_i * L_i(x) to the polynomial
        polynomial += y_values[i] * L_i

    # Simplify the final polynomial expression
    polynomial = simplify(polynomial)
    polynomial = str(polynomial)
    accuracy = f"Expect higher accuracy from {y_values[0]} <units> to {y_values[len(y_values)-1]} <units>. Unreliable otherwise."
    if bool_print:
        print(polynomial)
        print(accuracy)
    return polynomial, accuracy

def line(x,y, bool_print=False):
    # Linear regression
    model = LinearRegression()
    model.fit(x, y)

    # Coefficients
    a = model.intercept_
    b = model.coef_[0]

    formula = f"{a:.8f} + {b:.8f} * x"
    r2 =  r2_score(y, model.predict(x))
    if bool_print:
        print(f"Generated Linear: {formula}")
    return formula, r2
    
def poly(x, y, degree=2, bool_print=False):
    # Polynomial regression
    poly = PolynomialFeatures(degree=degree)
    x_poly = poly.fit_transform(x)
    model = LinearRegression()
    model.fit(x_poly, y)

    a = model.intercept_
    coef = model.coef_
    terms = [f"{coef[i]:+.8f}*x**{i}" for i in range(len(coef))]
    formula = " ".join(terms) + f" + {a:.8f}"

    r2 =  r2_score(y, model.predict(x_poly))
    if bool_print:
        print(f"Generated Polynomial: {formula}")
    return formula, r2


def loga(x, y, bool_print=False):
    # Remove Zeroes
    for i, val in enumerate(x):
        if val[0]<1:
            x[i][0]=1

    # Transform x using logarithm
    x_log = np.log(x)

    # Linear regression on log-transformed x
    model = LinearRegression()
    model.fit(x_log, y)

    # Coefficients
    a = model.intercept_
    b = model.coef_[0]

    formula = f"{a:.8f} + {b:.8f} * np.log(x)"
    r2 =  r2_score(y, model.predict(x_log))
    if bool_print:
        print(f"Generated Logarithmic: {formula}")
    return formula, r2


def expo(x,y, bool_print=False):
    for i, val in enumerate(y):
        if val<1:
            y[i]=1

    # Transform y_data to log(y)
    y_log = np.log(y)
    
    # Create and fit the linear regression model
    model = LinearRegression()
    model.fit(x, y_log)
    
    # Extract parameters
    b = model.coef_[0]
    log_a = model.intercept_
    a = np.exp(log_a)
    
    # Print the formula
    formula = f"{a:.4f} * np.exp({b:.4f} * x)"
    r2 =  r2_score(y, model.predict(x))
    
    if bool_print:
        print(f"Generated Polynomial: {formula}")
    return formula, r2


def sqrt(x,y,bool_print):
    for i, val in enumerate(y):
        if val<=0:
            x.pop(i)
            y.pop(i)

    # Transform y using square root
    y_sqrt = np.sqrt(y)

    # Linear regression on square root-transformed y
    model = LinearRegression()
    model.fit(x, y_sqrt)

    # Coefficients
    a = model.intercept_
    b = model.coef_[0]

    formula = f"({a:.8f} + {b:.8f} * x)^2"
    r2 =  r2_score(y, model.predict(x))
    if bool_print:
        print(f"Generated Square Root: {formula}")
    return formula, r2


def calibRegression(x_data,y_data,degree=2,bool_print=False):
    x = np.array(x_data).reshape(-1, 1)
    y = np.array(y_data)

    line_formula, line_r2 = line(x,y,bool_print=bool_print)
    poly_formula, poly_r2 = poly(x,y,degree,bool_print=bool_print)
    loga_formula, loga_r2 = loga(x,y,bool_print=bool_print)
    expo_formula, expo_r2 = expo(x,y,bool_print=bool_print)
    sqrt_formula, sqrt_r2 = sqrt(x,y,bool_print=bool_print)

    # Create a list of formulas and R^2 values
    formulas = [line_formula, poly_formula, loga_formula, expo_formula, sqrt_formula]
    r2_values = [line_r2, poly_r2, loga_r2, expo_r2, sqrt_r2]
    formula_types = ["Linear", "Polynomial", "Logarithmic", "Exponential", "Square Root"]
    
    # Find the index of the highest R^2 value
    max_index = np.argmax(r2_values)
    
    # Return the formula and R^2 value with the highest R^2
    best_formula = formulas[max_index]
    best_r2 = r2_values[max_index]
    best_type = formula_types[max_index]
    
    if bool_print:
        print("Conducting Regression best fit...")
        print(f"Linear Formula: {line_formula}\t\tr2={line_r2:.2f}")
        print(f"Polynomial Formula: {poly_formula}\t\tr2={poly_r2:.2f}")
        print(f"Logarithmic Formula: {loga_formula}\t\tr2={loga_r2:.2f}")
        print(f"Exponential Formula: {expo_formula}\t\tr2={expo_r2:.2f}")
        print(f"Square Root: {sqrt_formula}\t\tr2={sqrt_r2:.2f}")
        print(f"Best fit: {best_type}: \" {best_formula} \" with r2 = {best_r2:.2f}")

    return best_formula, f"Regression R² score (accuracy): {best_r2}"

# if __name__ == "__main__":
#     x = [1,2,3,4,5,6,7,8]
#     y = [i**2 for i in x]
#     print(unguided(x,y))
export default function GuidedOC() {
  return (
    <div
      className="offcanvas offcanvas-end bg-subtle"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      id="guide"
    >
      <div className="offcanvas-header">
        <h5 className="text-primary offcanvas-title">Guided Calibration</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        />
      </div>
      <div className="offcanvas-body">
        <div className="mb-5">
          <h6 className="fw-bold">I. Custom Calibration</h6>
          <p className="fw-light">
            This type of calibration allows you to input and customize your own
            formula.
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              Enter a valid formula in the input field. Your formula must
              include an <code>'x'</code>, which represents the measured analog
              value.
              <ul>
                <li>
                  You can use variables in the format <code>var[N]</code> (e.g.,{" "}
                  <code>var1</code>, <code>var2</code>, <code>var3</code>).
                </li>
                <li>
                  To include port channels, use <code>CH[N]</code> (e.g.,{" "}
                  <code>CH0</code>, <code>CH1</code>, <code>CH2</code>).
                </li>
              </ul>
              <div className="alert alert-light my-2">
                <small className="fw-medium">Example:</small>
                <p className="text-center">
                  <code>x + (var1 / CH0) - CH2</code>
                </p>
              </div>
            </li>
            <li className="mb-3">
              Click{" "}
              <span className="fw-medium text-primary">
                Extract Variables and Channels
              </span>{" "}
              to identify the variables and channels in your formula.
            </li>
            <li className="mb-3">
              For each variable, you can:
              <ul className="mb-1">
                <li>Enter the actual value in units manually, or</li>
                <li>
                  Click <span className="fw-medium text-primary">Measure</span>{" "}
                  to obtain a measurement from the calibration module.
                </li>
              </ul>
            </li>
            <li className="mb-3">
              For each channel, you can:
              <ul className="mb-1">
                <li>Assign the appropriate channel from the selection, or</li>
                <li>
                  Click <span className="fw-medium text-primary">Switch</span>{" "}
                  to enter a constant value.
                </li>
              </ul>
            </li>
            <li className="mb-3">
              Once all data points are assigned and validated, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
        <div className="mb-5">
          <h6 className="fw-bold">II. One Point Calibration</h6>
          <p className="fw-light">
            This calibration method calculates the drift based on a single data
            point.
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              Enter a valid formula in the input field. Your formula must
              include an <code>'x'</code>, which represents the measured analog
              value.
              <ul>
                <li>
                  Take note, this should not contain variables nor channels
                </li>
              </ul>
            </li>
            <li className="mb-3">
              Input the actual unit of measure, and then click{" "}
              <span className="fw-medium text-primary">Measure</span> to get the
              corresponding analog value.
            </li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
        <div className="mb-5">
          <h6 className="fw-bold">III. Two Point Calibration</h6>
          <p className="fw-light">
            This calibration method assumes that your sensor exhibits linear
            behavior, meaning its output changes proportionally with the input.
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              For each of the two points in the data collection, enter the
              actual unit of measure. Then, click
              <span className="fw-medium text-primary"> Measure</span> to obtain
              the corresponding analog values.
            </li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
        <div className="mb-5">
          <h6 className="fw-bold">IV. DF Robot pH Sensor</h6>
          <p className="fw-light">
            This predefined formula is accordance with the DFRobot PH Sensor
            derived from{" "}
            <a
              href="https://github.com/DFRobot/DFRobot_PH/blob/master/"
              target="_blank"
            >
              DF Robot pH Sensor Library (Github)
            </a>
            . (<strong>Unit of measure: pH</strong>).
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              To begin, click{" "}
              <span className="fw-medium text-primary">
                Extract Variables and Channels
              </span>{" "}
              to identify the variables and channels in the formula.{" "}
            </li>
            <li className="mb-3">
              This calibration requires two inputs: a 7.0 pH solution and a 4.0
              pH solution.
            </li>
            <li className="mb-3">
              Attach the probe to the sensor board, and then connect the sensor
              board to the calibration module.
            </li>
            <li className="mb-3">
              Place the probe in the 7.0 pH solution. Wait for a few seconds to
              allow the sensor to acclimate to the solution, then click{" "}
              <span className="fw-medium text-primary">Measure</span> on var1.
            </li>
            <li className="mb-3">Clean the probe thoroughly.</li>
            <li className="mb-3">
              Place the probe in the 4.0 pH solution. Wait for a few seconds,
              then click <span className="fw-medium text-primary">Measure</span>{" "}
              on var2.
            </li>
            <li className="mb-3">Clean the probe thoroughly again.</li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
        <div className="mb-5">
          <h6 className="fw-bold">V. DF Robot Dissolved Oxygen Sensor</h6>
          <p className="fw-light">
            This predefined formula is accordance with the DFRobot Dissolved
            Oxygen Sensor derived from{" "}
            <a
              href="https://wiki.dfrobot.com/Gravity__Analog_Dissolved_Oxygen_Sensor_SKU_SEN0237"
              target="_blank"
            >
              DF Robot DO Sensor Library (DFRobot Wiki)
            </a>
            . (<strong>Unit of measure: mg/L</strong>)
          </p>
          <ol>
            <li className="mb-3">
              To begin, click{" "}
              <span className="fw-medium text-primary">
                Extract Variables and Channels
              </span>{" "}
              to identify the variables and channels in the formula.
            </li>
            <li className="mb-3">
              Prepare the following:
              <ul>
                <li>Temperature sensor</li>
                <li>0.5mol/L NaOH solution</li>
              </ul>
            </li>
            <li className="mb-3">
              Prepare two solutions for calibration:
              <ol>
                <li>
                  Solution 1 - Distilled water at room temperature (around 25°C)
                </li>
                <li>
                  Solution 2 - High saturation DO solution at a relatively low
                  temperature
                </li>
              </ol>
            </li>
            <li className="mb-3">
              If it's your first time using the sensor, unscrew the cap, fill it
              with the 0.5mol/L NaOH solution, then screw the cap back on.
              Afterward, clean the probe thoroughly.
            </li>
            <li className="mb-3">
              Attach the probe to the sensor board, and then connect the sensor
              board to the calibration module.
            </li>
            <li className="mb-3">
              Place the probe into Solution 1. Wait for a few seconds to allow
              the sensor to acclimate to the solution, then click{" "}
              <span className="fw-medium text-primary"> Measure</span> on var1
              and input the temperature measured in var3.
            </li>
            <li className="mb-3">Clean the probe thoroughly.</li>
            <li className="mb-3">
              Place the probe into Solution 2, wait for a few seconds, then
              click <span className="fw-medium text-primary"> Measure</span> on
              var2 and input the temperature measured in var4.
            </li>
            <li className="mb-3">Clean the probe thoroughly again.</li>
            <li className="mb-3">
              Replace CH0 with the sensor channel of the temperature sensor. If
              you are not using a temperature sensor, click{" "}
              <span className="fw-medium text-primary"> Switch</span> and set
              the constant value to 25 (or any typical temperature for your
              operation).
            </li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
        <div className="mb-5">
          <h6 className="fw-bold">
            VI. DF Robot Electrical Conductivity Sensor
          </h6>
          <p className="fw-light">
            This predefined formula is accordance with the DFRobot Electrical
            Conductivity Sensor derived from{" "}
            <a
              href="https://github.com/DFRobot/DFRobot_EC/blob/master/DFRobot_EC.cpp"
              target="_blank"
            >
              DF Robot EC Sensor Library (Github)
            </a>
            . (<strong>Unit of measure: mS/m</strong>).
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              To begin, click{" "}
              <span className="fw-medium text-primary">
                Extract Variables and Channels
              </span>{" "}
              to identify the variables and channels in the formula.{" "}
            </li>
            <li className="mb-3">
              This calibration requires one input, depending on the type of
              predefined formula you select for the DF Robot Electrical
              Conductivity. You can choose either the 12.88 ms/cm solution or
              the 1.314 ms/cm solution at room temperature (around 25°C).
            </li>
            <li className="mb-3">
              Attach the probe to the sensor board, and then connect the sensor
              board to the calibration module.
            </li>
            <li className="mb-3">
              Place the probe in the solution. Wait for a few seconds to allow
              the sensor to acclimate to the solution, then click{" "}
              <span className="fw-medium text-primary">Measure</span> on var1.
            </li>
            <li className="mb-3">Clean the probe thoroughly.</li>
            <li className="mb-3">
              Replace CH0 with the sensor channel of the temperature sensor. If
              you are not using a temperature sensor, click{" "}
              <span className="fw-medium text-primary"> Switch</span> and set
              the constant value to 25 (or any typical temperature for your
              operation).
            </li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
        <div className="mb-5">
          <h6 className="fw-bold">VII. Generic LM35 Temperature Sensor</h6>
          <p className="fw-light">
            This predefined formula is in accordance with a generic LM35 IC
            Temperature Sensor. (<strong>Unit of measure: °C</strong>).
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              To begin, click{" "}
              <span className="fw-medium text-primary">
                Extract Variables and Channels
              </span>{" "}
              to identify the variables and channels in the formula.{" "}
            </li>
            <li className="mb-3">
              This calibration requires one input, which is distilled water at
              room temperature (around 25°C).
            </li>
            <li className="mb-3">
              Attach the sensor to the calibration module.
            </li>
            <li className="mb-3">
              Place the probe in the solution. Wait for a few seconds to allow
              the sensor to acclimate to the solution, then click{" "}
              <span className="fw-medium text-primary">Measure</span> on var1.
            </li>
            <li className="mb-3">Clean the probe thoroughly.</li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

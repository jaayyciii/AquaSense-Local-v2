from serial import Serial, SerialException
import serial.tools.list_ports as listCom
import statistics

class CalibModule:
    #Initialize Serial Object
    def __init__(self, com_port='COM4', baud_rate=57600, timeout=2, bool_print=False):
        self.serial_obj = None
        self.error = None

        try:
            self.serial_obj = Serial(port=com_port, baudrate=baud_rate, timeout=timeout)
        except SerialException:
            self.error = f"Unable to open the serial port: {com_port}. Please check the connection and try again."
        except ValueError:
            self.error = f"The serial configuration for {com_port} is invalid. Please review the settings and update them."

        self.bool_print = bool_print

    def is_valid(self):
        return self.serial_obj is not None and self.error is None
        
    def rcvmsg(self):
        msg = self.serial_obj.readline().decode().strip()
        msg_list = msg.split('-')

        if self.bool_print:
            print(f"Received from Calibration Module:\'{msg}\'")

        if msg_list[0] == "NA":         # If Error
            if self.bool_print:
                print(msg_list[1])      # Print Error
            return msg_list[1], False
        else:
            return msg, True            # Else return msg

    def send_data(self, msg):
        data = msg
        if type(data) == str:
            data = data.encode()
        self.serial_obj.write(data)

    # Detects if a sensor is connected to any of the channels
    def detect_auto(self):  
        # Send Command to detect sensor from both channels
        self.send_data("AutoDet")
        
        # Receive Data on detected sensor
        response, isRcv = self.rcvmsg()
        if not isRcv:
            return response, False

        if response == "Not-Detected":
            return None, True
        elif response == "Detected-CH0":
            return [0], True
        elif response == "Detected-CH1":
            return [1], True
        elif response == "Detected-CH0-Detected-CH1":
            return [0,1], True

    def request_data(self, sample_size=20, channel=0, stdev_thres=100):
        # Send Command to request data from calibration module
        self.send_data(f"ReqData-{channel}-{sample_size}")
        
        response, isRcv = self.rcvmsg()
        if not isRcv:
            return response, False

        if response != "Affirmative":
            return "The calibration module returned an unexpected response. Please verify the module's status and try again.", False
    
        data = []
        try:
            for i in range(sample_size):
                response, boolean = self.rcvmsg()
                if not boolean:
                    raise ValueError
                response = response.split('-')
                data.append( int( response[1] ) )
        except ValueError:
            return "The calibration module returned an unexpected response. Please verify the module's status and try again.", False

        if statistics.stdev(data) > stdev_thres:
            return "Sensor has not reached steady state nor stabilized. Please wait a moment and try again.", False

        return statistics.mean(data), True

def detect_serial_auto():
    ports = listCom.comports()
    detected_list = []
    selected_auto = ''

    for port, desc, hwid in sorted(ports):
        detected_list.append(f"{port}")
        if "CH340" in desc:
            selected_auto = f"{port}"

    return selected_auto, detected_list
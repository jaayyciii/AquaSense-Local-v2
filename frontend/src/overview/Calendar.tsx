import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function Calendar() {
  return (
    <div
      className="d-flex bg-primary shadow rounded"
      style={{ height: "310px", overflow: "hidden" }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
            color: "white",
            "& .MuiTypography-root": {
              color: "white",
            },
            "& .MuiPickersDay-root": {
              color: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "& .MuiPickersCalendarHeader-label": {
              fontWeight: "bold",
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}

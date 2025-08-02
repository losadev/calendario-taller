import { useState } from "react";
import { Typography, MenuItem, Select } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// Mock de fechas disponibles
const availableDates = ["2025-08-03", "2025-08-05", "2025-08-08", "2025-08-10"];
const availableTimes: Record<string, string[]> = {
  "2025-08-03": ["10:00", "14:00", "16:00"],
  "2025-08-05": ["09:00", "13:00"],
  "2025-08-08": ["11:00", "15:00", "17:00"],
  "2025-08-10": ["10:30", "12:30"],
};

export default function CalendarPicker() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const isDateAvailable = (date: Dayjs) =>
    availableDates.includes(date.format("YYYY-MM-DD"));

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const timesForSelectedDate = selectedDate
    ? availableTimes[selectedDate.format("YYYY-MM-DD")] || []
    : [];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 min-h-screen">
        <Typography
          variant="h5"
          component="h2"
          className="text-gray-800 font-semibold text-center"
        >
          Selecciona una fecha
        </Typography>

        <div className="flex justify-center">
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={(date) => !isDateAvailable(date)}
            className="rounded-md border border-gray-200 shadow-sm"
          />
        </div>

        {selectedDate && (
          <>
            <Typography
              variant="h6"
              component="h3"
              className="text-gray-700 font-medium"
            >
              Selecciona una hora
            </Typography>

            {timesForSelectedDate.length > 0 ? (
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                displayEmpty
                className="w-full bg-gray-50 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                sx={{
                  ".MuiSelect-select": { padding: "10px" },
                }}
              >
                <MenuItem disabled value="">
                  <em>Elige una hora</em>
                </MenuItem>
                {timesForSelectedDate.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Typography variant="body2" className="text-red-500 text-center">
                No hay horas disponibles.
              </Typography>
            )}
          </>
        )}

        {selectedDate && selectedTime && (
          <div className="mt-4 p-4 bg-indigo-100 text-indigo-800 rounded-md text-center font-semibold">
            Cita seleccionada: {selectedDate.format("DD/MM/YYYY")} a las{" "}
            {selectedTime}
          </div>
        )}

        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => {
            if (selectedDate && selectedTime) {
              alert(
                `Cita confirmada para el ${selectedDate.format(
                  "DD/MM/YYYY"
                )} a las ${selectedTime}`
              );
            } else {
              alert("Por favor, selecciona una fecha y hora.");
            }
          }}
        >
          Confirmar Cita
        </button>
        <button
          className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition-colors"
          onClick={() => {
            setSelectedDate(null);
            setSelectedTime("");
          }}
        >
          Limpiar Selección
        </button>
      </div>
    </LocalizationProvider>
  );
}

import { useState } from "react";
import { Typography, MenuItem, Select, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

const availableDates = ["2025-08-03", "2025-08-05", "2025-08-08", "2025-08-10"];
const availableTimes: Record<string, string[]> = {
  "2025-08-03": ["10:00", "14:00", "16:00"],
  "2025-08-05": ["09:00", "13:00"],
  "2025-08-08": ["11:00", "15:00", "17:00"],
  "2025-08-10": ["10:30", "12:30"],
};

function useQuery() {
  return new URLSearchParams(window.location.search);
}

export default function CalendarPicker() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const subscriberId = query.get("subscriber_id");

  const isDateAvailable = (date: Dayjs) =>
    availableDates.includes(date.format("YYYY-MM-DD"));

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const timesForSelectedDate = selectedDate
    ? availableTimes[selectedDate.format("YYYY-MM-DD")] || []
    : [];

  const handleConfirm = async () => {
    if (!subscriberId) {
      alert("No se encontró el subscriber_id en la URL.");
      return;
    }

    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      setLoading(true);

      try {
        const response = await fetch(
          "https://api.manychat.com/fb/subscriber/setCustomField",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 3149333:feb28f52cc42a1537718e93b3bc16000",
            },
            body: JSON.stringify({
              subscriber_id: subscriberId,
              field_name: "cita", // Cambia por el nombre del campo que tengas en Manychat
              field_value: `${formattedDate} ${selectedTime}`,
            }),
          }
        );

        if (!response.ok) throw new Error("Error en la solicitud");

        alert(
          `Cita confirmada para el ${selectedDate.format(
            "DD/MM/YYYY"
          )} a las ${selectedTime}`
        );
      } catch (error) {
        console.error("Error al enviar la cita:", error);
        alert("Error al enviar la cita. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Por favor, selecciona una fecha y hora.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl space-y-6 min-h-screen">
        <Typography
          variant="h5"
          className="text-center font-semibold text-gray-800"
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
            <Typography variant="h6" className="text-gray-700 font-medium">
              Selecciona una hora
            </Typography>

            {timesForSelectedDate.length > 0 ? (
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                displayEmpty
                className="w-full bg-gray-50 rounded-md border border-gray-300"
                sx={{ ".MuiSelect-select": { padding: "10px" } }}
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

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar Cita"}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setSelectedDate(null);
            setSelectedTime("");
          }}
        >
          Limpiar Selección
        </Button>
      </div>
    </LocalizationProvider>
  );
}

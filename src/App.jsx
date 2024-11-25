import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import timeGridPlugin from "@fullcalendar/timegrid"; 
import Holidays from "date-holidays"; 
import './App.css';

const App = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [validRange, setValidRange] = useState({});

  useEffect(() => {
    const hd = new Holidays("CO");
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const currentYearHolidays = hd.getHolidays(currentYear).map((holiday) => holiday.date.split(" ")[0]);
    const nextYearHolidays = hd.getHolidays(nextYear).map((holiday) => holiday.date.split(" ")[0]);
    const allHolidays = [...currentYearHolidays, ...nextYearHolidays];
    setHolidays(allHolidays);

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); 

    const endOfNextWeek = new Date(startOfWeek);
    endOfNextWeek.setDate(startOfWeek.getDate() + 13); 

    setValidRange({
      start: startOfWeek.toISOString().split("T")[0],
      end: endOfNextWeek.toISOString().split("T")[0],
    });
  }, []);

  const handleDateClick = (info) => {
    const selectedDate = ensureDateObject(info.date);
    const day = selectedDate.getDay();

   
    if (day === 0 || day === 6) {
      alert("No puedes seleccionar fines de semana.");
      return;
    }

    
    if (isHoliday(selectedDate)) {
      alert("No puedes seleccionar días festivos.");
      return;
    }

    alert(`Seleccionaste la fecha: ${selectedDate.toISOString().split("T")[0]}`);
    const slots = getAvailableSlots(selectedDate);
    setAvailableSlots(slots);
  };

  const ensureDateObject = (date) => {
    return date instanceof Date ? date : new Date(date);
  };

  const getAvailableSlots = (date) => {
    const parsedDate = ensureDateObject(date);
    const day = parsedDate.getDay();


    if (day === 0 || day === 6) {
      return [];
    }

    return ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];
  };

  const isHoliday = (date) => {
    const formattedDate = ensureDateObject(date).toISOString().split("T")[0];
    return holidays.includes(formattedDate);
  };

  const isWeekend = (date) => {
    const day = ensureDateObject(date).getDay();
    return day === 0 || day === 6;
  };

  return (
    <div>
      <h1>Agendar Reunión</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        validRange={validRange}
        dateClick={handleDateClick}
        selectable={true}
        dayCellClassNames={(info) => {
          const date = ensureDateObject(info.date);

          if (date < new Date(validRange.start) || date > new Date(validRange.end)) {
            return "disabled-day";
          }

          if (isWeekend(date)) {
            return "disabled-day";
          }

          if (isHoliday(date)) {
            return "disabled-day";
          }

          return "";
        }}
      />
      <div>
        <h3>Horarios Disponibles</h3>
        {availableSlots.length > 0 ? (
          <ul>
            {availableSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        ) : (
          <p>No hay horarios disponibles para esta fecha.</p>
        )}
      </div>
    </div>
  );
};

export default App;

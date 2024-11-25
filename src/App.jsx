import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import timeGridPlugin from "@fullcalendar/timegrid"; 
import Holidays from "date-holidays"; 
import { getMockedSlots } from "./mockApi";
import './App.css';

const App = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const hd = new Holidays("CO");
    const currentYear = new Date().getFullYear();
    const currentYearHolidays = hd.getHolidays(currentYear).map((holiday) => holiday.date.split(" ")[0]);
    const nextYear = currentYear + 1;
    const nextYearHolidays = hd.getHolidays(nextYear).map((holiday) => holiday.date.split(" ")[0]);
    const allHolidays = [...currentYearHolidays, ...nextYearHolidays];
    console.log("Festivos (año actual y próximo):", allHolidays);
    setHolidays(allHolidays);
  }, []);

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    alert(`Seleccionaste la fecha: ${selectedDate}`);
    const slots = getAvailableSlots(selectedDate);
    setAvailableSlots(slots);
  };

  const getAvailableSlots = (date) => {
    if (new Date(date).getDay() === 0 || new Date(date).getDay() === 6) {
      return [];
    }
    return getMockedSlots(date);
  };

  const isHoliday = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return holidays.includes(formattedDate);
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  return (
    <div>
      <h1>Agendar Reunión</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        selectable={true}
        dayCellClassNames={(info) => {
          const date = new Date(info.date);
          if (isWeekend(date) || isHoliday(date)) {
            return "disabled-day";
          }
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

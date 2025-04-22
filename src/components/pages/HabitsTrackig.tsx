import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useHabits } from "../context/HabitContext";

export const HabitsTrackig = () => {
  const { setSelectedDate, habitsTracking, selectedDate } = useHabits();

  return (
    <section>
      <Calendar
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date)}
      />
      <ul>
        {habitsTracking.map((habit) => (
          <li key={habit.id}>
            <span>{habit.title}</span> -{" "}
            <span
              className={habit.completed ? "text-green-600" : "text-red-600"}
            >
              {habit.completed ? "Completado" : "Pendiente"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

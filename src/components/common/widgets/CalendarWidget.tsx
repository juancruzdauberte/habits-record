import Calendar from "react-calendar";
import { useHabits } from "../../context/HabitContext";

export const CalendarWidget = () => {
  const { selectedDate, setSelectedDate } = useHabits();

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date as Date);
        }}
        className="rounded-sm shadow-md p-4 bg-white w-full max-w-[300px] lg:max-w-[450px] mt-5"
      />
    </div>
  );
};

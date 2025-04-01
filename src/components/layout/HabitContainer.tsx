import { useEffect, useState } from "react";
import { type ArrayHabits, type Day } from "../types/types";
import { getDate, getHabitsForUser } from "../services/services";

export const HabitContainer = () => {
  const [currentDate, setCurrentDate] = useState<Day>({ date: "" });
  const [habits, setHabits] = useState<ArrayHabits>([]);
  console.log(habits);
  useEffect(() => {
    getDate()
      .then((res) => {
        if (res) setCurrentDate(res);
      })
      .catch((error) => {
        console.error(error);
      });

    getHabitsForUser()
      .then((res) => {
        if (res) setHabits(res);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <section>
      <div>{currentDate.date}</div>
      <div>
        {habits.map((habit) => {
          return <div key={habit.id}>{habit.name}</div>;
        })}
      </div>
    </section>
  );
};

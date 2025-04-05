import { useEffect, useState } from "react";
import { useHabits } from "../context/HabitContext";
import { type Day, type Habit } from "../types/types";
import { checkAndResetHabits, getDate } from "../services/services";
import { useAuth } from "../context/AuthContext";

export const HabitContainer = () => {
  const { habits, habitCompleted } = useHabits();
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState<Day>({ date: "" });

  useEffect(() => {
    const checkHabitsForNeyDay = async () => {
      if (user) await checkAndResetHabits(user);
      getDate().then((res) => setCurrentDay(res!));
    };

    checkHabitsForNeyDay();
  }, [user]);

  const allCompleted =
    habits.length > 0 && habits.every((h: Habit) => h.completed);

  return (
    <section>
      {allCompleted ? (
        <section>
          <p>¡Felicidades, completaste todos tus hábitos!</p>
        </section>
      ) : (
        <>
          <div className="flex justify-center">{currentDay.date}</div>
          {habits.map((habit: Habit) => (
            <div key={habit.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={(e) =>
                  habitCompleted({
                    id: habit.id!,
                    completed: e.target.checked,
                  })
                }
                value={habit.id}
              />
              <label>{habit.name}</label>
            </div>
          ))}
        </>
      )}
    </section>
  );
};

import { useHabits } from "../context/HabitContext";

export const HabitContainer = () => {
  const { habits } = useHabits();

  return (
    <section>
      {habits?.map((habit) => {
        return <div key={habit.id}>{habit.title}</div>;
      })}
    </section>
  );
};

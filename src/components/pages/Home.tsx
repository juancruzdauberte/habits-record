import { HabitsForm } from "../layout/HabitsForm";
import { HabitContainer } from "../layout/HabitContainer";

export const Home = () => {
  document.title = "Habits Record";
  return (
    <section className="flex flex-col md:flex-row w-full justify-around items-center gap-10 md:gap-0">
      <section className="w-[320px] lg:w-[400px]">
        <HabitsForm />
      </section>
      <HabitContainer />
    </section>
  );
};

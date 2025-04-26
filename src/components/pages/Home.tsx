import { HabitsForm } from "../layout/HabitsForm";
import { HabitContainer } from "../layout/HabitContainer";

export const Home = () => {
  document.title = "Habits Record";
  return (
    <section className="flex flex-col md:flex-row w-full justify-around items-center gap-28 md:gap-0">
      <section className="w-[320px] lg:w-[400px] mt-5">
        <h2 className="font-semibold text-2xl text-slate-600 mb-2 border-b-2">
          Registra tus hábitos:
        </h2>
        <HabitsForm />
      </section>
      <HabitContainer />
    </section>
  );
};

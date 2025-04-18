import { HabitsForm } from "../layout/HabitsForm";
import { HabitContainer } from "../layout/HabitContainer";

export const Home = () => {
  document.title = "Habits Record";
  return (
    <main className="flex flex-col items justify-center">
      <section className="flex-1 flex flex-col items-center justify-around">
        <section className="">
          <HabitsForm />
        </section>
        <section>
          <HabitContainer />
        </section>
      </section>
    </main>
  );
};

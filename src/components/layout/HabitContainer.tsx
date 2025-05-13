import { useMemo, useState } from "react";
import { useHabits } from "../context/HabitContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { Filter } from "../common/Filter";
import { SkeletonHabitContainer } from "../common/SkeletonHabitContainer";
import { do_in } from "../types/types";

export const HabitContainer = () => {
  const { habits, habitsLoading, toggleHabit, today } = useHabits();
  const [filter, setFilterState] = useState(() => {
    return localStorage.getItem("habit-filter") || "a-z";
  });

  const setFilter = (newFilter: string) => {
    setFilterState(newFilter);
    localStorage.setItem("habit-filter", newFilter);
  };

  const allHabitsCompleted = habits.every((habit) => habit.completed);
  const filteredHabits = useMemo(() => {
    const sorted = [...habits];
    if (filter === "a-z")
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (filter === "z-a")
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    if (filter === "ma-no") {
      const order: Record<do_in, number> = {
        Mañana: 0,
        Tarde: 1,
        Noche: 2,
        "": 3,
      };

      return sorted.sort((a, b) => order[a.doIn] - order[b.doIn]);
    }
    return sorted;
  }, [filter, habits]);
  return (
    <section className="mb-20 md:mb-0">
      {habitsLoading ? (
        <SkeletonHabitContainer />
      ) : (
        <section className="px-10 py-5 bg-gray-50 rounded-sm shadow-md max-w-xl lg:w-[500px] mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 p-2">
              {today.toLocaleDateString()}
            </h2>
          </div>

          {habits.length === 0 ? (
            <section className="bg-yellow-100 p-4 rounded-lg shadow-md text-yellow-800">
              <h5 className="text-md font-medium">
                Aún no tenés hábitos registrados. Registralos en el formulario
                para comenzar con tu progreso.
              </h5>
            </section>
          ) : allHabitsCompleted ? (
            <section className="bg-green-100 p-4 rounded-lg shadow-md text-green-800">
              <h4 className="text-lg font-medium">
                ¡Felicidades! Has completado todos tus hábitos el día de hoy.
                ¡Buen trabajo! Vuelve mañana para seguir mejorando día a día.
              </h4>
            </section>
          ) : (
            <section>
              <div className="mb-4">
                <h4 className="text-lg md:text-xl font-semibold text-gray-700">
                  Hábitos a realizar el día de hoy:
                </h4>
              </div>
              <Filter filter={filter} setFilter={setFilter} />
              <div>
                <AnimatePresence mode="popLayout">
                  {filteredHabits?.map((habit) => (
                    <motion.div
                      key={habit.id}
                      layout
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between gap-2 mb-3"
                    >
                      <div className="relative flex items-center gap-2">
                        <motion.input
                          type="checkbox"
                          checked={habit.completed}
                          disabled={habit.completed}
                          onChange={() => {
                            if (!habit.completed) {
                              toggleHabit({
                                habitId: habit.id as string,
                                completed: true,
                              });
                            }
                          }}
                          whileTap={{ scale: 1.1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`h-5 w-5 cursor-pointer appearance-none ${
                            habit.completed
                              ? "bg-green-600"
                              : "border border-slate-400 bg-gray-200"
                          }`}
                        />
                        {habit.completed && (
                          <span className="absolute flex items-center justify-center pointer-events-none text-white">
                            <FiCheck size={22} />
                          </span>
                        )}
                        <label
                          className={`text-md ${
                            habit.completed
                              ? "line-through text-gray-500"
                              : "text-black"
                          }`}
                        >
                          {habit.title}
                        </label>
                      </div>

                      <label className="text-sm w-12">{habit.doIn}</label>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </section>
      )}
    </section>
  );
};

import { Loading } from "../common/widgets/Loading";
import { useHabits } from "../context/HabitContext";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

export const HabitContainer = () => {
  const { habits, isLoading, loadHabitsError, toggleHabit } = useHabits();
  const today = new Date().toISOString().split("T")[0];
  const allHabitsCompleted = habits.every((habit) => habit.completed);

  if (loadHabitsError) return <h2>{loadHabitsError.message}</h2>;
  return (
    <section>
      {isLoading ? (
        <Loading text="Cargando hábitos..." />
      ) : (
        <section className="px-10 py-5 bg-gray-50 rounded-sm shadow-md max-w-xl lg:w-[500px] mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{today}</h2>
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
              <div>
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center gap-2 mb-3">
                    <div className="relative flex items-center">
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
                        className={`h-5 w-5 cursor-pointer appearance-none  ${
                          habit.completed
                            ? "bg-green-500 "
                            : "border border-slate-400 bg-gray-200"
                        }`}
                      />
                      {habit.completed && (
                        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none text-white">
                          <FiCheck size={22} />
                        </span>
                      )}
                    </div>

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
                ))}
              </div>
            </section>
          )}
        </section>
      )}
    </section>
  );
};

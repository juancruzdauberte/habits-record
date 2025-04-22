import { Loading } from "../common/widgets/Loading";
import { useHabits } from "../context/HabitContext";

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
        <section className="p-4 bg-gray-50 rounded-sm shadow-md max-w-xl mx-auto">
          <section className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{today}</h2>
          </section>

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
              <section className="mb-4">
                <h4 className="text-xl font-semibold text-gray-700">
                  Hábitos a realizar el día de hoy:
                </h4>
              </section>
              <section>
                {habits.map((habit) => (
                  <section
                    key={habit.id}
                    className="flex items-center gap-2 mb-3"
                  >
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      disabled={habit.completed}
                      onChange={() => {
                        if (!habit.completed) {
                          toggleHabit({ habitId: habit.id, completed: true });
                        }
                      }}
                      className="h-4 w-4 bg-gray-600 border-gray-300 focus:ring-1 focus:ring-slate-400 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    />
                    <label
                      className={`text-md ${
                        habit.completed
                          ? "line-through text-gray-500"
                          : "text-black"
                      }`}
                    >
                      {habit.title}
                    </label>
                  </section>
                ))}
              </section>
            </section>
          )}
        </section>
      )}
    </section>
  );
};

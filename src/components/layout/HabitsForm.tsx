import { useHabits } from "../context/HabitContext";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "../context/AuthContext";
import { Habit } from "../types/types";
import { motion } from "framer-motion";
import { capitalizeFirstLetter } from "../utils/utils";
import { SkeletonHabitsForm } from "../common/SkeletonHabitsForm";

export const HabitsForm = () => {
  const { addNewHabit, habits, habitsLoading } = useHabits();
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      user_id: user?.id,
    } as Habit,

    onSubmit: async ({ value, formApi }) => {
      const title = capitalizeFirstLetter(value.title);
      const description = capitalizeFirstLetter(value.description);
      addNewHabit({ title, description });
      formApi.reset();
    },
  });

  return (
    <>
      {habitsLoading ? (
        <SkeletonHabitsForm />
      ) : (
        <section className="bg-gray-50 shadow-md p-4 ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            <form.Field
              name="title"
              validators={{
                onSubmit: ({ value }) => {
                  if (value.trim() === "") return "Debes ingresar un título";
                  const habitDuplicate = habits.find(
                    (habit) => habit.title.toLowerCase() === value.toLowerCase()
                  );
                  if (habitDuplicate) return "Hábito duplicado";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-md md:text-lg">
                    Título <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={field.state.value}
                    maxLength={25}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`px-2 py-0.5 border rounded-sm shadow-sm focus:outline-none focus:ring-2
                  ${
                    field.state.meta.errors.length > 0
                      ? "border-red-500 focus:ring-red-200 focus:ring-1"
                      : 25 - field.state.value.length === 0
                      ? "border-yellow-400 focus:ring-yellow-100 focus:ring-1"
                      : "border-gray-300 focus:ring-slate-300"
                  }
                `}
                  />

                  <div className="flex justify-between">
                    <div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                      {25 - field.state.value.length === 0 && (
                        <p className="text-yellow-500 text-sm">
                          Máximo de caracteres
                        </p>
                      )}
                    </div>

                    <motion.p
                      key={field.state.value.length}
                      className="self-end text-xs text-gray-500"
                    >
                      {field.state.value.length === 0
                        ? "Max: 25 carácteres"
                        : `Te quedan: ${
                            25 - field.state.value.length
                          } caracteres`}
                    </motion.p>
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-md md:text-lg">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`px-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-600 min-h-[150px] resize-none ${
                      60 - field.state.value.length === 0
                        ? "border-yellow-400 focus:ring-yellow-100 focus:ring-1"
                        : "border-gray-300 focus:ring-slate-300"
                    }`}
                    maxLength={60}
                  ></textarea>

                  <div className="flex justify-between">
                    <div>
                      {60 - field.state.value.length === 0 && (
                        <p className="text-yellow-500 text-sm">
                          Máximo de caracteres
                        </p>
                      )}
                    </div>

                    <motion.p
                      key={field.state.value.length}
                      className="self-end text-xs text-gray-500 "
                    >
                      {field.state.value.length === 0
                        ? "Max: 60 carácteres"
                        : `Te quedan: ${
                            60 - field.state.value.length
                          } caracteres`}
                    </motion.p>
                  </div>
                </div>
              )}
            </form.Field>
            <motion.button
              type="submit"
              className="w-full bg-slate-800 text-white py-2 rounded-sm font-semibold transition-colors"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear hábito
            </motion.button>
          </form>
        </section>
      )}
    </>
  );
};

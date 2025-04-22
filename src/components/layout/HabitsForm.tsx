import { useHabits } from "../context/HabitContext";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "../context/AuthContext";
import { Habit } from "../types/types";

export const HabitsForm = () => {
  const { addNewHabit } = useHabits();
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      user_id: user?.id,
    } as Habit,

    onSubmit: async ({ value, formApi }) => {
      await addNewHabit({ title: value.title, description: value.description });
      formApi.reset();
    },
  });

  return (
    <section className="bg-gray-50 shadow-md p-4">
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
              if (value.trim() === "") return "Debes ingresar un titulo";
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
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-2 py-0.5 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              />

              {field.state.meta.errors.length > 0 && (
                <em className="text-red-500 text-sm">
                  {field.state.meta.errors.join(", ")}
                </em>
              )}
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
                className="px-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-600 min-h-[150px] resize-none"
              ></textarea>
            </div>
          )}
        </form.Field>
        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          Crear hábito
        </button>
      </form>
    </section>
  );
};

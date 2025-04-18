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

    onSubmit: async ({ value }) => {
      await addNewHabit({ title: value.title, description: value.description });
    },
  });

  return (
    <section className="w-96">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5"
      >
        <form.Field name="title">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label>Titulo</label>
              <input
                id="title"
                name="title"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label>Descripcion</label>
              <textarea
                id="description"
                name="description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-600 min-h-[150px] resize-none"
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

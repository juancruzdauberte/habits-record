import { FormEvent, useEffect, useState } from "react";
import { type Habit } from "../types/types";
import { createHabit, getUser } from "../services/services";

export const HabitsForm = () => {
  const [habit, setHabit] = useState<Habit>({
    name: "",
    description: "",
    completed: false,
    day_id: "",
    user_id: "",
  });

  useEffect(() => {
    getUser().then((res) => {
      return res?.id;
    });
  }, []);

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (habit.name.trim() === "" && habit.description.trim() === "") {
      return;
    }
    console.log(habit);
    createHabit(habit);
  };

  const handleSubmitInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setHabit((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-96">
      <form
        onSubmit={(e) => handleSubmitForm(e)}
        className="flex flex-col gap-6 items-center"
      >
        <input
          type="text"
          name="name"
          value={habit.name}
          placeholder="Ingresa el habito que queres realizar"
          onChange={(e) => handleSubmitInput(e)}
          className="w-full h-10 px-4 py-2  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <textarea
          name="description"
          placeholder="Ingresa la descripcion del habito"
          value={habit.description}
          onChange={(e) => handleSubmitInput(e)}
          className="w-full h-32 px-4 py-2  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />

        <button
          className="font-bold bg-orange-400 p-2 rounded-md text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 "
          type="submit"
        >
          Agregar hábito
        </button>
      </form>
    </div>
  );
};

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Habit, type HabitContextType } from "../types/types";
import { useAuth } from "./AuthContext";
import {
  createHabit,
  getHabitsForUser,
  updateHabitCompleted,
} from "../services/services";
import { toast } from "sonner";

export const HabitContext = createContext<HabitContextType | undefined>(
  undefined
);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useAuth();

  const loadHabits = async () => {
    if (!user) return;
    const data = await getHabitsForUser();
    if (data) setHabits(data);
  };

  const addHabit = async (habit: Habit) => {
    if (!user) return;
    const habitCreated = await createHabit(habit, user);
    if (habitCreated) setHabits((prevHabits) => [...prevHabits, habitCreated]);
    toast.success("Habito creado exitosamente");
  };

  const habitCompleted = async ({
    id,
    completed,
  }: {
    id: string;
    completed: boolean;
  }) => {
    if (!user) return;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, completed } : habit
      )
    );

    const updatedHabit = await updateHabitCompleted({ id, completed }, user);

    if (!updatedHabit) {
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === id ? { ...habit, completed: !completed } : habit
        )
      );
      toast.error("No se pudo actualizar el hábito. Intentalo nuevamente");
    } else {
      if (completed)
        toast.success("Hábito realizado exitosamente. Felicidades!");
    }
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  const value = { loadHabits, addHabit, habitCompleted, habits };
  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits debe usarse dentro de un HabitProvider");
  }
  return context;
};

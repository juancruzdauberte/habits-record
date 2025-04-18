import { createContext, ReactNode, useContext } from "react";
import { type Habit, type HabitContextType } from "../types/types";
import { useAuth } from "./AuthContext";
import {
  getHabitsForToday,
  addHabit,
  toggleHabitStatus,
} from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const HabitContext = createContext<HabitContextType | undefined>(
  undefined
);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getHabitsForToday(user.id);
    },
    enabled: !!user?.id,
  });

  const { mutate: addNewHabit } = useMutation<
    Habit | null,
    Error,
    { title: string; description: string }
  >({
    mutationFn: async ({ title, description }) => {
      if (!user?.id) throw new Error("El usuario no está autenticado");
      return addHabit({ title, description, userId: user.id });
    },
    onSuccess: () => {
      toast.success("Hábito agregado con éxito");
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
    },
    onError: (error) => {
      toast.error("Error al agregar el hábito");
      console.error(error);
    },
  });

  const { mutate: toggleHabit } = useMutation<
    void,
    Error,
    { habitId: string; completed: boolean }
  >({
    mutationFn: async ({
      habitId,
      completed,
    }: {
      habitId: string;
      completed: boolean;
    }) => toggleHabitStatus(user?.id as string, habitId, completed),
    onSuccess: () => {
      toast.success("Habito realizado con exito");
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
    },
  });

  const value = { habits, isLoading, addNewHabit, toggleHabit };

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

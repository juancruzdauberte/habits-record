import { createContext, ReactNode, useContext, useState } from "react";
import {
  HabitWithStatus,
  type Habit,
  type HabitContextType,
} from "../types/types";
import { useAuth } from "./AuthContext";
import {
  getHabitsForToday,
  addHabit,
  toggleHabitStatus,
  getHabitsByDate,
} from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const queryClient = useQueryClient();

  const {
    data: habits = [],
    isLoading,
    error: loadHabitsError,
  } = useQuery<HabitWithStatus[]>({
    queryKey: ["habits", user?.id],
    queryFn: () => getHabitsForToday(user!.id),
    enabled: !!user?.id,
  });

  const { data: habitsTracking = [] } = useQuery<HabitWithStatus[]>({
    queryKey: ["habitsTracking", user?.id, formattedDate],
    queryFn: () => getHabitsByDate(user!.id, formattedDate),
    enabled: !!user?.id && !!selectedDate,
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
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      toast.success("Habito realizado con exito");
    },
  });

  const value = {
    habits,
    isLoading,
    addNewHabit,
    toggleHabit,
    loadHabitsError,
    habitsTracking,
    selectedDate,
    setSelectedDate,
  };

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

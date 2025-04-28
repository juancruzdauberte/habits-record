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
  deleteHabit,
} from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const HabitContext = createContext<HabitContextType | undefined>(undefined);

function formatDateToLocalYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const today = new Date();
  const formattedDate = formatDateToLocalYYYYMMDD(selectedDate);

  const {
    data: habits = [],
    isLoading: habitsLoading,
    error: loadHabitsError,
  } = useQuery<HabitWithStatus[]>({
    queryKey: ["habits", user?.id],
    queryFn: () => getHabitsForToday(user!.id),
    enabled: !!user?.id,
  });

  const { data: habitsTracking = [], isLoading: habitsTrackingLoading } =
    useQuery<HabitWithStatus[]>({
      queryKey: ["habitsTracking", user?.id, formattedDate],
      queryFn: () => getHabitsByDate(user!.id, formattedDate),
      enabled: !!user?.id && !!formattedDate,
    });

  const { mutate: deleteHabitById } = useMutation<
    void,
    Error,
    string,
    {
      previousHabits: HabitWithStatus[] | undefined;
      previousHabitsTracking: HabitWithStatus[] | undefined;
    }
  >({
    mutationFn: deleteHabit,
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: ["habits", user?.id] });
      await queryClient.cancelQueries({
        queryKey: ["habitsTracking", user?.id, formattedDate],
      });

      const previousHabits = queryClient.getQueryData<HabitWithStatus[]>([
        "habits",
        user?.id,
      ]);

      const previousHabitsTracking = queryClient.getQueryData<
        HabitWithStatus[]
      >(["habitsTracking", user?.id, formattedDate]);

      queryClient.setQueryData<HabitWithStatus[]>(
        ["habits", user?.id],
        (old = []) => old.filter((habit) => habit.id !== habitId)
      );

      queryClient.setQueryData<HabitWithStatus[]>(
        ["habitsTracking", user?.id, formattedDate],
        (old = []) => old.filter((habit) => habit.id !== habitId)
      );

      return { previousHabits, previousHabitsTracking };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({
        queryKey: ["habitsTracking", user?.id, formattedDate],
      });
      toast.success("Hábito eliminado correctamente");
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);

      if (context?.previousHabits)
        queryClient.setQueryData(["habits", user?.id], context.previousHabits);
      if (context?.previousHabitsTracking)
        queryClient.setQueryData(
          ["habitsTracking", user?.id, formattedDate],
          context.previousHabitsTracking
        );
    },
  });

  const { mutate: addNewHabit } = useMutation<
    Habit | null,
    Error,
    { title: string; description: string },
    {
      previousHabits: HabitWithStatus[] | undefined;
      previousHabitsTracking: HabitWithStatus[] | undefined;
    }
  >({
    mutationFn: async ({ title, description }) => {
      if (!user?.id) throw new Error("El usuario no está autenticado");
      return addHabit({ title, description, userId: user.id });
    },
    onMutate: async ({ title, description }) => {
      await queryClient.cancelQueries({ queryKey: ["habits", user?.id] });
      await queryClient.cancelQueries({
        queryKey: ["habitsTracking", user?.id, formattedDate],
      });

      const previousHabits = queryClient.getQueryData<HabitWithStatus[]>([
        "habits",
        user?.id,
      ]);
      const previousHabitsTracking = queryClient.getQueryData<
        HabitWithStatus[]
      >(["habitsTracking", user?.id, formattedDate]);

      const newHabit: HabitWithStatus = {
        title,
        description,
        completed: false,
        user_id: user!.id,
      };

      queryClient.setQueryData<HabitWithStatus[]>(
        ["habits", user?.id],
        (old = []) => [...old, newHabit]
      );
      queryClient.setQueryData<HabitWithStatus[]>(
        ["habitsTracking", user?.id, formattedDate],
        (old = []) => [...old, newHabit]
      );

      return { previousHabits, previousHabitsTracking };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      queryClient.invalidateQueries({
        queryKey: ["habitsTracking", user?.id, formattedDate],
      });
      toast.success("Hábito agregado con éxito");
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);

      if (context?.previousHabits)
        queryClient.setQueryData(["habits", user?.id], context.previousHabits);
      if (context?.previousHabitsTracking)
        queryClient.setQueryData(
          ["habitsTracking", user?.id, formattedDate],
          context.previousHabitsTracking
        );
    },
  });

  const { mutate: toggleHabit } = useMutation<
    void,
    Error,
    { habitId: string; completed: boolean },
    { previousHabits: HabitWithStatus[] | undefined }
  >({
    mutationFn: async ({ habitId, completed }) => {
      if (!user?.id) throw new Error("No existe el usuario");
      return toggleHabitStatus(user?.id, habitId, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      queryClient.invalidateQueries({
        queryKey: ["habitsTracking", user?.id, formattedDate],
      });
      toast.success("Hábito realizado con éxito");
    },
    onMutate: async ({ habitId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["habits", user?.id] });

      const previousHabits = queryClient.getQueryData<HabitWithStatus[]>([
        "habits",
        user?.id,
      ]);

      queryClient.setQueryData<HabitWithStatus[]>(
        ["habits", user?.id],
        (oldHabits = []) =>
          oldHabits.map((habit) =>
            habit.id === habitId ? { ...habit, completed } : habit
          )
      );

      return { previousHabits };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);

      if (context?.previousHabits)
        queryClient.setQueryData(["habits", user?.id], context.previousHabits);
    },
  });

  const value = {
    habits,
    habitsLoading,
    habitsTrackingLoading,
    addNewHabit,
    toggleHabit,
    loadHabitsError,
    habitsTracking,
    setSelectedDate,
    selectedDate,
    today,
    formattedDate,
    deleteHabitById,
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

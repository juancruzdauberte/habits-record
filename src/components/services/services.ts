import { supabase } from "../config/db";
import { HabitWithStatus, UserTypeState, type Habit } from "../types/types";

export async function createUser(user: UserTypeState) {
  try {
    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      picture: user.picture,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(error);
  }
}

export async function addHabit({
  title,
  description,
  userId,
}: {
  title: string;
  description: string;
  userId: string;
}): Promise<Habit | null> {
  try {
    const { data, error } = await supabase
      .from("habits")
      .insert({ title, description, user_id: userId })
      .select();

    if (error) throw new Error(error.message);
    return data[0] as Habit;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getHabitsForToday(
  userId: string
): Promise<HabitWithStatus[]> {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("id, title, description, user_id")
      .eq("user_id", userId);

    if (habitsError) throw new Error(habitsError.message);

    const { data: tracking, error: trackingError } = await supabase
      .from("habits_tracking")
      .select("habit_id, completed")
      .eq("user_id", userId)
      .eq("date", today);

    if (trackingError) throw new Error(trackingError.message);

    const result: HabitWithStatus[] = habits.map((habit) => {
      const tracked = tracking.find((t) => t.habit_id === habit.id);
      return {
        id: habit.id,
        title: habit.title,
        description: habit.description,
        user_id: habit.user_id,
        completed: tracked ? tracked.completed : false,
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function toggleHabitStatus(
  userId: string,
  habitId: string,
  completed: boolean
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("habits_tracking").upsert(
    {
      user_id: userId,
      habit_id: habitId,
      date: today,
      completed,
    },
    { onConflict: "user_id,habit_id,date" }
  );

  if (error) {
    console.error("Error al actualizar hábito:", error);
  }
}

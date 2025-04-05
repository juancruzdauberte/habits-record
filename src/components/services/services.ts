import { supabase } from "../config/db";
import { UserTypeState, type Day, type Habit } from "../types/types";

export async function getDate(): Promise<Day | null> {
  try {
    const currentDay = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("day")
      .select()
      .eq("date", currentDay)
      .single();
    if (error) {
      throw new Error("Error al obtener la fecha");
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateHabitCompleted(
  { id, completed }: { id: string; completed: boolean },
  user: UserTypeState
) {
  try {
    const { data, error } = await supabase
      .from("habit")
      .update({ completed: completed })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) throw error;

    console.log("Hábito actualizado:", data);

    return data;
  } catch (error) {
    console.error("Error en updateHabitCompleted:", error);
    return null;
  }
}

export async function checkAndResetHabits(user: UserTypeState): Promise<void> {
  try {
    const today = getDate().then((res) => {
      return res!;
    });
    if (!today) throw new Error("No se pudo obtener la fecha actual");
    await resetHabitsForNewDay(user);
  } catch (error) {
    console.error("Error en checkAndResetHabits:", error);
  }
}

export async function resetHabitsForNewDay(user: UserTypeState): Promise<void> {
  try {
    const { error } = await supabase
      .from("habit")
      .update({ completed: false })
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Error al resetear hábitos: " + error.message);
    }

    console.log("Hábitos reseteados correctamente.");
  } catch (error) {
    console.error("Error en resetHabitsForNewDay:", error);
  }
}

export async function createHabit(
  habit: Habit,
  user: UserTypeState
): Promise<Habit | null> {
  try {
    const date = await getDate();
    if (!date || !date.id) {
      throw new Error("Fecha no encontrada");
    }

    const { data, error } = await supabase
      .from("habit")
      .insert({ ...habit, day_id: date.id, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    console.log("Hábito insertado:", data);

    return data;
  } catch (error) {
    console.error("Error en createHabit:", error);
    return null;
  }
}

export async function createUser(user: UserTypeState): Promise<void> {
  try {
    const userInBd = await getUserById(user.id);
    console.log(userInBd);
    if (!userInBd) {
      const { error: insertError } = await supabase
        .from("users")
        .insert([user]);

      if (insertError) {
        console.error("Error al insertar usuario:", insertError);
      } else {
        console.log("Usuario insertado correctamente.");
      }
    }
  } catch (error) {
    console.log("Error en createUser:", error);
  }
}

export async function getUserById(id: string): Promise<UserTypeState | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, picture")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.warn("El usuario no existe en la base de datos.");
        return null;
      }
      console.error("Error al obtener usuario:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return null;
  }
}

export async function getHabitsForUser(): Promise<Habit[] | null> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No se pudo obtener el usuario");
    if (!user || !user.id) {
      throw new Error("Usuario no autenticado");
    }

    const { data, error } = await supabase
      .from("habit")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Error al obtener los hábitos: " + error.message);
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

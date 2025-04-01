import { User } from "@supabase/supabase-js";
import { supabase } from "../config/db";
import {
  UserType,
  type ArrayHabits,
  type Day,
  type Habit,
} from "../types/types";

export async function createUser({
  id,
  email,
  picture,
}: {
  id: string;
  email: string;
  picture: string;
}): Promise<UserType | null> {
  try {
    // Primero, verificamos si el usuario ya existe en la base de datos
    const { data: existingUser, error: existingUserError } = await supabase
      .from("user")
      .select("*")
      .eq("id", id)
      .single(); // Usamos single() para obtener solo un usuario

    // Si ocurre un error al buscar el usuario, lanzamos un error
    if (existingUserError && existingUserError.code !== "PGRST116") {
      throw new Error(
        "Error al verificar si el usuario existe: " + existingUserError.message
      );
    }

    // Si el usuario ya existe, lo retornamos
    if (existingUser) {
      console.log("Usuario ya existe:", existingUser);
      return existingUser;
    }

    // Si el usuario no existe, lo creamos
    const { data, error } = await supabase
      .from("user")
      .insert([{ id, email, picture }]);

    // Si hay un error al insertar, lo lanzamos
    if (error) throw new Error("Error al crear el usuario: " + error.message);

    // Si la inserción es exitosa, devolvemos los datos del nuevo usuario
    console.log("Nuevo usuario creado:", data);
    return data ? data[0] : null;
  } catch (error) {
    console.log("Error al crear el usuario:", error);
    return null;
  }
}

export async function getUser(): Promise<User | undefined> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error("error al obtener el usuario");
    return data.user;
  } catch (error) {
    console.log(error);
  }
}

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

export async function createHabit(habit: Habit): Promise<Habit | null> {
  try {
    const user = await getUser();
    const date = await getDate();
    if (!date || !date.id) {
      throw new Error("Fecha no encontrada");
    }
    const { data, error } = await supabase
      .from("habit")
      .insert({ ...habit, day_id: date.id, user_id: user?.id });
    if (error) {
      console.log("Error al insertar el hábito:", error); // Esto te ayudará a ver el error
      return null;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getHabitsForUser(): Promise<ArrayHabits | null> {
  try {
    const user = await getUser();
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

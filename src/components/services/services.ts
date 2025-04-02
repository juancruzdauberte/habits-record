import { supabase } from "../config/db";
import {
  UserTypeState,
  type ArrayHabits,
  type Day,
  type Habit,
} from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { toZonedTime, format } from "date-fns-tz";

export async function getDate(): Promise<Day | null> {
  try {
    const argentinaTime = toZonedTime(
      new Date(),
      "America/Argentina/Buenos_Aires"
    );
    const currentDay = format(argentinaTime, "dd-MM-yyyy");
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

export async function createHabit(
  habit: Habit,
  user: UserTypeState
): Promise<Habit | null> {
  try {
    const date = await getDate();
    if (!date || !date.id) {
      throw new Error("Fecha no encontrada");
    }

    const { data }: { data: Habit[] | null } = await supabase
      .from("habit")
      .insert({ ...habit, day_id: date.id, user_id: user.id });

    console.log("Hábito insertado:", data);

    return data;
  } catch (error) {
    console.error("Error en createHabit:", error);
    return null;
  }
}

export async function createUser({
  id,
  email,
  full_name,
  picture,
}: UserTypeState): Promise<void> {
  try {
    console.log("Intentando verificar usuario en la BD con ID:", id);

    // Verificar si el usuario ya existe en la base de datos
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", id);

    console.log("Respuesta de la consulta:", data, error);

    if (error && error.code !== "PGRST116") throw error; // Si es otro error, lanzarlo
    if (data && data.length > 0) {
      console.log("El usuario ya existe en la base de datos.");
      return;
    }

    console.log("El usuario no existe, intentando insertarlo...");

    const formattedId = id && id.length === 36 ? id : uuidv4();
    const { error: insertError } = await supabase.from("user").insert([
      {
        id: formattedId,
        email,
        picture,
        full_name,
      },
    ]);

    if (insertError) {
      console.error("Error al insertar usuario:", insertError);
    } else {
      console.log("Usuario insertado correctamente.");
    }
  } catch (error) {
    console.log("Error en createUser:", error);
  }
}

export async function getHabitsForUser(): Promise<ArrayHabits | null> {
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

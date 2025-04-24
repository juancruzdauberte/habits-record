import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useHabits } from "../context/HabitContext";
import { CiCircleRemove, CiCircleInfo } from "react-icons/ci";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Reorder } from "framer-motion";
import { type HabitWithStatus } from "../types/types";
import { useEffect, useState } from "react";

export const HabitsTrackig = () => {
  const { setSelectedDate, habitsTracking, selectedDate, deleteHabitById } =
    useHabits();
  const [items, setItems] = useState<HabitWithStatus[]>([]);

  const selected = selectedDate.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setItems(habitsTracking);
  }, [habitsTracking]);

  return (
    <>
      <section className="w-full flex flex-col md:flex-row gap-8 items-center md:items-start md:justify-around">
        <div className="flex flex-col justify-center bg-gray-50 shadow-md p-4">
          <h5 className="font-semibold text-2xl text-slate-600">Fecha:</h5>
          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            className="rounded-sm shadow-md p-4 bg-white w-full max-w-[300px] lg:max-w-[450px] mt-5"
          />
        </div>

        <div className="w-full md:w-2/4 max-w-[550px] bg-gray-50 shadow-md p-4 rounded-md">
          <h2 className="font-semibold text-2xl text-slate-600">
            Mis hábitos:
          </h2>
          {habitsTracking.length === 0 ? (
            <section className="bg-yellow-100 p-4 rounded-lg shadow-md text-yellow-800 mt-5">
              <h5 className="text-md font-medium">
                Aún no tenés hábitos registrados. Registralos en el
                <Link
                  to="/home"
                  className="text-yellow-500 font-semibold m-1 hover:underline"
                >
                  formulario
                </Link>
                para comenzar con tu progreso.
              </h5>
            </section>
          ) : (
            <section className="mt-5">
              <ul className="flex flex-col">
                <Reorder.Group axis="y" values={items} onReorder={setItems}>
                  {items.map((habit) => {
                    const isToday = selected === today;

                    const badgeColor = habit.completed
                      ? "bg-green-100 text-green-500 border border-green-500"
                      : isToday
                      ? "bg-yellow-100 text-yellow-500 border border-yellow-500"
                      : "bg-red-100 text-red-500 border border-red-500";

                    const badgeText = habit.completed
                      ? "Completado"
                      : isToday
                      ? "Pendiente"
                      : "No realizado";

                    return (
                      <Reorder.Item key={habit.id} value={habit}>
                        <li className="p-3 border border-gray-200 rounded-sm bg-white shadow-sm mb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-500">
                                Título
                              </span>
                              <span className="text-lg font-medium">
                                {habit.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-start w-28">
                                <span className="text-sm font-semibold text-gray-500">
                                  Estado
                                </span>
                                <span
                                  className={`text-sm font-medium mt-1 px-2 py-0.5 rounded-md text-center ${badgeColor}`}
                                >
                                  {badgeText}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    deleteHabitById(habit.id as string)
                                  }
                                  className="hover:text-red-500 text-gray-400 rounded-md transition-colors duration-100"
                                  aria-label="Delete"
                                >
                                  <CiCircleRemove size={25} />
                                </button>
                                <button
                                  className="hover:text-blue-400 text-blue-700 rounded-md transition-colors duration-100 relative group"
                                  aria-label="Info"
                                  onClick={() =>
                                    toast.info(
                                      `Descripción: ${
                                        habit.description ||
                                        "No hay descripción para este hábito."
                                      }`
                                    )
                                  }
                                >
                                  <div className="absolute hidden group-hover:block z-10 bg-gray-50 text-black text-xs px-3 py-1 rounded-md w-56 left-1/2 -translate-x-1/2 top-full shadow-md">
                                    {habit.description
                                      ? `Descripción: ${habit.description}`
                                      : "No hay descripción para este hábito."}
                                  </div>
                                  <CiCircleInfo size={25} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              </ul>
            </section>
          )}
        </div>
      </section>
    </>
  );
};

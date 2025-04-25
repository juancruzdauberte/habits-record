import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { CiCircleInfo, CiCircleRemove } from "react-icons/ci";
import { toast } from "sonner";
import { type HabitWithStatus } from "../types/types";
import { useHabits } from "../context/HabitContext";

export const HabitsTrackingList = () => {
  const [items, setItems] = useState<HabitWithStatus[]>([]);
  const { selectedDate, habitsTracking, deleteHabitById } = useHabits();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza la hora para evitar desfases

  const formattedSelectedDate = new Date(selectedDate);
  formattedSelectedDate.setHours(0, 0, 0, 0); // También normaliza

  const isToday = formattedSelectedDate.getTime() === today.getTime();
  const isFuture = formattedSelectedDate.getTime() > today.getTime();

  useEffect(() => {
    setItems(habitsTracking);
  }, [habitsTracking]);

  return (
    <section className="flex flex-col">
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((habit) => {
          const badgeColor = habit.completed
            ? "bg-green-100 text-green-500 border border-green-500"
            : isToday
            ? "bg-yellow-100 text-yellow-500 border border-yellow-500"
            : isFuture
            ? "bg-blue-100 text-blue-500 border border-blue-500"
            : "bg-red-100 text-red-500 border border-red-500";

          const badgeText = habit.completed
            ? "Completado"
            : isToday
            ? "Pendiente"
            : isFuture
            ? "Por realizar"
            : "No realizado";

          return (
            <Reorder.Item key={habit.id} value={habit}>
              <div className="p-3 border border-gray-200 rounded-sm bg-white shadow-sm mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Título
                    </span>
                    <span className="text-lg font-medium">{habit.title}</span>
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
                        onClick={() => deleteHabitById(habit.id as string)}
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
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </section>
  );
};

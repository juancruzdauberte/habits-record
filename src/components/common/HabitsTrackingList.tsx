import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { CiCircleInfo, CiCircleRemove } from "react-icons/ci";
import { type HabitWithStatus } from "../types/types";
import { useHabits } from "../context/HabitContext";
import Swal from "sweetalert2";

export const HabitsTrackingList = () => {
  const [items, setItems] = useState<HabitWithStatus[]>([]);
  const { selectedDate, habitsTracking, deleteHabitById } = useHabits();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formattedSelectedDate = new Date(selectedDate);
  formattedSelectedDate.setHours(0, 0, 0, 0);

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
              <section className="p-3 border border-gray-200 rounded-sm bg-white shadow-sm mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Título
                    </span>
                    <span className="text-sm font-medium mt-1">
                      {habit.title}
                    </span>
                  </div>

                  <div className="flex items-center md:gap-2">
                    <div className="flex flex-col items-start w-24 md:w-28">
                      <span className="text-sm font-semibold text-gray-500">
                        Estado
                      </span>
                      <span
                        className={`text-xs md:text-sm font-medium mt-1 px-2 py-0.5 rounded-md text-center ${badgeColor}`}
                      >
                        {badgeText}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: "¿Estás seguro?",
                            text: "Esta acción eliminará el hábito permanentemente.",
                            icon: "warning",
                            width: "400px",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Sí, eliminar",
                            cancelButtonText: "Cancelar",
                          });

                          if (result.isConfirmed) {
                            deleteHabitById(habit.id as string);
                            Swal.fire({
                              title: "Eliminado",
                              icon: "success",
                              text: "El habito ha sido eliminado",
                              width: "400px",
                            });
                          }
                        }}
                        className="hover:text-red-500 text-gray-400 rounded-md transition-colors duration-100"
                        aria-label="Delete"
                      >
                        <CiCircleRemove size={25} />
                      </button>
                      <button
                        className="hover:text-blue-400 text-blue-700 rounded-md transition-colors duration-100"
                        aria-label="Info"
                        onClick={() =>
                          Swal.fire({
                            title: "Descripción",
                            text:
                              habit.description ||
                              "No hay descripción para este hábito",
                            icon: "info",
                            width: "400px",
                            confirmButtonColor: "green",
                            cancelButtonText: "Cancelar",
                          })
                        }
                      >
                        <CiCircleInfo size={25} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </section>
  );
};

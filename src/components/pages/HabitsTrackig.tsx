import "react-calendar/dist/Calendar.css";
import { useHabits } from "../context/HabitContext";
import { Link } from "react-router-dom";
import { CalendarWidget } from "../common/widgets/CalendarWidget";
import { HabitsTrackingList } from "../common/HabitsTrackingList";
import { Loading } from "../common/widgets/Loading";

export const HabitsTrackig = () => {
  const { habitsTracking, habitsTrackingLoading, selectedDate } = useHabits();

  return (
    <section className="w-full flex flex-col md:flex-row gap-8 items-center md:items-start md:justify-around">
      <div className="flex flex-col justify-center bg-gray-50 shadow-md p-4">
        <h5 className="font-semibold text-2xl text-slate-600">
          Fecha:
          <span className="ms-2 font-bold text-xl text-slate-400">
            {selectedDate.toLocaleDateString()}
          </span>
        </h5>
        <CalendarWidget />
      </div>

      <div className="w-full md:w-2/4 max-w-[550px] bg-gray-50 shadow-md p-4 rounded-md">
        <h2 className="font-semibold text-2xl text-slate-600">Mis hábitos:</h2>
        {habitsTrackingLoading ? (
          <div className="flex justify-center p-20">
            <Loading text="Cargando hábitos..." />
          </div>
        ) : (
          <section>
            {habitsTracking.length === 0 ? (
              <div className="bg-yellow-100 p-4 rounded-lg shadow-md text-yellow-800 mt-5">
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
              </div>
            ) : (
              <div className="mt-5">
                <HabitsTrackingList />
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
};

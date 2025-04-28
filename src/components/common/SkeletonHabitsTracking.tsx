import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useHabits } from "../context/HabitContext";

export const SkeletonHabitsTracking = () => {
  const { habits } = useHabits();
  return (
    <section className="w-full flex flex-col md:flex-row gap-8 items-center md:items-start md:justify-around">
      <div className="flex flex-col justify-center bg-gray-50 shadow-md p-4">
        <div className="flex items-center justify-between border-b-2">
          <span className="font-semibold text-2xl text-slate-600 ">
            <Skeleton width={120} height={30} />
          </span>
          <span className="font-bold text-xl text-slate-400">
            <Skeleton width={100} height={30} />
          </span>
        </div>

        <div className="rounded-sm shadow-md w-full max-w-[300px] lg:max-w-[450px] mt-5">
          <Skeleton height={300} width={450} />
        </div>
      </div>

      <div className="w-full md:w-2/4 max-w-[555px] bg-gray-50 shadow-md p-4 rounded-md">
        <div className="border-b-2 mb-4 pb-2">
          <Skeleton width={150} height={24} />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          {[...Array(habits.length)].map((_, i) => (
            <Skeleton key={i} height={65} />
          ))}
        </div>
      </div>
    </section>
  );
};

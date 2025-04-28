import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonHabitContainer = () => {
  return (
    <section className="px-10 py-5 bg-gray-50 rounded-sm shadow-md max-w-xl lg:w-[500px] mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 p-2">
          <Skeleton height={30} width={150} />
        </h2>
      </div>
      {/* Título de sección */}
      <div className="mb-4">
        <Skeleton width={250} height={28} />
      </div>

      {/* Filtro */}
      <div className="mb-6">
        <Skeleton width={"30%"} height={20} />
      </div>

      {/* Lista de hábitos */}
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton width={20} height={20} borderRadius={4} />
            <Skeleton width={200} height={20} />
          </div>
        ))}
      </div>
    </section>
  );
};

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonHabitsForm = () => {
  return (
    <section className="px-10 py-5 bg-gray-50 rounded-sm shadow-md max-w-xl lg:w-[500px] mx-auto">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton width={100} height={20} />
          <Skeleton height={35} />
          <div className="text-end">
            <Skeleton width={100} height={15} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton width={150} height={20} />
          <Skeleton height={150} />
          <div className="text-end">
            <Skeleton width={100} height={15} />
          </div>
        </div>

        <Skeleton height={40} />
      </div>
    </section>
  );
};

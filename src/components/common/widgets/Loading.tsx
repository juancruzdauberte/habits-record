import { ClipLoader } from "react-spinners";

export const Loading = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center">
      <ClipLoader color="#2f4eb5" loading size={50} />
      <p className="mt-2 text-lg font-semibold text-[#2f4eb5]">{text}</p>
    </div>
  );
};

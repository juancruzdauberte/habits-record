import { useEffect, useState } from "react";
import { useHabits } from "../context/HabitContext";
import { type Habit } from "../types/types";
import { motion } from "framer-motion";

type Target = "good" | "bad";

export const MyHabits = () => {
  document.title = "Mis hábitos";
  const { habits } = useHabits();

  const [goodHabits, setGoodHabits] = useState<Habit[]>([]);
  const [badHabits, setBadHabits] = useState<Habit[]>([]);
  const [unassignedHabits, setUnassignedHabits] = useState<Habit[]>(habits);

  const handleDrop = (habit: Habit, target: Target) => {
    setUnassignedHabits((prev) => prev.filter((h) => h.id !== habit.id));
    setBadHabits((prev) => prev.filter((h) => h.id !== habit.id));
    setGoodHabits((prev) => prev.filter((h) => h.id !== habit.id));

    if (target === "good") setGoodHabits((prev) => [...prev, habit]);
    if (target === "bad") setBadHabits((prev) => [...prev, habit]);
  };

  useEffect(() => {
    const savedGoodHabits = JSON.parse(
      localStorage.getItem("goodHabits") || "[]"
    );
    const savedBadHabits = JSON.parse(
      localStorage.getItem("badHabits") || "[]"
    );

    const currentIds = habits.map((h) => h.id);

    const filteredGood = savedGoodHabits.filter((h: Habit) =>
      currentIds.includes(h.id)
    );
    const filteredBad = savedBadHabits.filter((h: Habit) =>
      currentIds.includes(h.id)
    );

    setGoodHabits(filteredGood);
    setBadHabits(filteredBad);

    localStorage.setItem("goodHabits", JSON.stringify(filteredGood));
    localStorage.setItem("badHabits", JSON.stringify(filteredBad));

    const assignedIds = [...filteredGood, ...filteredBad].map((h) => h.id);
    const remainingHabits = habits.filter((h) => !assignedIds.includes(h.id));

    setUnassignedHabits(remainingHabits);
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("goodHabits", JSON.stringify(goodHabits));
    localStorage.setItem("badHabits", JSON.stringify(badHabits));
  }, [goodHabits, badHabits]);

  const HabitCard = ({ habit }: { habit: Habit }) => (
    <motion.div
      className="bg-white border rounded-md p-2 shadow cursor-grab"
      drag
      dragSnapToOrigin
      whileDrag={{ scale: 1.05 }}
      onDragEnd={(event, info) => {
        const dropX = info.point.x;

        if (dropX < window.innerWidth / 2) {
          handleDrop(habit, "good");
        } else {
          handleDrop(habit, "bad");
        }
      }}
    >
      {habit.title}
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-[400px]">
      <div className="bg-green-50 border rounded-md p-4">
        <p className="text-green-700 font-bold mb-2 text-center">
          Buenos hábitos
        </p>
        <div className="flex flex-col gap-2">
          {goodHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border rounded-md p-4">
        <p className="text-gray-700 font-bold text-center mb-2">
          Sin clasificar
        </p>
        <div className="flex flex-col gap-2">
          {unassignedHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>

      <div className="bg-red-50 border rounded-md p-4 ">
        <p className="text-red-700 font-bold mb-2 text-center">Malos hábitos</p>
        <div className="flex flex-col gap-2">
          {badHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>
    </div>
  );
};

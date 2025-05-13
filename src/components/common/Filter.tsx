import { motion } from "framer-motion";

export const Filter = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (value: string) => void;
}) => {
  return (
    <motion.div
      className="flex gap-2 items-center mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-md font-medium text-gray-700">Ordenar:</span>
      <motion.select
        className="border border-gray-300 rounded-md p-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
      >
        <option value="a-z">A-Z</option>
        <option value="z-a">Z-A</option>
        <option value="ma-no">Mañana - Noche</option>
      </motion.select>
    </motion.div>
  );
};

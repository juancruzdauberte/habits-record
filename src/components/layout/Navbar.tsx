import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../common/widgets/Loading";
import { CiLogout } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { HiMiniBars3, HiXMark } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
Modal.setAppElement("#root");

export const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      signOut();
    }, 500);
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  if (loading)
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-300">
        <Loading text="Cerrando sesión..." />
      </section>
    );

  return (
    <AnimatePresence mode="wait">
      {!isLoggingOut && (
        <motion.header
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full fixed top-0 flex items-center justify-between bg-slate-600 p-2 z-50"
        >
          <div>
            <Link to="/home">
              <h1 className="text-white font-bold text-lg md:text-2xl hover:underline">
                Habits Record
              </h1>
            </Link>
          </div>
          <nav>
            {!modalOpen && (
              <button
                onClick={openModal}
                className="md:hidden text-2xl text-white"
                aria-label="Abrir menú"
              >
                <HiMiniBars3 />
              </button>
            )}
            <ul className="hidden md:flex md:items-center md:gap-5">
              <li className="text-white font-semibold text-sm md:text-md">
                <NavLink
                  className={({ isActive }: { isActive: boolean }) =>
                    `border-b-[2px] ${
                      isActive
                        ? "border-white"
                        : "border-transparent hover:border-white"
                    }`
                  }
                  to="/my-habits"
                >
                  Mis hábitos
                </NavLink>
              </li>
              <li className="text-white font-semibold text-sm md:text-md">
                <NavLink
                  className={({ isActive }: { isActive: boolean }) =>
                    `border-b-[2px] ${
                      isActive
                        ? "border-white"
                        : "border-transparent hover:border-white"
                    }`
                  }
                  to="/habits-tracking"
                >
                  Registro de hábitos
                </NavLink>
              </li>

              <li className="relative">
                <div className="group relative inline-block">
                  {!imgError ? (
                    <img
                      src={user?.picture}
                      alt={user?.full_name}
                      className="w-9 h-9 rounded-full cursor-pointer"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center">
                      <FiUser className="text-white" size={24} />
                    </div>
                  )}
                  <div className="hidden group-hover:block absolute right-0 w-40 bg-white shadow-lg rounded-sm transition-all duration-300">
                    <span
                      className="px-4 py-2 flex items-center gap-1 hover:bg-red-200 cursor-pointer text-red-600"
                      onClick={handleLogout}
                    >
                      <CiLogout size={18} /> Cerrar sesión
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            <Modal
              isOpen={modalOpen}
              onRequestClose={closeModal}
              contentLabel="Menú móvil"
              className="z-60 text-black bg-white h-full absolute flex right-0 top-0 p-6 w-60 max-w-md outline-none md:hidden"
              overlayClassName="z-50 inset-0 fixed inset-0 bg-black bg-opacity-50 flex md:hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 md:hidden text-2xl cursor-pointer"
                aria-label="Abrir menú"
              >
                <HiXMark />
              </button>

              <ul className="flex flex-col items-start gap-4 text-center text-xl mt-10 font-semibold">
                <li>
                  <NavLink
                    className={({ isActive }: { isActive: boolean }) =>
                      `border-b-[2px] ${
                        isActive
                          ? "border-black"
                          : "border-transparent hover:border-white"
                      }`
                    }
                    to="/my-habits"
                    onClick={closeModal}
                  >
                    Mis hábitos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }: { isActive: boolean }) =>
                      `border-b-[2px] ${
                        isActive
                          ? "border-black"
                          : "border-transparent hover:border-white"
                      }`
                    }
                    to="/habits-tracking"
                    onClick={closeModal}
                  >
                    Registro de hábitos
                  </NavLink>
                </li>
                <li
                  onClick={() => {
                    handleLogout();
                    closeModal();
                  }}
                  className="flex items-center gap-2 text-red-600"
                >
                  <CiLogout size={18} /> Cerrar sesión
                </li>
              </ul>
            </Modal>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

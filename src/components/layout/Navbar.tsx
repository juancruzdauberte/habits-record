import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../common/widgets/Loading";
import { CiLogout } from "react-icons/ci";
export const Navbar = () => {
  const { user, signOut, loading } = useAuth();

  if (loading)
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-300">
        <Loading text="Cerrando sesion..." />
      </section>
    );

  return (
    <header className="w-full fixed top-0 flex items-center justify-between bg-slate-600 p-1.5 z-50">
      <div>
        <Link to="/home">
          <h1 className="text-white font-bold">Habits Record</h1>
        </Link>
      </div>
      <ul className="flex items-center gap-5">
        <li>
          <Link to="/habits-tracking">Registro</Link>
        </li>
        <li>
          <div className=" relative group">
            <img
              src={user?.picture}
              alt={user?.full_name}
              className="w-9 h-9 rounded-full cursor-pointer"
            />

            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ul className="flex flex-col text-black">
                <Link to="/account">
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Mi perfil
                  </li>
                </Link>

                <li
                  className="px-4 py-2 flex items-center gap-1 hover:bg-red-200 cursor-pointer text-red-600"
                  onClick={signOut}
                >
                  <CiLogout size={18} /> Cerrar sesión
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </header>
  );
};

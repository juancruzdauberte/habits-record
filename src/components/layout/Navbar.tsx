import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../common/widgets/Loading";
export const Navbar = () => {
  const { user, signOut, loading } = useAuth();

  if (loading)
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-300">
        <Loading text="Cerrando sesion..." />
      </section>
    );

  return (
    <header className="w-full flex items-center bg-slate-500 p-2">
      <div>
        <Link to="/home">
          <h1>Habits Record</h1>
        </Link>
      </div>
      <div className="ml-auto relative group">
        <img
          src={user?.picture}
          alt={user?.full_name}
          className="w-12 h-12 rounded-full cursor-pointer"
        />

        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ul className="flex flex-col text-black">
            <Link to="/account">
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Mi perfil
              </li>
            </Link>

            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-red-600"
              onClick={signOut}
            >
              Cerrar sesión
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

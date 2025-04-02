import { useEffect } from "react";
import { GoogleWidget } from "../common/widgets/GoogleWidget";
import { useAuth } from "../context/AuthContext";
import { createUser } from "../services/services";

export const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  document.title = "Login - Habits Record";

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (user) await createUser(user);
    };
    fetchData();
  }, [user]);

  return (
    <main className="h-screen w-full flex justify-center items-center bg-slate-300">
      <section className="bg-black h-72 flex items-center">
        <button
          onClick={signInWithGoogle}
          className="flex gap-2 items-center bg-slate-200 text-black p-2 text-xl"
        >
          <GoogleWidget /> Continuar con google
        </button>
      </section>
    </main>
  );
};

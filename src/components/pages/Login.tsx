import { GoogleWidget } from "../common/widgets/GoogleWidget";
import { useAuth } from "../context/AuthContext";
import { createUser } from "../services/services";
import { useMutation } from "@tanstack/react-query";
import { UserTypeState } from "../types/types";
import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

export const Login = () => {
  document.title = "Login - Habits Record";
  const { signInWithGoogle, user, signInWithMagicLink } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await signInWithMagicLink(value.email);
    },
  });

  const { mutate: createUserMutation } = useMutation<
    void,
    Error,
    UserTypeState
  >({
    mutationFn: createUser,
  });

  useEffect(() => {
    if (user) createUserMutation(user);
  }, [createUserMutation, user]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md bg-white shadow-lg rounded-sm p-10">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-5">
          Iniciar sesión
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            validators={{
              onSubmit: ({ value }) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const trimmed = value.trim();

                if (!trimmed) return "El campo no puede estar vacio";

                if (!emailRegex.test(trimmed))
                  return "Formato de email inválido";

                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="text-slate-700 font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                />
                {field.state.meta.errors.length > 0 && (
                  <em className="text-red-500 text-sm">
                    {field.state.meta.errors.join(", ")}
                  </em>
                )}
              </div>
            )}
          </form.Field>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-sm font-semibold hover:bg-slate-700 transition-colors mt-5"
          >
            Enviar
          </button>
        </form>

        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-sm font-semibold transition-colors mt-16"
        >
          <GoogleWidget />
          Continuar con Google
        </button>
      </section>
    </main>
  );
};

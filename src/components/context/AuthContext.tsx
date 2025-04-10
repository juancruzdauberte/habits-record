import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type AuthContextType, type UserTypeState } from "../types/types";
import { supabase } from "../config/db";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserTypeState | null>(null);
  const navigate = useNavigate();

  async function signInWithGoogle(): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw new Error("Ha ocurrido un error en la autenticación");

      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        throw new Error("No se pudo obtener el usuario autenticado");
      }

      const { id, user_metadata } = data.user;
      const { email, picture, full_name } = user_metadata;
      const userData: UserTypeState = { id, email, picture, full_name };
      setUser(userData);
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error("Ha ocurrido un error en la autenticación");
      setUser(null);
      console.log(user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const { picture, full_name } = user_metadata;

        const userData: UserTypeState = {
          id,
          email: email || " ",
          picture,
          full_name,
        };
        setUser(userData);
        if (event === "SIGNED_IN") navigate("/home");
      } else {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  const value = { signInWithGoogle, signOut, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return authContext;
};

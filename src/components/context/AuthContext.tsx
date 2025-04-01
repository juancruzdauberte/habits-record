import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type UserType, type AuthContextType } from "../types/types";
import { supabase } from "../config/db";
import { useNavigate } from "react-router-dom";
import { createUser, getUser } from "../services/services";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw new Error("Ha ocurrido un error en la autenticación");
      const user = await getUser();

      if (user) {
        const userData = user.user_metadata as UserType;
        const currentUser = await createUser({
          id: userData.id,
          email: userData.user_metadata.email,
          picture: userData.user_metadata.picture,
        });
        setUser(currentUser);
      }
      return data;
    } catch (error) {
      console.error(error);
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
      setUser(session?.user as UserType | null);
      console.log(session?.user);

      if (event === "SIGNED_IN") navigate("/home");
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

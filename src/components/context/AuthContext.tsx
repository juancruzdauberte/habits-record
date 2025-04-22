import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type AuthContextType, type UserTypeState } from "../types/types";
import { supabase } from "../config/db";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserTypeState | null>(null);
  const { loading, loadingFalse, loadingTrue } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();

  const [hasRequestedMagicLink, setHasRequestedMagicLink] =
    useState<boolean>(false);

  async function signInWithGoogle(): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw new Error("Ha ocurrido un error en la autenticación");
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  }

  async function signInWithMagicLink(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      navigate("/check-email");
      setHasRequestedMagicLink(true);
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
    }
  }

  async function signOut() {
    loadingTrue();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error("Ha ocurrido un error en la autenticación");
      setUser(null);
      console.log(user);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      loadingFalse();
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
        if (event === "SIGNED_IN" && location.pathname === "/")
          navigate("/home");
      } else {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    signInWithGoogle,
    signOut,
    user,
    loading,
    signInWithMagicLink,
    hasRequestedMagicLink,
    loadingTrue,
    loadingFalse,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return authContext;
};

import {
  type AuthResponse,
  type User,
  type Session,
  type AuthError,
  type UserResponse,
} from "@supabase/supabase-js";

export type AuthResponse = {
  data: {
    user: User | null;
    session: Session | null;
  } | null;
  error: AuthError | null;
};

export type UserType = User & {
  user_metadata: {
    id?: string;
    name: string;
    email: string;
    picture: string;
  };
};

export interface AuthContextType {
  user: UserType | null;
  signOut: () => Promise;
  signInWithGoogle: () => Promise;
}

export type Habit = {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
  day_id: string;
  user_id: string;
};

export type Day = {
  id?: string;
  date: string;
};

export type ArrayDays = Day[];
export type ArrayHabits = Habit[];

export type UserResponse = {
  data: { user: User | null };
  error: AuthError | null;
};

import { UseMutateFunction } from "@tanstack/react-query";

export interface UserResponse {
  data: {
    user: User;
  };
  error: null | string;
}

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
}

export interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface UserMetadata {
  id: string;
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  name: string;
  picture: string;
}

export interface Identity {
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

export interface IdentityData {
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  picture: string;
  sub: string;
}

export type UserTypeState = Omit<
  UserMetadata,
  "avatar_url" | "name" | "email_verified"
>;

export interface AuthContextType {
  user: UserTypeState | null;
  signOut: () => Promise;
  signInWithGoogle: () => Promise;
  loading: boolean;
  loadingTrue: () => void;
  loadingFalse: () => void;
  signInWithMagicLink: (email: string) => Promise;
  hasRequestedMagicLink: bolean;
}

export interface HabitContextType {
  habits: HabitWithStatus[];
  habitsTracking: HabitWithStatus[];
  habitsLoading: boolean;
  habitsTrackingLoading: boolean;
  today: Date;
  formattedDate: string;
  selectedDate: Date;
  loadHabitsError: Error | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  addNewHabit: UseMutateFunction<
    Habit | null,
    Error,
    { title: string; description: string; doIn: do_in }
  >;
  toggleHabit: UseMutateFunction<
    void,
    Error,
    { habitId: string; completed: boolean }
  >;
  deleteHabitById: UseMutateFunction<void, Error, string>;
}

export type Habit = {
  id?: string;
  title: string;
  description: string;
  doIn: do_in;
  user_id: string;
};

export type do_in = "Mañana" | "Tarde" | "Noche" | "";

export type HabitWithStatus = Habit & { completed: boolean };

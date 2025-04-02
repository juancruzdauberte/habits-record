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
}

export type Habit = {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
  day_id: string | undefined;
  user_id: string;
};

export type Day = {
  id?: string;
  date: string;
};

export type ArrayDays = Day[];
export type ArrayHabits = Habit[];

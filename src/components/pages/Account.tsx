import { useAuth } from "../context/AuthContext";

export const Account = () => {
  const { user, signOut } = useAuth();
  document.title = "Mi cuenta";
  return (
    <div>
      <img src={user?.picture} alt={user?.full_name} />
      <p>{user?.full_name}</p>
      <p>{user?.email}</p>
      <button onClick={signOut}>Cerrar sesion</button>
    </div>
  );
};

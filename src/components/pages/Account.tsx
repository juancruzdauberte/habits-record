import { useAuth } from "../context/AuthContext";

export const Account = () => {
  const { user, signOut } = useAuth();
  document.title = "Mi cuenta";
  return (
    <div>
      <img src={user?.user_metadata.picture} alt={user?.user_metadata.name} />
      <button onClick={signOut}>Cerrar sesion</button>
    </div>
  );
};

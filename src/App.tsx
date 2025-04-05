import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/pages/Login";
import { AuthProvider } from "./components/context/AuthContext";
import { Home } from "./components/pages/Home";
import { Account } from "./components/pages/Account";
import { ProtectedRoutes } from "./components/config/ProtectedRoutes";
import { NotFound } from "./components/pages/NotFound";
import { HabitProvider } from "./components/context/HabitContext";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors duration={2500} />
      <AuthProvider>
        <HabitProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/account" element={<Account />} />
              <Route path="/home" element={<Home />} />
            </Route>
          </Routes>
        </HabitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

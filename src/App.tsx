import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/pages/Login";
import { AuthProvider } from "./components/context/AuthContext";
import { Home } from "./components/pages/Home";
import { ProtectedRoutes } from "./components/config/ProtectedRoutes";
import { NotFound } from "./components/pages/NotFound";
import { HabitProvider } from "./components/context/HabitContext";
import { Toaster } from "sonner";
import { ProtectedLayout } from "./components/config/ProtectedLayout";
import { ProtectedCheckEmailRoute } from "./components/config/ProtectedCheckEmailRoute";
import { CheckEmail } from "./components/pages/CheckEmail";
import { HabitsTrackig } from "./components/pages/HabitsTrackig";
import { MyHabits } from "./components/pages/MyHabits";

function App() {
  return (
    <section className=" bg-slate-50 text-black w-full">
      <BrowserRouter>
        <Toaster richColors duration={2500} closeButton />
        <AuthProvider>
          <HabitProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/check-email"
                element={
                  <ProtectedCheckEmailRoute>
                    <CheckEmail />
                  </ProtectedCheckEmailRoute>
                }
              />
              <Route element={<ProtectedRoutes />}>
                <Route element={<ProtectedLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/habits-tracking" element={<HabitsTrackig />} />
                  <Route path="/my-habits" element={<MyHabits />} />
                </Route>
              </Route>
            </Routes>
          </HabitProvider>
        </AuthProvider>
      </BrowserRouter>
    </section>
  );
}

export default App;

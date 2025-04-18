import { Outlet } from "react-router-dom";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";

export const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col w-full justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

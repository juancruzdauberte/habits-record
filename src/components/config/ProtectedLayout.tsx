import { Outlet } from "react-router-dom";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";

export const ProtectedLayout = () => {
  return (
    <section className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16 pb-12 flex justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export const CheckEmail = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <section className="w-full flex flex-col gap-10  max-w-md bg-white shadow-lg rounded-sm p-8 space-y-6 ">
        <div className="flex flex-col items-center gap-7">
          <h1 className="text-3xl font-bold text-center text-customBrown">
            Verifica tu email
          </h1>
          <p>
            Hemos enviado un mail a tu correo. Por favor verifica el mismo para
            poder autenticarte en nuestro sitio web
          </p>
        </div>
      </section>
    </main>
  );
};

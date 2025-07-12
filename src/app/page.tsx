export default function Home() {
  return (
    <main className="min-h-screen bg-amber-200 text-white">
      <section
        className="relative h-screen w-full flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/your-image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wide">
            ABDULHAMEED AL-AZZAWI
          </h1>
        </div>
        <div className="absolute bottom-5 z-10">
          <a href="#about" className="text-white text-sm animate-bounce">↓</a>
        </div>
      </section>

      <section id="about" className="min-h-screen bg-white text-black p-10">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p>Här börjar nästa sektion…</p>
      </section>
    </main>
  );
}

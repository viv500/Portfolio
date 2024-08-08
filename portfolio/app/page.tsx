import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative flex justify-center mx-auto items-center flex-col sm:px-11 px-6">
      <div className="max-w-7xl w-full">
        <div> <Hero /> </div>

      </div>
    </main>
  );
}

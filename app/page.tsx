import Hero from "@/components/Hero";
import Bento from '../components/Bento'

export default function Home() {
  return (
    <main className="relative w-full overflow-x-clip bg-black">
      <Hero />
      <div className="mx-auto w-full max-w-7xl">
        <Bento />
      </div>
    </main>
  );
}

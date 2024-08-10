import Hero from "@/components/Hero";
import Bento from '../components/Bento'

export default function Home() {
  return (
    <main className="relative flex justify-center mx-auto items-center flex-col">
      <div className="max-w-7xl w-full">
        <Hero/>
        <Bento/>

      </div>
    </main>
  );
}

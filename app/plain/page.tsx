import Hero from "@/components/Hero";
import Bento from "@/components/Bento"

// The previous version of the site, kept reachable at /plain.
export const metadata = { title: "Vivek Jude Manoj | Classic", robots: { index: false } };

export default function Classic() {
  return (
    <main className="relative w-full overflow-x-clip bg-black">
      <Hero />
      <div className="mx-auto w-full max-w-7xl">
        <Bento />
      </div>
    </main>
  );
}

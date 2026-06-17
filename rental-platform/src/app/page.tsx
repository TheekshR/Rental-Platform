import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ZoneHighlights from "@/components/ZoneHighlights";
import AboutUs from "@/components/AboutUs";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Stats />
      <ZoneHighlights />
      <AboutUs />
    </div>
  );
}
import Faqs from "../../components/Faqs";
import Hero from "../../components/Hero";
import QuickStats from "../../components/QuickStart";
import Steps from "../../components/Steps";

export default function About() {
  return (
    <div className="font-worksans text-black w-full">
      {/* banner (a attention-grabbing visual element) with text and a call-to-action */}
      <section className="relative overflow-hidden shadow">
        <Hero />
      </section>

      {/* how it works */}
      <section className="px-6 py-12 md:px-20 shadow">
        <Steps/>
      </section>

      {/* quick start checklist */}
      <section className="px-6 py-12 md:px-20 bg-cream">
        <QuickStats/>
      </section>

      {/* frequently asked questions */}
      <section className="px-6 py-12 md:px-20 shadow">
        <Faqs/>
      </section>
    </div>
  );
}

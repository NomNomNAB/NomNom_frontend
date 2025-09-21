import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { features } from "../../constants";

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden">
      <img
        src="/cooking2.JPG"
        alt="Kitchen background"
        className="absolute inset-0 h-full w-full object-cover object-[30%_50%] md:object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-white/15" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.25fr] md:gap-16 md:items-center">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(320px,480px)] lg:gap-10 lg:-ml-15">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold">Cook • Share • Inspire</span>
              </div>

              <h1 className="mb-2 font-lobster text-3xl md:text-4xl text-white drop-shadow">
                About <span className="text-primary">Nom Nom</span>
              </h1>

              <p className="mb-6 text-base md:text-lg text-white/95 max-w-xl">
                Nom Nom is your cozy kitchen corner to discover, create, and share delicious recipes.
              </p>

              <div className="mb-2 flex flex-wrap gap-3">
                <Link
                  to="/recipes/add"
                  className="shrink-0 rounded-full bg-primary px-6 py-3 font-worksans uppercase text-white font-semibold transition-transform duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                >
                  Share Your Recipe
                </Link>
                <Link
                  to="/recipes"
                  className="shrink-0 rounded-full shadow-sm px-6 py-3 font-worksans uppercase font-semibold text-[#732c4e] bg-white transition-transform duration-200 hover:scale-105 hover:shadow-md active:scale-95 dark:text-primary"
                >
                  Explore
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-2 shrink-0 break-normal lg:max-w-[520px] lg:-ml-5">
              {features.map((f, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200/70 bg-white/90 p-4 shadow-sm hover:shadow-md transition"
                >
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold break-words">{f.title}</h3>
                  <p className="mt-1 text-sm break-words">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

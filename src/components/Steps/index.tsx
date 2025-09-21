import { steps } from "../../constants";

export default function Steps() {
  return (
    <div>
      <div className="text-black mb-6 text-center">
        <h2 className="font-playfair font-extrabold text-primary text-3xl md:text-4xl">
          Getting Started
        </h2>
        <p className="mt-2 text-gray max-w-xl mx-auto">
          Just three simple steps to discover, create, and share your favorite recipes
          with Nom Nom
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-primary/40 transition"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-primary group-hover:bg-primary group-hover:text-white transition">
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-black">{s.title}</h3>
            <p className="mt-3 text-sm text-gray max-w-[220px] text-center">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

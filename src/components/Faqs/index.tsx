import { ArrowRight } from "lucide-react";
import { faqs } from "../../constants";

export default function Faqs() {
  return (
    <div className="text-black max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="font-playfair font-extrabold text-primary text-3xl md:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-gray max-w-xl mx-auto">
          Answers to common questions about using Nom Nom
        </p>
      </div>

      <div className="divide-y shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
        {faqs.map((f, i) => (
          <div key={i}>
            <details className="group px-6 py-4">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-black">
                {f.q}
                <ArrowRight className="shrink-0 h-4 w-4 transition group-open:rotate-90 text-primary" />
              </summary>
              <p className="mt-2 text-sm text-gray">{f.a}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

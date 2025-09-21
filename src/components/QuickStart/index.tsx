import { CheckCircle } from "lucide-react";
import { quickStats } from "../../constants";

export default function QuickStats() {
  return (
    <div className="text-black  max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-playfair font-extrabold text-primary text-3xl md:text-4xl">
          Quick starts
        </h2>
        <p className="mt-2 mb-4 text-gray max-w-xl mx-auto">
          Follow these essentials and begin your cooking journey today.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">

        {quickStats.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-black"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100">
                <CheckCircle className="h-4 w-4 text-primary" />
              </span>
              {item}
            </li>

        ))}
      </div>
    </div>
  );
}

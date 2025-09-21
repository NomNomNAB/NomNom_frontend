import { Link } from "react-router-dom";
import { FileWarning, } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-w-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-rose-100 p-6 mb-6">
          <FileWarning className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-worksans text-5xl font-extrabold select-none text-primary">
          404
        </h1>
        <p className="mt-3 text-lg font-worksans select-none text-black">
          Oops! This page not found
        </p>
        <Link
          to="/"
          className="mt-6 uppercase font-semibold inline-block rounded-full bg-primary px-6 py-3 font-worksans font-medium text-white transition hover:bg-[#732c4e] select-none"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

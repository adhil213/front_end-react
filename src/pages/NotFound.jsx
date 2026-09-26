import { Link } from "react-router-dom";
import useDocumentMeta from "../hooks/useDocumentMeta";

const NotFound = () => {
  useDocumentMeta({
    title: "Page Not Found",
    path: "/404",
    noindex: true,
  });

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0b1120] text-white text-center">
      
      <h1 className="text-6xl font-black text-emerald-500 mb-4">
        404
      </h1>

      <p className="text-gray-400 mb-6">
        Page not found
      </p>

      <Link
        to="/"
        className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold"
      >
        Go Home
      </Link>

    </div>
  );
};

export default NotFound;
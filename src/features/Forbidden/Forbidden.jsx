import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-black text-white font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#CC8400] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E65100] rounded-full blur-[120px] opacity-30 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-2xl p-8 sm:p-10 text-center">
        <div className="text-[120px] sm:text-[180px] font-black bg-linear-to-br from-[#CC8400] via-[#E65100] to-[#CC8400] bg-clip-text text-transparent leading-none mb-4">
          403
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold mb-4 bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Accés denegat
        </h1>

        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Aquesta pàgina no es per a tu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-black/30 text-white border border-white/10 rounded-xl font-semibold hover:bg-black/50 hover:border-[#CC8400]/50 transition-all duration-300"
          >
            ← Tornar Enrere
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-linear-to-r from-[#CC8400] to-[#E65100] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-orange-900/40 transform hover:scale-105 transition-all duration-300"
          >
            Anar a l'Inici
          </button>
        </div>
      </div>
    </div>
  );
}

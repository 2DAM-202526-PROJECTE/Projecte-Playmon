import React from "react";
import { FiCheck, FiX, FiLayers, FiZap, FiStar } from "react-icons/fi";

const PricingCard = ({ title, price, features, recommended, icon: Icon, color, onSelect }) => {
  return (
    <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-105 ${
      recommended 
        ? "bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] border-[#CC8400] shadow-[0_0_40px_-10px_rgba(204,132,0,0.3)]" 
        : "bg-[#1A1A1A]/40 backdrop-blur-xl border-white/10 hover:border-white/20"
    }`}>
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Més popular
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 text-white`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold text-white leading-none">{price}€</span>
          <span className="text-gray-400 text-sm ml-1">/mes</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-8">Millora la teva experiència a Playmon amb el pla {title.toLowerCase()}.</p>

      <div className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {feature.included ? (
              <FiCheck className="text-[#CC8400] mt-1 shrink-0" />
            ) : (
              <FiX className="text-gray-600 mt-1 shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? "text-gray-200" : "text-gray-500"}`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onSelect({ title, price })}
        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
          recommended 
            ? "bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black hover:shadow-[0_0_20px_rgba(230,81,0,0.4)]" 
            : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
        }`}
      >
        Seleccionar Pla
      </button>
    </div>
  );
};

export const SubscriptionPlans = ({ onSelectPlan }) => {
  const plans = [
    {
      title: "Pla Bàsic",
      price: "1",
      icon: FiLayers,
      color: "from-gray-500 to-gray-700",
      features: [
        { text: "Funcions bàsiques", included: true },
        { text: "Veure tot el contingut", included: true },
        { text: "Qualitat 1080p (Full HD)", included: true },
        { text: "Amb anuncis", included: true },
        { text: "Sense càrrega de contingut", included: false },
        { text: "Accés a la Zona Master", included: false },
      ],
    },
    {
      title: "Pla Super",
      price: "5.99",
      recommended: true,
      icon: FiZap,
      color: "from-[#CC8400] to-[#E65100]",
      features: [
        { text: "Tot el del pla Bàsic", included: true },
        { text: "Sense anuncis", included: true },
        { text: "Qualitat 2K (QHD)", included: true },
        { text: "Penjar el teu propi contingut", included: true },
        { text: "Suport estàndard", included: true },
        { text: "Accés a la Zona Master", included: false },
      ],
    },
    {
      title: "Pla Master",
      price: "12.99",
      icon: FiStar,
      color: "from-purple-500 to-blue-600",
      features: [
        { text: "Tot el del pla Super", included: true },
        { text: "Qualitat 4K (Ultra HD)", included: true },
        { text: "Accés a pàgina especial Master", included: true },
        { text: "Insígnia exclusiva al perfil", included: true },
        { text: "Suport prioritari 24/7", included: true },
        { text: "Beta tester de noves funcions", included: true },
      ],
    },
  ];

  return (
    <div className="py-8 w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          Tria el teu <span className="bg-gradient-to-r from-[#CC8400] to-[#E65100] bg-clip-text text-transparent">Pla de Poder</span>
        </h2>
        <p className="text-gray-400 text-base max-w-xl mx-auto">
          Subscriu-te per desbloquejar noves possibilitats i gaudir de Playmon sense límits.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, idx) => (
          <PricingCard key={idx} {...plan} onSelect={onSelectPlan} />
        ))}
      </div>

      <div className="mt-16 p-8 rounded-3xl bg-[#1A1A1A]/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 sm:p-10">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white mb-2">Teniu dubtes sobre els plans?</h4>
          <p className="text-gray-400 text-sm">Pots canviar de pla en qualsevol moment o cancel·lar la teva subscripció sense compromís des de la configuració del teu compte.</p>
        </div>
        <button className="whitespace-nowrap px-8 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors">
          Contactar amb Suport
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

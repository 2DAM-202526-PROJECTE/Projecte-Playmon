import { useEffect, useMemo, useState } from "react";
import SubscriptionPlans from "@/features/subscriptions/SubscriptionPlans";
import PaymentForm from "@/features/subscriptions/PaymentForm";
import { FiCheck, FiCheckCircle, FiArrowLeft, FiLayers, FiStar, FiZap } from "react-icons/fi";
import { updateUserSubscription } from "@/api/usersApi";
import { getCurrentUser, updateCurrentUser } from "@/api/authApi";

const PLAN_DETAILS = {
  basic: {
    key: "basic",
    title: "Pla Bàsic",
    price: 0,
    level: 1,
    description: "Ideal per a començar i gaudir del catàleg complet amb funcionalitats essencials.",
    icon: FiLayers,
    accent: "from-gray-500 to-gray-700",
    features: [
      "Funcions bàsiques",
      "Veure tot el contingut",
      "Qualitat 1080p (Full HD)",
      "Amb anuncis",
    ],
  },
  super: {
    key: "super",
    title: "Pla Super",
    price: 5.99,
    level: 2,
    description: "La millor opció qualitat-preu per a veure i crear contingut sense anuncis.",
    icon: FiZap,
    accent: "from-[#3b9eff] to-[#2563eb]",
    features: [
      "Tot el del pla Bàsic",
      "Sense anuncis",
      "Qualitat 2K (QHD)",
      "Penjar el teu propi contingut",
      "Suport estàndard",
    ],
  },
  ultra: {
    key: "ultra",
    title: "Pla Ultra",
    price: 12.99,
    level: 3,
    description: "Experiència premium completa amb qualitat 4K i avantatges exclusius de comunitat.",
    icon: FiStar,
    accent: "from-[#CC8400] to-[#FFD700]",
    features: [
      "Tot el del pla Super",
      "Qualitat 4K (Ultra HD)",
      "Accés a pàgina especial Ultra",
      "Insígnia exclusiva al perfil",
      "Suport prioritari 24/7",
    ],
  },
};

function normalizePlanKey(rawPlan) {
  const plan = (rawPlan || "basic").toLowerCase().trim();
  if (plan in PLAN_DETAILS) return plan;
  return "basic";
}

export default function ComptePagaments() {
  const [step, setStep] = useState("overview"); // overview | plans | confirm | payment | success
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener("auth:user-updated", syncUser);
    return () => window.removeEventListener("auth:user-updated", syncUser);
  }, []);

  const currentPlan = useMemo(() => {
    const key = normalizePlanKey(user?.pla_pagament);
    return PLAN_DETAILS[key];
  }, [user]);

  const handlePlanSelect = (plan) => {
    // plan object from SubscriptionPlans has { id, title, price }
    const details = PLAN_DETAILS[plan.id];
    setSelectedPlan(details);
    setStep("confirm");
  };

  const executeUpdate = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateUserSubscription(user.id, selectedPlan.key);
      updateCurrentUser(updatedUser);
      setUser(updatedUser);
      setStep("success");
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Error al processar el canvi de pla");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = () => {
    if (selectedPlan.level > currentPlan.level) {
      setStep("payment");
    } else {
      executeUpdate();
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#1A1A1A]/40 backdrop-blur-xl border border-white/10 rounded-3xl">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Pla Actualitzat!</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Enhorabona! Ara ja ets usuari del <span className="text-[#CC8400] font-bold">{selectedPlan.title}</span>. 
          Ja pots gaudir de tots els avantatges exclusius.
        </p>
        <button 
          onClick={() => setStep("overview")}
          className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-semibold"
        >
          Tornar al meu pla
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Pagaments i subscripcions</h2>
        <p className="text-gray-400">
          {step === "overview" && "Aquest és el teu pla actual. Pots canviar-lo en qualsevol moment."}
          {step === "plans" && "Selecciona el nou pla que vols contractar."}
          {step === "confirm" && "Confirma els canvis per al teu nou pla."}
          {step === "payment" && "Completa el pagament per activar el teu nou pla."}
        </p>
      </div>

      {(step === "plans" || step === "confirm" || step === "payment") && (
        <button
          onClick={() => step === "plans" ? setStep("overview") : setStep("plans")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mb-2"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          {step === "plans" ? "Tornar al pla actual" : "Tornar a la selecció de plans"}
        </button>
      )}

      {step === "overview" && (
        <CurrentPlanCard
          plan={currentPlan}
          onChangePlan={() => setStep("plans")}
        />
      )}

      {step === "plans" && (
        <SubscriptionPlans onSelectPlan={handlePlanSelect} />
      )}

      {step === "confirm" && (
        <div className="max-w-3xl mx-auto">
          <PlanConfirmationCard 
            currentPlan={currentPlan} 
            newPlan={selectedPlan} 
            onConfirm={handleConfirmation}
            loading={loading}
          />
        </div>
      )}

      {step === "payment" && (
        <PaymentForm 
          selectedPlan={selectedPlan} 
          onCancel={() => setStep("confirm")} 
          onSuccess={executeUpdate} 
          loading={loading}
        />
      )}
    </div>
  );
}

function PlanConfirmationCard({ currentPlan, newPlan, onConfirm, loading }) {
  const isUpgrade = newPlan.level > currentPlan.level;
  
  return (
    <div className="bg-[#1A1A1A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${newPlan.accent}`}></div>
      
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Confirmació de Canvi de Pla</h3>
          <p className="text-gray-400">Estàs a punt de canviar la teva subscripció actual.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 opacity-60">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pla Actual</span>
            <div className="mt-2 flex items-center gap-3">
              <currentPlan.icon size={24} className="text-gray-400" />
              <div>
                <div className="text-white font-bold">{currentPlan.title}</div>
                <div className="text-gray-400 text-sm font-mono">{currentPlan.price}€/mes</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#CC8400]/5 border border-[#CC8400]/20">
            <span className="text-[10px] font-bold text-[#CC8400] uppercase tracking-widest">Nou Pla</span>
            <div className="mt-2 flex items-center gap-3">
              <newPlan.icon size={24} className="text-white" />
              <div>
                <div className="text-white font-bold">{newPlan.title}</div>
                <div className="text-[#CC8400] text-sm font-mono font-bold">{newPlan.price}€/mes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#CC8400]/5 border border-[#CC8400]/10">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FiCheck className="text-[#CC8400]" /> Què inclou el teu nou pla:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {newPlan.features.map(f => (
                <div key={f} className="text-xs text-gray-300 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#CC8400]" /> {f}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-center text-gray-500 px-4">
            Al confirmar, la teva subscripció s'actualitzarà immediatament. 
            {isUpgrade 
              ? " Com que es tracta d'una millora, el següent pas serà completar el pagament segur amb Stripe." 
              : " Els canvis s'aplicaran ara mateix al teu compte."}
          </p>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              loading 
                ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(204,132,0,0.3)]"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              isUpgrade ? "Anar al Pagament" : "Confirmar Canvi de Pla"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrentPlanCard({ plan, onChangePlan }) {
  const Icon = plan.icon;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-[#1A1A1A] to-[#0D0D0D] p-8 md:p-10 shadow-[0_0_40px_-12px_rgba(204,132,0,0.25)]">
      <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#CC8400]/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200">
            <span className={`h-3 w-3 rounded-full bg-linear-to-r ${plan.accent}`} />
            Pla actual actiu
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className={`rounded-2xl bg-linear-to-br ${plan.accent} p-4 text-white shadow-lg`}>
              <Icon size={30} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white md:text-4xl">{plan.title}</h3>
              <p className="text-gray-400">{plan.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-gray-200">
                <FiCheck className="mt-1 shrink-0 text-[#CC8400]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-right">
          <p className="text-sm uppercase tracking-wider text-gray-400">Facturació mensual</p>
          <p className="mt-2 text-5xl font-black leading-none text-white">{plan.price}€</p>
          <p className="mt-1 text-gray-400">IVA inclòs</p>

          <button
            onClick={onChangePlan}
            className="mt-6 w-full rounded-xl bg-linear-to-r from-[#CC8400] to-[#E65100] px-6 py-4 font-bold text-black transition-all hover:shadow-[0_0_24px_rgba(230,81,0,0.45)]"
          >
            Canviar de pla
          </button>
        </div>
      </div>
    </article>
  );
}

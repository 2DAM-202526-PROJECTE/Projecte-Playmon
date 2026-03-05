import { useState } from "react";
import SubscriptionPlans from "@/features/subscriptions/SubscriptionPlans";
import PaymentForm from "@/features/subscriptions/PaymentForm";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";

export default function ComptePagaments() {
  const [step, setStep] = useState("plans"); // plans | payment | success
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
    // Aquí es podria cridar a l'API per actualitzar l'estat real
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#1A1A1A]/40 backdrop-blur-xl border border-white/10 rounded-3xl">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Subscripció Confirmada!</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Enhorabona! Ara ja ets usuari del <span className="text-[#CC8400] font-bold">{selectedPlan.title}</span>. 
          Ja pots gaudir de tots els avantatges exclusius.
        </p>
        <button 
          onClick={() => setStep("plans")}
          className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-semibold"
        >
          Tornar a la secció de pagaments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {step === "plans" ? (
        <>
          <div className="rounded-3xl bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Pagaments i subscripcions</h2>
            <p className="text-gray-400">Gestiona el teu pla actual i consulta el teu historial de facturació.</p>
          </div>
          <SubscriptionPlans onSelectPlan={handlePlanSelect} />
        </>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setStep("plans")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Tornar a la selecció de plans
          </button>
          <PaymentForm 
            selectedPlan={selectedPlan} 
            onCancel={() => setStep("plans")} 
            onSuccess={handlePaymentSuccess} 
          />
        </div>
      )}
    </div>
  );
}

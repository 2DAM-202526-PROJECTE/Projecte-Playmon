import { useMemo, useState } from "react";
import ProgressSteps from "../../components/Subscripcio/ProgresSubscripcio.jsx";
import StepIntro from "./pasos/PasIntro.jsx";
import StepChoosePlan from "./pasos/PasTriarPlan.jsx";
import StepPayment from "./pasos/PasPagament.jsx";
import StepConfirm from "./pasos/PasConfirmar.jsx";

export default function FluxSubscripcio() {
  const steps = useMemo(
    () => [
      { id: "intro", label: "Comença" },
      { id: "plan", label: "Tria un pla" },
      { id: "payment", label: "Pagament" },
      { id: "confirm", label: "Confirmació" },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Dades del flux de subscripió
  const [flowData, setFlowData] = useState({
    planId: null, // Pla seleccionat
    billingCycle: "monthly", // Cicle de pagament
    paymentMethod: "card", // Metode de pagament
    cardLast4: "",
    acceptedTerms: false,
  });

  function next() {
    setCurrentIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  function update(partial) {
    setFlowData((prev) => ({ ...prev, ...partial }));
  }

  const StepComponent = (() => {
    switch (steps[currentIndex].id) {
      case "intro":
        return (
          <StepIntro
            onNext={next}
          />
        );
      case "plan":
        return (
          <StepChoosePlan
            data={flowData}
            onBack={back}
            onNext={next}
            onUpdate={update}
          />
        );
      case "payment":
        return (
          <StepPayment
            data={flowData}
            onBack={back}
            onNext={next}
            onUpdate={update}
          />
        );
      case "confirm":
        return (
          <StepConfirm
            data={flowData}
            onBack={back}
            onRestart={() => setCurrentIndex(0)}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold text-slate-900">
            Activar subscripció
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Completa els passos per activar el teu pla.
          </p>

          <div className="mt-5">
            <ProgressSteps steps={steps} currentIndex={currentIndex} />
          </div>

          <div className="mt-6">{StepComponent}</div>
        </div>
      </div>
    </div>
  );
}

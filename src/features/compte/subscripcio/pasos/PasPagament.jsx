import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FiCreditCard, FiCalendar, FiLock, FiAlertCircle } from "react-icons/fi";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "#1e293b", // slate-800
      "::placeholder": {
        color: "#94a3b8", // slate-400
      },
    },
    invalid: {
      color: "#e11d48", // rose-600
    },
  },
};

function PasPagamentInner({ data, onUpdate, onBack, onNext }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const canPay = data.paymentMethod && data.acceptedTerms;

  async function handlePay() {
    if (!canPay) return;
    
    if (data.paymentMethod === "paypal") {
      // Simulem PayPal de manera directa
      onNext();
      return;
    }

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorStatus(null);

    const cardElement = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setErrorStatus(error.message);
      setIsProcessing(false);
    } else {
      // Simulem èxit de pagament
      setTimeout(() => {
        setIsProcessing(false);
        onUpdate({ cardLast4: paymentMethod.card.last4 });
        onNext();
      }, 800);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          Pagament segur amb Stripe
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Aquest pagament es processarà amb els sistemes de prova de Stripe.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="text-sm font-semibold text-slate-900 mb-3">Mètode</div>
        
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => onUpdate({ paymentMethod: "card" })}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm",
              data.paymentMethod === "card"
                ? "bg-blue-600 text-white shadow-blue-500/30"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            Targeta (Stripe)
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ paymentMethod: "paypal" })}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm",
              data.paymentMethod === "paypal"
                ? "bg-blue-600 text-white shadow-blue-500/30"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            PayPal (simulat)
          </button>
        </div>

        {data.paymentMethod === "card" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wide">Número de targeta</label>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
                <FiCreditCard className="text-slate-400 mr-2" />
                <div className="w-full">
                  <CardNumberElement options={ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wide">Caducitat</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
                  <FiCalendar className="text-slate-400 mr-2" />
                  <div className="w-full">
                    <CardExpiryElement options={ELEMENT_OPTIONS} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wide">CVV</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
                  <FiLock className="text-slate-400 mr-2" />
                  <div className="w-full">
                    <CardCvcElement options={ELEMENT_OPTIONS} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="mt-4 flex items-start gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <p>{errorStatus}</p>
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-black/5 cursor-pointer hover:bg-slate-50 transition-colors">
        <input
          type="checkbox"
          checked={data.acceptedTerms}
          onChange={(e) => onUpdate({ acceptedTerms: e.target.checked })}
          className="mt-1 cursor-pointer w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
        <div className="text-sm text-slate-700 font-medium">
          Accepto les condicions i entenc que és un pagament de prova verificat per Stripe.
        </div>
      </label>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
        >
          Enrere
        </button>

        <button
          type="button"
          onClick={handlePay}
          disabled={!canPay || isProcessing}
          className={[
            "rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md",
            canPay && !isProcessing
              ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30"
              : "bg-slate-400 cursor-not-allowed",
          ].join(" ")}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Processant...
            </div>
          ) : (
            "Pagar i continuar"
          )}
        </button>
      </div>
    </div>
  );
}

export default function PasPagament(props) {
  return (
    <Elements stripe={stripePromise}>
      <PasPagamentInner {...props} />
    </Elements>
  );
}

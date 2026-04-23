import React, { useState } from "react";
import Select from "react-select";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FiCreditCard,
  FiUser,
  FiCalendar,
  FiLock,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";

// Clau pública de Stripe des de les variables d'entorn
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK ?? "pk_test_TYooMQauvdEDq54NiTphI7jx");

const countryOptions = [
  { value: "AD", label: "Andorra" },
  { value: "ES", label: "Espanya" },
  { value: "FR", label: "França" },
  { value: "PT", label: "Portugal" },
  { value: "IT", label: "Itàlia" },
  { value: "DE", label: "Alemanya" },
  { value: "GB", label: "Regne Unit" },
  { value: "US", label: "Estats Units" },
  { value: "CA", label: "Canadà" },
  { value: "MX", label: "Mèxic" },
  { value: "JP", label: "Japó" },
  { value: "CN", label: "Xina" },
  { value: "AU", label: "Austràlia" },
  { value: "BR", label: "Brasil" },
  { value: "AR", label: "Argentina" },
].sort((a, b) => a.label.localeCompare(b.label));

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(0, 0, 0, 0.4)",
    borderColor: state.isFocused ? "#CC8400" : "rgba(255, 255, 255, 0.05)",
    borderRadius: "0.75rem",
    padding: "0.25rem",
    color: "white",
    boxShadow: "none",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
  }),
  menu: (base) => ({
    ...base,
    background: "#1A1A1A",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.75rem",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "#CC8400" : "transparent",
    color: state.isFocused ? "black" : "white",
    "&:active": {
      background: "#E65100",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6b7280",
  }),
};

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      letterSpacing: "0.025em",
      fontFamily: "inherit",
      "::placeholder": {
        color: "#4b5563", // Tailwind gray-600
      },
    },
    invalid: {
      color: "#fb7185", // Tailwind rose-400
    },
  },
};

const PaymentFormInner = ({
  onCancel,
  onSuccess,
  selectedPlan,
  loading: isExternalLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    holder: "",
    country: null,
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const isSubmitting = isExternalLoading || isProcessing;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.holder.trim()) newErrors.holder = "El nom és obligatori";
    if (!form.country) newErrors.country = "Selecciona un país";
    if (!form.city.trim()) newErrors.city = "La ciutat és obligatòria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setStripeError(null);

    const cardElement = elements.getElement(CardNumberElement);

    try {
      // 1. Demanem al nostre backend un clientSecret (PaymentIntent)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlan.price,
          currency: "eur",
          planId: selectedPlan.id
        })
      });

      if (!response.ok) throw new Error("Error obtenint el client_secret del servidor");
      const { clientSecret } = await response.json();

      // 2. Confirmem el pagament amb Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: form.holder,
            address: {
              city: form.city,
              country: form.country?.value,
              line1: form.address,
            },
          },
        },
      });

      if (result.error) {
        setStripeError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log("[Stripe] Payment success:", result.paymentIntent.id);
          onSuccess();
        }
      }
    } catch (err) {
      setStripeError(err.message || "Hi ha hagut un problema amb el pagament.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Panel targetes de test */}
      <div className="rounded-2xl bg-[#0f1f0f]/80 border border-emerald-500/20 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Stripe Test Mode — Targetes de prova</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex flex-col gap-0.5 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
            <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">✅ Pagament correcte</span>
            <span className="text-white tracking-widest">4242 4242 4242 4242</span>
            <span className="text-white/40">Qualsevol data futura · Qualsevol CVV</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
            <span className="text-rose-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">❌ Rebutjat</span>
            <span className="text-white tracking-widest">4000 0000 0000 0002</span>
            <span className="text-white/40">Qualsevol data futura · Qualsevol CVV</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
            <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">🔐 Requereix autenticació</span>
            <span className="text-white tracking-widest">4000 0025 0000 3155</span>
            <span className="text-white/40">Qualsevol data futura · Qualsevol CVV</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
            <span className="text-sky-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">💳 Fons insuficients</span>
            <span className="text-white tracking-widest">4000 0000 0000 9995</span>
            <span className="text-white/40">Qualsevol data futura · Qualsevol CVV</span>
          </div>
        </div>
      </div>

      {/* Formulari de pagament */}
      <div className="bg-[#1A1A1A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CC8400] via-[#E65100] to-[#CC8400]"></div>

        <div className="mb-8 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Dades de Pagament
            </h3>
            <p className="text-gray-400">
              Estàs subscrivint-te al{" "}
              <span className="text-[#CC8400] font-semibold">
                {selectedPlan?.title || "Pla"}
              </span>
            </p>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-white">Stripe Test Mode</span>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titular */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">
            Titular de la targeta
          </label>
          <div
            className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${
              errors.holder ? "border-rose-500/50" : "border-white/5"
            }`}
          >
            <FiUser className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
            <input
              name="holder"
              value={form.holder}
              onChange={handleChange}
              placeholder="NOM COMPLET"
              className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium uppercase tracking-wider"
            />
          </div>
          {errors.holder && (
            <p className="text-xs text-rose-400 ml-1">{errors.holder}</p>
          )}
        </div>

        {/* Número Targeta */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">
            Número de targeta
          </label>
          <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group">
            <FiCreditCard className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
            <div className="w-full pl-4">
              <CardNumberElement options={ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Caducitat
            </label>
            <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group">
              <FiCalendar className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
              <div className="w-full pl-4">
                <CardExpiryElement options={ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              CVV
            </label>
            <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group">
              <FiLock className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
              <div className="w-full pl-4">
                <CardCvcElement options={ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>
        </div>

        {stripeError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {stripeError}
          </div>
        )}

        <hr className="border-white/5 my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* País */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              País
            </label>
            <Select
              options={countryOptions}
              styles={customSelectStyles}
              placeholder="Seleccionar..."
              value={form.country}
              onChange={(opt) => {
                setForm((prev) => ({ ...prev, country: opt }));
                setErrors((prev) => ({ ...prev, country: "" }));
              }}
            />
            {errors.country && (
              <p className="text-xs text-rose-400 ml-1">{errors.country}</p>
            )}
          </div>

          {/* Ciutat */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Ciutat
            </label>
            <div
              className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${
                errors.city ? "border-rose-500/50" : "border-white/5"
              }`}
            >
              <FiMapPin className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Barcelona"
                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium"
              />
            </div>
            {errors.city && (
              <p className="text-xs text-rose-400 ml-1">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Adreça */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">
            Adreça de facturació
          </label>
          <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Carrer, número, pis..."
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-8 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
          >
            Cancel·lar
          </button>
          <button
            type="submit"
            disabled={!stripe || isSubmitting}
            className={`flex-[2] flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black transition-all hover:shadow-[0_0_30px_rgba(204,132,0,0.4)] ${
              !stripe || isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Confirmar Pagament <FiArrowRight />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default function PaymentForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}

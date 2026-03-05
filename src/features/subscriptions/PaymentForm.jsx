import React, { useState, useMemo } from "react";
import Select from "react-select";
import { 
  FiCreditCard, 
  FiUser, 
  FiCalendar, 
  FiLock, 
  FiMapPin, 
  FiCheckCircle,
  FiArrowRight
} from "react-icons/fi";

// Llista simplificada de països (es podria usar una llibreria externa per a tots, però per a l'exemple n'afegim uns quants i l'estructura)
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
      borderColor: "rgba(255, 255, 255, 0.2)"
    }
  }),
  menu: (base) => ({
    ...base,
    background: "#1A1A1A",
    border: "1px border-white/10",
    borderRadius: "0.75rem",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "#CC8400" : "transparent",
    color: state.isFocused ? "black" : "white",
    "&:active": {
      background: "#E65100"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "white"
  }),
  input: (base) => ({
    ...base,
    color: "white"
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6b7280"
  })
};

const PaymentForm = ({ onCancel, onSuccess, selectedPlan, loading: isExternalLoading }) => {
  const [form, setForm] = useState({
    holder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    country: null,
    city: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const isSubmitting = isExternalLoading;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    return value
      .replace(/[^0-9]/g, "")
      .replace(/^([2-9])/, "0$1")
      .replace(/^(1[3-9])/, "1")
      .replace(/^([0-1][0-9])([0-9])/, "$1/$2")
      .substring(0, 5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") formattedValue = formatCardNumber(value).substring(0, 19);
    if (name === "expiry") formattedValue = formatExpiry(value);
    if (name === "cvv") formattedValue = value.replace(/[^0-9]/g, "").substring(0, 3);

    setForm(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.holder.trim()) newErrors.holder = "El nom és obligatori";
    if (form.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Número de targeta incomplet";
    if (form.expiry.length < 5) newErrors.expiry = "Data caducitat no vàlida";
    if (form.cvv.length < 3) newErrors.cvv = "CVV no vàlid";
    if (!form.country) newErrors.country = "Selecciona un país";
    if (!form.city.trim()) newErrors.city = "La ciutat és obligatòria";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Notify parent to perform the real API call
    onSuccess?.();
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#1A1A1A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CC8400] via-[#E65100] to-[#CC8400]"></div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Dades de Pagament</h3>
        <p className="text-gray-400">Estàs subscrivint-te al <span className="text-[#CC8400] font-semibold">{selectedPlan?.title || "Pla"}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titular */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Titular de la targeta</label>
          <div className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${errors.holder ? 'border-rose-500/50' : 'border-white/5'}`}>
            <FiUser className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
            <input
              name="holder"
              value={form.holder}
              onChange={handleChange}
              placeholder="NOM COMPLET"
              className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium uppercase tracking-wider"
            />
          </div>
          {errors.holder && <p className="text-xs text-rose-400 ml-1">{errors.holder}</p>}
        </div>

        {/* Número Targeta */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Número de targeta</label>
          <div className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${errors.cardNumber ? 'border-rose-500/50' : 'border-white/5'}`}>
            <FiCreditCard className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="0000 0000 0000 0000"
              className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium tracking-widest"
            />
          </div>
          {errors.cardNumber && <p className="text-xs text-rose-400 ml-1">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Caducitat</label>
            <div className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${errors.expiry ? 'border-rose-500/50' : 'border-white/5'}`}>
              <FiCalendar className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
              <input
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/AA"
                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium"
              />
            </div>
            {errors.expiry && <p className="text-xs text-rose-400 ml-1">{errors.expiry}</p>}
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">CVV</label>
            <div className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${errors.cvv ? 'border-rose-500/50' : 'border-white/5'}`}>
              <FiLock className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
              <input
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium"
              />
            </div>
            {errors.cvv && <p className="text-xs text-rose-400 ml-1">{errors.cvv}</p>}
          </div>
        </div>

        <hr className="border-white/5 my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* País */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">País</label>
            <Select
              options={countryOptions}
              styles={customSelectStyles}
              placeholder="Seleccionar..."
              value={form.country}
              onChange={(opt) => {
                setForm(prev => ({ ...prev, country: opt }));
                setErrors(prev => ({ ...prev, country: "" }));
              }}
            />
            {errors.country && <p className="text-xs text-rose-400 ml-1">{errors.country}</p>}
          </div>

          {/* Ciutat */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Ciutat</label>
            <div className={`flex items-center bg-black/40 border rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 group ${errors.city ? 'border-rose-500/50' : 'border-white/5'}`}>
              <FiMapPin className="text-xl text-gray-500 group-focus-within:text-[#CC8400] transition-colors" />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Barcelona"
                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-600 font-medium"
              />
            </div>
            {errors.city && <p className="text-xs text-rose-400 ml-1">{errors.city}</p>}
          </div>
        </div>

        {/* Adreça */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Adreça de facturació</label>
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
            disabled={isSubmitting}
            className={`flex-[2] flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black transition-all hover:shadow-[0_0_30px_rgba(204,132,0,0.4)] hover:scale-[1.02] active:scale-95 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
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
  );
};

export default PaymentForm;

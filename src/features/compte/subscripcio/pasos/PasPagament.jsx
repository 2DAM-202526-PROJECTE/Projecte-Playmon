export default function PasPagament({ data, onUpdate, onBack, onNext }) {
  const canPay =
    data.paymentMethod &&
    data.acceptedTerms &&
    (data.paymentMethod !== "card" || data.cardLast4.length === 4);

  function handlePay() {
    // Simulem un pagament correcte
    onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm font-semibold text-slate-900">Pagament</div>
        <p className="mt-1 text-sm text-slate-600">
          Aquest pagament és simulat (de moment).
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <div className="text-sm font-semibold text-slate-900">Mètode</div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ paymentMethod: "card" })}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium",
              data.paymentMethod === "card"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            Targeta
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ paymentMethod: "paypal" })}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium",
              data.paymentMethod === "paypal"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            PayPal (simulat)
          </button>
        </div>

        {data.paymentMethod === "card" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Últims 4 dígits (simulat)
            </label>
            <input
              value={data.cardLast4}
              onChange={(e) =>
                onUpdate({ cardLast4: e.target.value.replace(/\D/g, "").slice(0, 4) })
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="1234"
              inputMode="numeric"
              maxLength={4}
            />
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-black/5">
        <input
          type="checkbox"
          checked={data.acceptedTerms}
          onChange={(e) => onUpdate({ acceptedTerms: e.target.checked })}
          className="mt-1"
        />
        <div className="text-sm text-slate-700">
          Accepto les condicions i entenc que és un pagament simulat per a la demo.
        </div>
      </label>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Enrere
        </button>

        <button
          type="button"
          onClick={handlePay}
          disabled={!canPay}
          className={[
            "rounded-full px-5 py-2.5 text-sm font-semibold text-white",
            canPay ? "bg-blue-600 hover:brightness-95" : "bg-slate-300 cursor-not-allowed",
          ].join(" ")}
        >
          Pagar i continuar
        </button>
      </div>
    </div>
  );
}

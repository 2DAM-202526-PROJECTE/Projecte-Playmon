import { useMemo, useState } from "react";
import { useToast } from "@/features/compte/perfil/components/toast/ProveidorToast";

export default function CompteContrasenya() {
  const { mostraToast } = useToast();

  const usuari = useMemo(
    () => ({
      email: "eloi.cortiella@iesebre.com",
      nom: "Eloi",
    }),
    []
  );

  const [pas, setPas] = useState(1);

  // Pas 1
  const [contrasenyaActual, setContrasenyaActual] = useState("");
  const [mostraActual, setMostraActual] = useState(false);

  // Pas 2
  const [novaContrasenya, setNovaContrasenya] = useState("");
  const [confirmaContrasenya, setConfirmaContrasenya] = useState("");
  const [mostraNova, setMostraNova] = useState(false);

  const [carregant, setCarregant] = useState(false);
  const [error, setError] = useState("");

  const validarPas1 = () => {
    if (contrasenyaActual.trim().length < 6) {
      return "Introdueix la contrasenya actual (mínim 6 caràcters).";
    }
    return "";
  };

  const validarPas2 = () => {
    const n = novaContrasenya.trim();
    if (n.length < 8) return "La nova contrasenya ha de tindre mínim 8 caràcters.";
    if (n !== confirmaContrasenya.trim()) return "Les contrasenyes no coincideixen.";
    if (n === contrasenyaActual.trim())
      return "La nova contrasenya no pot ser igual a l'actual.";
    return "";
  };

  const handleSeguent = async (e) => {
    e.preventDefault();
    const msg = validarPas1();
    if (msg) {
      setError(msg);
      mostraToast({ tipus: "error", titol: "Error", missatge: msg, duracio: 3500 });
      return;
    }

    try {
      setCarregant(true);
      setError("");

      // ✅ Aquí faries la verificació real al backend
      // await api.verificaContrasenya(contrasenyaActual)
      await new Promise((r) => setTimeout(r, 250));

      setPas(2);
      mostraToast({
        tipus: "exit",
        titol: "Identitat verificada",
        missatge: "Ja pots establir una nova contrasenya.",
        duracio: 2500,
      });
    } catch (err) {
      const m = err?.message ?? "No s'ha pogut verificar la contrasenya.";
      setError(m);
      mostraToast({ tipus: "error", titol: "Error", missatge: m, duracio: 4000 });
    } finally {
      setCarregant(false);
    }
  };

  const handleCanviar = async (e) => {
    e.preventDefault();
    const msg = validarPas2();
    if (msg) {
      setError(msg);
      mostraToast({ tipus: "error", titol: "Error", missatge: msg, duracio: 3500 });
      return;
    }

    try {
      setCarregant(true);
      setError("");

      // ✅ Aquí faries el canvi real al backend
      // await api.canviaContrasenya({ actual: contrasenyaActual, nova: novaContrasenya })
      await new Promise((r) => setTimeout(r, 350));

      mostraToast({
        tipus: "exit",
        titol: "Contrasenya actualitzada",
        missatge: "S'ha canviat la contrasenya correctament.",
        duracio: 3000,
      });

      // Reset
      setPas(1);
      setContrasenyaActual("");
      setNovaContrasenya("");
      setConfirmaContrasenya("");
      setMostraActual(false);
      setMostraNova(false);
    } catch (err) {
      const m = err?.message ?? "No s'ha pogut canviar la contrasenya.";
      setError(m);
      mostraToast({ tipus: "error", titol: "Error", missatge: m, duracio: 4500 });
    } finally {
      setCarregant(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {pas === 1 ? "Verifica la teva identitat" : "Canvia la contrasenya"}
        </h1>
        <p className="max-w-3xl text-sm text-white/60">
          {pas === 1
            ? "Per continuar, primer verifica que ets tu. Introdueix la contrasenya actual del teu compte."
            : "Introdueix una nova contrasenya segura per protegir el teu compte."}
        </p>
      </header>

      {/* Indicador de pas */}
      <div className="flex items-center gap-3">
        <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${pas >= 1 ? 'bg-[#CC8400]' : 'bg-white/10'}`} />
        <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${pas >= 2 ? 'bg-[#CC8400]' : 'bg-white/10'}`} />
        <span className="text-xs text-white/35 ml-1">Pas {pas} de 2</span>
      </div>

      {/* Formulari */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
        {pas === 1 ? (
          <form onSubmit={handleSeguent} className="space-y-5 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">
                Contrasenya actual
              </label>
              <input
                type={mostraActual ? "text" : "password"}
                value={contrasenyaActual}
                onChange={(e) => setContrasenyaActual(e.target.value)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all placeholder-white/25"
                placeholder="Contrasenya actual"
                autoFocus
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-white/55 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={mostraActual}
                onChange={(e) => setMostraActual(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#CC8400]"
              />
              Mostra la contrasenya
            </label>

            {error ? (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => mostraToast({ tipus: "info", titol: "Opcions alternatives", missatge: "Pots implementar 2FA o codi per email.", duracio: 3000 })}
                className="text-sm text-[#CC8400]/70 font-semibold hover:text-[#CC8400] transition-colors"
              >
                Prova una altra manera
              </button>
              <button
                type="submit"
                disabled={carregant}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-black disabled:opacity-60 transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)', boxShadow: carregant ? 'none' : '0 0 20px rgba(204,132,0,0.2)' }}
              >
                {carregant ? "Verificant..." : "Següent →"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCanviar} className="space-y-5 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">
                Nova contrasenya
              </label>
              <input
                type={mostraNova ? "text" : "password"}
                value={novaContrasenya}
                onChange={(e) => setNovaContrasenya(e.target.value)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all placeholder-white/25"
                placeholder="Mínim 8 caràcters"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">
                Confirma la nova contrasenya
              </label>
              <input
                type={mostraNova ? "text" : "password"}
                value={confirmaContrasenya}
                onChange={(e) => setConfirmaContrasenya(e.target.value)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all placeholder-white/25"
                placeholder="Repeteix la contrasenya"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-white/55 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={mostraNova}
                onChange={(e) => setMostraNova(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#CC8400]"
              />
              Mostra la contrasenya
            </label>

            {error ? (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setPas(1); setError(""); }}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white/80 transition-all"
              >
                ← Enrere
              </button>
              <button
                type="submit"
                disabled={carregant}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-black disabled:opacity-60 transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)', boxShadow: carregant ? 'none' : '0 0 20px rgba(204,132,0,0.2)' }}
              >
                {carregant ? "Guardant..." : "Canviar contrasenya"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}


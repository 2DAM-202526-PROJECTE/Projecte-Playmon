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
      return "La nova contrasenya no pot ser igual a l’actual.";
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
      const m = err?.message ?? "No s’ha pogut verificar la contrasenya.";
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
        missatge: "S’ha canviat la contrasenya correctament.",
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
      const m = err?.message ?? "No s’ha pogut canviar la contrasenya.";
      setError(m);
      mostraToast({ tipus: "error", titol: "Error", missatge: m, duracio: 4500 });
    } finally {
      setCarregant(false);
    }
  };

  return (
    <div className="rounded-3xl bg-transparent">
      <div className="rounded-3xl bg-[#202124] p-6 text-white ring-1 ring-white/10 md:p-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          {/* Columna esquerra (estil Google) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GoogleG />
              <span className="text-sm font-semibold text-white/80">Compte</span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              {pas === 1 ? "Verifica la teva identitat" : "Canvia la contrasenya"}
            </h1>

            <p className="max-w-md text-sm text-white/65">
              {pas === 1
                ? "Per continuar, primer verifica la teva identitat."
                : "Introdueix una nova contrasenya segura."}
            </p>
          </div>

          {/* Columna dreta (formulari) */}
          <div className="space-y-4">
            {pas === 1 ? (
              <form onSubmit={handleSeguent} className="space-y-4">
                <div className="rounded-2xl bg-[#1f1f1f] p-5 ring-1 ring-white/10">
                  <label className="text-xs font-semibold text-white/70">
                    Introdueix la contrasenya
                  </label>

                  <input
                    type={mostraActual ? "text" : "password"}
                    value={contrasenyaActual}
                    onChange={(e) => setContrasenyaActual(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-transparent px-3 py-3 text-sm text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-[#8ab4f8]/40"
                    placeholder="Contrasenya actual"
                    autoFocus
                  />

                  <label className="mt-4 flex items-center gap-3 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={mostraActual}
                      onChange={(e) => setMostraActual(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-transparent"
                    />
                    Mostra la contrasenya
                  </label>

                  {error ? (
                    <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-500/20">
                      {error}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      mostraToast({
                        tipus: "info",
                        titol: "Opcions alternatives",
                        missatge: "Ací pots implementar 2FA, codi per email, etc.",
                        duracio: 3000,
                      });
                    }}
                    className="text-sm text-orange-400 font-semibold text-[#8ab4f8] hover:underline"
                  >
                    Prova una altra manera
                  </button>

                  <button
                    type="submit"
                    disabled={carregant}
                    className="rounded-full bg-orange-400 px-6 py-2.5 text-sm font-semibold text-[#202124] hover:brightness-95 disabled:opacity-60"
                  >
                    {carregant ? "Verificant..." : "Següent"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCanviar} className="space-y-4">
                <div className="rounded-2xl bg-[#1f1f1f] p-5 ring-1 ring-white/10">
                  <label className="text-xs font-semibold text-white/70">
                    Nova contrasenya
                  </label>

                  <input
                    type={mostraNova ? "text" : "password"}
                    value={novaContrasenya}
                    onChange={(e) => setNovaContrasenya(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-transparent px-3 py-3 text-sm text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-[#8ab4f8]/40"
                    placeholder="Mínim 8 caràcters"
                    autoFocus
                  />

                  <label className="mt-4 text-xs font-semibold text-white/70">
                    Confirma la nova contrasenya
                  </label>

                  <input
                    type={mostraNova ? "text" : "password"}
                    value={confirmaContrasenya}
                    onChange={(e) => setConfirmaContrasenya(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-transparent px-3 py-3 text-sm text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-[#8ab4f8]/40"
                    placeholder="Repeteix la contrasenya"
                  />

                  <label className="mt-4 flex items-center gap-3 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={mostraNova}
                      onChange={(e) => setMostraNova(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-transparent"
                    />
                    Mostra la contrasenya
                  </label>

                  {error ? (
                    <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-500/20">
                      {error}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setPas(1);
                      setError("");
                    }}
                    className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Enrere
                  </button>

                  <button
                    type="submit"
                    disabled={carregant}
                    className="rounded-full bg-[#8ab4f8] px-6 py-2.5 text-sm font-semibold text-[#202124] hover:brightness-95 disabled:opacity-60"
                  >
                    {carregant ? "Guardant..." : "Canviar contrasenya"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI petits ---------------- */
function CompteChip({ email }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white/80">
        <UserMini />
      </span>
      <span className="text-sm text-white/80">{email}</span>
      <span className="text-white/50">▾</span>
    </div>
  );
}

function GoogleG() {
  // Simplificat (decoratiu)
  return (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
      <span className="text-sm font-bold text-white/80">C</span>
    </div>
  );
}

function UserMini() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
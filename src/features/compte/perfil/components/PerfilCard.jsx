export default function PerfilCard({
    user,
    cameraIcon,
    onEditProfile,
    onManagePlan,
    onChangePhoto,
}) {
    const name = user?.name ?? "Usuari";
    const email = user?.email ?? "";
    const avatar = user?.avatar ?? null;

    return (
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
            <div className="md:grid-cols-[180px_1fr] md:items-center">
                {/* Info Compte Usuari */}
                <div className="text-center md:text-left">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="text-2xl font-semibold tracking-tight text-slate-950">
                                {name}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                {email}
                            </div>
                        </div>
                        {/* Avatar */}
                        <div className="justify-center md:justify-start">
                            <div className="relative h-40 w-40 rounded-full bg-slate-200 ring-4 ring-white shadow-lg">
                                <img
                                    src={avatar}
                                    alt="Foto de perfil"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats (placeholders) */}
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-slate-950">Pla de Subscripció</div>
                            <div className="text-xs text-slate-500">Premium</div>
                        </div>
                    </div>

                    {/* Panels */}
                    <div className="mt-5">
                        {/* Pla */}
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-slate-950">El teu pla</div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Qualitat alta, fins a 2 dispositius.
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                    Actiu
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                                >
                                    Canviar pla
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                                >
                                    Veure factures
                                </button>
                            </div>
                        </div>

                        {/* Seguretat */}
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
                            <div className="text-sm font-semibold text-slate-950">Seguretat</div>
                            <div className="mt-1 text-sm text-slate-600">
                                Mantén el compte segur amb contrasenya i dispositius autoritzats.
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                                >
                                    Canviar contrasenya
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                                >
                                    Dispositius
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

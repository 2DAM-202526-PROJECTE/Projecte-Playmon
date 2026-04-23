import { useState, useEffect } from "react";
import { httpClient } from "@/api/httpClient";
import { HiPencil, HiTrash, HiCheck, HiXMark, HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editData, setEditData] = useState({});
    
    // Paginació
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await httpClient("/users");
            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (err) {
            setError("No s'han pogut carregar els usuaris");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Estàs segur que vols eliminar aquest usuari?")) return;
        try {
            await httpClient(`/users/${id}`, { method: "DELETE" });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert("Error eliminant l'usuari");
        }
    };

    const startEdit = (user) => {
        setEditingUser(user.id);
        const currentPlan = (user.pla_pagament || "basic").toLowerCase().trim();
        const mappedPlan = currentPlan === 'super' ? 'ultra' : currentPlan;
        setEditData({
            role: user.role || "user",
            pla_pagament: mappedPlan
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditData({});
    };

    const handleUpdate = async (id) => {
        try {
            await httpClient(`/users/${id}`, {
                method: "PUT",
                body: JSON.stringify(editData)
            });
            setUsers(users.map(u => u.id === id ? { ...u, ...editData } : u));
            setEditingUser(null);
        } catch (err) {
            alert("Error actualitzant l'usuari");
        }
    };

    // Lògica de paginació
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-white p-10 text-center">Carregant usuaris...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Gestió d'Usuaris</h1>
                <p className="text-sm text-white/50">{users.length} usuaris registrats</p>
            </header>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-xl">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-white/70">
                    <thead className="bg-white/5 text-white/40 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Usuari</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Pla</th>
                            <th className="px-6 py-4 text-right">Accions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {currentItems.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-[#CC8400]/20 flex items-center justify-center text-[#CC8400] overflow-hidden">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-xs">{(user.username || user.name || "U")[0].toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span className="font-medium text-white">{user.username || user.name}</span>
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    {editingUser === user.id ? (
                                        <select 
                                            value={editData.role} 
                                            onChange={e => setEditData({...editData, role: e.target.value})}
                                            className="bg-[#202124] border border-white/10 rounded px-2 py-1 text-white text-xs outline-none"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-[#CC8400]/20 text-[#CC8400]' : 'bg-white/10 text-white/60'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {editingUser === user.id ? (
                                        <select 
                                            value={editData.pla_pagament} 
                                            onChange={e => setEditData({...editData, pla_pagament: e.target.value})}
                                            className="bg-[#202124] border border-white/10 rounded px-2 py-1 text-white text-xs outline-none focus:border-[#CC8400]/50"
                                        >
                                            <option value="basic">Basic (Gratuït)</option>
                                            <option value="super">Super (Nivell 2)</option>
                                            <option value="ultra">Ultra (VIP)</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center">
                                            {(() => {
                                                const p = (user.pla_pagament || "basic").toLowerCase().trim();
                                                if (p === 'basic') return (
                                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                                                        Basic
                                                    </span>
                                                );
                                                if (p === 'super') return (
                                                    <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                        Super
                                                    </span>
                                                );
                                                if (p === 'ultra') return (
                                                    <span className="px-2 py-1 rounded-md bg-[#CC8400]/10 border border-[#CC8400]/30 text-[#CC8400] text-[9px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(204,132,0,0.3)] animate-pulse">
                                                        Ultra
                                                    </span>
                                                );
                                                return <span className="text-white/20">{p}</span>;
                                            })()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {editingUser === user.id ? (
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => handleUpdate(user.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                                                <HiCheck className="h-4 w-4" />
                                            </button>
                                            <button onClick={cancelEdit} className="p-2 bg-white/5 text-white/40 rounded-lg hover:bg-white/10 transition-colors">
                                                <HiXMark className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => startEdit(user)} className="p-2 bg-white/5 text-white/40 rounded-lg hover:text-[#CC8400] hover:bg-[#CC8400]/10 transition-all">
                                                <HiPencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 bg-white/5 text-white/40 rounded-lg hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                                <HiTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button 
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-all"
                    >
                        <HiChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                        Pàgina {currentPage} de {totalPages}
                    </span>
                    <button 
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-all"
                    >
                        <HiChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

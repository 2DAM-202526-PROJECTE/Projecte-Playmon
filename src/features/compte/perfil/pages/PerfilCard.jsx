import { useNavigate } from 'react-router-dom'
import {
    HiAtSymbol, HiEnvelope, HiUser, HiCreditCard,
    HiPencil, HiCamera, HiBolt, HiCheck,
} from 'react-icons/hi2'
import AccountSearch from '@/features/compte/perfil/components/AccountSearch'

// ── Tokens de color (paleta del projecte) ─────────────────────────────────
const AMBER      = '#CC8400'
const AMBER_HOT  = '#FFB800'
const BORDER     = 'rgba(204,132,0,0.18)'
const BORDER_MID = 'rgba(204,132,0,0.32)'
const TEXT_DIM   = 'rgba(184,173,156,0.85)'
const TEXT_MUTE  = 'rgba(122,112,101,1)'

// ── Subcomponents ─────────────────────────────────────────────────────────

function Divider({ style }) {
    return (
        <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${BORDER_MID}, transparent)`,
            ...style,
        }} />
    )
}

function SectionLabel({ children }) {
    return (
        <p style={{
            fontSize: 10.5, letterSpacing: '0.22em', color: TEXT_MUTE,
            fontWeight: 500, textTransform: 'uppercase', marginBottom: 4,
        }}>
            {children}
        </p>
    )
}

function UltraBadge() {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px 3px 7px', borderRadius: 6,
            background: 'linear-gradient(135deg, rgba(255,184,0,0.15), rgba(204,132,0,0.04))',
            border: `1px solid rgba(204,132,0,0.55)`,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            color: AMBER_HOT, textTransform: 'uppercase',
        }}>
            <HiBolt style={{ width: 10, height: 10 }} />
            Ultra
        </span>
    )
}

function VerifiedTag() {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11.5, color: '#7fc28a', fontWeight: 500,
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(127,194,138,0.08)',
            border: '1px solid rgba(127,194,138,0.25)',
            whiteSpace: 'nowrap', flexShrink: 0,
        }}>
            <HiCheck style={{ width: 11, height: 11 }} />
            Verificat
        </span>
    )
}

function Field({ icon: Ico, label, children, trailing }) {
    return (
        <div style={{
            padding: '14px 18px', borderRadius: 14,
            background: 'rgba(10,7,3,0.55)',
            border: `1px solid ${BORDER}`,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 10.5, letterSpacing: '0.18em', fontWeight: 500,
                color: AMBER, textTransform: 'uppercase', marginBottom: 7,
            }}>
                <Ico style={{ width: 12, height: 12, flexShrink: 0 }} />
                <span>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#f5efe4', letterSpacing: '-0.005em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {children}
                </div>
                {trailing}
            </div>
        </div>
    )
}

// ── Component principal ────────────────────────────────────────────────────

export default function PerfilCard({ user, cameraIcon, onEditProfile, onChangePhoto }) {
    const navigate = useNavigate()

    const nom      = user?.name ?? 'Usuari'
    const correu   = user?.email ?? ''
    const avatar   = user?.avatar ?? null
    const username = user?.username ?? 'usuari'
    const planRaw  = (user?.plan || user?.pla_pagament || 'basic').toLowerCase().trim()

    const memberSinceText = (() => {
        const raw = user?.memberSince
        if (!raw) return null
        const date = new Date(raw)
        if (isNaN(date.getTime())) return null
        return new Intl.DateTimeFormat('ca', { month: 'short', year: 'numeric' }).format(date)
    })()

    const planConfig = {
        basic: { label: 'Basic', dotColor: '#888888', glow: null },
        super: { label: 'Super', dotColor: '#3b9eff', glow: '0 0 10px #3b9eff' },
        ultra: { label: 'Ultra', dotColor: AMBER_HOT,  glow: `0 0 10px ${AMBER}` },
    }
    const pla = planConfig[planRaw] || planConfig.basic

    return (
        <section style={{
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(20,14,6,0.7), rgba(12,8,4,0.55))',
            border: `1px solid ${BORDER_MID}`,
            borderRadius: 22,
            padding: 38,
            boxShadow: `0 0 0 1px rgba(204,132,0,0.04), 0 30px 80px -20px rgba(204,132,0,0.18), inset 0 0 60px rgba(204,132,0,0.04)`,
            backdropFilter: 'blur(10px)',
        }}>

            {/* ── 1. Cercador ────────────────────────────────────────── */}
            <AccountSearch user={user} onEditProfile={onEditProfile} />

            <Divider style={{ margin: '30px 0' }} />

            {/* ── 2. Fila d'identitat ────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30, flexWrap: 'wrap' }}>

                {/* Avatar */}
                <div style={{ position: 'relative', width: 104, height: 104, flexShrink: 0 }}>
                    <div style={{
                        width: 104, height: 104, borderRadius: '50%',
                        background: !avatar
                            ? 'conic-gradient(from 200deg, #2a1a0a, #5a3818, #c47a2c, #3a2410, #1a0f06, #2a1a0a)'
                            : undefined,
                        boxShadow: `0 0 0 1px ${BORDER_MID}, 0 0 30px rgba(204,132,0,0.18)`,
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {avatar ? (
                            <img src={avatar} alt="Foto de perfil"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'radial-gradient(circle at 35% 30%, rgba(255,200,140,0.4), transparent 55%), radial-gradient(circle at 65% 75%, rgba(0,0,0,0.55), transparent 60%)',
                                }} />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 34, fontWeight: 700, color: 'rgba(204,132,0,0.5)',
                                }}>
                                    {nom.slice(0, 1).toUpperCase()}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Botó càmera */}
                    <button
                        type="button"
                        title="Canviar foto"
                        onClick={onChangePhoto}
                        style={{
                            position: 'absolute', right: -2, bottom: -2,
                            width: 30, height: 30, borderRadius: '50%',
                            background: `linear-gradient(180deg, ${AMBER_HOT}, ${AMBER})`,
                            border: `2px solid #080808`,
                            display: 'grid', placeItems: 'center', cursor: 'pointer',
                            boxShadow: `0 4px 14px rgba(204,132,0,0.45)`,
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = ''}
                    >
                        <HiCamera style={{ width: 14, height: 14, color: '#1a0d02' }} />
                    </button>
                </div>

                {/* Nom + subtítol */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: 11, letterSpacing: '0.22em', color: AMBER,
                        fontWeight: 500, textTransform: 'uppercase', marginBottom: 6,
                    }}>
                        El teu perfil
                    </div>
                    <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.015em', color: '#f5efe4', lineHeight: 1 }}>
                            {nom}
                        </span>
                    </div>
                    <div style={{ color: TEXT_DIM, fontSize: 14 }}>
                        {correu}{correu && memberSinceText ? ' · ' : ''}{memberSinceText ? `membre des de ${memberSinceText}` : ''}
                    </div>
                </div>

                {/* Botó editar */}
                <button
                    type="button"
                    onClick={onEditProfile}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '9px 16px', borderRadius: 10,
                        background: 'rgba(204,132,0,0.08)',
                        border: `1px solid ${BORDER_MID}`,
                        color: AMBER_HOT, fontSize: 13.5, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                        transition: 'background 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(204,132,0,0.15)'
                        e.currentTarget.style.transform = 'scale(1.03)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(204,132,0,0.08)'
                        e.currentTarget.style.transform = ''
                    }}
                >
                    <HiPencil style={{ width: 14, height: 14 }} />
                    Editar perfil
                </button>
            </div>

            <Divider />

            {/* ── 3. Graella de camps (2 columnes) ──────────────────── */}
            <div style={{ marginTop: 20 }}>
                <SectionLabel>Dades del compte</SectionLabel>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 14, marginTop: 12,
                }}>
                    <Field icon={HiAtSymbol} label="Nom d'usuari">
                        <span style={{ color: pla.dotColor, fontWeight: 600 }}>@{username}</span>
                    </Field>

                    <Field icon={HiUser} label="Nom">
                        {nom}
                    </Field>

                    <Field icon={HiEnvelope} label="Correu electrònic" trailing={<VerifiedTag />}>
                        <span style={{ fontSize: 17 }}>{correu}</span>
                    </Field>

                    <Field
                        icon={HiCreditCard}
                        label="Pla de subscripció"
                        trailing={
                            <button
                                onClick={() => navigate('/compte/pagaments')}
                                style={{
                                    background: 'none', border: 'none', padding: 0,
                                    color: AMBER, fontSize: 13, fontWeight: 500,
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Gestionar →
                            </button>
                        }
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: pla.dotColor,
                                boxShadow: pla.glow ?? undefined,
                                flexShrink: 0,
                            }} />
                            <span style={{ fontWeight: 600 }}>{pla.label}</span>
                        </span>
                    </Field>
                </div>
            </div>
        </section>
    )
}

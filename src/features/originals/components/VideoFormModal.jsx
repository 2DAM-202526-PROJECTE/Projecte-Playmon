import React, { useState, useRef, useEffect } from 'react'
import { HiXMark, HiCloudArrowUp, HiFilm, HiPhoto, HiCheckCircle, HiPlus, HiLanguage } from 'react-icons/hi2'
import { getCurrentUser } from '@/api/authApi'
import { uploadVideoDirect, updateVideo, MAX_VIDEO_SIZE } from '@/api/videosApi'

const PRESET_CATEGORIES = [
    'Acció', 'Comèdia', 'Drama', 'Thriller', 'Terror',
    'Ciència Ficció', 'Documentari', 'Animació', 'Romàntic', 'Altres'
]

function DropZone({ label, icon: Icon, accept, file, onFile, hint }) {
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef(null)

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped) onFile(dropped)
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 select-none
                ${dragging
                    ? 'border-[#CC8400] bg-[#CC8400]/10 scale-[1.01]'
                    : file
                        ? 'border-[#CC8400]/60 bg-[#CC8400]/5'
                        : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
            />
            {file ? (
                <>
                    <HiCheckCircle className="text-[#CC8400] text-3xl" />
                    <p className="text-white/90 text-sm font-medium text-center truncate max-w-full px-2">{file.name}</p>
                    <p className="text-white/40 text-xs">{(file.size / (1024 * 1024)).toFixed(1)} MB · Clic per canviar</p>
                </>
            ) : (
                <>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300
                        ${dragging ? 'bg-[#CC8400]/20' : 'bg-white/8'}`}>
                        <Icon className={`text-2xl transition-colors duration-300 ${dragging ? 'text-[#CC8400]' : 'text-white/50'}`} />
                    </div>
                    <div className="text-center">
                        <p className="text-white/80 text-sm font-medium">{label}</p>
                        <p className="text-white/40 text-xs mt-0.5">{hint}</p>
                    </div>
                    <span className="text-[#CC8400] text-xs border border-[#CC8400]/40 rounded-full px-3 py-1">Seleccionar fitxer</span>
                </>
            )}
        </div>
    )
}

export default function VideoFormModal({ onClose, onSave, initialData }) {
    const isEditing = !!initialData
    const currentUser = getCurrentUser()

    const [title, setTitle] = useState(initialData?.title || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [category, setCategory] = useState(initialData?.category || initialData?.categoria || '')
    const [showCustomInput, setShowCustomInput] = useState(false)
    const [customInput, setCustomInput] = useState('')
    const customInputRef = useRef(null)
    const [videoFile, setVideoFile] = useState(null)
    const [thumbFile, setThumbFile] = useState(null)
    const [thumbPreview, setThumbPreview] = useState(initialData?.thumbnailDataUrl || initialData?.thumbnail_url || null)
    const [subtitleFile, setSubtitleFile] = useState(null)
    const [subtitleLang, setSubtitleLang] = useState('ca')
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [uploadError, setUploadError] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)

    const SUBTITLE_LANGS = [
        { code: 'ca', label: 'Català' },
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'pt', label: 'Português' },
    ]
    const MAX_SUBTITLE_SIZE = 2 * 1024 * 1024

    useEffect(() => {
        if (thumbFile) {
            const reader = new FileReader()
            reader.onloadend = () => setThumbPreview(reader.result)
            reader.readAsDataURL(thumbFile)
        }
    }, [thumbFile])

    const validate = () => {
        const e = {}
        if (!title.trim()) e.title = 'El títol és obligatori'
        if (!description.trim()) e.description = 'La descripció és obligatòria'
        if (!isEditing) {
            if (!videoFile) {
                e.video = 'Selecciona un fitxer de vídeo'
            } else if (videoFile.size > MAX_VIDEO_SIZE) {
                e.video = `Vídeo massa gran (${(videoFile.size / 1024 / 1024).toFixed(1)} MB). Màxim 100 MB.`
            }
        }
        if (subtitleFile) {
            const name = (subtitleFile.name || '').toLowerCase()
            if (!name.endsWith('.vtt') && !name.endsWith('.srt')) {
                e.subtitle = 'Subtítols han de ser .vtt o .srt'
            } else if (subtitleFile.size > MAX_SUBTITLE_SIZE) {
                e.subtitle = `Fitxer massa gran (${(subtitleFile.size / 1024).toFixed(0)} KB). Màxim 2 MB.`
            }
        }
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setSaving(true)
        setUploadError(null)
        setUploadProgress(0)

        try {
            let savedVideo

            if (isEditing) {
                savedVideo = await updateVideo(initialData.id, {
                    title: title.trim(),
                    description: description.trim(),
                    categoria: category || null,
                    thumbnail: thumbFile || null,
                })
            } else {
                savedVideo = await uploadVideoDirect({
                    file: videoFile,
                    thumbnail: thumbFile || null,
                    subtitle: subtitleFile || null,
                    subtitleLang,
                    title: title.trim(),
                    description: description.trim(),
                    categoria: category || null,
                    isPublic: true,
                    userId: currentUser?.id,
                    onProgress: (p) => setUploadProgress(p),
                })
            }

            onSave(savedVideo)
        } catch (err) {
            setUploadError(err.message || 'Error desconegut. Torna-ho a intentar.')
        } finally {
            setSaving(false)
            setUploadProgress(0)
        }
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl shadow-2xl
                            max-h-[90vh] overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}>

                {/* Header */}
                <div className="sticky top-0 bg-[#111111] z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#CC8400]/20 flex items-center justify-center">
                            <HiFilm className="text-[#CC8400] text-lg" />
                        </div>
                        <h2 className="text-white font-bold text-lg">
                            {isEditing ? 'Editar vídeo' : 'Puja el teu vídeo'}
                        </h2>
                    </div>
                    <button
                        onClick={() => !saving && onClose()}
                        disabled={saving}
                        className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                        <HiXMark className="text-white/70 text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                    {/* Error global */}
                    {uploadError && (
                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {uploadError}
                        </div>
                    )}

                    {/* Títol */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-1.5">
                            Títol <span className="text-[#CC8400]">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: null })) }}
                            placeholder="El títol del teu vídeo..."
                            maxLength={80}
                            className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm
                                outline-none transition-colors focus:bg-white/8
                                ${errors.title ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#CC8400]/60'}`}
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Descripció */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-1.5">
                            Descripció <span className="text-[#CC8400]">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setErrors(p => ({ ...p, description: null })) }}
                            placeholder="Descriu el contingut del teu vídeo..."
                            rows={3}
                            maxLength={400}
                            className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm
                                outline-none transition-colors focus:bg-white/8 resize-none
                                ${errors.description ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#CC8400]/60'}`}
                        />
                        <div className="flex items-center justify-between mt-1">
                            {errors.description
                                ? <p className="text-red-400 text-xs">{errors.description}</p>
                                : <span />
                            }
                            <span className="text-white/30 text-xs">{description.length}/400</span>
                        </div>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-1.5">Categoria</label>
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => setCategory('')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                                    ${category === ''
                                        ? 'bg-white/20 border-white/40 text-white font-bold'
                                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                                    }`}>
                                Sense categoria
                            </button>

                            {PRESET_CATEGORIES.map(cat => (
                                <button key={cat} type="button"
                                    onClick={() => { setCategory(cat); setShowCustomInput(false) }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                                        ${category === cat
                                            ? 'bg-[#CC8400] border-[#CC8400] text-black font-bold'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white/80'
                                        }`}>
                                    {cat}
                                </button>
                            ))}

                            {category && !PRESET_CATEGORIES.includes(category) && category !== '' && (
                                <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#CC8400] border-[#CC8400] text-black border">
                                    {category}
                                    <button type="button" onClick={() => setCategory('')} className="ml-0.5 hover:opacity-70 transition-opacity">
                                        <HiXMark className="text-xs" />
                                    </button>
                                </span>
                            )}

                            {!showCustomInput && (
                                <button type="button"
                                    onClick={() => { setShowCustomInput(true); setTimeout(() => customInputRef.current?.focus(), 50) }}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                                               border border-dashed border-white/20 text-white/40 hover:border-[#CC8400]/50 hover:text-[#CC8400]">
                                    <HiPlus className="text-xs" /> Crea la teva
                                </button>
                            )}
                        </div>

                        {showCustomInput && (
                            <div className="mt-2 flex gap-2 items-center">
                                <input
                                    ref={customInputRef}
                                    type="text"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            const val = customInput.trim()
                                            if (val) { setCategory(val); setCustomInput(''); setShowCustomInput(false) }
                                        }
                                        if (e.key === 'Escape') { setShowCustomInput(false); setCustomInput('') }
                                    }}
                                    placeholder="Nom de la categoria..."
                                    maxLength={30}
                                    className="flex-1 bg-white/5 border border-[#CC8400]/40 rounded-xl px-3 py-2 text-white placeholder-white/30 text-xs
                                               outline-none focus:border-[#CC8400]/70 focus:bg-white/8 transition-colors"
                                />
                                <button type="button"
                                    onClick={() => { const val = customInput.trim(); if (val) { setCategory(val); setCustomInput(''); setShowCustomInput(false) } }}
                                    className="px-3 py-2 rounded-xl bg-[#CC8400] text-black text-xs font-bold hover:bg-[#E09400] transition-colors">
                                    Afegir
                                </button>
                                <button type="button"
                                    onClick={() => { setShowCustomInput(false); setCustomInput('') }}
                                    className="px-3 py-2 rounded-xl border border-white/15 text-white/50 text-xs hover:bg-white/5 transition-colors">
                                    Cancel·lar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Vídeo (només en creació) */}
                    {!isEditing && (
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-1.5">
                                Fitxer de vídeo <span className="text-[#CC8400]">*</span>
                            </label>
                            <DropZone
                                label="Arrossega el teu vídeo aquí"
                                icon={HiCloudArrowUp}
                                accept="video/*"
                                file={videoFile}
                                onFile={(f) => { setVideoFile(f); setErrors(p => ({ ...p, video: null })) }}
                                hint="MP4, MOV, AVI, MKV · Màxim 100 MB"
                            />
                            {errors.video && <p className="text-red-400 text-xs mt-1">{errors.video}</p>}
                        </div>
                    )}

                    {/* Barra de progrés */}
                    {saving && !isEditing && uploadProgress > 0 && (
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                                <span>Pujant a Cloudinary…</span>
                                <span className="font-mono text-[#CC8400]">{uploadProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#CC8400] transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Miniatura */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-1.5">
                            Miniatura <span className="text-white/30 font-normal">(opcional)</span>
                        </label>
                        {thumbPreview ? (
                            <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10">
                                <img src={thumbPreview} alt="Previsualització" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setThumbPreview(null); setThumbFile(null) }}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
                                >
                                    <HiXMark className="text-white text-sm" />
                                </button>
                            </div>
                        ) : (
                            <DropZone
                                label="Afegeix una miniatura"
                                icon={HiPhoto}
                                accept="image/*"
                                file={thumbFile}
                                onFile={setThumbFile}
                                hint="JPG, PNG, WEBP · Arrossega o fes clic per seleccionar"
                            />
                        )}
                    </div>

                    {/* Subtítols (només en creació) */}
                    {!isEditing && (
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-1.5">
                                Subtítols <span className="text-white/30 font-normal">(opcional, .vtt o .srt)</span>
                            </label>

                            {subtitleFile ? (
                                <div className="rounded-xl border border-[#CC8400]/40 bg-[#CC8400]/5 p-3 flex items-center gap-3">
                                    <HiLanguage className="text-[#CC8400] text-xl shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/90 text-sm font-medium truncate">{subtitleFile.name}</p>
                                        <p className="text-white/40 text-xs">{(subtitleFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <select
                                        value={subtitleLang}
                                        onChange={(e) => setSubtitleLang(e.target.value)}
                                        className="bg-white/8 border border-white/15 rounded-lg px-2 py-1 text-white text-xs outline-none focus:border-[#CC8400]/60"
                                    >
                                        {SUBTITLE_LANGS.map((l) => (
                                            <option key={l.code} value={l.code} className="bg-[#111111]">{l.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => { setSubtitleFile(null); setErrors(p => ({ ...p, subtitle: null })) }}
                                        className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-colors"
                                    >
                                        <HiXMark className="text-white text-sm" />
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5
                                               flex items-center gap-3 p-3 transition-all duration-200"
                                >
                                    <input
                                        type="file"
                                        accept=".vtt,.srt,text/vtt"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0]
                                            if (f) { setSubtitleFile(f); setErrors(p => ({ ...p, subtitle: null })) }
                                        }}
                                    />
                                    <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center">
                                        <HiLanguage className="text-white/50 text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white/80 text-sm font-medium">Afegir subtítols</p>
                                        <p className="text-white/40 text-xs">.vtt o .srt · màxim 2 MB</p>
                                    </div>
                                    <span className="text-[#CC8400] text-xs border border-[#CC8400]/40 rounded-full px-3 py-1">
                                        Seleccionar
                                    </span>
                                </label>
                            )}
                            {errors.subtitle && <p className="text-red-400 text-xs mt-1">{errors.subtitle}</p>}
                        </div>
                    )}

                    {/* Botons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => !saving && onClose()}
                            disabled={saving}
                            className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-medium
                                hover:bg-white/5 hover:border-white/25 hover:text-white transition-all duration-200 disabled:opacity-40"
                        >
                            Cancel·lar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-[#CC8400] text-black text-sm font-bold
                                hover:bg-[#E09400] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    {isEditing ? 'Desant...' : 'Pujant vídeo...'}
                                </>
                            ) : (
                                isEditing ? 'Desar canvis' : 'Publicar vídeo'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

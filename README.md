# Playmon - Plataforma de Streaming

Playmon és una plataforma de streaming de pel·lícules i sèries, similar a Netflix o HBO, però creada des de zero com a projecte de classe. L'aplicació permet als usuaris navegar per un catàleg de continguts, veure tràilers, reproduir vídeos i gestionar la seva subscripció.

---

## Que fa l'aplicació?

L'objectiu principal de Playmon és oferir una experiència d'streaming completa. Aquestes són les coses que pot fer un usuari:

- **Registrar-se i iniciar sessió** per tenir el seu propi compte personalitzat.
- **Navegar pel catàleg** de pel·lícules i sèries organitzades per categories (acció, comèdia, drama...).
- **Veure els detalls** de cada contingut: sinopsi, repartiment, gèneres i puntuació.
- **Reproduir vídeos** directament des del navegador amb el reproductor integrat.
- **Gestionar el seu perfil**: canviar contrasenya, dades personals, privacitat i seguretat.
- **Contractar una subscripció** amb pagament integrat a través de Stripe.
- **Buscar continguts** des d'una barra de cerca.

A més, hi ha un **panell d'administrador** on es pot gestionar els usuaris, el contingut multimèdia, les estadístiques i les notificacions.

---

## Com està fet?

El frontend (la part visual que veu l'usuari) està construïda amb les tecnologies següents:

| Tecnologia | Per a que serveix |
|---|---|
| **React** | El framework principal per construir la interfície d'usuari |
| **React Router** | Per navegar entre les diferents pàgines sense recarregar |
| **Tailwind CSS** | Per donar estil i disseny a l'aplicació |
| **Axios** | Per comunicar-se amb el servidor i obtenir les dades |
| **HLS.js** | Per reproduir els vídeos en streaming |
| **Stripe** | Per gestionar els pagaments de subscripció |
| **Vite** | L'eina que compila i arranca el projecte durant el desenvolupament |

---

## Estructura de carpetes

Dins la carpeta `src/` hi ha tot el codi de l'aplicació. Està organitzat per funcionalitats:

```
src/
├── features/           # Cada pantalla o secció de l'app
│   ├── home/           # Pàgina d'inici amb el catàleg de continguts
│   ├── login/          # Pantalla de login i registre
│   ├── movies/         # Llistat de pel·lícules
│   ├── series/         # Llistat de sèries
│   ├── detail/         # Detalls d'una pel·lícula o sèrie
│   ├── reproductor/    # El reproductor de vídeo
│   ├── compte/         # Gestió del compte d'usuari
│   ├── subscriptions/  # Planes de subscripció i pagament
│   └── Admin/          # Panell d'administrador
├── components/         # Components reutilitzables (capçalera, targetes...)
├── api/                # Connexió amb el servidor (backend)
├── hooks/              # Lògica reutilitzable entre pantalles
└── assets/             # Imatges i vídeos
```

---

## Com posar en marxa el projecte

### Requisits previs

Necessites tenir instal·lat al teu ordinador:
- [Node.js](https://nodejs.org) (versió 18 o superior)
- Un gestor de paquets com `npm`

### Passos

**1. Clona el repositori**
```bash
git clone <URL_DEL_REPOSITORI>
cd Projecte-Playmon
```

**2. Instal·la les dependències**
```bash
npm install
```

**3. Configura les variables d'entorn**

Crea un fitxer `.env` a l'arrel del projecte amb el contingut del fitxer `.env.example` (si existeix) o demana'l al teu company d'equip.

**4. Arrenca el servidor de desenvolupament**
```bash
npm run dev
```

L'aplicació s'obrirà a `http://localhost:5173`.

---

## Pàgines principals de l'aplicació

| Ruta | Descripció |
|---|---|
| `/` | Pàgina d'inici amb el catàleg |
| `/login` | Inici de sessió |
| `/signup` | Registre de nou usuari |
| `/movies` | Llistat de totes les pel·lícules |
| `/series` | Llistat de totes les sèries |
| `/movie/:id` | Detalls d'una pel·lícula |
| `/tv/:id` | Detalls d'una sèrie |
| `/compte` | Gestió del compte d'usuari |
| `/subscripcio` | Plans i pagament de subscripció |
| `/admin` | Panell d'administrador (només per admins) |

---

## Equip

Projecte desenvolupat per alumnes del cicle formatiu de **Desenvolupament d'Aplicacions Multiplataforma (DAM)** com a projecte final de curs.

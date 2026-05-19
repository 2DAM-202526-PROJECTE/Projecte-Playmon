const Icon = ({ d, size = 16, stroke = 1.5, fill = 'none', children, viewBox = '0 0 24 24', style }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const IconPlay = (p) => <Icon {...p} fill="currentColor"><path d="M8 5v14l11-7z" /></Icon>;
export const IconPause = (p) => <Icon {...p}>
  <rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none"/>
  <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none"/>
</Icon>;
export const IconSkipFwd = (p) => <Icon {...p}>
  <path d="M21 12a9 9 0 1 1-3-6.7"/>
  <path d="M21 4v5h-5"/>
  <text x="12" y="15" fontSize="7" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Outfit, sans-serif">10</text>
</Icon>;
export const IconSkipBack = (p) => <Icon {...p}>
  <path d="M3 12a9 9 0 1 0 3-6.7"/>
  <path d="M3 4v5h5"/>
  <text x="12" y="15" fontSize="7" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Outfit, sans-serif">10</text>
</Icon>;
export const IconVolHigh = (p) => <Icon {...p}><path d="M3 9v6h4l5 4V5L7 9z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></Icon>;
export const IconVolMid = (p) => <Icon {...p}><path d="M3 9v6h4l5 4V5L7 9z"/><path d="M15 9a4 4 0 0 1 0 6"/></Icon>;
export const IconVolLow = (p) => <Icon {...p}><path d="M3 9v6h4l5 4V5L7 9z"/></Icon>;
export const IconMute = (p) => <Icon {...p}><path d="M3 9v6h4l5 4V5L7 9z"/><path d="m16 9 5 6m0-6-5 6"/></Icon>;
export const IconFull = (p) => <Icon {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></Icon>;
export const IconCaptions = (p) => <Icon {...p}>
  <rect x="3" y="5" width="18" height="14" rx="2"/>
  <path d="M7 12h2m1 0h2m1 0h2m1 0h2M7 15h2m1 0h2m1 0h2"/>
</Icon>;
export const IconSettings = (p) => <Icon {...p}>
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
</Icon>;
export const IconPip = (p) => <Icon {...p}>
  <rect x="3" y="5" width="18" height="14" rx="2"/>
  <rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor" stroke="none"/>
</Icon>;
export const IconLockBig = (p) => <Icon {...p}>
  <rect x="4" y="11" width="16" height="11" rx="2"/>
  <path d="M8 11V7a4 4 0 1 1 8 0v4"/>
</Icon>;
export const IconBolt = (p) => <Icon {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7z" /></Icon>;
export const IconGlobe = (p) => <Icon {...p}>
  <circle cx="12" cy="12" r="9" />
  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
</Icon>;
export const IconType = (p) => <Icon {...p}><path d="M4 7V5h16v2M9 5v14m-2 0h4M14 11v8m-2 0h4"/></Icon>;
export const IconActivity = (p) => <Icon {...p}><path d="M3 12h4l2-7 4 14 2-7h6"/></Icon>;
export const IconMP4 = ({ size = 14 }) => (
  <span style={{
    fontSize: size - 2, fontWeight: 700, letterSpacing: '0.06em',
    padding: '3px 7px', borderRadius: 4,
    border: '1px solid currentColor', color: 'currentColor',
    fontFamily: "'JetBrains Mono', monospace",
  }}>HLS</span>
);

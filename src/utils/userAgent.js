/**
 * Parser User-Agent lleuger. No fa servir cap llibreria.
 * Retorna { browser, os, device } amb les parts rellevants per a humans.
 * Si no detecta res torna la cadena original com a fallback.
 */
export function parseUserAgent(ua) {
    if (!ua || typeof ua !== "string") return { browser: "Desconegut", os: "", device: "" };

    // Ordre IMPORTANT: Edge ha d'anar abans de Chrome (Edge conté "Chrome").
    // Opera abans de Chrome. Firefox abans de Safari. Safari ÚLTIM.
    let browser = "Navegador desconegut";
    const browserPatterns = [
        { re: /Edg(?:e|A|iOS)?\/([\d.]+)/, name: "Edge" },
        { re: /OPR\/([\d.]+)/, name: "Opera" },
        { re: /Firefox\/([\d.]+)/, name: "Firefox" },
        { re: /Chrome\/([\d.]+)/, name: "Chrome" },
        { re: /Version\/([\d.]+).*Safari/, name: "Safari" },
    ];
    for (const { re, name } of browserPatterns) {
        const m = ua.match(re);
        if (m) {
            const major = m[1].split(".")[0];
            browser = `${name} ${major}`;
            break;
        }
    }

    // Sistema operatiu
    let os = "";
    if (/Windows NT 10\.0/.test(ua)) os = "Windows 10/11";
    else if (/Windows NT 6\.3/.test(ua)) os = "Windows 8.1";
    else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7";
    else if (/Windows/.test(ua)) os = "Windows";
    else if (/Android\s([\d.]+)/.test(ua)) os = `Android ${ua.match(/Android\s([\d.]+)/)[1]}`;
    else if (/iPhone OS ([\d_]+)/.test(ua)) os = `iOS ${ua.match(/iPhone OS ([\d_]+)/)[1].replace(/_/g, ".")}`;
    else if (/iPad/.test(ua)) os = "iPadOS";
    else if (/Mac OS X ([\d_]+)/.test(ua)) os = `macOS ${ua.match(/Mac OS X ([\d_]+)/)[1].replace(/_/g, ".")}`;
    else if (/Linux/.test(ua)) os = "Linux";
    else if (/CrOS/.test(ua)) os = "ChromeOS";

    // Tipus de dispositiu
    let device = "Ordinador";
    if (/Mobi|iPhone|Android.*Mobile/.test(ua)) device = "Mòbil";
    else if (/Tablet|iPad/.test(ua)) device = "Tauleta";
    else if (/TV|SmartTV|GoogleTV/.test(ua)) device = "TV";

    return { browser, os, device };
}

/**
 * Format curt en una línia: "Chrome 148 · Linux · Ordinador"
 */
export function formatUserAgent(ua) {
    const { browser, os, device } = parseUserAgent(ua);
    return [browser, os, device].filter(Boolean).join(" · ");
}

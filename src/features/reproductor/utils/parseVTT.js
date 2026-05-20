function tsToSeconds(ts) {
  const t = ts.trim().replace(",", ".");
  const parts = t.split(":");
  let h = 0, m = 0, s = 0;
  if (parts.length === 3) {
    h = +parts[0]; m = +parts[1]; s = parseFloat(parts[2]);
  } else if (parts.length === 2) {
    m = +parts[0]; s = parseFloat(parts[1]);
  } else {
    s = parseFloat(parts[0]);
  }
  return h * 3600 + m * 60 + s;
}

export function parseVTT(raw) {
  if (!raw || typeof raw !== "string") return [];

  const text = raw.replace(/\r/g, "");
  const blocks = text.split(/\n\n+/);
  const cues = [];

  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.length);
    if (!lines.length) continue;

    const headerIdx = lines.findIndex((l) => l.includes("-->"));
    if (headerIdx === -1) continue;

    const [startRaw, endRawTail] = lines[headerIdx].split("-->");
    const endRaw = (endRawTail || "").trim().split(/\s+/)[0];
    const start = tsToSeconds(startRaw);
    const end = tsToSeconds(endRaw);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) continue;

    const textLines = lines.slice(headerIdx + 1);
    const cueText = textLines
      .join("\n")
      .replace(/<\/?[^>]+>/g, "")
      .trim();
    if (!cueText) continue;

    cues.push({ start, end, text: cueText });
  }

  return cues;
}

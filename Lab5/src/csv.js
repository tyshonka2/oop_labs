const HEADER = "type,x1,y1,x2,y2";

export function toCSV(records) {
    const lines = records.map((record) => [
        record.type,
        Math.round(record.x1),
        Math.round(record.y1),
        Math.round(record.x2),
        Math.round(record.y2)
    ].join(","));

    return [HEADER, ...lines].join("\n") + "\n";
}

export function parseCSV(text) {
    const records = [];

    for (const line of text.split(/\r?\n/)) {
        const parts = line.split(",").map((part) => part.trim());
        if (parts.length !== 5 || parts[0] === "type") continue;

        const [x1, y1, x2, y2] = parts.slice(1).map(Number);
        if ([x1, y1, x2, y2].some(Number.isNaN)) continue;

        records.push({ type: parts[0], x1, y1, x2, y2 });
    }

    return records;
}

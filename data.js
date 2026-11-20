import fileData from "./posts.seed.json" with { type: "json" };

// Données en mémoire (copie pour ne pas muter l'import)
export const posts = fileData.map((p) => ({ ...p }));

let nextId = posts.reduce((max, p) => Math.max(max, p.id), 0) + 1;

export const generateId = () => nextId++;

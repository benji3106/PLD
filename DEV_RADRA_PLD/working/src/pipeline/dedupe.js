export function dedupeEvents(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.title.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

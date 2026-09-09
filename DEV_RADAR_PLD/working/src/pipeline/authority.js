const severity = { removed: 4, breaking: 3, deprecated: 2, changed: 1 };

export function resolveContradiction(claims) {
  return [...claims].sort((a, b) => (severity[b.claimType] || 0) - (severity[a.claimType] || 0))[0] || null;
}

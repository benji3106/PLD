/**
 * PATCH//ZERO - MODEL ROUTER
 * BONUS PX-203 starts here.
 *
 * WHERE THIS RUNS
 * Task + risk -> model tier
 *
 * INPUT
 * { task, risk }
 *
 * OUTPUT
 * { tier, reason }
 *
 * The goal is not to know a vendor catalogue by heart. Think in service tiers:
 * cheap/fast work does not need the same model or review policy as a global
 * rollback. The checker only verifies that those two risk levels are separated.
 */
export function routeModel({ task, risk }) {
  // Starter behaviour: everything is routed to the most expensive tier.
  return { tier: 'premium', reason: 'default-largest-model' };
}

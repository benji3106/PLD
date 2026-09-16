/**
 * PATCH//ZERO - TRACE REDACTION
 * BONUS PX-202 starts here.
 *
 * WHERE THIS RUNS
 * Raw telemetry payload -> redaction -> Trace storage
 *
 * INPUT
 * An arbitrary trace payload that can contain nested player or payment data.
 *
 * OUTPUT
 * The same useful telemetry, without storing sensitive values in clear text.
 *
 * Do not delete the entire payload just to make the checker green: observability
 * must remain useful after redaction.
 */
export function redactTracePayload(payload) {
  // Starter behaviour: telemetry stores the raw payload unchanged.
  return structuredClone(payload);
}

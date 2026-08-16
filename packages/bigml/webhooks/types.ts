/**
 * BigML has no webhook, callback, or streaming mechanism - it is a
 * request/response REST API only (confirmed: the OSS catalog lists zero
 * triggers for it). This file exists so the package keeps the shape every
 * Corsair plugin has, matching Alpha Vantage's `webhooks/types.ts`.
 */

/** No webhook handlers are registered, and the provider offers none. */
export type BigmlWebhookOutputs = Record<string, never>;

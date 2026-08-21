/**
 * Alpha Vantage has no webhook, callback or streaming mechanism — it is a
 * request/response HTTP API only. The OSS catalog lists zero triggers for it
 * accordingly, and there is no provider-side envelope to model here.
 *
 * This file exists so the package keeps the shape every Corsair plugin has.
 */

/** No webhook handlers are registered, and the provider offers none. */
export type AlphaVantageWebhookOutputs = Record<string, never>;

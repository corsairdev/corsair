/**
 * BigML has no inbound webhook stream (the OSS catalog lists 0 triggers).
 * Resources may carry an outbound `webhook` field; this plugin does not
 * receive those callbacks.
 */

/** No webhook handlers are registered, and the provider offers none. */
export type BigmlWebhookOutputs = Record<string, never>;

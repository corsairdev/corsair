// Appointo uses API-token authentication and does not expose native webhooks.
// This file exists to satisfy the plugin structure but exports nothing.

export type AppointoWebhookOutputs = Record<string, never>;

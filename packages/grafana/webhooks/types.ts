// Grafana has no webhook triggers (triggers: [] in API spec)
export type GrafanaWebhookOutputs = Record<string, never>;

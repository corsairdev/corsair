export interface SpokiWebhookContext {
	headers: Record<string, string | undefined>;
	body: unknown;
}

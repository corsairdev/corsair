export interface SpokiWebhookRequest {
	headers: Record<string, string | string[] | undefined>;
	body?: unknown;
}

export interface SpokiTenantWebhookMatch {
	tenantId: string;
	linkType: string;
	externalId: string;
}

export function matchSpokiTenantWebhook(
	request: SpokiWebhookRequest,
): SpokiTenantWebhookMatch | null {
	const headers = request.headers ?? {};

	// Find the header without caring about capitalization.
	const tenantHeader = Object.entries(headers).find(
		([name]) => name.toLowerCase() === 'x-spoki-tenant-id',
	);

	const value = tenantHeader?.[1];

	const tenantId = Array.isArray(value) ? value[0] : value;

	if (!tenantId) {
		return null;
	}

	return {
		tenantId,
		linkType: 'spoki_account',
		externalId: tenantId,
	};
}

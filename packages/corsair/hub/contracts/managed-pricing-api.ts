// Hub contract for metered / managed-pricing provider credentials.
// Keep in sync with hub/packages/api when the route is implemented.

export type HubManagedPricingCredentialsRequest = {
	plugin: string;
	tenantId: string;
	/** Optional — reserved for per-operation metering on Hub. */
	operation?: string;
};

export type HubManagedPricingCredentialsResponse = {
	api_key: string;
	expires_in?: number;
	/**
	 * Set when Hub prices the operation per unit: the dot path in the
	 * endpoint's result to the number of units the call used, reported back
	 * once the call succeeds.
	 */
	usage_path?: string;
};

const USAGE_PATH = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/;

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}

export function parseManagedPricingCredentialsResponse(
	payload: unknown,
): HubManagedPricingCredentialsResponse {
	if (!payload || typeof payload !== 'object') {
		throw new Error(
			'Hub API returned an empty managed pricing credentials payload',
		);
	}

	const body = payload as Record<string, unknown>;
	if (!isNonEmptyString(body.api_key)) {
		throw new Error(
			'Hub API returned incomplete managed pricing credentials (expected api_key)',
		);
	}

	const result: HubManagedPricingCredentialsResponse = {
		api_key: body.api_key,
	};

	if (
		body.expires_in !== undefined &&
		typeof body.expires_in === 'number' &&
		Number.isFinite(body.expires_in) &&
		body.expires_in > 0
	) {
		result.expires_in = body.expires_in;
	}

	if (typeof body.usage_path === 'string' && USAGE_PATH.test(body.usage_path)) {
		result.usage_path = body.usage_path;
	}

	return result;
}

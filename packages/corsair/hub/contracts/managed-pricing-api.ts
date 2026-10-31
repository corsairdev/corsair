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
	/**
	 * Set when the operation starts a provider job on Corsair's key: where its
	 * result has the job id, so the SDK can record the job even when it could
	 * not read Hub's job table.
	 */
	job?: { role: 'start'; id_path: string; status_operation?: string };
	/**
	 * Set for a provider that answers some failures with a success status:
	 * the call failed when the value at `path` in its result equals `equals`
	 * (Firecrawl: `success` is false), and is reported like one that threw.
	 */
	failed_when?: ManagedPricingFailedWhen;
};

export type ManagedPricingFailedWhen = {
	path: string;
	equals: boolean | number | string;
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

	const job = body.job as Record<string, unknown> | undefined;
	if (
		job?.role === 'start' &&
		typeof job.id_path === 'string' &&
		USAGE_PATH.test(job.id_path)
	) {
		result.job = {
			role: 'start',
			id_path: job.id_path,
			...(typeof job.status_operation === 'string'
				? { status_operation: job.status_operation }
				: {}),
		};
	}

	// unknown: Hub's JSON, typed only once each field below is checked.
	const failedWhen = body.failed_when as Record<string, unknown> | undefined;
	if (
		failedWhen &&
		typeof failedWhen.path === 'string' &&
		USAGE_PATH.test(failedWhen.path) &&
		(typeof failedWhen.equals === 'boolean' ||
			typeof failedWhen.equals === 'string' ||
			(typeof failedWhen.equals === 'number' &&
				Number.isFinite(failedWhen.equals)))
	) {
		result.failed_when = { path: failedWhen.path, equals: failedWhen.equals };
	}

	return result;
}

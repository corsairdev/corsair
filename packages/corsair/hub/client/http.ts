import { parseHubApiErrorBody } from '../contracts/connect-api';
import { resolveHubDeliveryUrl } from '../resolve-delivery-url';
import type { HubConfig } from '../types';

export function normalizeHubApiUrl(apiUrl: string): string {
	return apiUrl.replace(/\/$/, '');
}

/**
 * The delivery URL this app should advertise to Hub, or null if there's nothing
 * to send. Only development keys self-register: Hub applies the delivery URL for
 * development environments only, so advertising anything on a production key is a
 * no-op. Production delivery URLs are set deliberately in the dashboard.
 */
export function deliveryUrlToAdvertise(hub: HubConfig): string | null {
	if (!hub.projectApiKey.startsWith('ck_dev_')) {
		return null;
	}
	try {
		return resolveHubDeliveryUrl();
	} catch {
		return null;
	}
}

/**
 * Every SDK call tells Hub where this app lives, so nobody has to type the
 * delivery URL into the dashboard. The URL comes from the app's own trusted
 * config (CORSAIR_DELIVERY_URL / APP_URL / PORT) — never from inbound request
 * headers. Hub applies it for development keys only.
 */
export function appDeliveryUrlHeader(hub: HubConfig): Record<string, string> {
	const url = deliveryUrlToAdvertise(hub);
	return url ? { 'x-corsair-delivery-url': url } : {};
}

export async function readHubJsonResponse(
	response: Response,
): Promise<unknown> {
	const contentType = response.headers.get('content-type') ?? '';
	const bodyText = await response.text();

	if (!bodyText) {
		return null;
	}

	if (
		!contentType.includes('application/json') &&
		bodyText.trimStart().startsWith('<')
	) {
		throw new Error(
			`Hub API returned HTML instead of JSON (HTTP ${response.status}). Check HUB_API_URL and deploy the latest hub API.`,
		);
	}

	try {
		return JSON.parse(bodyText) as unknown;
	} catch {
		throw new Error(`Hub API returned invalid JSON (HTTP ${response.status})`);
	}
}

export function parseHubApiError(
	payload: unknown,
	status: number,
	notFoundMessage?: string,
): string {
	if (status === 404 && notFoundMessage) {
		return notFoundMessage;
	}

	const message = parseHubApiErrorBody(payload);
	if (message) {
		return message;
	}

	return `Hub API returned HTTP ${status}`;
}

export async function hubApiPost<T>(input: {
	hub: HubConfig;
	path: string;
	body: unknown;
	notFoundMessage?: string;
	parseResponse: (payload: unknown) => T;
}): Promise<T> {
	const apiUrl = normalizeHubApiUrl(input.hub.apiUrl);
	const response = await fetch(`${apiUrl}${input.path}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${input.hub.projectApiKey}`,
			...appDeliveryUrlHeader(input.hub),
		},
		body: JSON.stringify(input.body),
	});

	const payload = await readHubJsonResponse(response);

	if (!response.ok) {
		throw new Error(
			parseHubApiError(payload, response.status, input.notFoundMessage),
		);
	}

	return input.parseResponse(payload);
}

export async function hubApiGet<T>(input: {
	hub: HubConfig;
	path: string;
	notFoundMessage?: string;
	parseResponse: (payload: unknown) => T;
}): Promise<T> {
	const apiUrl = normalizeHubApiUrl(input.hub.apiUrl);
	const response = await fetch(`${apiUrl}${input.path}`, {
		method: 'GET',
		headers: {
			authorization: `Bearer ${input.hub.projectApiKey}`,
			...appDeliveryUrlHeader(input.hub),
		},
	});

	const payload = await readHubJsonResponse(response);

	if (!response.ok) {
		throw new Error(
			parseHubApiError(payload, response.status, input.notFoundMessage),
		);
	}

	return input.parseResponse(payload);
}

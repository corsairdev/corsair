import { parseHubApiErrorBody } from '../contracts/connect-api';
import type { HubConfig } from '../types';

export function normalizeHubApiUrl(apiUrl: string): string {
	return apiUrl.replace(/\/$/, '');
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

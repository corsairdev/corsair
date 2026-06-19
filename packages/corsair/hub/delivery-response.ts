import type { ProcessCorsairRequest } from '../tunnel';
import { HubNotConfiguredError } from './config';
import type { HubDeliveryResult } from './delivery';
import { handleHubDeliveryGet, handleHubDeliveryPost } from './delivery';

export type HubDeliveryRequest = {
	method: 'GET' | 'POST';
	url: string;
	headers: ProcessCorsairRequest['headers'];
	body?: string;
};

export function hubDeliveryToResponse(result: HubDeliveryResult): Response {
	if (result.type === 'redirect') {
		return Response.redirect(result.url);
	}

	const headers = new Headers();
	for (const [key, value] of Object.entries(result.headers ?? {})) {
		if (typeof value === 'string') {
			headers.set(key, value);
		}
	}

	if (result.type === 'json') {
		return Response.json(result.body, {
			status: result.status,
			headers,
		});
	}

	return new Response(result.body, {
		status: result.status,
		headers,
	});
}

export async function handleHubDeliveryRequest(
	corsair: unknown,
	request: HubDeliveryRequest,
): Promise<HubDeliveryResult> {
	if (request.method === 'GET') {
		return handleHubDeliveryGet(corsair, request.url);
	}

	return handleHubDeliveryPost(corsair, {
		headers: request.headers,
		body: request.body ?? '',
	});
}

export async function respondToHubDelivery(
	corsair: unknown,
	request: HubDeliveryRequest,
): Promise<Response> {
	try {
		const result = await handleHubDeliveryRequest(corsair, request);
		return hubDeliveryToResponse(result);
	} catch (error) {
		if (error instanceof HubNotConfiguredError) {
			return Response.json({ error: error.message }, { status: 503 });
		}
		throw error;
	}
}

export async function respondToHubDeliveryFromRequest(
	corsair: unknown,
	request: Request,
): Promise<Response> {
	const method = request.method.toUpperCase();
	if (method !== 'GET' && method !== 'POST') {
		return Response.json({ error: 'Method not allowed' }, { status: 405 });
	}

	return respondToHubDelivery(corsair, {
		method,
		url: request.url,
		headers: request.headers,
		body: method === 'POST' ? await request.text() : undefined,
	});
}

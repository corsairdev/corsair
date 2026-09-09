import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { GetCampaignPdfAnalysisResponse } from './endpoints/types';

const CAMPAIGNCLEANER_API_BASE = 'https://api.campaigncleaner.com';
const REQUEST_TIMEOUT_MS = 20_000;

type CampaignIdBody = { campaign: { id: string } };

export class CampaignCleanerAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;
	// unknown is necessary because Campaign Cleaner error payloads vary by endpoint; a closed error body union is infeasible because docs only guarantee an optional "error" string
	public readonly body?: unknown;

	constructor(
		message: string,
		status?: number,
		retryAfter?: number,
		// unknown is necessary because Campaign Cleaner error payloads vary by endpoint; a closed error body union is infeasible because docs only guarantee an optional "error" string
		body?: unknown,
	) {
		super(message);
		this.name = 'CampaignCleanerAPIError';
		this.status = status;
		this.retryAfter = retryAfter;
		this.body = body;
	}
}

type CampaignCleanerRequestOptions = {
	method?: 'GET' | 'POST';
	body?: CampaignIdBody;
	binary?: boolean;
};

function config(apiKey: string): OpenAPIConfig {
	return {
		BASE: CAMPAIGNCLEANER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		TIMEOUT: REQUEST_TIMEOUT_MS,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-CC-API-Key': apiKey,
		},
	};
}

function stringProp(value: object, key: string): string | undefined {
	const field = Object.getOwnPropertyDescriptor(value, key)?.value;
	return typeof field === 'string' && field.length > 0 ? field : undefined;
}

function errorMessageFromBody(
	// unknown is necessary because JSON error bodies are untyped at the HTTP boundary; a closed body union is infeasible because Campaign Cleaner documents only an optional error string
	body: unknown,
	fallback: string,
): string {
	if (typeof body !== 'object' || body === null) return fallback;
	return (
		stringProp(body, 'error') ??
		stringProp(body, 'message') ??
		stringProp(body, 'detail') ??
		fallback
	);
}

export function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	if (!Number.isNaN(seconds)) return Math.max(0, seconds * 1000);
	const at = Date.parse(header);
	if (Number.isNaN(at)) return undefined;
	return Math.max(0, at - Date.now());
}

export async function makeCampaignCleanerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CampaignCleanerRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, binary = false } = options;

	if (binary) {
		return makeCampaignCleanerBinaryRequest(
			endpoint,
			apiKey,
			method,
			body,
		) as Promise<T>;
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
	};

	try {
		return await request<T>(config(apiKey), requestOptions);
	} catch (
		// unknown is necessary because the transport can throw any value; a closed error union is infeasible because fetch-level failures are untyped
		error: unknown
	) {
		throw normalizeCampaignCleanerError(error);
	}
}

async function makeCampaignCleanerBinaryRequest(
	endpoint: string,
	apiKey: string,
	method: 'GET' | 'POST',
	body?: CampaignIdBody,
): Promise<GetCampaignPdfAnalysisResponse> {
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const url = `${CAMPAIGNCLEANER_API_BASE}/${path}`;

	try {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'X-CC-API-Key': apiKey,
			},
			body: method === 'POST' ? JSON.stringify(body) : undefined,
			credentials: 'omit',
			redirect: 'error',
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (!response.ok) {
			const retryAfter = parseRetryAfterMs(response.headers.get('Retry-After'));
			let parsed: object | undefined;
			const contentType = response.headers.get('Content-Type') ?? '';
			if (contentType.toLowerCase().includes('application/json')) {
				try {
					// unknown is necessary because response.json() is untyped; a closed JSON union is infeasible because error bodies are not schema-published
					const json: unknown = await response.json();
					parsed = typeof json === 'object' && json !== null ? json : undefined;
				} catch {
					parsed = undefined;
				}
			}
			throw new CampaignCleanerAPIError(
				errorMessageFromBody(
					parsed,
					`Campaign Cleaner API request failed with status ${response.status}`,
				),
				response.status,
				retryAfter,
				parsed,
			);
		}

		const bytes = Buffer.from(await response.arrayBuffer());
		const contentType =
			response.headers.get('Content-Type') ?? 'application/pdf';
		if (
			!contentType.toLowerCase().includes('application/pdf') &&
			bytes.subarray(0, 4).toString() !== '%PDF'
		) {
			throw new CampaignCleanerAPIError(
				`Expected application/pdf response but received ${contentType}`,
				response.status,
			);
		}

		return {
			content_type: contentType,
			content_base64: bytes.toString('base64'),
		};
	} catch (
		// unknown is necessary because the transport can throw any value; a closed error union is infeasible because fetch-level failures are untyped
		error: unknown
	) {
		throw normalizeCampaignCleanerError(error);
	}
}

function normalizeCampaignCleanerError(
	// unknown is necessary because the transport can throw any value; a closed error union is infeasible because fetch-level failures are untyped
	error: unknown,
): CampaignCleanerAPIError {
	if (error instanceof CampaignCleanerAPIError) return error;
	if (error instanceof ApiError) {
		return new CampaignCleanerAPIError(
			errorMessageFromBody(error.body, error.message),
			error.status,
			error.retryAfter,
			error.body,
		);
	}
	if (error instanceof Error) return new CampaignCleanerAPIError(error.message);
	return new CampaignCleanerAPIError('Unknown error');
}

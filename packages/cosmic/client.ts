import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const COSMIC_API_BASE = 'https://api.cosmicjs.com';
const COSMIC_UPLOAD_BASE = 'https://workers.cosmicjs.com';

export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, string | number | boolean] =>
				entry[1] !== undefined,
		),
	);
}

export function encodeQueryFilter(filter: Record<string, unknown>): string {
	return JSON.stringify(filter);
}

function baseConfig(base: string, writeKey?: string): OpenAPIConfig {
	return {
		BASE: base,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			...(writeKey ? { Authorization: `Bearer ${writeKey}` } : {}),
		},
	};
}

export async function makeCosmicReadRequest<T>(
	path: string,
	readKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: compactQuery({ ...query, read_key: readKey }),
	};

	return await request<T>(baseConfig(COSMIC_API_BASE), requestOptions);
}

export async function makeCosmicWriteRequest<T>(
	path: string,
	writeKey: string,
	options: {
		method: 'POST' | 'PATCH' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = { method: 'POST' },
): Promise<T> {
	const { method, body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: 'application/json; charset=utf-8',
		query: query ? compactQuery(query) : undefined,
	};

	return await request<T>(
		baseConfig(COSMIC_API_BASE, writeKey),
		requestOptions,
	);
}

export type CosmicUploadMedia = {
	filename: string;
	contentType: string;
	data: Uint8Array;
};

export async function makeCosmicUploadRequest<T>(
	path: string,
	writeKey: string,
	upload: {
		media: CosmicUploadMedia;
		folder?: string;
		alt_text?: string;
		metadata?: Record<string, unknown>;
		trigger_webhook?: boolean;
	},
): Promise<T> {
	const form = new FormData();
	form.append(
		'media',
		new Blob([upload.media.data], { type: upload.media.contentType }),
		upload.media.filename,
	);
	form.append('write_key', writeKey);
	if (upload.folder !== undefined) form.append('folder', upload.folder);
	if (upload.alt_text !== undefined) form.append('alt_text', upload.alt_text);
	if (upload.metadata !== undefined)
		form.append('metadata', JSON.stringify(upload.metadata));
	if (upload.trigger_webhook) form.append('trigger_webhook', 'true');

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: path,
		body: form,
	};

	return await request<T>(
		baseConfig(COSMIC_UPLOAD_BASE, writeKey),
		requestOptions,
	);
}

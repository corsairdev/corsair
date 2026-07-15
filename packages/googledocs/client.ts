import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type { BatchUpdateResponse, Document, StructuralElement } from './types';

export class GoogleDocsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GoogleDocsAPIError';
	}
}

export const DOCS_API_BASE = 'https://docs.googleapis.com/v1';
export const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
export const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4';

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new GoogleDocsAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};

	return json;
}

export async function getValidAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	clientId: string;
	clientSecret: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
	forceRefresh?: boolean;
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return { accessToken, expiresAt: Number(expiresAt), refreshed: false };
	}

	const tokenData = await refreshAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

type GoogleDocsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

async function googleApiRequest<T>(
	base: string,
	endpoint: string,
	credentials: string,
	options: GoogleDocsRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: credentials,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query: method === 'GET' ? query : undefined,
	};

	return await request<T>(config, requestOptions);
}

// Google Docs has no native push; document operations hit docs.googleapis.com.
export async function makeGoogleDocsRequest<T>(
	endpoint: string,
	credentials: string,
	options: GoogleDocsRequestOptions = {},
): Promise<T> {
	return googleApiRequest(DOCS_API_BASE, endpoint, credentials, options);
}

// Several listed routes live on the Drive API: search documents, export as PDF, copy.
export async function makeGoogleDriveRequest<T>(
	endpoint: string,
	credentials: string,
	options: GoogleDocsRequestOptions = {},
): Promise<T> {
	return googleApiRequest(DRIVE_API_BASE, endpoint, credentials, options);
}

// Get Charts from Spreadsheet reads chart specs from the Sheets API.
export async function makeGoogleSheetsRequest<T>(
	endpoint: string,
	credentials: string,
	options: GoogleDocsRequestOptions = {},
): Promise<T> {
	return googleApiRequest(SHEETS_API_BASE, endpoint, credentials, options);
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

export async function makeAuthenticatedGoogleRequest<T>(
	base: string,
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: GoogleDocsRequestOptions = {},
): Promise<T> {
	try {
		return await googleApiRequest<T>(base, endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await googleApiRequest<T>(base, endpoint, freshToken, options);
		}
		throw error;
	}
}

// Most listed text/structure/table operations are documents.batchUpdate with a
// single request type. This wraps the POST so each handler only builds its request.
export async function runBatchUpdate(
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	documentId: string,
	requests: Record<string, unknown>[],
	writeControl?: Record<string, unknown>,
): Promise<BatchUpdateResponse> {
	return makeAuthenticatedGoogleRequest<BatchUpdateResponse>(
		DOCS_API_BASE,
		`/documents/${documentId}:batchUpdate`,
		ctx,
		{
			method: 'POST',
			body: writeControl ? { requests, writeControl } : { requests },
		},
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Document helpers — shared by the plaintext endpoint and the polling triggers.
// The Docs API returns deeply nested structural JSON; callers want flat text and
// a structure summary without traversing it themselves.
// ─────────────────────────────────────────────────────────────────────────────

function flattenStructuralElements(elements: StructuralElement[]): string {
	const lines: string[] = [];

	for (const element of elements) {
		if (element.paragraph) {
			const text = (element.paragraph.elements ?? [])
				.map((e) => e.textRun?.content ?? '')
				.join('');
			lines.push(text);
		} else if (element.table) {
			for (const row of element.table.tableRows ?? []) {
				for (const cell of row.tableCells ?? []) {
					lines.push(flattenStructuralElements(cell.content ?? []));
				}
			}
		} else if (element.tableOfContents?.content) {
			lines.push(flattenStructuralElements(element.tableOfContents.content));
		}
	}

	return lines.join('\n');
}

export function extractPlainText(document: Document): string {
	const bodyText = flattenStructuralElements(document.body?.content ?? []);
	return bodyText.replace(/\n{3,}/g, '\n\n').trim();
}

export function countWords(text: string): number {
	const matches = text.match(/\S+/g);
	return matches ? matches.length : 0;
}

export type DocumentStructure = {
	headers: number;
	footers: number;
	footnotes: number;
	tables: number;
	images: number;
	positionedObjects: number;
	namedRanges: number;
};

export function summarizeStructure(document: Document): DocumentStructure {
	let tables = 0;
	for (const element of document.body?.content ?? []) {
		if (element.table) tables++;
	}

	return {
		headers: document.headers ? Object.keys(document.headers).length : 0,
		footers: document.footers ? Object.keys(document.footers).length : 0,
		footnotes: document.footnotes ? Object.keys(document.footnotes).length : 0,
		tables,
		images: document.inlineObjects
			? Object.keys(document.inlineObjects).length
			: 0,
		positionedObjects: document.positionedObjects
			? Object.keys(document.positionedObjects).length
			: 0,
		namedRanges: document.namedRanges
			? Object.keys(document.namedRanges).length
			: 0,
	};
}

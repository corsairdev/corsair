import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type {
	BatchUpdateResponse,
	Document,
	DocumentTabSummary,
	StructuralElement,
	Tab,
} from './types';

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

export type ExtractPlainTextOptions = {
	tabId?: string;
	tabTitle?: string;
	/** Root-level tab index (see TabProperties.index). */
	tabIndex?: number;
	/** When document.tabs is populated, concatenate text from every tab. */
	allTabs?: boolean;
};

function normalizePlainText(text: string): string {
	return text.replace(/\n{3,}/g, '\n\n').trim();
}

function walkTabs(tabs: Tab[], visit: (tab: Tab) => void): void {
	for (const tab of tabs) {
		visit(tab);
		if (tab.childTabs?.length) {
			walkTabs(tab.childTabs, visit);
		}
	}
}

/** Find a tab by id, case-insensitive title, or root-level index (depth-first for id/title). */
export function findTab(
	document: Document,
	criteria: { tabId?: string; tabTitle?: string; tabIndex?: number },
): Tab | undefined {
	if (!document.tabs?.length) {
		return undefined;
	}
	if (criteria.tabIndex !== undefined) {
		const roots = document.tabs;
		const byProp = roots.find(
			(tab) => tab.tabProperties?.index === criteria.tabIndex,
		);
		if (byProp) return byProp;
		return roots[criteria.tabIndex];
	}

	const wantId = criteria.tabId;
	const wantTitle = criteria.tabTitle?.trim().toLowerCase();
	if (!wantId && !wantTitle) {
		return undefined;
	}

	let match: Tab | undefined;
	walkTabs(document.tabs, (tab) => {
		if (match) return;
		const props = tab.tabProperties;
		if (wantId && props?.tabId === wantId) {
			match = tab;
			return;
		}
		if (wantTitle && props?.title?.trim().toLowerCase() === wantTitle) {
			match = tab;
		}
	});
	return match;
}

/** Flat list of tab metadata for agents (includes nested tabs). */
export function listTabSummaries(document: Document): DocumentTabSummary[] {
	if (!document.tabs?.length) {
		return [];
	}
	const summaries: DocumentTabSummary[] = [];
	walkTabs(document.tabs, (tab) => {
		const tabId = tab.tabProperties?.tabId;
		if (!tabId) return;
		summaries.push({
			tabId,
			title: tab.tabProperties?.title,
			index: tab.tabProperties?.index,
			parentTabId: tab.tabProperties?.parentTabId,
			nestingLevel: tab.tabProperties?.nestingLevel,
		});
	});
	return summaries;
}

function extractPlainTextFromBody(document: Document): string {
	return flattenStructuralElements(document.body?.content ?? []);
}

function extractPlainTextFromTab(tab: Tab): string {
	return flattenStructuralElements(tab.documentTab?.body?.content ?? []);
}

export function extractPlainText(
	document: Document,
	options?: ExtractPlainTextOptions,
): string {
	if (options?.tabId || options?.tabTitle || options?.tabIndex !== undefined) {
		const tab = findTab(document, {
			tabId: options.tabId,
			tabTitle: options.tabTitle,
			tabIndex: options.tabIndex,
		});
		if (!tab) {
			const hint =
				options.tabId !== undefined
					? `tabId "${options.tabId}"`
					: options.tabTitle !== undefined
						? `tabTitle "${options.tabTitle}"`
						: `tabIndex ${options.tabIndex}`;
			throw new Error(
				`[googledocs] No tab matching ${hint}. Call documents.listDocumentTabs or pass includeTabsContent on getDocumentPlaintext.`,
			);
		}
		return normalizePlainText(extractPlainTextFromTab(tab));
	}

	if (options?.allTabs && document.tabs?.length) {
		const parts: string[] = [];
		walkTabs(document.tabs, (tab) => {
			const chunk = extractPlainTextFromTab(tab);
			if (chunk) {
				const label = tab.tabProperties?.title?.trim();
				parts.push(label ? `## ${label}\n${chunk}` : chunk);
			}
		});
		return normalizePlainText(parts.join('\n\n'));
	}

	// includeTabsContent=true leaves top-level body empty; fall back to tabs.
	if (document.tabs?.length && !document.body?.content?.length) {
		return extractPlainText(document, { allTabs: true });
	}

	return normalizePlainText(extractPlainTextFromBody(document));
}

export function documentGetQuery(options?: {
	includeTabsContent?: boolean;
}): Record<string, string | boolean | undefined> {
	if (options?.includeTabsContent) {
		return { includeTabsContent: true };
	}
	return {};
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

function summarizeStructureFromParts(parts: {
	body?: Document['body'];
	headers?: Document['headers'];
	footers?: Document['footers'];
	footnotes?: Document['footnotes'];
	inlineObjects?: Document['inlineObjects'];
	positionedObjects?: Document['positionedObjects'];
	namedRanges?: Document['namedRanges'];
}): DocumentStructure {
	let tables = 0;
	for (const element of parts.body?.content ?? []) {
		if (element.table) tables++;
	}

	return {
		headers: parts.headers ? Object.keys(parts.headers).length : 0,
		footers: parts.footers ? Object.keys(parts.footers).length : 0,
		footnotes: parts.footnotes ? Object.keys(parts.footnotes).length : 0,
		tables,
		images: parts.inlineObjects ? Object.keys(parts.inlineObjects).length : 0,
		positionedObjects: parts.positionedObjects
			? Object.keys(parts.positionedObjects).length
			: 0,
		namedRanges: parts.namedRanges ? Object.keys(parts.namedRanges).length : 0,
	};
}

export function summarizeStructure(document: Document): DocumentStructure {
	if (document.tabs?.length) {
		let merged: DocumentStructure = {
			headers: 0,
			footers: 0,
			footnotes: 0,
			tables: 0,
			images: 0,
			positionedObjects: 0,
			namedRanges: 0,
		};
		walkTabs(document.tabs, (tab) => {
			const dt = tab.documentTab;
			if (!dt) return;
			const part = summarizeStructureFromParts({
				body: dt.body,
				headers: dt.headers,
				footers: dt.footers,
				footnotes: dt.footnotes,
				inlineObjects: dt.inlineObjects,
				positionedObjects: dt.positionedObjects,
				namedRanges: dt.namedRanges,
			});
			merged = {
				headers: merged.headers + part.headers,
				footers: merged.footers + part.footers,
				footnotes: merged.footnotes + part.footnotes,
				tables: merged.tables + part.tables,
				images: merged.images + part.images,
				positionedObjects: merged.positionedObjects + part.positionedObjects,
				namedRanges: merged.namedRanges + part.namedRanges,
			};
		});
		return merged;
	}

	return summarizeStructureFromParts(document);
}

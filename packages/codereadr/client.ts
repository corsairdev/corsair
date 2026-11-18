import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * CodeREADr serves its whole API from one URL. A form-encoded POST body names
 * the `section` and `action`; the API version in the docs URL is documentation
 * only and is not part of the request.
 * https://developer.codereadr.com/1.0/api/overview/
 */
export const CODEREADR_API_BASE = 'https://api.codereadr.com/api/';

/**
 * The documented limit codes: 111 is the per-minute limit, which resets at the
 * start of every minute, and 113 is the per-day limit, which resets at
 * midnight. Both mark the error as a rate limit; error-handlers.ts retries
 * only 111, because waiting a minute cannot clear a daily limit.
 */
const CODEREADR_RATE_LIMIT_CODES = new Set([111, 113]);

/** A successful call answers `status` 1 and the requested nodes. */
const CODEREADR_STATUS_OK = '1';

// unknown: `record` is untyped until the endpoint schema parses the result.
export type XmlValue = string | XmlRecord | XmlValue[];

export interface XmlNode {
	attributes: Record<string, string>;
	text: string;
	children: XmlRecord;
}

export interface XmlRecord {
	[key: string]: XmlValue;
}

/**
 * Parses the flat, attribute-carrying XML that CodeREADr returns. Every
 * response wraps a single `<xml>` root whose children repeat (`<scan>`,
 * `<answer>`), so a repeated tag becomes an array and one occurrence stays an
 * object. Namespaces, processing instructions and CDATA are not supported
 * because the API sends none.
 */
export function parseCodereadrXml(xml: string): XmlRecord | undefined {
	const root = parseXmlDocument(xml);
	return root;
}

// Reads one element starting at `start` (the index of its `<`). Returns the
// node, the index just past its closing tag, and any text after it.
function readElement(
	xml: string,
	start: number,
): { name: string; node: XmlNode; end: number } | undefined {
	let at = start;
	if (xml[at] !== '<') return undefined;
	at++;
	if (xml[at] === '/') return undefined;

	let name = '';
	while (at < xml.length && !/[\s/>]/.test(xml[at] as string)) {
		name += xml[at];
		at++;
	}
	if (name.length === 0) return undefined;

	const attributes: Record<string, string> = {};
	while (at < xml.length) {
		while (at < xml.length && /\s/.test(xml[at] as string)) at++;
		if (xml[at] === '/' || xml[at] === '>') break;
		let key = '';
		while (at < xml.length && !/[\s=/>]/.test(xml[at] as string)) {
			key += xml[at];
			at++;
		}
		while (at < xml.length && /\s/.test(xml[at] as string)) at++;
		if (xml[at] !== '=') {
			if (key.length > 0) attributes[key] = '';
			if (xml[at] !== '/') continue;
			break;
		}
		at++;
		while (at < xml.length && /\s/.test(xml[at] as string)) at++;
		const quote = xml[at];
		if (quote !== '"' && quote !== "'") return undefined;
		at++;
		let value = '';
		while (at < xml.length && xml[at] !== quote) {
			value += xml[at];
			at++;
		}
		at++;
		if (key.length > 0) attributes[key] = decodeXmlText(value);
	}

	// `<tag/>` has no children and no text.
	if (xml[at] === '/') {
		const close = xml.indexOf('>', at);
		if (close === -1) return undefined;
		return {
			name,
			node: { attributes, text: '', children: {} },
			end: close + 1,
		};
	}
	if (xml[at] !== '>') return undefined;
	at++;

	// A null prototype keeps a tag named `constructor` or `toString` from
	// matching an inherited property, which would make the first occurrence
	// look like a repeat and drop the value.
	const children: XmlRecord = Object.create(null) as XmlRecord;
	let text = '';
	while (at < xml.length) {
		const next = xml.indexOf('<', at);
		if (next === -1) return undefined;
		text += decodeXmlText(xml.slice(at, next));
		at = next;

		// The element's own closing tag.
		if (xml[at + 1] === '/') {
			const close = xml.indexOf('>', at);
			if (close === -1) return undefined;
			const closingName = xml
				.slice(at + 2, close)
				.trim()
				.toLowerCase();
			if (closingName !== name.toLowerCase()) return undefined;
			return {
				name,
				node: { attributes, text, children },
				end: close + 1,
			};
		}

		// A comment or a declaration inside the body is skipped.
		if (xml.startsWith('<!--', at)) {
			const close = xml.indexOf('-->', at);
			if (close === -1) return undefined;
			at = close + 3;
			continue;
		}
		if (xml.startsWith('<?', at) || xml.startsWith('<!', at)) {
			const close = xml.indexOf('>', at);
			if (close === -1) return undefined;
			at = close + 1;
			continue;
		}

		const child = readElement(xml, at);
		if (!child) return undefined;
		at = child.end;
		addChild(children, child.name, nodeToValue(child.node));
	}

	return undefined;
}

// A record with children stays a record; a leaf keeps its text verbatim.
// Attributes are kept under `@` so an id can be read next to the text it
// labels.
//
// Leaf text is not trimmed. A barcode stored as `' A1 '` with `trim_value` off
// must come back exactly as stored, or the caller cannot use it as the key it
// was written under. Whitespace is only used to decide whether a node holds
// meaningful text at all: the text beside child elements is pure formatting.
function nodeToValue(node: XmlNode): XmlValue {
	const hasChildren = Object.keys(node.children).length > 0;
	const hasAttributes = Object.keys(node.attributes).length > 0;
	const hasText = node.text.trim().length > 0;
	if (!hasChildren && !hasAttributes) return node.text;
	const value: XmlRecord = { ...node.children };
	if (hasAttributes) value['@'] = { ...node.attributes };
	if (hasText) value['#text'] = node.text;
	return value;
}

function addChild(record: XmlRecord, name: string, value: XmlValue): void {
	// Only an own key counts as an earlier occurrence. A name such as
	// `constructor` resolves through the prototype chain, and treating that as
	// an existing value would turn the first real occurrence into an array.
	const existing = Object.hasOwn(record, name) ? record[name] : undefined;
	if (existing === undefined) {
		record[name] = value;
		return;
	}
	if (Array.isArray(existing)) {
		existing.push(value);
		return;
	}
	record[name] = [existing, value];
}

/**
 * Decodes character and entity references in one pass. Doing it in sequence
 * with replace() would decode a reference twice: `&#38;amp;` must become
 * `&amp;` (the literal text the provider sent), not `&`.
 */
function decodeXmlText(text: string): string {
	if (!text.includes('&')) return text;
	return text.replace(
		/&(?:#(\d+)|#x([0-9a-f]+)|(lt|gt|quot|apos|amp));/gi,
		(
			match,
			decimal: string | undefined,
			hex: string | undefined,
			named: string | undefined,
		) => {
			if (decimal !== undefined) {
				return String.fromCodePoint(Number.parseInt(decimal, 10));
			}
			if (hex !== undefined) {
				return String.fromCodePoint(Number.parseInt(hex, 16));
			}
			switch (named?.toLowerCase()) {
				case 'lt':
					return '<';
				case 'gt':
					return '>';
				case 'quot':
					return '"';
				case 'apos':
					return "'";
				case 'amp':
					return '&';
				default:
					return match;
			}
		},
	);
}

function parseXmlDocument(xml: string): XmlRecord | undefined {
	let at = 0;
	while (at < xml.length) {
		const next = xml.indexOf('<', at);
		if (next === -1) return undefined;
		if (xml.startsWith('<?', next) || xml.startsWith('<!', next)) {
			const close = xml.indexOf('>', next);
			if (close === -1) return undefined;
			at = close + 1;
			continue;
		}
		const element = readElement(xml, next);
		if (!element) return undefined;
		const value = nodeToValue(element.node);
		// The root is `<xml>`; its children are the payload.
		if (element.name.toLowerCase() === 'xml' && typeof value === 'object') {
			return value as XmlRecord;
		}
		return { [element.name]: value };
	}
	return undefined;
}

/**
 * CodeREADr answers HTTP 200 for a failed call and reports the failure in the
 * body: `<status>0</status>` plus an `<error code="101">` node. A call that
 * only checked the status code would treat every error as success.
 * https://developer.codereadr.com/1.0/reference/error-codes/
 */
export class CodereadrAPIError extends Error {
	/** The numeric error code from `<error code>`, when the body carried one. */
	readonly code?: number;
	/** The HTTP status; only set when the transport itself failed. */
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when the server sent one. */
	readonly retryAfter?: number;
	/**
	 * True when the request got no answer: a connection reset, DNS failure,
	 * timeout or abort. The outcome is unknown. The provider may have applied
	 * the call before the response was lost, so only replay it when
	 * `replaySafe` is also true.
	 */
	readonly transport: boolean;
	/**
	 * True when repeating the request cannot apply the operation twice. Every
	 * call is a POST here, so the method says nothing about replay safety.
	 */
	readonly replaySafe: boolean;
	/**
	 * True for codes 111 and 113, the per-minute and per-day API limits, and
	 * for an HTTP 429. The documented limits arrive in the body with a 200, but
	 * a gateway in front of the API can answer 429 before CodeREADr sees the
	 * call, so both forms have to be recognized.
	 */
	readonly isRateLimit: boolean;

	constructor(
		message: string,
		options: {
			code?: number;
			status?: number;
			retryAfter?: number;
			transport?: boolean;
			replaySafe?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'CodereadrAPIError';
		this.code = options.code;
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.transport = options.transport ?? false;
		this.replaySafe = options.replaySafe ?? false;
		this.isRateLimit =
			options.status === 429 ||
			(options.code !== undefined &&
				CODEREADR_RATE_LIMIT_CODES.has(options.code));
	}
}

/** Reads the numeric and text halves of an `<error>` node. */
function readErrorNode(body: XmlRecord | undefined): {
	code?: number;
	text?: string;
} {
	const error = body?.error;
	if (typeof error !== 'object' || Array.isArray(error)) return {};
	const codeText = typeof error['#text'] === 'string' ? error['#text'] : '';
	const attributes = error['@'];
	const rawCode =
		typeof attributes === 'object' && !Array.isArray(attributes)
			? attributes.code
			: undefined;
	const code =
		typeof rawCode === 'string' && rawCode.length > 0
			? Number.parseInt(rawCode, 10)
			: undefined;
	return {
		code: Number.isNaN(code) ? undefined : code,
		text: codeText.length > 0 ? codeText : undefined,
	};
}

// unknown: the parameter object is built per endpoint, so the values arrive
// untyped and are serialized with String().
export type CodereadrParams = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Sends one `section`/`action` call and returns the parsed `<xml>` payload.
 * The key travels in the form body, never the query string: the docs say GET
 * is disabled by default and that a key in a URL is not safe.
 */
export async function makeCodereadrRequest(
	apiKey: string,
	params: CodereadrParams,
	options: {
		/**
		 * True for reads, and for writes the provider documents as upserts.
		 * A transient failure on an unsafe call is not replayed, because the
		 * write may already have been applied.
		 */
		replaySafe?: boolean;
	} = {},
): Promise<XmlRecord> {
	const form = new URLSearchParams();
	form.append('api_key', apiKey);
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined) continue;
		form.append(key, String(value));
	}

	const config: OpenAPIConfig = {
		BASE: CODEREADR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'text/xml' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '',
		body: form.toString(),
		mediaType: 'application/x-www-form-urlencoded',
	};

	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions, {
			// error-handlers.ts owns retries; the client makes one attempt.
			rateLimitConfig: NO_RETRY,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is dropped on purpose. ApiError keeps the request it was
			// built from, and this request's body is the form carrying `api_key`
			// and, on user writes, the new `password`. Attaching it would put both
			// into anything that stringifies the error, including app logs. Only
			// the parts a caller can act on are copied across.
			throw new CodereadrAPIError(
				`CodeREADr HTTP ${error.status}: ${error.statusText || error.message}`,
				{
					status: error.status,
					retryAfter: error.retryAfter,
					replaySafe: options.replaySafe,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new CodereadrAPIError(error.message, {
				replaySafe: options.replaySafe,
				transport: true,
				// This error came from fetch itself, so it never held the form.
				cause: error,
			});
		}
		throw new CodereadrAPIError('Unknown CodeREADr error', {
			replaySafe: options.replaySafe,
		});
	}

	const text = typeof raw === 'string' ? raw : '';
	const parsed = parseCodereadrXml(text);
	if (!parsed) {
		throw new CodereadrAPIError(
			'CodeREADr returned a response that is not XML',
			{ replaySafe: options.replaySafe },
		);
	}

	// A response only counts as success when it says so. A 200 whose body is
	// something else entirely, such as a proxy's HTML error page, parses to a
	// record with no `status`, and treating that as success would let a delete
	// report `success: true` for a call the provider never processed.
	const status = parsed.status;
	if (status !== CODEREADR_STATUS_OK) {
		const { code, text: message } = readErrorNode(parsed);
		if (code === undefined && typeof status !== 'string') {
			throw new CodereadrAPIError(
				'CodeREADr returned a response without a status',
				{ replaySafe: options.replaySafe },
			);
		}
		const label = code !== undefined ? ` (code ${code})` : '';
		throw new CodereadrAPIError(
			`CodeREADr error${label}: ${message ?? 'the call failed'}`,
			{ code, replaySafe: options.replaySafe },
		);
	}

	return parsed;
}

// One attempt on every request: retries belong to error-handlers.ts.
//
// `retryAfter` still has to be listed here even though no retry happens. The
// request layer reads the header through this config before it raises the
// error, and an empty `headerNames` would leave `retryAfter` unset, so the
// handler would never see the server's requested wait.
const NO_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class WorldNewsApiError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'WorldNewsApiError';
	}
}

export type WorldNewsQuotaInfo = {
	quotaRequest?: number;
	quotaUsed?: number;
	quotaLeft?: number;
};

export type WorldNewsClientResponse<T> = {
	data: T;
	quota?: WorldNewsQuotaInfo;
};

const WORLD_NEWS_API_BASE = 'https://api.worldnewsapi.com';

/**
 * Validates whether a URL is a valid public HTTP/HTTPS URL and guards against SSRF.
 */
export function validatePublicUrl(rawUrl: string): URL {
	if (!rawUrl || typeof rawUrl !== 'string') {
		throw new WorldNewsApiError(
			'Invalid URL provided: URL must be a non-empty string',
			400,
			'INVALID_URL',
		);
	}

	let parsed: URL;
	try {
		parsed = new URL(rawUrl);
	} catch {
		throw new WorldNewsApiError(
			`Malformed URL: "${rawUrl}"`,
			400,
			'MALFORMED_URL',
		);
	}

	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		throw new WorldNewsApiError(
			`Unsupported protocol: "${parsed.protocol}". Only http and https URLs are permitted.`,
			400,
			'INVALID_PROTOCOL',
		);
	}

	const hostname = parsed.hostname.toLowerCase();

	// Guard against loopback and private network targets (SSRF protection)
	const isLocalhost =
		hostname === 'localhost' ||
		hostname === '127.0.0.1' ||
		hostname === '::1' ||
		hostname === '0.0.0.0' ||
		hostname.endsWith('.localhost') ||
		hostname.endsWith('.local') ||
		hostname.endsWith('.internal');

	const isPrivateIp =
		/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
		/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
		/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
		/^169\.254\.\d{1,3}\.\d{1,3}$/.test(hostname);

	if (isLocalhost || isPrivateIp) {
		throw new WorldNewsApiError(
			`Access to private or local network hosts (${hostname}) is not permitted.`,
			400,
			'SSRF_PROTECTED',
		);
	}

	return parsed;
}

/**
 * Safe XML entity decoder
 */
function decodeXmlEntities(text: string): string {
	return text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/&#(\d+);/g, (_, dec) => {
			const code = parseInt(dec, 10);
			return Number.isNaN(code) ? '' : String.fromCharCode(code);
		})
		.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
			const code = parseInt(hex, 16);
			return Number.isNaN(code) ? '' : String.fromCharCode(code);
		});
}

function stripCdata(text: string): string {
	return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

function extractTagValue(
	xml: string | undefined,
	tag: string,
): string | undefined {
	if (!xml) return undefined;
	const regex = new RegExp(
		`<(?:[a-zA-Z0-9_-]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_-]+:)?${tag}>`,
		'i',
	);
	const match = xml.match(regex);
	if (!match || match[1] === undefined) return undefined;
	return decodeXmlEntities(stripCdata(match[1].trim()));
}

export type ParsedRssItem = {
	title?: string;
	link?: string;
	guid?: string;
	pubDate?: string;
	description?: string;
	author?: string;
	category?: string;
	enclosureUrl?: string;
};

export type ParsedRssFeed = {
	title?: string;
	link?: string;
	description?: string;
	pubDate?: string;
	lastBuildDate?: string;
	language?: string;
	items: ParsedRssItem[];
	rawXml: string;
};

/**
 * Parses RSS 2.0 XML safely without external entity expansion (XXE-safe).
 */
export function parseRssFeedXml(xmlContent: string): ParsedRssFeed {
	if (!xmlContent || typeof xmlContent !== 'string') {
		throw new WorldNewsApiError(
			'Empty or invalid RSS feed content',
			422,
			'MALFORMED_RSS',
		);
	}

	// Extract channel block
	const channelMatch = xmlContent.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
	const channelXml = channelMatch ? (channelMatch[1] ?? '') : xmlContent;

	const title = extractTagValue(channelXml, 'title');
	const link = extractTagValue(channelXml, 'link');
	const description = extractTagValue(channelXml, 'description');
	const pubDate = extractTagValue(channelXml, 'pubDate');
	const lastBuildDate = extractTagValue(channelXml, 'lastBuildDate');
	const language = extractTagValue(channelXml, 'language');

	// Extract all <item> blocks
	const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
	const items: ParsedRssItem[] = [];

	let match: RegExpExecArray | null;
	while ((match = itemRegex.exec(channelXml)) !== null) {
		const itemXml = match[1] ?? '';
		const itemTitle = extractTagValue(itemXml, 'title');
		const itemLink = extractTagValue(itemXml, 'link');
		const itemGuid = extractTagValue(itemXml, 'guid');
		const itemPubDate = extractTagValue(itemXml, 'pubDate');
		const itemDesc = extractTagValue(itemXml, 'description');
		const itemAuthor =
			extractTagValue(itemXml, 'author') ?? extractTagValue(itemXml, 'creator');
		const itemCategory = extractTagValue(itemXml, 'category');

		// Check enclosure
		const enclosureMatch = itemXml.match(
			/<enclosure[^>]*url=["']([^"']+)["'][^>]*\/?>/i,
		);
		const enclosureUrl = enclosureMatch ? enclosureMatch[1] : undefined;

		items.push({
			title: itemTitle,
			link: itemLink,
			guid: itemGuid,
			pubDate: itemPubDate,
			description: itemDesc,
			author: itemAuthor,
			category: itemCategory,
			enclosureUrl,
		});
	}

	return {
		title,
		link,
		description,
		pubDate,
		lastBuildDate,
		language,
		items,
		rawXml: xmlContent,
	};
}

export type WorldNewsRequestOptions = {
	method?: 'GET' | 'POST';
	query?: Record<string, string | number | boolean | undefined>;
	timeout?: number;
};

/**
 * Performs an authenticated HTTP request to the World News API.
 * Uses x-api-key header for production authentication.
 */
export async function makeWorldNewsApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: WorldNewsRequestOptions = {},
): Promise<T> {
	if (!apiKey || !apiKey.trim()) {
		throw new WorldNewsApiError(
			'World News API key is required. Set WORLD_NEWS_API_KEY environment variable or pass key option.',
			401,
			'AUTH_MISSING',
		);
	}

	const { method = 'GET', query, timeout = 25_000 } = options;

	const config: OpenAPIConfig = {
		BASE: WORLD_NEWS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeout,
		TOKEN: undefined,
		HEADERS: {
			'x-api-key': apiKey.trim(),
			Accept: endpoint.endsWith('.rss')
				? 'application/xml, text/xml, application/rss+xml'
				: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions);
}

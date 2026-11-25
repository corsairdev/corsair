// IndexNow tells Bing, Yandex and the engines that read from them (ChatGPT
// search among them) that a page changed, so they recrawl it now instead of on
// their own schedule. The key is public by design: search engines check that
// https://corsair.dev/<key>.txt returns it, which proves we own the host.
// Spec: https://www.indexnow.org/documentation

export const INDEXNOW_KEY = 'b232666b394cfd668c5a69d411176e7c';
export const INDEXNOW_HOST = 'corsair.dev';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/** The protocol accepts at most 10,000 URLs in one request. */
export const INDEXNOW_MAX_URLS = 10_000;

export type IndexNowPayload = {
	host: string;
	key: string;
	keyLocation: string;
	urlList: string[];
};

/**
 * Keeps only https URLs on corsair.dev (a request may name one host only) and
 * drops duplicates and fragments. No cap here: callers batch the list.
 */
export function indexNowUrls(urls: Iterable<string>): string[] {
	const seen = new Set<string>();
	for (const raw of urls) {
		let url: URL;
		try {
			url = new URL(raw.trim());
		} catch {
			continue;
		}
		if (url.protocol !== 'https:' || url.host !== INDEXNOW_HOST) continue;
		url.hash = '';
		seen.add(url.toString());
	}
	return [...seen];
}

export function indexNowPayload(urls: Iterable<string>): IndexNowPayload {
	return {
		host: INDEXNOW_HOST,
		key: INDEXNOW_KEY,
		keyLocation: INDEXNOW_KEY_LOCATION,
		// One request takes at most INDEXNOW_MAX_URLS; the rest are dropped.
		urlList: indexNowUrls(urls).slice(0, INDEXNOW_MAX_URLS),
	};
}

export type IndexNowResult = { submitted: number; status: number | null };

/**
 * Sends the URLs to IndexNow. 200 and 202 mean accepted. Never throws: a failed
 * ping only means the engines find the change on their next crawl.
 */
export async function submitToIndexNow(
	urls: Iterable<string>,
	fetchImpl: typeof fetch = fetch,
): Promise<IndexNowResult> {
	const payload = indexNowPayload(urls);
	if (payload.urlList.length === 0) return { submitted: 0, status: null };

	try {
		const response = await fetchImpl(INDEXNOW_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify(payload),
		});
		return { submitted: payload.urlList.length, status: response.status };
	} catch {
		return { submitted: payload.urlList.length, status: null };
	}
}

/** The pages that change when a blog post is published or edited. */
export function blogPostIndexNowUrls(slug: string | undefined): string[] {
	const urls = [`https://${INDEXNOW_HOST}/blog`];
	if (slug)
		urls.unshift(`https://${INDEXNOW_HOST}/blog/${encodeURIComponent(slug)}`);
	return urls;
}

const XML_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
};

/** The <loc> entries of a sitemap.xml document, XML references decoded once. */
export function sitemapLocs(xml: string): string[] {
	return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) =>
		match[1].replace(
			/&(amp|lt|gt|quot|apos);/g,
			(_, name: string) => XML_ENTITIES[name],
		),
	);
}

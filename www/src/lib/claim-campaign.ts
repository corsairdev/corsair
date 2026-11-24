// The campaign tags a visitor arrived with (?utm_source=... on a video's or a
// post's link), ported from lug.dev (hub apps/lug/src/lib/campaign.ts). Hub
// records them at sign-up from its login URL, so the hand-off link carries
// them, like ph_did. The /start flow rewrites its own query as it moves between
// steps, so the tags are saved before any script can touch the URL
// (CAMPAIGN_INIT runs inline, before hydration) and read back at the click.

export const CAMPAIGN_KEYS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
] as const;

export type Campaign = Partial<Record<(typeof CAMPAIGN_KEYS)[number], string>>;

export const CAMPAIGN_STORE_KEY = 'corsair:campaign';

// Hub clips each value to 200 characters too.
const MAX_VALUE = 200;
// A tagged visit still counts for a sign-up a week later, in another tab.
export const CAMPAIGN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// `unknown`: values come from a URL or from storage that anyone can edit, so
// the type is only known after the typeof check.
function clip(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	// Cutting at 200 can split an emoji; a lone half makes encodeURIComponent throw.
	return trimmed
		? trimmed.slice(0, MAX_VALUE).replace(/[\uD800-\uDBFF]$/, '')
		: undefined;
}

const isEmpty = (c: Campaign) => Object.keys(c).length === 0;

/** The tags in a query string. */
export function campaignFrom(search: string): Campaign {
	const params = new URLSearchParams(search);
	const campaign: Campaign = {};
	for (const key of CAMPAIGN_KEYS) {
		const value = clip(params.get(key));
		if (value) campaign[key] = value;
	}
	return campaign;
}

/** The tags CAMPAIGN_INIT saved, or none when missing, garbled or older than a week. */
export function storedCampaign(raw: string | null, now: number): Campaign {
	if (!raw) return {};
	// `unknown`: parsed from localStorage, which anyone can edit; checked below.
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return {};
	}
	if (!parsed || typeof parsed !== 'object') return {};
	// Unchecked fields from storage; each is tested before use.
	const { c, at } = parsed as { c?: unknown; at?: unknown };
	if (
		typeof at !== 'number' ||
		!(now - at >= 0 && now - at <= CAMPAIGN_MAX_AGE_MS)
	) {
		return {};
	}
	if (!c || typeof c !== 'object') return {};
	const campaign: Campaign = {};
	for (const key of CAMPAIGN_KEYS) {
		const value = clip((c as Record<string, unknown>)[key]);
		if (value) campaign[key] = value;
	}
	return campaign;
}

/**
 * What the hand-off carries: tags on the page's own URL win, else the last
 * tagged visit's from storage, else the tags this page opened with (`landing`),
 * which still count when storage is blocked and the steps have rewritten the URL.
 */
export function handoffCampaign(
	search: string,
	raw: string | null,
	now: number,
	landing: Campaign = {},
): Campaign {
	const here = campaignFrom(search);
	if (!isEmpty(here)) return here;
	const stored = storedCampaign(raw, now);
	return isEmpty(stored) ? landing : stored;
}

/** `&utm_source=...` for each tag, in a fixed order, ready to append to a URL that has a query. */
export function campaignParams(campaign: Campaign | undefined): string {
	if (!campaign) return '';
	let out = '';
	for (const key of CAMPAIGN_KEYS) {
		const value = clip(campaign[key]);
		if (value) out += `&${key}=${encodeURIComponent(value)}`;
	}
	return out;
}

// The tags this page opened with, read when the module loads: before the
// /start steps rewrite the URL.
const LANDING: Campaign =
	typeof window === 'undefined' ? {} : campaignFrom(window.location.search);

/** In the browser, at the click. */
export function currentCampaign(): Campaign {
	if (typeof window === 'undefined') return {};
	let raw: string | null = null;
	try {
		raw = window.localStorage.getItem(CAMPAIGN_STORE_KEY);
	} catch {
		// Storage blocked (private mode, a strict setting): the URL's own tags still count.
	}
	return handoffCampaign(window.location.search, raw, Date.now(), LANDING);
}

/** Inline, before hydration: saves the URL's tags. An untagged visit leaves the last tagged one in place. */
export const CAMPAIGN_INIT =
	`try{var q=new URLSearchParams(location.search),c={},n=0;` +
	`${JSON.stringify(CAMPAIGN_KEYS)}.forEach(function(k){var v=(q.get(k)||"").trim().slice(0,${MAX_VALUE}).replace(/[\\uD800-\\uDBFF]$/,"");if(v){c[k]=v;n++}});` +
	`if(n)localStorage.setItem(${JSON.stringify(CAMPAIGN_STORE_KEY)},JSON.stringify({c:c,at:Date.now()}))}catch(e){}`;

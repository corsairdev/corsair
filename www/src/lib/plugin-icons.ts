/**
 * Which file `/plugin-icons/<id>` serves. Icons live in `explorer/icons`
 * (written by `pnpm fetch:plugin-icons`): `<id>.svg` when the source is
 * vector, `<id>.png` always, and `<id>.dark.png` for marks that are largely
 * black and would vanish on a dark surface.
 */

export const PLUGIN_ID_PATTERN = /^[a-z0-9]+$/;

export type IconTheme = 'light' | 'dark';
export type IconFormat = 'auto' | 'png';

export type IconQuery = { theme: IconTheme; format: IconFormat };

export function parseIconQuery(params: URLSearchParams): IconQuery {
	return {
		theme: params.get('theme') === 'dark' ? 'dark' : 'light',
		format: params.get('format') === 'png' ? 'png' : 'auto',
	};
}

export type IconFile = { file: string; type: 'image/svg+xml' | 'image/png' };

/**
 * Prefer the dark variant on a dark surface, then vector, then PNG.
 * `format=png` is for clients that can't draw SVG (email, some unfurlers).
 */
export function pickIconFile(
	id: string,
	query: IconQuery,
	exists: (file: string) => boolean,
): IconFile | null {
	const candidates: IconFile[] = [];
	if (query.theme === 'dark') {
		candidates.push({ file: `${id}.dark.png`, type: 'image/png' });
	}
	if (query.format === 'auto') {
		candidates.push({ file: `${id}.svg`, type: 'image/svg+xml' });
	}
	candidates.push({ file: `${id}.png`, type: 'image/png' });
	return candidates.find((c) => exists(c.file)) ?? null;
}

/**
 * What to answer for a catalog plugin with no icon file: the placeholder,
 * except to a client that asked for PNG because it can't draw SVG; that one
 * gets a 404 and shows its own fallback.
 */
export function missingIconResponse(
	query: IconQuery,
): 'placeholder' | 'not-found' {
	return query.format === 'png' ? 'not-found' : 'placeholder';
}

/**
 * Shown for a catalog plugin whose icon hasn't been fetched yet: a Corsair
 * blue tile with the plugin's initial, so a missing icon is obvious rather
 * than a broken image.
 */
export function placeholderSvg(id: string): string {
	const initial = (id.match(/[a-z]/)?.[0] ?? id[0] ?? '?').toUpperCase();
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="#4a38f5"/><text x="32" y="42" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="30" font-weight="600" fill="#fff">${initial}</text></svg>`;
}

const ONE_DAY = 86_400;

export const ICON_CACHE_CONTROL =
	// Not immutable: an icon can be replaced under the same URL, and a
	// year-long immutable copy would keep the old mark in every browser.
	`public, max-age=${ONE_DAY}, stale-while-revalidate=${7 * ONE_DAY}`;

/** Short, so the real icon shows up soon after it is fetched. */
export const PLACEHOLDER_CACHE_CONTROL = 'public, max-age=300';

/**
 * Third-party SVG is sanitized when it is fetched; this stops anything that
 * slipped through from running or loading if someone opens an icon URL
 * directly on corsair.dev.
 */
export const SVG_SECURITY_HEADERS = {
	'Content-Security-Policy':
		"default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox",
	'X-Content-Type-Options': 'nosniff',
} as const;

// Sends every URL in the live sitemap to IndexNow. Run it once after the key
// file is live on corsair.dev, and after a change that touches many pages
// (an integrations catalog sync, a site-wide copy change):
//
//   pnpm --filter @corsair/www indexnow:sitemap            # submit
//   pnpm --filter @corsair/www indexnow:sitemap --dry-run  # count only

import {
	INDEXNOW_KEY,
	INDEXNOW_KEY_LOCATION,
	INDEXNOW_MAX_URLS,
	indexNowUrls,
	sitemapLocs,
	submitToIndexNow,
} from '../src/lib/indexnow';

const SITEMAP_URL = 'https://corsair.dev/sitemap.xml';

async function main() {
	const dryRun = process.argv.includes('--dry-run');

	const keyFile = await fetch(INDEXNOW_KEY_LOCATION);
	const keyText = keyFile.ok ? (await keyFile.text()).trim() : '';
	if (keyText !== INDEXNOW_KEY) {
		throw new Error(
			`${INDEXNOW_KEY_LOCATION} does not return the key yet (status ${keyFile.status}); deploy first.`,
		);
	}

	const sitemap = await fetch(SITEMAP_URL);
	if (!sitemap.ok) throw new Error(`${SITEMAP_URL} returned ${sitemap.status}`);
	const urls = indexNowUrls(sitemapLocs(await sitemap.text()));
	console.log(`${urls.length} URLs in ${SITEMAP_URL}`);
	if (dryRun) return;

	for (let start = 0; start < urls.length; start += INDEXNOW_MAX_URLS) {
		const batch = urls.slice(start, start + INDEXNOW_MAX_URLS);
		const result = await submitToIndexNow(batch);
		console.log(
			`sent ${result.submitted}, IndexNow answered ${result.status ?? 'no response'}`,
		);
		if (result.status !== 200 && result.status !== 202) process.exitCode = 1;
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});

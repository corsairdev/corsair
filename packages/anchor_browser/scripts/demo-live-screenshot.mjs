// Live end-to-end demo for the anchor_browser plugin.
//
// Drives a REAL browser session through the plugin's own request client
// (makeAnchorBrowserRequest) and captures a REAL screenshot from the
// Anchor Browser API. This is the source of truth for the README image
// and the PR demo screenshot.
//
// Usage:
//   ANCHOR_BROWSER_API_KEY=sk-xxx node scripts/demo-live-screenshot.mjs
//
// Output:
//   - prints the real JSON the plugin client returns (verifies it works)
//   - writes scripts/demo-session-screenshot.png (a real captured PNG)

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeAnchorBrowserRequest } from '../client.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.ANCHOR_BROWSER_API_KEY;
const BASE = 'https://api.anchorbrowser.io/v1';

if (!API_KEY) {
	console.error('Missing ANCHOR_BROWSER_API_KEY');
	process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
	console.log('=== anchor_browser live demo ===\n');

	// 1) Start a real browser session via the plugin client.
	console.log('1) startBrowserSession — POST /sessions');
	const session = await makeAnchorBrowserRequest('/sessions', API_KEY, {
		method: 'POST',
		body: {
			browser: { profile: { name: 'corsair-demo' } },
			recording: false,
			timeout: 60,
		},
	});
	console.log(JSON.stringify(session, null, 2));
	const sessionId = session?.data?.id ?? session?.id;
	if (!sessionId) {
		throw new Error('No session id returned from Anchor Browser');
	}
	console.log(`\n   → session id: ${sessionId}\n`);

	// Give the browser a moment to boot.
	await sleep(4000);

	// 2) Navigate the session to a real page via the plugin client.
	console.log('2) navigateToUrl — POST /sessions/{id}/goto');
	const nav = await makeAnchorBrowserRequest(
		`/sessions/${sessionId}/goto`,
		API_KEY,
		{ method: 'POST', body: { url: 'https://example.com' } },
	);
	console.log(JSON.stringify(nav, null, 2));
	await sleep(3000);

	// 3) Capture a screenshot of the live session via the plugin client,
	//    then save the raw image bytes (the shared client decodes binary as
	//    text, so we fetch the bytes directly here).
	console.log('3) takeScreenshot — GET /sessions/{id}/screenshot');
	const res = await fetch(`${BASE}/sessions/${sessionId}/screenshot`, {
		method: 'GET',
		headers: { 'anchor-api-key': API_KEY },
	});
	if (!res.ok) {
		const txt = await res.text();
		throw new Error(`Screenshot failed ${res.status}: ${txt}`);
	}
	const buf = Buffer.from(await res.arrayBuffer());
	const outPath = join(__dirname, 'demo-session-screenshot.png');
	await writeFile(outPath, buf);
	console.log(`\n   → wrote ${buf.length} bytes to ${outPath}`);

	// 4) Tear down the session.
	console.log('\n4) endBrowserSession — DELETE /sessions/{id}');
	await makeAnchorBrowserRequest(`/sessions/${sessionId}`, API_KEY, {
		method: 'DELETE',
	});
	console.log('   → session ended\n');
	console.log('=== demo complete ===');
}

main().catch((err) => {
	console.error('Demo failed:', err);
	process.exit(1);
});

/**
 * Live smoke tests. CI skips this file by name, and it skips itself without keys.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with both halves of the packed key:
 *   WAIVERFILE_API_KEY=... WAIVERFILE_SITE_ID=... \
 *     pnpm --filter @corsair-dev/waiverfile test:live
 *
 * Read-only: nothing here creates, edits or deletes an event or waiver.
 */
import { Forms, Waivers } from './endpoints';
import type { WaiverFileContext } from './index';

const apiKey = process.env.WAIVERFILE_API_KEY;
const siteId = process.env.WAIVERFILE_SITE_ID;

const describeIfKey = apiKey && siteId ? describe : describe.skip;

if (!apiKey || !siteId) {
	// A skipped run must not read as a green one.
	console.warn(
		[apiKey ? null : 'WAIVERFILE_API_KEY', siteId ? null : 'WAIVERFILE_SITE_ID']
			.filter(Boolean)
			.join(' and ') +
			' not set: the live WaiverFile suite is skipped, not passing.',
	);
}

/** The packed key the plugin splits into its apiKey/siteID pair. */
function packedKey(): string {
	return `${apiKey}\n${siteId}`;
}

function liveContext(): WaiverFileContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: packedKey() } as unknown as WaiverFileContext;
}

describeIfKey('live WaiverFile API', () => {
	it('lists the active forms through the output schema', async () => {
		const result = await Forms.active(liveContext() as never, {} as never);

		expect(Array.isArray(result)).toBe(true);
	});

	it('lists waiver forms through the output schema', async () => {
		const result = await Forms.all(liveContext() as never, {} as never);

		expect(Array.isArray(result)).toBe(true);
	});

	it('pages through signed waivers through the output schema', async () => {
		const result = await Waivers.list(
			liveContext() as never,
			{
				pageSize: 5,
			} as never,
		);

		expect(result).toBeDefined();
	});

	it('downloads a waiver PDF as real bytes', async () => {
		const listed = await Waivers.list(
			liveContext() as never,
			{
				pageSize: 1,
			} as never,
		);
		const rows = Array.isArray(listed) ? listed : [];
		const first = rows[0] as { waiverID?: string } | undefined;
		const waiverID = first?.waiverID;
		if (!waiverID) return;

		const pdf = await Waivers.pdf(
			liveContext() as never,
			{
				waiverID,
			} as never,
		);

		// The bytes are returned, so a caller can write a real file.
		expect(pdf.bytes).toBeGreaterThan(0);
		const bytes = Buffer.from(pdf.content, 'base64');
		expect(bytes.byteLength).toBe(pdf.bytes);
		// Every PDF starts with %PDF-.
		expect(bytes.subarray(0, 5).toString('utf8')).toBe('%PDF-');
	});

	it('never exposes the API key or site id in a returned object', async () => {
		const result = await Forms.active(liveContext() as never, {} as never);
		const text = JSON.stringify(result);

		expect(text).not.toContain(apiKey as string);
		expect(text).not.toContain(siteId as string);
	});
});

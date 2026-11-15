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
import { Forms, Site, Waivers } from './endpoints';
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

function liveContext(): WaiverFileContext {
	// The endpoints read only `key`; a real context also carries the database,
	// hooks and key manager, so the fixture is cast at this boundary.
	return { key: `${apiKey}\n${siteId}` } as WaiverFileContext;
}

/** The last 60 days, in the offset-free UTC format WaiverFile asks for. */
function lastSixtyDays() {
	const end = new Date();
	const start = new Date(end.getTime() - 60 * 24 * 60 * 60 * 1000);
	const format = (date: Date) => date.toISOString().slice(0, 19);
	return { startDate: format(start), endDate: format(end) };
}

describeIfKey('live WaiverFile API', () => {
	it('pings with the packed key', async () => {
		const result = await Site.ping(liveContext(), {});

		expect(result.Message).toBe('Service online');
	});

	it('lists the active forms through the output schema', async () => {
		const result = await Forms.active(liveContext(), {});

		expect(Array.isArray(result.WaiverForms)).toBe(true);
	});

	it('lists every form through the output schema', async () => {
		const result = await Forms.all(liveContext(), {});

		expect(Array.isArray(result.WaiverForms)).toBe(true);
	});

	it('pages through signed waivers through the output schema', async () => {
		const result = await Waivers.listLite(liveContext(), {
			...lastSixtyDays(),
			pageIndex: 0,
			pageSize: 10,
		});

		expect(Array.isArray(result.Waivers)).toBe(true);
	});

	it('downloads a waiver PDF as real bytes', async () => {
		const listed = await Waivers.listLite(liveContext(), {
			...lastSixtyDays(),
			pageIndex: 0,
			pageSize: 10,
		});
		const waiverID = listed.Waivers?.[0]?.WaiverID;
		if (!waiverID) {
			throw new Error(
				'No signed waiver in the last 60 days: sign one on the test site to run the PDF check.',
			);
		}

		const pdf = await Waivers.pdf(liveContext(), { waiverID });

		expect(pdf.bytes).toBeGreaterThan(0);
		const bytes = Buffer.from(pdf.content, 'base64');
		expect(bytes.byteLength).toBe(pdf.bytes);
		// Every PDF starts with %PDF-.
		expect(bytes.subarray(0, 5).toString('utf8')).toBe('%PDF-');
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Forms.active(liveContext(), {});

		// A boolean, so a failure cannot print the key it found.
		expect(JSON.stringify(result).includes(apiKey as string)).toBe(false);
	});
});

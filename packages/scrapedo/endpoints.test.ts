import { ScrapeDoEndpointInputSchemas as Inputs } from './endpoints/types';

/**
 * Input validation. Every rule the provider documents is pinned here with a
 * rejection, because a value the API refuses still costs a round trip and, for
 * a 400 the provider counts as a target rejection, a credit.
 */
describe('scrape input validation', () => {
	const base = { url: 'https://example.com/' };

	it('rejects a non-http URL scheme', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ url: 'ftp://example.com/' }),
		).toThrow(/scheme/);
	});

	it('rejects a missing url', () => {
		expect(() => Inputs.scrapeHtml.parse({})).toThrow();
	});

	it('rejects a timeout outside the documented 5000-120000 ms', () => {
		// The live API answers 400 naming these exact bounds.
		expect(() => Inputs.scrapeHtml.parse({ ...base, timeout: 4999 })).toThrow();
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, timeout: 120_001 }),
		).toThrow();
		expect(Inputs.scrapeHtml.parse({ ...base, timeout: 5000 }).timeout).toBe(
			5000,
		);
		expect(Inputs.scrapeHtml.parse({ ...base, timeout: 120_000 }).timeout).toBe(
			120_000,
		);
	});

	it('rejects a timeout that is not a whole number', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, timeout: 10_000.5 }),
		).toThrow();
	});

	it('rejects an unknown device', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, device: 'watch' }),
		).toThrow();
	});

	it('rejects an unknown output format', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, output: 'screenshot' }),
		).toThrow();
	});

	it('rejects a proxy country that is not two letters', () => {
		expect(() => Inputs.scrapeHtml.parse({ ...base, geoCode: 'USA' })).toThrow(
			/two-letter/,
		);
	});

	it('rejects a render-only option with render: false', () => {
		const result = Inputs.scrapeHtml.safeParse({
			...base,
			render: false,
			waitSelector: '#app',
		});
		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected a rejection');
		expect(result.error.issues[0]?.path).toEqual(['waitSelector']);
	});

	it('rejects every render-only option under render: false', () => {
		for (const [key, value] of [
			['waitUntil', 'load'],
			['customWait', 500],
			['waitSelector', '#x'],
			['blockResources', true],
		] as const) {
			const result = Inputs.scrapeHtml.safeParse({
				...base,
				render: false,
				[key]: value,
			});
			expect({ key, success: result.success }).toEqual({
				key,
				success: false,
			});
		}
	});

	it('accepts a render-only option when render is unset or true', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, waitSelector: '#app' }),
		).not.toThrow();
		expect(() =>
			Inputs.scrapeHtml.parse({
				...base,
				render: true,
				waitSelector: '#app',
			}),
		).not.toThrow();
	});
});

describe('screenshot input validation', () => {
	it('requires render, because the API refuses a screenshot without it', () => {
		expect(() =>
			Inputs.scrapeScreenshot.parse({ url: 'https://example.com/' }),
		).toThrow();
		expect(() =>
			Inputs.scrapeScreenshot.parse({
				url: 'https://example.com/',
				render: false,
			}),
		).toThrow();
	});

	it('accepts render: true', () => {
		expect(() =>
			Inputs.scrapeScreenshot.parse({
				url: 'https://example.com/',
				render: true,
			}),
		).not.toThrow();
	});

	it('rejects fullPage together with an area', () => {
		const result = Inputs.scrapeScreenshot.safeParse({
			url: 'https://example.com/',
			render: true,
			fullPage: true,
			area: { x: 0, y: 0, width: 10, height: 10 },
		});
		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected a rejection');
		expect(result.error.issues[0]?.path).toEqual(['area']);
	});

	it('rejects an area with a non-positive width', () => {
		expect(() =>
			Inputs.scrapeScreenshot.parse({
				url: 'https://example.com/',
				render: true,
				area: { x: 0, y: 0, width: 0, height: 10 },
			}),
		).toThrow();
	});
});

describe('job input validation', () => {
	it('requires at least one target', () => {
		expect(() => Inputs.jobsStart.parse({ targets: [] })).toThrow();
	});

	it('rejects a target that is not an http URL', () => {
		expect(() => Inputs.jobsStart.parse({ targets: ['not-a-url'] })).toThrow();
	});

	it('rejects a job id or task id that is empty', () => {
		expect(() => Inputs.jobsGet.parse({ jobId: '' })).toThrow();
		expect(() => Inputs.jobsCancel.parse({ jobId: '' })).toThrow();
		expect(() => Inputs.jobsResult.parse({ jobId: 'j', taskId: '' })).toThrow();
	});

	it('rejects a page size outside 1-100', () => {
		expect(() => Inputs.jobsList.parse({ pageSize: 0 })).toThrow();
		expect(() => Inputs.jobsList.parse({ pageSize: 101 })).toThrow();
		expect(Inputs.jobsList.parse({ pageSize: 100 }).pageSize).toBe(100);
	});

	it('rejects a page number below 1', () => {
		expect(() => Inputs.jobsList.parse({ pageNumber: 0 })).toThrow();
	});
});

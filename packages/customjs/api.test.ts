import { CustomjsAPIError } from './client';
import { AuthEndpoints, Javascript, Pages, Pdf, Screenshot } from './endpoints';
import { CustomjsEndpointOutputSchemas as Outputs } from './endpoints/types';
import { captureError } from './test-helpers';

/**
 * Live smoke tests. They call the real API and are skipped unless a key is set,
 * so CI stays offline. A free key allows 20 renders and runs a day, so this suite makes a
 * handful and asserts on the shape of each answer.
 *
 * Run with the key's own variable: CUSTOMJS_API_KEY=… pnpm test:live
 *
 * Every answer goes through its output schema, which is the contract a caller
 * receives. Asserting on a hand-written type would pass while a real field has the
 * wrong type.
 */
const apiKey = process.env.CUSTOMJS_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A silent skip reads like a pass in the summary, so say what is missing.
	console.warn(
		'[customjs] CUSTOMJS_API_KEY is not set: live smoke tests skipped.',
	);
}

/** The endpoints read `ctx.key`; the log helper also needs an account ID. */
function ctx() {
	return {
		key: apiKey,
		$getAccountId: async () => 'customjs-account',
		$getEntityId: async (id: string) => id,
	} as never;
}

describeIfKey('customjs live', () => {
	it('verifies the key and never returns it', async () => {
		const raw = await AuthEndpoints.check(ctx(), {} as never);
		const result = Outputs.authCheck.parse(raw);

		expect(result.workspaceId).toBeTruthy();
		expect(result.name).toBeTruthy();
		expect(JSON.stringify(result)).not.toContain(apiKey);
	});

	it('renders HTML to a real PDF', async () => {
		const raw = await Pdf.fromHtml(ctx(), {
			html: '<h1>Hello from the live smoke test</h1>',
		} as never);
		const result = Outputs.pdfFromHtml.parse(raw);

		expect(result.contentType).toContain('pdf');
		expect(result.byteLength).toBeGreaterThan(0);
		// Every PDF starts with %PDF.
		expect(Buffer.from(result.base64, 'base64').subarray(0, 4).toString()).toBe(
			'%PDF',
		);
	});

	it('renders Markdown to a real PDF', async () => {
		const raw = await Pdf.fromMarkdown(ctx(), {
			markdown: '# Live smoke test\n\nA short document.',
		} as never);
		const result = Outputs.pdfFromMarkdown.parse(raw);

		expect(result.byteLength).toBeGreaterThan(0);
	});

	it('captures a screenshot as a real PNG', async () => {
		const raw = await Screenshot.capture(ctx(), {
			url: 'https://example.com',
		} as never);
		const result = Outputs.screenshotCapture.parse(raw);

		expect(result.contentType).toContain('png');
		// The eight-byte PNG signature.
		expect(Buffer.from(result.base64, 'base64').subarray(0, 8)).toEqual(
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		);
	});

	it('runs inline JavaScript and returns its text output', async () => {
		const raw = await Javascript.run(ctx(), {
			input: { name: 'Jon Doe' },
			code: 'return input.name',
		} as never);
		const result = Outputs.javascriptRun.parse(raw);

		expect(result.output).toBe('Jon Doe');
	});

	it('returns a script error as a provider message', async () => {
		const error = await captureError(
			Javascript.run(ctx(), {
				code: 'throw new Error("live smoke failure")',
			} as never),
		);

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect((error as CustomjsAPIError).providerMessage).toContain(
			'live smoke failure',
		);
	});

	it('lists the hosted pages', async () => {
		const raw = await Pages.list(ctx(), {} as never);
		const result = Outputs.pagesList.parse(raw);

		expect(Array.isArray(result.pages)).toBe(true);
		for (const page of result.pages) {
			expect(typeof page.pageId).toBe('string');
			expect(typeof page.htmlFileUrl).toBe('string');
		}
	});

	it('reports a bad key as an auth failure', async () => {
		const error = await captureError(
			Pdf.fromHtml(
				{ key: 'not-a-real-key' } as never,
				{
					html: '<h1>x</h1>',
				} as never,
			),
		);

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect((error as CustomjsAPIError).isAuthError).toBe(true);
	});
});

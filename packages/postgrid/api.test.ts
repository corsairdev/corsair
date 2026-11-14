// Live PostGrid smoke tests. Excluded from the default run; run with:
//
//   POSTGRID_API_KEY=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// Nothing here creates an order: a letter spends postage and cannot be recalled.
//
// A key created in test mode only reads test-mode data, which is what the
// fixture-less reads below need. There is no separate sandbox host.
import {
	makePostgridRequest,
	POSTGRID_API_BASE,
	PostgridAPIError,
} from './client';
import {
	ContactSchema,
	PostgridEndpointOutputSchemas,
	TemplateSchema,
} from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_KEY = process.env.POSTGRID_API_KEY ?? '';

if (LIVE_KEY.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn('Skipping PostGrid live tests: POSTGRID_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('PostGrid live API', () => {
	it('lists contacts through the output schema', async () => {
		const raw = await makePostgridRequest(LIVE_KEY, {
			method: 'GET',
			path: '/contacts',
			query: { limit: 5 },
		});
		const page = PostgridEndpointOutputSchemas.contactsList.parse(raw);

		expect(Array.isArray(page.data)).toBe(true);
		// A row the docs describe with `addressStatus` must parse, which is what
		// proves the schema matches the wire format.
		for (const contact of page.data) {
			expect(ContactSchema.safeParse(contact).success).toBe(true);
		}
	});

	it('lists templates through the output schema', async () => {
		const raw = await makePostgridRequest(LIVE_KEY, {
			method: 'GET',
			path: '/templates',
			query: { limit: 5 },
		});
		const page = PostgridEndpointOutputSchemas.templatesList.parse(raw);

		expect(Array.isArray(page.data)).toBe(true);
		for (const template of page.data) {
			expect(TemplateSchema.safeParse(template).success).toBe(true);
		}
	});

	it('lists letters through the output schema', async () => {
		const raw = await makePostgridRequest(LIVE_KEY, {
			method: 'GET',
			path: '/letters',
			query: { limit: 5 },
		});
		const page = PostgridEndpointOutputSchemas.lettersList.parse(raw);

		expect(Array.isArray(page.data)).toBe(true);
	});

	it('rejects a wrong key as a credential failure, keeping it off the error', async () => {
		const error = await captureError(
			makePostgridRequest('definitely-not-a-key', {
				method: 'GET',
				path: '/contacts',
			}),
		);

		expect(error).toBeInstanceOf(PostgridAPIError);
		if (!(error instanceof PostgridAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.credentialsRejected).toBe(true);
		expect(error.code).toBe('invalid_api_key_error');
		// The key rode in a header, so nothing may echo it back.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-key');
	});

	it('exposes the documented print-mail base', () => {
		expect(POSTGRID_API_BASE).toBe('https://api.postgrid.com/print-mail/v1');
	});
});

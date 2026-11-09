/**
 * Live CraftMyPDF tests. These run only when `CRAFTMYPDF_API_KEY` is set;
 * otherwise they are skipped so CI stays green without credentials.
 *
 * Most calls are reads and cost nothing. The generation and editing tests do
 * spend credits (one per generated file, half for a merge), so they are gated
 * separately on `CRAFTMYPDF_TEMPLATE_ID`: without a template id there is
 * nothing to generate from and they are skipped rather than failed.
 *
 * Run with:
 *   CRAFTMYPDF_API_KEY=... CRAFTMYPDF_TEMPLATE_ID=... \
 *     pnpm --filter @corsair-dev/craftmypdf test:live
 */

import { makeCraftmypdfRequest } from './client';
import {
	CraftmypdfEndpointOutputSchemas,
	failedFields,
} from './endpoints/types';

const LIVE_KEY = process.env.CRAFTMYPDF_API_KEY ?? '';
const TEMPLATE_ID = process.env.CRAFTMYPDF_TEMPLATE_ID ?? '';

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;
const describeGeneration =
	LIVE_KEY.length > 0 && TEMPLATE_ID.length > 0 ? describe : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'CRAFTMYPDF_API_KEY is not set: the live CraftMyPDF suite is skipped.',
	);
} else if (TEMPLATE_ID.length === 0) {
	console.warn(
		'CRAFTMYPDF_TEMPLATE_ID is not set: the live generation tests are skipped. Set it to a template id from a CraftMyPDF account to run them, noting that each test spends credits.',
	);
}

// Public sample file from the W3C test set, so no upload is needed.
const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const SAMPLE_DATA = {
	order_number: 'CORSAIR-PROBE',
	order_date: '2026-11-09',
};

describeLive('CraftMyPDF live API: reads', () => {
	it('reads the account quota', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/get-account-info',
		});
		const out = CraftmypdfEndpointOutputSchemas.accountGetInfo.parse(raw);

		expect(out.status).toBe('success');
		expect(out.username).toBeTruthy();
	});

	it('lists templates and returns an array even when empty', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/list-templates',
			query: { limit: 5, offset: 0 },
		});
		// unknown: the live body is untyped; only the array check matters here.
		const record = raw as { templates?: unknown };
		expect(Array.isArray(record?.templates)).toBe(true);
	});

	it('lists transactions', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/list-transactions',
			query: { limit: 5, offset: 0 },
		});
		const out = CraftmypdfEndpointOutputSchemas.transactionsList.parse({
			...(raw as object),
			next_offset: undefined,
		});

		expect(out.status).toBe('success');
		expect(Array.isArray(out.transactions)).toBe(true);
	});

	it('reads the page count and properties of a public PDF', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/get-pdf-info',
			query: { url: SAMPLE_PDF },
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfGetInfo.parse(raw);

		expect(out.status).toBe('success');
		expect(out.totalPages).toBe(1);
		expect(out.producer).toBeTruthy();
	});

	it('rejects a key that does not exist', async () => {
		await expect(
			makeCraftmypdfRequest('definitely-not-a-key', {
				method: 'GET',
				path: '/get-account-info',
			}),
		).rejects.toThrow(/api key/i);
	});
});

describeGeneration('CraftMyPDF live API: generation', () => {
	it('generates a PDF and reports its page count and size', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/create',
			body: {
				template_id: TEMPLATE_ID,
				data: SAMPLE_DATA,
				export_type: 'json',
				expiration: 5,
			},
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfCreate.parse(raw);

		expect(out.status).toBe('success');
		expect(out.file).toContain('http');
		// Present on generation, absent on the editing endpoints.
		expect(out.total_pages).toBeGreaterThan(0);
		expect(out.file_size).toBeGreaterThan(0);
	});

	it('accepts the empty-data fallback used with a data URL', async () => {
		// The plugin sends data: {} when a caller passes only load_data_from,
		// because the API documents data as required. Reaching the URL fetch
		// rather than a validation error proves the fallback is accepted.
		await expect(
			makeCraftmypdfRequest(LIVE_KEY, {
				method: 'POST',
				path: '/create',
				body: {
					template_id: TEMPLATE_ID,
					data: {},
					load_data_from: 'https://example.com/does-not-exist.json',
					export_type: 'json',
				},
			}),
		).rejects.toThrow(/Failed to load/);
	});

	it('renders an image', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/create-image',
			body: {
				template_id: TEMPLATE_ID,
				data: SAMPLE_DATA,
				output_type: 'png',
			},
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfCreateImage.parse(raw);

		expect(out.status).toBe('success');
		expect(out.file).toBeTruthy();
	});

	it('answers immediately for an asynchronous generation', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/create-async',
			body: { template_id: TEMPLATE_ID, data: SAMPLE_DATA },
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfCreateAsync.parse(raw);

		expect(out.is_async).toBe(true);
		expect(out.transaction_ref).toBeTruthy();
	});

	it('reports an unknown template with the documented error', async () => {
		await expect(
			makeCraftmypdfRequest(LIVE_KEY, {
				method: 'POST',
				path: '/create',
				body: {
					template_id: '0000000000000000',
					data: { probe: true },
					export_type: 'json',
				},
			}),
		).rejects.toThrow(/Template ID not found/);
	});
});

describeLive('CraftMyPDF live API: PDF editing', () => {
	it('adds a watermark', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/add-watermark',
			body: {
				url: SAMPLE_PDF,
				text: 'CONFIDENTIAL',
				font_family: 'Times-Bold',
				opacity: 0.25,
			},
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfAddWatermark.parse(raw);

		expect(out.status).toBe('success');
		expect(out.file).toBeTruthy();
	});

	it('draws page text', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/add-text-to-pdf',
			body: {
				url: SAMPLE_PDF,
				textSettings: [
					{
						page_selector: '1',
						text: 'Page {{pageNumber}} of {{totalPages}}',
						position: 'bottom-center',
					},
				],
			},
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfAddText.parse(raw);

		expect(out.status).toBe('success');
		expect(out.file).toBeTruthy();
	});

	it('merges two PDFs', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/merge-pdfs',
			body: { urls: [SAMPLE_PDF, SAMPLE_PDF] },
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfMerge.parse(raw);

		expect(out.status).toBe('success');
		expect(out.file).toBeTruthy();
	});

	it('reports a missing form field without failing the call', async () => {
		// Verified against the live API: status is success and the field error
		// appears only in field_statuses, which is why the endpoint derives
		// failed_fields from it.
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/update-pdf-fields',
			body: {
				url: SAMPLE_PDF,
				fields: [{ id: 'last_name', value: 'Smith' }],
			},
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfUpdateFields.parse({
			...(raw as object),
			failed_fields: failedFields(
				(raw as { field_statuses?: { status?: string | null }[] })
					.field_statuses as never,
			),
		});

		expect(out.status).toBe('success');
		expect(out.failed_fields).toHaveLength(1);
	});
});

describeGeneration('CraftMyPDF live API: templates', () => {
	it('reads the template and its sample JSON', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/get-template',
			query: { template_id: TEMPLATE_ID },
		});
		const out = CraftmypdfEndpointOutputSchemas.templatesGet.parse(raw);

		expect(out.status).toBe('success');
		expect(out.body).toBeTruthy();
	});

	it('lists the template versions', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/list-template-versions',
			query: { template_id: TEMPLATE_ID },
		});
		const out =
			CraftmypdfEndpointOutputSchemas.templatesListVersions.parse(raw);

		expect(out.status).toBe('success');
		expect(out.versions.length).toBeGreaterThan(0);
	});

	it('opens and closes an editor session', async () => {
		const opened = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/create-editor-session',
			body: { template_id: TEMPLATE_ID, expiration: 5 },
		});
		const session =
			CraftmypdfEndpointOutputSchemas.editorCreateSession.parse(opened);

		expect(session.status).toBe('success');
		expect(session.url).toContain('http');
		expect(session.token_uuid).toBeTruthy();

		const closed = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/deactivate-editor-session',
			body: { token_uuid: session.token_uuid },
		});
		expect(
			CraftmypdfEndpointOutputSchemas.editorDeactivateSession.parse(closed)
				.status,
		).toBe('success');
	});

	it('clones a template and deletes the copy', async () => {
		const cloned = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'POST',
			path: '/new-template-from',
			body: { template_id: TEMPLATE_ID, name: 'Corsair live test copy' },
		});
		const copy =
			CraftmypdfEndpointOutputSchemas.templatesCreateFrom.parse(cloned);

		expect(copy.status).toBe('success');
		expect(copy.template_id).toBeTruthy();

		const deleted = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/delete-template',
			// The clone always has an id; the guard keeps the type honest.
			query: { template_id: copy.template_id ?? '' },
		});
		expect(
			CraftmypdfEndpointOutputSchemas.templatesDelete.parse(deleted).status,
		).toBe('success');
	});
});

import { logEventFromContext } from 'corsair/core';
import { Account, Editor, Pdf, Templates } from './endpoints';
import { redactUrls } from './endpoints/call';
import {
	accountInfo,
	asyncAccepted,
	editorSession,
	generatedFile,
	generatedFileWithAnchors,
	newTemplate,
	parallelResult,
	pdfInfo,
	retainedVersions,
	successOnly,
	templateDetail,
	templatesPage,
	templateVersions,
	transactionsPage,
	updatedFields,
	updatedFieldsWithFailure,
	usageReport,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'cmp-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown: the assertions inspect it per case.
// unknown: see above.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// The fake context carries what the endpoints read: ctx.key and the region.
function context(region?: string) {
	return { key: API_KEY, options: region ? { region } : {} } as never;
}

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown, region?: string) {
	return endpoint(context(region), input as never);
}

let fetchMock: jest.SpyInstance;
let unmockedFetches = 0;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the body is whatever the endpoint serialised.
		body: init.body === undefined ? undefined : JSON.parse(String(init.body)),
		headers: new Headers(init.headers),
	};
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API. afterEach also fails the test, so a negative test whose
	// input was wrongly accepted cannot pass on this error instead.
	unmockedFetches = 0;
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		unmockedFetches += 1;
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
	expect(unmockedFetches).toBe(0);
});

describe('pdf generation', () => {
	it('pdf.create posts the template and data', async () => {
		respond(generatedFile);

		const result = await invoke(Pdf.create, {
			template_id: '05f77b2b18ad809a',
			data: { invoice_number: 'INV38379' },
			export_type: 'json',
		});

		expect(result).toEqual(expect.objectContaining({ status: 'success' }));
		const request = lastRequest();
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v1/create');
		expect(request.body).toMatchObject({
			template_id: '05f77b2b18ad809a',
			data: { invoice_number: 'INV38379' },
		});
		expect(request.headers.get('x-api-key')).toBe(API_KEY);
	});

	it('pdf.create sends an empty data object when only a data URL is given', async () => {
		respond(generatedFile);

		await invoke(Pdf.create, {
			template_id: '05f77b2b18ad809a',
			load_data_from: 'https://example.com/data.json',
		});

		expect(lastRequest().body).toMatchObject({
			load_data_from: 'https://example.com/data.json',
			data: {},
		});
	});

	it('pdf.create rejects a call with neither data nor a data URL', async () => {
		await expect(invoke(Pdf.create, { template_id: 'abc' })).rejects.toThrow(
			/Pass data \(the template JSON\)/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		['pdf.create', Pdf.create],
		['pdf.createImage', Pdf.createImage],
	] as const)(
		'%s rejects a load_data_from that is not an http(s) URL',
		async (_, endpoint) => {
			for (const load_data_from of [
				'not-a-url',
				'{"invoice_number":"INV38379"}',
				'ftp://example.com/data.json',
			]) {
				await expect(
					invoke(endpoint, { template_id: 'abc', load_data_from }),
				).rejects.toThrow();
			}
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('pdf.create requires a password when password_protected is set', async () => {
		await expect(
			invoke(Pdf.create, {
				template_id: 'abc',
				data: {},
				password_protected: true,
			}),
		).rejects.toThrow(/password is required/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('pdf.create rejects an expiration outside the documented range', async () => {
		await expect(
			invoke(Pdf.create, { template_id: 'abc', data: {}, expiration: 0 }),
		).rejects.toThrow();
		await expect(
			invoke(Pdf.create, { template_id: 'abc', data: {}, expiration: 10_081 }),
		).rejects.toThrow();
	});

	it('pdf.createAsync posts the webhook URL and keeps the transaction ref', async () => {
		respond(asyncAccepted);

		const result = await invoke(Pdf.createAsync, {
			template_id: '05f77b2b18ad809a',
			data: { a: 1 },
			webhook_url: 'https://example.com/pdf-handler',
		});

		expect(result).toMatchObject({
			transaction_ref: 'b692183d-46d7-3213-891a-460a5814ad3f',
			is_async: true,
		});
		const request = lastRequest();
		expect(request.path).toBe('/v1/create-async');
		expect(request.body).toMatchObject({
			webhook_url: 'https://example.com/pdf-handler',
			data: { a: 1 },
		});
	});

	it('pdf.createAsync requires data, since it has no load_data_from to fall back on', async () => {
		// Sending {} in its place would spend a credit on a blank PDF.
		await expect(
			invoke(Pdf.createAsync, { template_id: '05f77b2b18ad809a' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('pdf.createAsync rejects a webhook URL that is not a URL', async () => {
		await expect(
			invoke(Pdf.createAsync, {
				template_id: 'abc',
				data: {},
				webhook_url: 'not-a-url',
			}),
		).rejects.toThrow();
	});

	it('pdf.createImage posts the output type', async () => {
		respond(generatedFile);

		await invoke(Pdf.createImage, {
			template_id: '05f77b2b18ad809a',
			data: { a: 1 },
			output_type: 'png',
		});

		const request = lastRequest();
		expect(request.path).toBe('/v1/create-image');
		expect(request.body).toMatchObject({ output_type: 'png' });
	});

	it('pdf.createImage rejects an output type the API does not accept', async () => {
		await expect(
			invoke(Pdf.createImage, {
				template_id: 'abc',
				data: {},
				output_type: 'gif',
			}),
		).rejects.toThrow();
	});

	it('pdf.createMerge posts every template in order', async () => {
		respond(generatedFileWithAnchors);

		const result = await invoke(Pdf.createMerge, {
			templates: [
				{ template_id: 'one', data: { a: 1 } },
				{ template_id: 'two', data: { b: 2 } },
			],
			paging: 'continuous',
		});

		expect(result).toMatchObject({ anchors: expect.any(Array) });
		const request = lastRequest();
		expect(request.path).toBe('/v1/create-merge');
		expect(request.body).toMatchObject({
			templates: [
				{ template_id: 'one', data: { a: 1 } },
				{ template_id: 'two', data: { b: 2 } },
			],
			paging: 'continuous',
		});
	});

	it('pdf.createMerge requires top-level data when a template has none', async () => {
		await expect(
			invoke(Pdf.createMerge, {
				templates: [{ template_id: 'one' }],
			}),
		).rejects.toThrow(/top-level data is required/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('pdf.createParallel posts the request list and reports the count', async () => {
		respond(parallelResult);

		const result = await invoke(Pdf.createParallel, {
			requests: [{ template_id: 'abc', data: { a: 1 }, meta: 'ref-1' }],
			merge: true,
		});

		expect(result).toMatchObject({
			results: [expect.objectContaining({ meta: 'yourrefernce0001' })],
			merge_result: expect.objectContaining({ status: 'success' }),
		});
		const request = lastRequest();
		expect(request.path).toBe('/v1/create-parallel');
		expect(request.body).toMatchObject({ merge: true });

		const logged = mockLog.mock.calls.at(-1);
		expect(logged?.[1]).toBe('craftmypdf.pdf.createParallel');
		expect(logged?.[2]).toEqual({ count: 1, merged: true });
	});

	it('pdf.createParallel rejects a request with no data', async () => {
		await expect(
			invoke(Pdf.createParallel, { requests: [{ template_id: 'abc' }] }),
		).rejects.toThrow(/no data/);
	});
});

describe('pdf editing', () => {
	it('pdf.addWatermark posts the text and font settings', async () => {
		respond(generatedFile);

		await invoke(Pdf.addWatermark, {
			url: 'https://example.com/in.pdf',
			text: 'Confidential',
			font_family: 'Times-Bold',
			opacity: 0.25,
		});

		const request = lastRequest();
		expect(request.path).toBe('/v1/add-watermark');
		expect(request.body).toMatchObject({
			text: 'Confidential',
			font_family: 'Times-Bold',
			opacity: 0.25,
		});
	});

	it('pdf.addWatermark rejects an opacity outside 0 to 1', async () => {
		await expect(
			invoke(Pdf.addWatermark, {
				url: 'https://example.com/in.pdf',
				text: 'x',
				opacity: 1.5,
			}),
		).rejects.toThrow();
	});

	it('pdf.addWatermark rejects a font CraftMyPDF does not ship', async () => {
		await expect(
			invoke(Pdf.addWatermark, {
				url: 'https://example.com/in.pdf',
				text: 'x',
				font_family: 'Comic Sans',
			}),
		).rejects.toThrow();
	});

	it('pdf.addText posts the page selectors', async () => {
		respond(generatedFile);

		await invoke(Pdf.addText, {
			url: 'https://example.com/in.pdf',
			textSettings: [
				{
					page_selector: '1,2-*,5-8',
					text: 'Page {{pageNumber}} of {{totalPages}}',
					position: 'bottom-center',
				},
			],
		});

		const request = lastRequest();
		expect(request.path).toBe('/v1/add-text-to-pdf');
		expect(request.body).toMatchObject({
			textSettings: [
				expect.objectContaining({
					page_selector: '1,2-*,5-8',
					position: 'bottom-center',
				}),
			],
		});
	});

	it('pdf.addText rejects a page selector that is not pages or ranges', async () => {
		await expect(
			invoke(Pdf.addText, {
				url: 'https://example.com/in.pdf',
				textSettings: [
					{ page_selector: 'last page', text: 'x', position: 'center' },
				],
			}),
		).rejects.toThrow();
	});

	it('pdf.addText rejects an unknown position', async () => {
		await expect(
			invoke(Pdf.addText, {
				url: 'https://example.com/in.pdf',
				textSettings: [
					{ page_selector: '1', text: 'x', position: 'somewhere' },
				],
			}),
		).rejects.toThrow();
	});

	it('pdf.updateFields posts every field value', async () => {
		respond(updatedFields);

		const result = await invoke(Pdf.updateFields, {
			url: 'https://example.com/form.pdf',
			fields: [{ id: 'last_name', value: 'Smith', readOnly: true }],
		});

		expect(result).toMatchObject({
			file: expect.stringContaining('updated.pdf'),
			field_statuses: [expect.objectContaining({ id: 'last_name' })],
		});
		const request = lastRequest();
		expect(request.path).toBe('/v1/update-pdf-fields');
		expect(request.body).toMatchObject({
			fields: [{ id: 'last_name', value: 'Smith', readOnly: true }],
		});
	});

	it('pdf.updateFields surfaces a field the PDF does not have', async () => {
		// CraftMyPDF answers status success here; the endpoint lifts the failed
		// field out so a caller cannot mistake it for a filled form.
		respond(updatedFieldsWithFailure);

		const result = (await invoke(Pdf.updateFields, {
			url: 'https://example.com/form.pdf',
			fields: [{ id: 'last_name', value: 'Smith' }],
		})) as { status?: string; failed_fields?: { id?: string }[] };

		expect(result.status).toBe('success');
		expect(result.failed_fields).toHaveLength(1);
		expect(result.failed_fields?.[0]?.id).toBe('last_name');

		const logged = mockLog.mock.calls.at(-1);
		expect(logged?.[2]).toMatchObject({ fields: 1, failed: 1 });
	});

	it('pdf.updateFields reports no failures when every field was filled', async () => {
		respond(updatedFields);

		const result = (await invoke(Pdf.updateFields, {
			url: 'https://example.com/form.pdf',
			fields: [{ id: 'last_name', value: 'Smith' }],
		})) as { failed_fields?: unknown[] };

		expect(result.failed_fields).toEqual([]);
	});

	it('pdf.updateFields rejects an empty field list', async () => {
		await expect(
			invoke(Pdf.updateFields, {
				url: 'https://example.com/form.pdf',
				fields: [],
			}),
		).rejects.toThrow();
	});

	it('pdf.merge posts the URL list', async () => {
		respond(generatedFile);

		await invoke(Pdf.merge, {
			urls: ['https://example.com/a.pdf', 'https://example.com/b.pdf'],
		});

		const request = lastRequest();
		expect(request.path).toBe('/v1/merge-pdfs');
		expect(request.body).toMatchObject({
			urls: ['https://example.com/a.pdf', 'https://example.com/b.pdf'],
		});
	});

	it('pdf.merge rejects a list with a non-URL entry', async () => {
		await expect(invoke(Pdf.merge, { urls: ['a.pdf'] })).rejects.toThrow();
	});

	it('pdf.getInfo reads the PDF over GET with a url query', async () => {
		respond(pdfInfo);

		const result = await invoke(Pdf.getInfo, {
			url: 'https://example.com/sample.pdf',
		});

		expect(result).toMatchObject({ totalPages: 19, producer: 'pdf-lib' });
		const request = lastRequest();
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/v1/get-pdf-info');
		expect(request.query).toEqual({ url: 'https://example.com/sample.pdf' });
		expect(request.body).toBeUndefined();
	});
});

describe('templates', () => {
	it('templates.list reads a page and derives the next offset', async () => {
		respond(templatesPage);

		const result = (await invoke(Templates.list, {
			limit: 2,
			offset: 0,
		})) as { next_offset?: number };

		expect(result).toMatchObject({ status: 'success' });
		// Two rows for a limit of two means there may be more.
		expect(result.next_offset).toBe(2);
		const request = lastRequest();
		expect(request.path).toBe('/v1/list-templates');
		expect(request.query).toEqual({ limit: '2', offset: '0' });
	});

	it('templates.list reports no next offset on a short page', async () => {
		respond(templatesPage);

		const result = (await invoke(Templates.list, {
			limit: 50,
			offset: 0,
		})) as { next_offset?: number };

		expect(result.next_offset).toBeUndefined();
	});

	it('templates.list throws when templates is not an array', async () => {
		respond({ status: 'success', templates: 'nope' });

		await expect(invoke(Templates.list, {})).rejects.toThrow(
			/Expected templates to be an array/,
		);
	});

	it('templates.list throws on a body that is not an object instead of reporting an empty last page', async () => {
		respond('<html>Service Unavailable</html>');

		await expect(invoke(Templates.list, {})).rejects.toThrow(
			/Expected an object/,
		);
	});

	it('transactions.list throws on a body that is not an object', async () => {
		respond(['not', 'an', 'envelope']);

		await expect(invoke(Account.list, {})).rejects.toThrow(
			/Expected an object/,
		);
	});

	it('templates.get sends the template id and version', async () => {
		respond(templateDetail);

		const result = await invoke(Templates.get, {
			template_id: 'ad577b2b22d4e612',
			version: 8,
		});

		expect(result).toMatchObject({ name: 'Test Template' });
		const request = lastRequest();
		expect(request.path).toBe('/v1/get-template');
		expect(request.query).toEqual({
			template_id: 'ad577b2b22d4e612',
			version: '8',
		});
	});

	it('templates.update posts the changed fields', async () => {
		respond(successOnly);

		await invoke(Templates.update, {
			template_id: 'abc',
			name: 'Renamed',
			json: '{"a":1}',
		});

		const request = lastRequest();
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v1/update-template');
		expect(request.body).toEqual({
			template_id: 'abc',
			name: 'Renamed',
			json: '{"a":1}',
		});
	});

	it('templates.delete sends the id as a query parameter on GET', async () => {
		respond(successOnly);

		await invoke(Templates.remove, { template_id: '06977b2b18ace42a' });

		const request = lastRequest();
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/v1/delete-template');
		expect(request.query).toEqual({ template_id: '06977b2b18ace42a' });
	});

	it('templates.createFrom posts the copy settings', async () => {
		respond(newTemplate);

		const result = await invoke(Templates.createFrom, {
			template_id: '5ef88b2b237c968c',
			name: 'My Invoice',
			version: 8,
			group_name: 'Customer_009',
		});

		expect(result).toMatchObject({
			template_id: '05f77b2b18ad809a',
			from_template_version: '8',
		});
		const request = lastRequest();
		expect(request.path).toBe('/v1/new-template-from');
		expect(request.body).toMatchObject({
			template_id: '5ef88b2b237c968c',
			version: '8',
		});
	});

	it('templates.transfer posts the target team', async () => {
		respond(successOnly);

		await invoke(Templates.transfer, {
			template_id: '5ef88b2b237c968c',
			team_id: 'haag3ce4',
		});

		const request = lastRequest();
		expect(request.path).toBe('/v1/transfer-template-to');
		expect(request.body).toEqual({
			template_id: '5ef88b2b237c968c',
			team_id: 'haag3ce4',
		});
	});

	it('templates.listVersions reads the versions', async () => {
		respond(templateVersions);

		const result = (await invoke(Templates.listVersions, {
			template_id: '5ef77b2b187c968c',
		})) as { versions: { version?: number }[] };

		expect(result.versions).toHaveLength(2);
		const request = lastRequest();
		expect(request.path).toBe('/v1/list-template-versions');
		expect(request.query).toEqual({ template_id: '5ef77b2b187c968c' });
	});

	it('templates.retainVersions posts the version list and the flag', async () => {
		respond(retainedVersions);

		const result = (await invoke(Templates.retainVersions, {
			template_id: 'c2d77b234151b7c4',
			versions: [1, 4],
			keep: true,
		})) as { versions: { version?: number }[] };

		expect(result.versions).toHaveLength(1);
		const request = lastRequest();
		expect(request.path).toBe('/v1/retain-template-versions');
		expect(request.body).toEqual({
			template_id: 'c2d77b234151b7c4',
			versions: [1, 4],
			keep: true,
		});
	});

	it('templates.retainVersions rejects an empty version list', async () => {
		await expect(
			invoke(Templates.retainVersions, {
				template_id: 'abc',
				versions: [],
				keep: true,
			}),
		).rejects.toThrow();
	});

	it('templates.queryUsage joins the template ids into one value', async () => {
		respond(usageReport);

		const result = (await invoke(Templates.queryUsage, {
			template_ids: ['bba77b234e84443e', '02077b2b1aa8b938'],
			start_date: '2025-01-30T00:00:00Z',
			end_date: '2025-01-30T11:59:59Z',
		})) as { results: { template_id?: string }[] };

		expect(result.results).toHaveLength(2);
		const request = lastRequest();
		expect(request.path).toBe('/v1/query-template-usage');
		expect(request.query).toMatchObject({
			template_ids: 'bba77b234e84443e,02077b2b1aa8b938',
			start_date: '2025-01-30T00:00:00Z',
		});
	});

	it('templates.queryUsage rejects a date that is not ISO 8601', async () => {
		await expect(
			invoke(Templates.queryUsage, {
				template_ids: ['abc'],
				start_date: '30/01/2025',
			}),
		).rejects.toThrow();
	});
});

describe('editor', () => {
	it('editor.createSession posts the permissions it was given', async () => {
		respond(editorSession);

		const result = await invoke(Editor.createSession, {
			template_id: '5ef88b2b237c968c',
			expiration: 1440,
			canSave: false,
			jsonMode: 2,
		});

		expect(result).toMatchObject({
			token_uuid: '66b0e71d-5a72-4fee-b4a5-7f1713fd2fb5',
		});
		const request = lastRequest();
		expect(request.path).toBe('/v1/create-editor-session');
		expect(request.body).toMatchObject({
			template_id: '5ef88b2b237c968c',
			expiration: 1440,
			canSave: false,
			jsonMode: 2,
		});
	});

	it('editor.createSession rejects a jsonMode other than 1 or 2', async () => {
		await expect(
			invoke(Editor.createSession, {
				template_id: 'abc',
				expiration: 60,
				jsonMode: 3,
			}),
		).rejects.toThrow();
	});

	it('editor.deactivateSession posts the token uuid', async () => {
		respond(successOnly);

		await invoke(Editor.deactivateSession, { token_uuid: 'a1263472b-tok' });

		const request = lastRequest();
		expect(request.path).toBe('/v1/deactivate-editor-session');
		expect(request.body).toEqual({ token_uuid: 'a1263472b-tok' });
	});
});

describe('account and transactions', () => {
	it('account.getInfo reads the quota over GET', async () => {
		respond(accountInfo);

		const result = await invoke(Account.getInfo, {});

		expect(result).toMatchObject({ quota_counter: 35, quota_max: 100 });
		const request = lastRequest();
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/v1/get-account-info');
		expect(request.body).toBeUndefined();
	});

	it('transactions.list reads a page and derives the next offset', async () => {
		respond(transactionsPage);

		const result = (await invoke(Account.list, {
			limit: 1,
			offset: 0,
		})) as { next_offset?: number };

		expect(result).toMatchObject({
			transactions: [expect.objectContaining({ transaction_type: 'PDFGEN' })],
		});
		expect(result.next_offset).toBe(1);
		const request = lastRequest();
		expect(request.path).toBe('/v1/list-transactions');
		expect(request.query).toEqual({ limit: '1', offset: '0' });
	});

	it('transactions.list throws when transactions is not an array', async () => {
		respond({ status: 'success', transactions: {} });

		await expect(invoke(Account.list, {})).rejects.toThrow(
			/Expected transactions to be an array/,
		);
	});
});

describe('redactUrls', () => {
	it('drops a signed query string but keeps host and path', () => {
		expect(
			redactUrls(
				'Failed to load: https://bucket.s3.amazonaws.com/a/out.pdf?X-Amz-Signature=abc',
			),
		).toBe(
			'Failed to load: https://bucket.s3.amazonaws.com/a/out.pdf?redacted',
		);
	});

	it('keeps a URL that carries no credential unchanged', () => {
		expect(redactUrls('Failed to load: https://example.com/data.json')).toBe(
			'Failed to load: https://example.com/data.json',
		);
	});

	it('drops userinfo from a URL that carries it', () => {
		expect(redactUrls('see https://user:pw@example.com/x')).toBe(
			'see https://example.com/x?redacted',
		);
	});

	it('redacts several URLs in one message', () => {
		const message =
			'first https://a.example.com/x?k=1 then https://b.example.com/y?k=2';
		expect(redactUrls(message)).toBe(
			'first https://a.example.com/x?redacted then https://b.example.com/y?redacted',
		);
	});

	it('leaves a message with no URL alone', () => {
		expect(redactUrls('Template ID not found')).toBe('Template ID not found');
	});
});

describe('regions and logging', () => {
	it('sends the request to the region the options name', async () => {
		respond(accountInfo);

		await invoke(Account.getInfo, {}, 'us');

		const [url] = fetchMock.mock.calls.at(-1) as [string];
		expect(url).toBe('https://api-us.craftmypdf.com/v1/get-account-info');
	});

	it('logs a failed call and still rethrows the provider error', async () => {
		respond({ status: 'error', message: 'Invalid API Key' }, 400);

		await expect(invoke(Account.getInfo, {})).rejects.toThrow(
			'Invalid API Key',
		);

		const logged = mockLog.mock.calls.at(-1);
		expect(logged?.[1]).toBe('craftmypdf.account.getInfo');
		expect(logged?.[3]).toBe('failed');
	});

	it('strips a signed URL from the error it saves, but not from what it throws', async () => {
		const signed =
			'https://craftmypdf-gen.s3.ap-southeast-1.amazonaws.com/abc/out.pdf?X-Amz-Signature=SECRET-SIG&X-Amz-Credential=SECRET-KEY';
		// The live API echoes the URL it was given in this message.
		respond({ status: 'error', message: `Failed to load: ${signed}` }, 400);

		const thrown = await invoke(Pdf.merge, { urls: [signed] }).catch(
			(e: unknown) => e,
		);

		// The caller keeps the real message so it can act on it.
		expect((thrown as Error).message).toContain('SECRET-SIG');

		// The saved event must not hold the credential.
		const logged = mockLog.mock.calls.at(-1);
		const saved = JSON.stringify(logged?.[2]);
		expect(saved).not.toContain('SECRET-SIG');
		expect(saved).not.toContain('SECRET-KEY');
		expect(saved).toContain('craftmypdf-gen.s3.ap-southeast-1.amazonaws.com');
		expect(saved).toContain('redacted');
	});

	it('never logs the template data that was sent', async () => {
		respond(generatedFile);

		await invoke(Pdf.create, {
			template_id: 'abc',
			data: { customer_email: 'someone@example.com' },
		});

		const logged = mockLog.mock.calls.at(-1);
		expect(JSON.stringify(logged?.[2])).not.toContain('someone@example.com');
		expect(logged?.[2]).toEqual({
			transactionRef: generatedFile.transaction_ref,
		});
	});
});

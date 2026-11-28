import { logEventFromContext } from 'corsair/core';
import { Submissions, Submitters, Templates } from './endpoints';
import {
	archiveResult,
	base64Pdf,
	submission,
	submissionCreateOneoffResult,
	submissionDocuments,
	submissionList,
	submissionListItem,
	submitter,
	submitterCreateResult,
	submitterList,
	template,
	templateList,
	templateUpdateResult,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'docuseal-test-key';

// unknown: every concrete endpoint is assignable to never's parameters and
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('templates.list keeps the pagination cursor', async () => {
		respond(templateList);

		const result = await invoke(Templates.list, {});
		expect(result).toEqual(templateList);
	});

	it('templates.get parses a full template', async () => {
		respond(template);

		const result = await invoke(Templates.get, { id: 12 });
		expect(result).toEqual(template);
	});

	it('templates.update returns the bare id and timestamp', async () => {
		respond(templateUpdateResult);

		const result = await invoke(Templates.update, { id: 12, name: 'x' });
		expect(result).toEqual(templateUpdateResult);
	});

	it('templates.archive returns id and archived_at', async () => {
		respond(archiveResult);

		const result = await invoke(Templates.archive, { id: 12 });
		expect(result).toEqual(archiveResult);
	});

	it.each([
		['createFromHtml', { html: '<p>x</p>' }],
		['createFromPdf', { documents: [{ name: 'a.pdf', file: base64Pdf }] }],
		['createFromDocx', { documents: [{ name: 'a.docx', file: base64Pdf }] }],
		['clone', {}],
		['merge', { template_ids: [12] }],
		['updateDocuments', { documents: [{ html: '<p>x</p>' }] }],
	])('templates.%s parses the returned template', async (op, input) => {
		respond(template);

		const result = await invoke(
			Templates[op as keyof typeof Templates] as AnyEndpoint,
			{ id: 12, ...input },
		);
		expect(result).toEqual(template);
	});

	it('submissions.list keeps submitters without their values and documents', async () => {
		respond(submissionList);

		const result = await invoke(Submissions.list, {});
		expect(result).toEqual(submissionList);
	});

	it('submissions.get parses submitters, events and documents', async () => {
		respond(submission);

		const result = await invoke(Submissions.get, { id: 55 });
		expect(result).toEqual(submission);
	});

	it('submissions.create parses the bare submitter array', async () => {
		respond([submitterCreateResult]);

		const result = await invoke(Submissions.create, {
			template_id: 12,
			submitters: [{ role: 'Tenant', email: 'jordan@acme-logistics.example' }],
		});
		expect(result).toEqual([submitterCreateResult]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'docuseal.submissions.create',
			{ templateId: 12, count: 1 },
			'completed',
		);
	});

	it.each([
		['createFromPdf', { documents: [{ name: 'a.pdf', file: base64Pdf }] }],
		['createFromHtml', { documents: [{ html: '<p>x</p>' }] }],
		['createFromDocx', { documents: [{ name: 'a.docx', file: base64Pdf }] }],
	])('submissions.%s parses the one-off result', async (op, input) => {
		respond(submissionCreateOneoffResult);

		const result = await invoke(
			Submissions[op as keyof typeof Submissions] as AnyEndpoint,
			{ ...input, submitters: [{ role: 'Tenant' }] },
		);
		expect(result).toEqual(submissionCreateOneoffResult);
	});

	it('submissions.createFromEmails parses the submitter array', async () => {
		respond([submitterCreateResult]);

		const result = await invoke(Submissions.createFromEmails, {
			template_id: 12,
			emails: 'jordan@acme-logistics.example',
		});
		expect(result).toEqual([submitterCreateResult]);
	});

	it('submissions.update returns the full submission', async () => {
		respond(submission);

		const result = await invoke(Submissions.update, { id: 55, archived: true });
		expect(result).toEqual(submission);
	});

	it('submissions.getDocuments returns the document list', async () => {
		respond(submissionDocuments);

		const result = await invoke(Submissions.getDocuments, { id: 55 });
		expect(result).toEqual(submissionDocuments);
	});

	it('submitters.list parses submitter values and documents', async () => {
		respond(submitterList);

		const result = await invoke(Submitters.list, {});
		expect(result).toEqual(submitterList);
	});

	it('submitters.get returns values and documents', async () => {
		respond(submitter);

		const result = await invoke(Submitters.get, { id: 77 });
		expect(result).toEqual(submitter);
	});

	it('submitters.update returns the submitter with embed_src', async () => {
		respond(submitterCreateResult);

		const result = await invoke(Submitters.update, {
			id: 77,
			completed: true,
		});
		expect(result).toEqual(submitterCreateResult);
	});
});

describe('input rejections', () => {
	it.each([
		['Templates.list', Templates.list, { limit: 101 }],
		['Templates.list zero', Templates.list, { limit: 0 }],
		['Templates.list after', Templates.list, { after: 1.5 }],
		['Submissions.list status', Submissions.list, { status: 'archived' }],
		['Submissions.list limit', Submissions.list, { limit: 500 }],
		[
			'Submissions.create empty submitters',
			Submissions.create,
			{ template_id: 12, submitters: [] },
		],
		[
			'Submissions.create bad email',
			Submissions.create,
			{
				template_id: 12,
				submitters: [{ role: 'Tenant', email: 'not-an-email' }],
			},
		],
		['Templates.merge empty ids', Templates.merge, { template_ids: [] }],
		['Templates.get id', Templates.get, { id: 'abc' }],
		[
			'Templates.createFromHtml without html or documents',
			Templates.createFromHtml,
			{ name: 'empty' },
		],
		[
			'Submissions.createFromPdf no documents',
			Submissions.createFromPdf,
			{ submitters: [{ role: 'Tenant' }] },
		],
	])(
		'rejects %s input %j before calling DocuSeal',
		async (_name, endpoint, input) => {
			await expect(invoke(endpoint as AnyEndpoint, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('output rejections', () => {
	it('rejects a list answered as a bare array instead of the {data, pagination} envelope', async () => {
		respond([template]);

		await expect(invoke(Templates.list, {})).rejects.toThrow();
	});

	it('rejects a pagination count that arrived as a string', async () => {
		respond({
			data: [template],
			pagination: { count: '2', next: null, prev: null },
		});

		await expect(invoke(Templates.list, {})).rejects.toThrow();
	});

	it('rejects submissions.create answered as an object where a bare array is required', async () => {
		respond(submitterCreateResult);

		await expect(
			invoke(Submissions.create, {
				template_id: 12,
				submitters: [{ role: 'Tenant' }],
			}),
		).rejects.toThrow();
	});

	it('rejects a submitter whose values are not field/value pairs', async () => {
		respond({ ...submitter, values: ['not-an-object'] });

		await expect(invoke(Submitters.get, { id: 77 })).rejects.toThrow();
	});

	it('rejects a submission missing the required slug', async () => {
		const { slug: _slug, ...rest } = submissionListItem;
		respond({ data: [rest], pagination: { count: 1, next: null, prev: null } });

		await expect(invoke(Submissions.list, {})).rejects.toThrow();
	});

	it('rejects an error envelope answered with 200', async () => {
		respond({ error: 'Template not found' }, 200);

		await expect(invoke(Templates.get, { id: 999 })).rejects.toThrow();
	});
});

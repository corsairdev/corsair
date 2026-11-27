import { Submissions, Submitters, Templates } from './endpoints';
import {
	archiveResult,
	base64Pdf,
	submission,
	submissionCreateOneoffResult,
	submissionDocuments,
	submissionList,
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

const API_KEY = 'docuseal-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: every concrete endpoint is assignable to never's parameters and
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.docuseal.com');
	expect(sent.headers.get('x-auth-token')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('templates requests', () => {
	it('lists templates with every filter as a query parameter', async () => {
		respond(templateList);

		await invoke(Templates.list, {
			q: 'rental',
			slug: 'AfZkZbCiRkCWSo',
			external_id: 'lease-42',
			folder: 'Legal',
			archived: true,
			shared: true,
			limit: 20,
			after: 12,
			before: 99,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/templates',
			query: {
				q: 'rental',
				slug: 'AfZkZbCiRkCWSo',
				external_id: 'lease-42',
				folder: 'Legal',
				archived: 'true',
				shared: 'true',
				limit: '20',
				after: '12',
				before: '99',
			},
		});
	});

	it('omits unset template filters rather than sending null', async () => {
		respond(templateList);

		await invoke(Templates.list, { limit: 5 });

		expect(lastRequest().query).toStrictEqual({ limit: '5' });
	});

	it('reads a template by id', async () => {
		respond(template);

		await invoke(Templates.get, { id: 12 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/templates/12',
			body: undefined,
		});
	});

	it('updates a template with the editable fields in the body', async () => {
		respond(templateUpdateResult);

		await invoke(Templates.update, {
			id: 12,
			name: 'Lease v2',
			external_id: 'lease-42',
			folder_name: 'Legal',
			roles: ['Tenant', 'Landlord'],
			archived: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/templates/12',
			body: {
				name: 'Lease v2',
				external_id: 'lease-42',
				folder_name: 'Legal',
				roles: ['Tenant', 'Landlord'],
				archived: false,
			},
		});
	});

	it('archives a template with DELETE and no body', async () => {
		respond(archiveResult);

		await invoke(Templates.archive, { id: 12 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/templates/12',
			body: undefined,
		});
	});

	it('creates a template from HTML', async () => {
		respond(template);

		await invoke(Templates.createFromHtml, {
			html: '<p><span class="text-field" style="width: 100px"></span></p>',
			html_header: '<style></style>',
			html_footer: '',
			name: 'From HTML',
			size: 'A4',
			external_id: 'html-1',
			folder_name: 'Legal',
			shared_link: false,
			documents: [{ html: '<p>Appendix</p>', name: 'Appendix' }],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/templates/html',
			body: {
				html: '<p><span class="text-field" style="width: 100px"></span></p>',
				html_header: '<style></style>',
				html_footer: '',
				name: 'From HTML',
				size: 'A4',
				external_id: 'html-1',
				folder_name: 'Legal',
				shared_link: false,
				documents: [{ html: '<p>Appendix</p>', name: 'Appendix' }],
			},
		});
	});

	it('creates a template from base64 PDFs with placed fields', async () => {
		respond(template);

		await invoke(Templates.createFromPdf, {
			name: 'From PDF',
			folder_name: 'Legal',
			external_id: 'pdf-1',
			shared_link: true,
			documents: [
				{
					name: 'lease.pdf',
					file: base64Pdf,
					fields: [
						{
							name: 'Signature',
							type: 'signature',
							role: 'Tenant',
							required: true,
							areas: [{ x: 5, y: 10, w: 20, h: 3, page: 1 }],
						},
					],
				},
			],
			flatten: true,
			remove_tags: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/templates/pdf',
			body: {
				name: 'From PDF',
				folder_name: 'Legal',
				external_id: 'pdf-1',
				shared_link: true,
				flatten: true,
				remove_tags: false,
				documents: [
					{
						name: 'lease.pdf',
						file: base64Pdf,
						fields: [
							{
								name: 'Signature',
								type: 'signature',
								role: 'Tenant',
								required: true,
								areas: [{ x: 5, y: 10, w: 20, h: 3, page: 1 }],
							},
						],
					},
				],
			},
		});
	});

	it('creates a template from DOCX files', async () => {
		respond(template);

		await invoke(Templates.createFromDocx, {
			name: 'From DOCX',
			external_id: 'docx-1',
			folder_name: 'Legal',
			shared_link: true,
			documents: [{ name: 'lease.docx', file: base64Pdf, dynamic: true }],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/templates/docx',
			body: {
				name: 'From DOCX',
				external_id: 'docx-1',
				folder_name: 'Legal',
				shared_link: true,
				documents: [{ name: 'lease.docx', file: base64Pdf, dynamic: true }],
			},
		});
	});

	it('clones a template by id with the copy options in the body', async () => {
		respond(template);

		await invoke(Templates.clone, {
			id: 12,
			name: 'Lease copy',
			folder_name: 'Legal',
			external_id: 'clone-1',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/templates/12/clone',
			body: {
				name: 'Lease copy',
				folder_name: 'Legal',
				external_id: 'clone-1',
			},
		});
	});

	it('merges templates by ids', async () => {
		respond(template);

		await invoke(Templates.merge, {
			template_ids: [12, 13],
			name: 'Merged',
			folder_name: 'Legal',
			external_id: 'merge-1',
			shared_link: true,
			roles: ['First party', 'Second party'],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/templates/merge',
			body: {
				template_ids: [12, 13],
				name: 'Merged',
				folder_name: 'Legal',
				external_id: 'merge-1',
				shared_link: true,
				roles: ['First party', 'Second party'],
			},
		});
	});

	it('updates template documents with add, replace and remove entries', async () => {
		respond(template);

		await invoke(Templates.updateDocuments, {
			id: 12,
			documents: [
				{ name: 'new.pdf', file: base64Pdf, position: 1, replace: true },
				{ html: '<p>Appendix</p>', remove: false },
			],
			merge: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/templates/12/documents',
			body: {
				documents: [
					{ name: 'new.pdf', file: base64Pdf, position: 1, replace: true },
					{ html: '<p>Appendix</p>', remove: false },
				],
				merge: true,
			},
		});
	});
});

describe('submissions requests', () => {
	it('lists submissions with every filter as a query parameter', async () => {
		respond(submissionList);

		await invoke(Submissions.list, {
			template_id: 12,
			status: 'completed',
			q: 'lease',
			slug: 'aQ9u7DkxZmPlWr',
			template_folder: 'Legal',
			archived: false,
			limit: 100,
			after: 55,
			before: 90,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/submissions',
			query: {
				template_id: '12',
				status: 'completed',
				q: 'lease',
				slug: 'aQ9u7DkxZmPlWr',
				template_folder: 'Legal',
				archived: 'false',
				limit: '100',
				after: '55',
				before: '90',
			},
		});
	});

	it('creates a submission from a template with per-role submitter fields', async () => {
		respond([submitterCreateResult]);

		await invoke(Submissions.create, {
			template_id: 12,
			submitters: [
				{
					role: 'Tenant',
					email: 'jordan@acme-logistics.example',
					name: 'Jordan Lee',
					values: { 'Start date': '2026-02-01' },
					external_id: 'user-9',
					completed: false,
					metadata: { crm_id: 'abc' },
					send_email: true,
					send_sms: false,
					reply_to: 'legal@fieldkit.example',
					completed_redirect_url: 'https://fieldkit.example/done',
					order: 1,
					require_email_2fa: true,
					invite_by: 'manager@fieldkit.example',
					message: { subject: 'Please sign', body: 'Thanks!' },
					fields: [
						{ name: 'Start date', default_value: '2026-02-01', readonly: true },
					],
					roles: ['Tenant'],
				},
			],
			send_email: true,
			send_sms: false,
			order: 'preserved',
			completed_redirect_url: 'https://fieldkit.example/done',
			bcc_completed: 'legal@fieldkit.example',
			reply_to: 'legal@fieldkit.example',
			expire_at: '2026-09-01 12:00:00 UTC',
			variables: { company: 'Fieldkit' },
			message: { subject: 'Please sign', body: 'Thanks!' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/submissions',
			body: {
				template_id: 12,
				send_email: true,
				send_sms: false,
				order: 'preserved',
				completed_redirect_url: 'https://fieldkit.example/done',
				bcc_completed: 'legal@fieldkit.example',
				reply_to: 'legal@fieldkit.example',
				expire_at: '2026-09-01 12:00:00 UTC',
				variables: { company: 'Fieldkit' },
				message: { subject: 'Please sign', body: 'Thanks!' },
				submitters: [
					{
						role: 'Tenant',
						email: 'jordan@acme-logistics.example',
						name: 'Jordan Lee',
						values: { 'Start date': '2026-02-01' },
						external_id: 'user-9',
						completed: false,
						metadata: { crm_id: 'abc' },
						send_email: true,
						send_sms: false,
						reply_to: 'legal@fieldkit.example',
						completed_redirect_url: 'https://fieldkit.example/done',
						order: 1,
						require_email_2fa: true,
						invite_by: 'manager@fieldkit.example',
						message: { subject: 'Please sign', body: 'Thanks!' },
						fields: [
							{
								name: 'Start date',
								default_value: '2026-02-01',
								readonly: true,
							},
						],
						roles: ['Tenant'],
					},
				],
			},
		});
	});

	it('creates a one-off submission from PDFs', async () => {
		respond(submissionCreateOneoffResult);

		await invoke(Submissions.createFromPdf, {
			name: 'One-off NDA',
			send_email: false,
			send_sms: false,
			order: 'random',
			completed_redirect_url: 'https://fieldkit.example/done',
			bcc_completed: 'legal@fieldkit.example',
			reply_to: 'legal@fieldkit.example',
			expire_at: '2026-09-01 12:00:00 UTC',
			template_ids: [12],
			documents: [{ name: 'nda.pdf', file: base64Pdf }],
			submitters: [
				{ role: 'Discloser', email: 'jordan@acme-logistics.example' },
			],
			message: { subject: 'Please sign' },
			flatten: true,
			merge_documents: true,
			remove_tags: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/submissions/pdf',
			body: {
				name: 'One-off NDA',
				send_email: false,
				send_sms: false,
				order: 'random',
				completed_redirect_url: 'https://fieldkit.example/done',
				bcc_completed: 'legal@fieldkit.example',
				reply_to: 'legal@fieldkit.example',
				expire_at: '2026-09-01 12:00:00 UTC',
				template_ids: [12],
				documents: [{ name: 'nda.pdf', file: base64Pdf }],
				submitters: [
					{ role: 'Discloser', email: 'jordan@acme-logistics.example' },
				],
				message: { subject: 'Please sign' },
				flatten: true,
				merge_documents: true,
				remove_tags: false,
			},
		});
	});

	it('creates a one-off submission from HTML', async () => {
		respond(submissionCreateOneoffResult);

		await invoke(Submissions.createFromHtml, {
			name: 'One-off from HTML',
			documents: [
				{
					html: '<p>Sign below</p>',
					name: 'appendix.html',
					html_header: '',
					html_footer: '',
					size: 'Letter',
					position: 2,
				},
			],
			submitters: [
				{ role: 'First party', email: 'jordan@acme-logistics.example' },
			],
			merge_documents: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/submissions/html',
			body: {
				name: 'One-off from HTML',
				merge_documents: true,
				documents: [
					{
						html: '<p>Sign below</p>',
						name: 'appendix.html',
						html_header: '',
						html_footer: '',
						size: 'Letter',
						position: 2,
					},
				],
				submitters: [
					{ role: 'First party', email: 'jordan@acme-logistics.example' },
				],
			},
		});
	});

	it('creates a one-off submission from DOCX with variables', async () => {
		respond(submissionCreateOneoffResult);

		await invoke(Submissions.createFromDocx, {
			name: 'One-off DOCX',
			variables: { company: 'Fieldkit' },
			documents: [{ name: 'nda.docx', file: base64Pdf }],
			submitters: [
				{ role: 'Discloser', email: 'jordan@acme-logistics.example' },
			],
			remove_tags: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/submissions/docx',
			body: {
				name: 'One-off DOCX',
				variables: { company: 'Fieldkit' },
				documents: [{ name: 'nda.docx', file: base64Pdf }],
				submitters: [
					{ role: 'Discloser', email: 'jordan@acme-logistics.example' },
				],
				remove_tags: true,
			},
		});
	});

	it('creates submissions from a comma-separated email list', async () => {
		respond([submitterCreateResult]);

		await invoke(Submissions.createFromEmails, {
			template_id: 12,
			emails: 'jordan@acme-logistics.example, sam@fieldkit.example',
			send_email: true,
			message: { subject: 'Please sign' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/submissions/emails',
			body: {
				template_id: 12,
				emails: 'jordan@acme-logistics.example, sam@fieldkit.example',
				send_email: true,
				message: { subject: 'Please sign' },
			},
		});
	});

	it('reads a submission by id', async () => {
		respond(submission);

		await invoke(Submissions.get, { id: 55 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/submissions/55',
			body: undefined,
		});
	});

	it('updates a submission, including a null expire_at to clear it', async () => {
		respond(submission);

		await invoke(Submissions.update, {
			id: 55,
			name: 'Lease for unit 4',
			expire_at: null,
			archived: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/submissions/55',
			body: { name: 'Lease for unit 4', expire_at: null, archived: false },
		});
	});

	it('archives a submission with DELETE', async () => {
		respond(archiveResult);

		await invoke(Submissions.archive, { id: 55 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/submissions/55',
			body: undefined,
		});
	});

	it('reads submission documents with the merge query', async () => {
		respond(submissionDocuments);

		await invoke(Submissions.getDocuments, { id: 55, merge: true });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/submissions/55/documents',
			query: { merge: 'true' },
		});
	});
});

describe('submitters requests', () => {
	it('lists submitters with every filter as a query parameter', async () => {
		respond(submitterList);

		await invoke(Submitters.list, {
			submission_id: 55,
			q: 'jordan',
			slug: 'STkiTbP8YgHhOa',
			completed_after: '2026-08-01T12:00:00Z',
			completed_before: '2026-09-01T12:00:00Z',
			external_id: 'user-9',
			limit: 10,
			after: 70,
			before: 80,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/submitters',
			query: {
				submission_id: '55',
				q: 'jordan',
				slug: 'STkiTbP8YgHhOa',
				completed_after: '2026-08-01T12:00:00Z',
				completed_before: '2026-09-01T12:00:00Z',
				external_id: 'user-9',
				limit: '10',
				after: '70',
				before: '80',
			},
		});
	});

	it('reads a submitter by id', async () => {
		respond(submitter);

		await invoke(Submitters.get, { id: 77 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/submitters/77',
			body: undefined,
		});
	});

	it('updates a submitter with the editable fields in the body', async () => {
		respond(submitterCreateResult);

		await invoke(Submitters.update, {
			id: 77,
			name: 'Jordan Lee',
			email: 'jordan@acme-logistics.example',
			phone: '+1 555-0100',
			values: { 'Start date': '2026-02-15' },
			external_id: 'user-9',
			send_email: true,
			send_sms: false,
			reply_to: 'legal@fieldkit.example',
			completed: true,
			metadata: { crm_id: 'abc' },
			completed_redirect_url: 'https://fieldkit.example/done',
			require_phone_2fa: true,
			message: { subject: 'Please sign' },
			fields: [{ name: 'Start date', default_value: '2026-02-15' }],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/submitters/77',
			body: {
				name: 'Jordan Lee',
				email: 'jordan@acme-logistics.example',
				phone: '+1 555-0100',
				values: { 'Start date': '2026-02-15' },
				external_id: 'user-9',
				send_email: true,
				send_sms: false,
				reply_to: 'legal@fieldkit.example',
				completed: true,
				metadata: { crm_id: 'abc' },
				completed_redirect_url: 'https://fieldkit.example/done',
				require_phone_2fa: true,
				message: { subject: 'Please sign' },
				fields: [{ name: 'Start date', default_value: '2026-02-15' }],
			},
		});
	});
});

import { ElorusRegisteredHandlers } from './endpoints';
import { elorusOperationSchemas } from './endpoints/types';
import type { ElorusContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
// The real resolveFileInput, with links served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		// unknown: a pass-through to the real resolveFileInput, which checks its own arguments.
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	served: new Map<string, { body: Uint8Array; type: string }>(),
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			const file = mockLinks.served.get(url.toString());
			return {
				status: file ? 200 : 404,
				headers: file ? { 'content-type': file.type } : {},
				body: (async function* () {
					if (file) yield file.body;
				})(),
			};
		},
	},
};

const context = {
	endpoints: {},
	db: {},
	$getAccountId: async () => 'fixture-account',
	key: 'fixture-token',
	options: { organizationId: 'org-1' },
	keys: {
		get_dek: async () => 'fixture-dek',
		issue_new_dek: async () => 'fixture-dek',
		get_api_key: async () => 'fixture-token',
		set_api_key: async (_value: string | null) => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async (_value: string | null) => undefined,
		get_organization_id: async () => 'org-1',
		set_organization_id: async (_value: string | null) => undefined,
	},
} satisfies ElorusContext;

// Every operation that uploads an attachment: one per document type.
const attachmentCreates = ElorusRegisteredHandlers.filter((handler) =>
	handler.operationKey.endsWith('_attachments_create'),
);

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0xff]);

let fetchSpy: jest.SpyInstance;
beforeEach(() => {
	mockLinks.served.clear();
	fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(
		async () =>
			new Response(JSON.stringify({ id: 'attachment-1', title: 'Receipt' }), {
				status: 201,
				headers: { 'content-type': 'application/json' },
			}),
	);
});
afterEach(() => fetchSpy.mockRestore());

/** The multipart body of the one Elorus request made. */
function sentForm(): FormData {
	expect(fetchSpy).toHaveBeenCalledTimes(1);
	const body = fetchSpy.mock.calls[0]?.[1]?.body;
	if (!(body instanceof FormData)) throw new Error('Expected a multipart body');
	return body;
}

describe('Elorus attachment uploads take a link, base64 or a Blob', () => {
	it('covers every attachment upload, each with the shared file schema', () => {
		expect(attachmentCreates).toHaveLength(11);
		for (const handler of attachmentCreates) {
			const schema = elorusOperationSchemas[handler.operationKey].input;
			const input = (file: unknown) => ({
				path: { parent_pk: 'doc-1' },
				form: { title: 'Receipt', file },
			});
			for (const file of [
				'https://files.example.com/receipt.pdf',
				'fil_abc123',
				{ url: 'https://files.example.com/receipt.pdf' },
				{ base64: 'JVBERi0x', contentType: 'application/pdf' },
				new Blob(['receipt']),
			]) {
				expect(schema.safeParse(input(file)).success).toBe(true);
			}
			for (const file of [undefined, '', 42, { path: '/tmp/receipt.pdf' }]) {
				expect(schema.safeParse(input(file)).success).toBe(false);
			}
		}
	});

	it.each(attachmentCreates.map((handler) => [handler.operationKey, handler]))(
		'%s downloads a link and sends it as the file part',
		async (_key, handler) => {
			mockLinks.served.set('https://files.example.com/docs/receipt.pdf', {
				body: PDF,
				type: 'application/pdf',
			});
			await handler.invoke(context, {
				path: { parent_pk: 'doc-1' },
				form: {
					title: 'Receipt',
					file: 'https://files.example.com/docs/receipt.pdf',
				},
			});
			const form = sentForm();
			expect(form.get('title')).toBe('Receipt');
			const file = form.get('file');
			expect(file).toBeInstanceOf(File);
			expect((file as File).name).toBe('receipt.pdf');
			expect((file as File).type).toBe('application/pdf');
			expect(new Uint8Array(await (file as File).arrayBuffer())).toEqual(PDF);
		},
	);

	it('decodes {base64, filename, contentType} into the file part', async () => {
		const [handler] = attachmentCreates;
		if (!handler) throw new Error('No attachment upload operation');
		await handler.invoke(context, {
			path: { parent_pk: 'doc-1' },
			form: {
				file: {
					base64: Buffer.from(PDF).toString('base64'),
					filename: 'scan.pdf',
					contentType: 'application/pdf',
				},
			},
		});
		const file = sentForm().get('file') as File;
		expect(file.name).toBe('scan.pdf');
		expect(file.type).toBe('application/pdf');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
	});

	it('takes {url, filename, contentType} and names the part from it', async () => {
		const [handler] = attachmentCreates;
		if (!handler) throw new Error('No attachment upload operation');
		mockLinks.served.set('https://files.example.com/get?id=3', {
			body: PDF,
			type: 'application/octet-stream',
		});
		await handler.invoke(context, {
			path: { parent_pk: 'doc-1' },
			form: {
				file: {
					url: 'https://files.example.com/get?id=3',
					filename: 'invoice.pdf',
					contentType: 'application/pdf',
				},
			},
		});
		const file = sentForm().get('file') as File;
		expect(file.name).toBe('invoice.pdf');
		expect(file.type).toBe('application/pdf');
	});

	it('still sends a Blob as before', async () => {
		const [handler] = attachmentCreates;
		if (!handler) throw new Error('No attachment upload operation');
		const blob = new Blob([PDF], { type: 'application/pdf' });
		await handler.invoke(context, {
			path: { parent_pk: 'doc-1' },
			form: { file: blob, primary: true },
		});
		const form = sentForm();
		expect(form.get('primary')).toBe('true');
		const file = form.get('file') as File;
		expect(file.type).toBe('application/pdf');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
	});

	it('refuses a file over 3 MB and a private address before any Elorus request', async () => {
		const [handler] = attachmentCreates;
		if (!handler) throw new Error('No attachment upload operation');
		mockLinks.served.set('https://files.example.com/big.pdf', {
			body: new Uint8Array(3 * 1024 * 1024 + 1),
			type: 'application/pdf',
		});
		for (const file of [
			'https://files.example.com/big.pdf',
			'https://127.0.0.1/x.pdf',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(
				handler.invoke(context, {
					path: { parent_pk: 'doc-1' },
					form: { file },
				}),
			).rejects.toThrow(/3 MB limit|file URL/);
		}
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});

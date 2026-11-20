import * as client from './client';
import { Template } from './endpoints';
import { CloudlayerEndpointInputSchemas } from './endpoints/types';
import type { CloudlayerContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeCloudlayerSyncRequest: jest.fn(),
		makeCloudlayerRequest: jest.fn(),
	};
});

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
	requested: [] as string[],
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			mockLinks.requested.push(url.toString());
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

const mockedRequest = jest.mocked(client.makeCloudlayerRequest);
const mockedSyncRequest = jest.mocked(client.makeCloudlayerSyncRequest);

// unknown: the template endpoints read only ctx.key and pass ctx to the logger.
const ctx = { key: 'unit-test-api-key' } as unknown as CloudlayerContext;
const job = { id: 'job-1', status: 'pending' };
const html = '<h1>Invoice {{ number }}</h1>';
const data = { number: 'INV-9' };

type SentForm = { template: Blob; data: string };

function sentForm(): SentForm {
	const options = mockedRequest.mock.calls.at(-1)?.[2] as {
		formData: SentForm;
	};
	return options.formData;
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedSyncRequest.mockReset();
	mockedRequest.mockResolvedValue(job);
	mockLinks.served.clear();
	mockLinks.requested.length = 0;
});

describe.each([
	['toPdf', '/template/pdf'],
	['toImage', '/template/image'],
] as const)(
	'template.%s takes the template file as FileInput',
	(name, path) => {
		const call = (input: unknown) =>
			// unknown: each case passes a different input form through the same endpoint.
			(Template[name] as (ctx: unknown, input: unknown) => Promise<unknown>)(
				ctx,
				input,
			);

		it('downloads a link and uploads it as the template part', async () => {
			const link = 'https://files.example.com/templates/invoice.html';
			mockLinks.served.set(link, {
				body: new TextEncoder().encode(html),
				type: 'text/html',
			});

			await expect(call({ template: link, data })).resolves.toEqual(job);

			expect(mockLinks.requested).toEqual([link]);
			expect(mockedRequest).toHaveBeenCalledWith(path, 'unit-test-api-key', {
				method: 'POST',
				formData: expect.any(Object),
			});
			const form = sentForm();
			expect(form.template).toBeInstanceOf(File);
			expect((form.template as File).name).toBe('invoice.html');
			expect(form.template.type).toBe('text/html');
			expect(await form.template.text()).toBe(html);
			expect(form.data).toBe(JSON.stringify(data));
			expect(mockedSyncRequest).not.toHaveBeenCalled();
		});

		it('decodes {base64, filename, contentType} into the template part', async () => {
			await call({
				template: {
					base64: Buffer.from(html).toString('base64'),
					filename: 'invoice.njk',
					contentType: 'text/html',
				},
				data,
			});

			const form = sentForm();
			expect((form.template as File).name).toBe('invoice.njk');
			expect(form.template.type).toBe('text/html');
			expect(await form.template.text()).toBe(html);
			expect(mockLinks.requested).toEqual([]);
		});

		it('still sends a Blob as it was given', async () => {
			const template = new Blob([html], { type: 'text/html' });

			await call({ template, data });

			expect(sentForm().template).toBe(template);
		});

		it('keeps a bare base64 string as the inline JSON template', async () => {
			const input = { template: Buffer.from(html).toString('base64'), data };

			await call(input);

			expect(mockedRequest).toHaveBeenCalledWith(path, 'unit-test-api-key', {
				method: 'POST',
				body: input,
			});
			expect(mockLinks.requested).toEqual([]);
		});

		it('refuses a private address before any cloudlayer.io request', async () => {
			await expect(
				call({ template: 'https://127.0.0.1/template.html', data }),
			).rejects.toThrow(/file URL/);
			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedSyncRequest).not.toHaveBeenCalled();
		});
	},
);

describe('template multipart input schema', () => {
	it.each(['template.toPdf', 'template.toImage'] as const)(
		'%s accepts a link or base64 object beside render data',
		(name) => {
			const schema = CloudlayerEndpointInputSchemas[name];
			expect(
				schema.safeParse({
					template: 'https://files.example.com/invoice.html',
					data,
				}).success,
			).toBe(true);
			expect(
				schema.safeParse({
					template: { url: 'https://files.example.com/invoice.html' },
					data,
				}).success,
			).toBe(true);
			expect(
				schema.safeParse({
					template: { base64: 'PGgxPkhpPC9oMT4=', filename: 'a.html' },
					data,
				}).success,
			).toBe(true);
			// A file still needs its render data, and an unknown file shape is refused.
			expect(
				schema.safeParse({ template: 'https://files.example.com/a.html' })
					.success,
			).toBe(false);
			expect(
				schema.safeParse({ template: { path: '/tmp/a.html' }, data }).success,
			).toBe(false);
		},
	);
});

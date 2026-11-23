import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as client from './client';
import { inkboxEndpointsNested } from './endpoints/catalog';
import type { InkboxOperationDefinition } from './endpoints/manifest';
import { inkboxDefinitions, inkboxOperations } from './endpoints/manifest';
import { inkboxInputFields } from './endpoints/openapi-schema';
import { fileNameFor, timeoutFor } from './endpoints/operations';
import type { InkboxContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeInkboxRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makeInkboxRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

function buildCtx(options: Record<string, unknown> = {}): InkboxContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'ib_test_key',
		options,
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('ib_test_key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read, not the whole plugin context.
	} as unknown as InkboxContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: InkboxContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = inkboxEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	return node as AnyEndpoint;
}

// `unknown` because a resolved schema is any JSON Schema document.
function resolveSchema(schema: unknown): Record<string, unknown> {
	let current = schema as Record<string, unknown> | undefined;
	for (
		let depth = 0;
		depth < 10 && current && typeof current.$ref === 'string';
		depth++
	) {
		current = inkboxDefinitions[current.$ref];
	}
	return current ?? {};
}

/** The smallest body that passes an operation's output schema. */
// `unknown` because each operation answers its own shape.
function sampleResponse(operation: InkboxOperationDefinition): unknown {
	if (operation.response === 'empty') return undefined;
	if (operation.response === 'file') {
		return { bytes: new Uint8Array([1, 2, 3]), contentType: 'image/png' };
	}
	const output = resolveSchema(operation.output);
	if (output.type === 'array') return [];
	if (output.type === 'string') return '';
	if (output.type === 'integer' || output.type === 'number') return 0;
	if (output.type === 'boolean') return false;
	return {};
}

beforeEach(() => {
	jest.clearAllMocks();
	// Drop queued answers too, so a call that throws early can't hand its
	// answer to the next test.
	mockedRequest.mockReset();
});

describe.each(inkboxOperations.map((operation) => [operation.id, operation]))(
	'%s',
	(id, operation) => {
		it('sends its apiExample to the documented route', async () => {
			const args = docs.apiExamples[id]?.args ?? {};
			mockedRequest.mockResolvedValueOnce(sampleResponse(operation));

			const result = await endpointFor(id)(buildCtx(), args);

			const sent = mockedRequest.mock.calls[0]?.[0];
			expect(sent?.method).toBe(operation.method);
			expect(sent?.path).toBe(operation.path);
			expect(sent?.key).toBe('ib_test_key');

			// Every {placeholder} is filled from the input.
			for (const name of operation.path.match(/\{([^}]+)\}/g) ?? []) {
				const key = name.slice(1, -1);
				expect([key, sent?.pathParameters?.[key]]).toEqual([
					key,
					String(args[key]),
				]);
			}
			// Path, query and header inputs never leak into the body.
			const fields = inkboxInputFields(id);
			if (
				sent?.body &&
				typeof sent.body === 'object' &&
				!Array.isArray(sent.body)
			) {
				for (const field of fields) {
					if (field.in !== 'body') {
						expect(Object.keys(sent.body as object)).not.toContain(field.name);
					}
				}
			}
			if (operation.request === 'none') expect(sent?.body).toBeUndefined();
			if (operation.request === 'multipart') {
				expect(sent?.body).toBeInstanceOf(FormData);
			}
			if (operation.response === 'file') {
				expect(sent?.responseType).toBe('binary');
				expect(result).toMatchObject({
					contentType: 'image/png',
					byteLength: 3,
				});
			}
			if (operation.response === 'empty') {
				expect(result).toEqual({ success: true });
			}
			expect(mockedLogEvent).toHaveBeenCalledWith(
				expect.anything(),
				'inkbox.operation',
				{ operationId: id },
				'completed',
			);
		});
	},
);

describe('routing', () => {
	it('sends path, query, header and body fields where the spec puts them', async () => {
		mockedRequest.mockResolvedValueOnce({ items: [], next_cursor: null });
		await endpointFor('mail.messages.list')(buildCtx(), {
			email_address: 'agent@inkboxmail.com',
			limit: 5,
		});
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			method: 'GET',
			path: '/api/v1/mail/mailboxes/{email_address}/messages',
			pathParameters: { email_address: 'agent@inkboxmail.com' },
			query: { limit: 5 },
		});
		mockedRequest.mockResolvedValueOnce({ id: 'm1' });
		await endpointFor('mail.messages.send')(buildCtx(), {
			email_address: 'agent@inkboxmail.com',
			recipients: { to: ['ada@example.com'] },
			subject: 'Hello',
			body_text: 'Hi Ada',
			prefer: 'idempotency-replay',
		});
		const sent = mockedRequest.mock.calls[1]?.[0];
		expect(sent).toMatchObject({
			method: 'POST',
			path: '/api/v1/mail/mailboxes/{email_address}/messages',
			pathParameters: { email_address: 'agent@inkboxmail.com' },
			body: {
				recipients: { to: ['ada@example.com'] },
				subject: 'Hello',
				body_text: 'Hi Ada',
			},
		});
		expect(sent?.headers?.Prefer).toBe('idempotency-replay');
	});

	it('sends a new Idempotency-Key per send unless one is given', async () => {
		mockedRequest.mockResolvedValue({ id: 'n1' });
		const input = { body: 'Escalate refunds over $500.' };
		await endpointFor('notes.create')(buildCtx(), input);
		await endpointFor('notes.create')(buildCtx(), input);
		await endpointFor('notes.create')(buildCtx(), {
			...input,
			idempotencyKey: 'note-2026-11-23',
		});
		const keys = mockedRequest.mock.calls.map(
			(call) => call[0].headers?.['Idempotency-Key'],
		);
		expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/);
		expect(keys[1]).toMatch(/^[0-9a-f-]{36}$/);
		expect(keys[0]).not.toBe(keys[1]);
		expect(keys[2]).toBe('note-2026-11-23');
		// The key is a header, never part of the body.
		expect(mockedRequest.mock.calls[2]?.[0].body).toEqual(input);
	});

	it('looks a send up by the key the caller names, never a made-up one', async () => {
		mockedRequest.mockResolvedValueOnce({ message_id: 'm1' });
		await endpointFor('messageSends.lookup')(buildCtx(), {
			sender_kind: 'mailbox',
			sender_id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
			operation: 'mail.send',
			idempotencyKey: 'send-2026-11-23-001',
		});
		expect(mockedRequest.mock.calls[0]?.[0].headers?.['Idempotency-Key']).toBe(
			'send-2026-11-23-001',
		);
		await expect(
			endpointFor('messageSends.lookup')(buildCtx(), {
				sender_kind: 'mailbox',
				sender_id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
				operation: 'send',
			}),
		).rejects.toThrow(/idempotencyKey/);
	});

	it('asks for an attachment link as JSON, so the key never follows a redirect', async () => {
		mockedRequest.mockResolvedValueOnce({ url: 'https://files.example.com/a' });
		await endpointFor('mail.messages.getAttachment')(buildCtx(), {
			email_address: 'agent@inkboxmail.com',
			message_id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
			filename: 'invoice.pdf',
		});
		expect(mockedRequest.mock.calls[0]?.[0].query).toEqual({ redirect: false });
	});

	it('uploads a file as multipart form data', async () => {
		mockedRequest.mockResolvedValueOnce({ agent_handle: 'support' });
		await endpointFor('identities.avatar.upload')(buildCtx(), {
			agent_handle: 'support',
			file: {
				base64: Buffer.from('png-bytes').toString('base64'),
				filename: 'avatar.png',
				contentType: 'image/png',
			},
		});
		const sent = mockedRequest.mock.calls[0]?.[0];
		expect(sent?.body).toBeInstanceOf(FormData);
		const file = (sent?.body as FormData).get('file') as File;
		expect(file.name).toBe('avatar.png');
		expect(Buffer.from(await file.arrayBuffer()).toString()).toBe('png-bytes');
	});

	it('sends a vCard import as raw text/vcard', async () => {
		mockedRequest.mockResolvedValueOnce({
			created_count: 1,
			error_count: 0,
			results: [],
		});
		const vcard = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Ada\r\nEND:VCARD\r\n';
		await endpointFor('contacts.import')(buildCtx(), {
			vcard,
			vcardPreviewHash: 'a'.repeat(64),
		});
		const sent = mockedRequest.mock.calls[0]?.[0];
		expect(sent?.body).toBe(vcard);
		expect(sent?.mediaType).toBe('text/vcard; charset=utf-8');
		expect(sent?.headers?.['X-VCard-Preview-Hash']).toBe('a'.repeat(64));
	});

	it('returns a downloaded file as a named file output', async () => {
		mockedRequest.mockResolvedValueOnce({
			bytes: new TextEncoder().encode('BEGIN:VCARD\r\nEND:VCARD\r\n'),
			contentType: 'text/vcard; charset=utf-8',
		});
		const result = (await endpointFor('contacts.exportVcard')(buildCtx(), {
			contact_id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
		})) as { filename?: string; contentType?: string };
		expect(mockedRequest.mock.calls[0]?.[0].responseType).toBe('binary');
		expect(result.filename).toBe('7c9e6679-7425-40de-944b-e07fc1f90ae7.vcf');
		expect(result.contentType).toMatch(/vcard/);
	});

	it('keeps body fields an open body does not list yet, and refuses them where the spec closes it', async () => {
		mockedRequest.mockResolvedValueOnce({ id: 'c1' });
		await endpointFor('contacts.create')(buildCtx(), {
			given_name: 'Ada',
			newField: 'kept',
			idempotencyKey: 'k',
		});
		expect(mockedRequest.mock.calls[0]?.[0].body).toEqual({
			given_name: 'Ada',
			newField: 'kept',
		});
		// notes.create's body is `additionalProperties: false` in the spec.
		await expect(
			endpointFor('notes.create')(buildCtx(), {
				body: 'x',
				newField: 'refused',
			}),
		).rejects.toThrow(/1 unknown field/);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
	});

	it('refuses invalid input before sending anything, naming fields not values', async () => {
		const call = () =>
			endpointFor('mail.messages.send')(buildCtx(), {
				email_address: 'agent@inkboxmail.com',
				recipients: { to: ['secret-person@example.com'] },
				subject: 42,
			});
		await expect(call()).rejects.toThrow(
			/Invalid input for inkbox mail\.messages\.send: subject:/,
		);
		await expect(call()).rejects.not.toThrow(/secret-person/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('masks unknown keys in validation errors and lists what the operation takes', async () => {
		const unknown = (await endpointFor('identities.get')(buildCtx(), {
			agent_handle: 'support',
			alice_phone: 'x',
		}).catch((e: unknown) => e)) as Error;
		expect(unknown.message).toBe(
			'Invalid input for inkbox identities.get: input: 1 unknown field (<key>); this operation takes agent_handle',
		);
	});

	it('fails a response that breaks its documented shape instead of inventing one', async () => {
		mockedRequest.mockResolvedValueOnce({ items: 'not-a-list' });
		await expect(
			endpointFor('mail.messages.list')(buildCtx(), {
				email_address: 'agent@inkboxmail.com',
			}),
		).rejects.toThrow(
			/mail\.messages\.list response did not match its documented schema/,
		);
		mockedRequest.mockResolvedValueOnce(undefined);
		await expect(
			endpointFor('identities.get')(buildCtx(), { agent_handle: 'support' }),
		).rejects.toThrow(/did not match/);
	});

	it('passes an ApiError through unchanged, so core and the handlers see its status', async () => {
		const unauthorized = new ApiError(
			{ method: 'GET', url: '/api/v1/identities/' },
			{
				url: 'x',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { detail: 'Unauthorized' },
			},
			'Inkbox 401: Unauthorized',
		);
		mockedRequest.mockRejectedValueOnce(unauthorized);
		await expect(endpointFor('identities.list')(buildCtx(), {})).rejects.toBe(
			unauthorized,
		);
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('helpers', () => {
	it('gives hosted-agent turns, calls and uploads longer to answer', () => {
		expect(timeoutFor('hostedChat.turns.create')).toBe(120_000);
		expect(timeoutFor('phone.calls.place')).toBe(120_000);
		expect(timeoutFor('identities.list')).toBe(30_000);
	});

	it('names downloaded files after what they are', () => {
		expect(
			fileNameFor('identities.avatar.get', { agent_handle: 'support' }),
		).toBe('support-avatar.jpg');
		expect(fileNameFor('phone.media.getPlayback', { media_id: 'med_1' })).toBe(
			'med_1.wav',
		);
		expect(
			fileNameFor(
				'slack.getCachedMedia',
				{ kind: 'emoji', resource_id: 'party' },
				'image/png',
			),
		).toBe('emoji-party.png');
		expect(fileNameFor('slack.files.download', {})).toBe('file');
	});
});

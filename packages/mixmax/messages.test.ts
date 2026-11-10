import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

const MESSAGE = {
	_id: 'msg-1',
	subject: 'Quarterly review',
	to: [{ email: 'alice@example.com', name: 'Alice' }],
};

const PAGE = { results: [MESSAGE], hasNext: false };

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax messages endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('messages.list sends GET /v1/messages with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.messages.list(ctx, {
			limit: 20,
			fields: 'subject,created',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages', {
			method: 'GET',
			query: {
				limit: 20,
				next: undefined,
				previous: undefined,
				fields: 'subject,created',
			},
		});
		expect(result).toEqual(PAGE);
	});

	it('messages.create posts the message fields as the body', async () => {
		request.mockResolvedValue(MESSAGE);
		const result = await endpoints.messages.create(ctx, {
			to: [{ email: 'alice@example.com', name: 'Alice' }],
			subject: 'Quarterly review',
			body: '<p>Agenda</p>',
			trackingEnabled: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages', {
			method: 'POST',
			body: {
				to: [{ email: 'alice@example.com', name: 'Alice' }],
				subject: 'Quarterly review',
				body: '<p>Agenda</p>',
				trackingEnabled: true,
			},
		});
		expect(result).toEqual(MESSAGE);
	});

	it('messages.get sends GET /v1/messages/:id and rejects unsafe ids', async () => {
		request.mockResolvedValue(MESSAGE);
		const result = await endpoints.messages.get(ctx, { id: 'msg-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages/msg-1', {
			method: 'GET',
		});
		expect(result).toEqual(MESSAGE);

		await expect(
			endpoints.messages.get(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('messages.update patches /v1/messages/:id without the id in the body', async () => {
		await endpoints.messages.update(ctx, {
			id: 'msg-1',
			subject: 'Updated',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages/msg-1', {
			method: 'PATCH',
			body: { subject: 'Updated' },
		});
	});

	it('messages.send posts /v1/messages/:id/send with data and options', async () => {
		request.mockResolvedValue({});
		await endpoints.messages.send(ctx, {
			id: 'msg-1',
			options: { implicit: true },
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages/msg-1/send', {
			method: 'POST',
			body: { data: undefined, options: { implicit: true } },
		});
	});

	it('messages.schedule posts /v1/messages/:id/schedule with the options envelope', async () => {
		await endpoints.messages.schedule(ctx, {
			id: 'msg-1',
			options: { scheduledDate: 1767225600000 },
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages/msg-1/schedule', {
			method: 'POST',
			body: {
				options: { scheduledDate: 1767225600000 },
				data: undefined,
			},
		});
	});

	it('messages.schedule rejects a missing scheduledDate before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.messages.schedule(ctx, { id: 'msg-1' } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('messages.unschedule deletes /v1/messages/:id/schedule', async () => {
		request.mockResolvedValue('OK');
		const result = await endpoints.messages.unschedule(ctx, {
			id: 'msg-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages/msg-1/schedule', {
			method: 'DELETE',
		});
		expect(result).toBe('OK');
	});

	it('messages.test posts /v1/messages/test with the documented fields', async () => {
		request.mockResolvedValue({});
		await endpoints.messages.test(ctx, {
			subject: 'Test',
			body: 'Hello',
			meetingTypeId: 'mt-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/messages/test', {
			method: 'POST',
			body: {
				subject: 'Test',
				body: 'Hello',
				meetingTypeId: 'mt-1',
				meetingTimeMs: undefined,
				primaryTimeZone: undefined,
			},
		});
	});

	it('messages.sendPlain posts /v1/send with the nested message envelope', async () => {
		await endpoints.messages.sendPlain(ctx, {
			message: {
				to: { address: 'ada@example.com', name: 'Ada Lovelace' },
				subject: 'Your invoice',
				html: '<p>Attached.</p>',
			},
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/send', {
			method: 'POST',
			body: {
				message: {
					to: { address: 'ada@example.com', name: 'Ada Lovelace' },
					subject: 'Your invoice',
					html: '<p>Attached.</p>',
				},
			},
		});
	});

	it('messages.sendPlain accepts an array of recipients, as the reference allows for Gmail accounts', async () => {
		const message = {
			to: [
				{ address: 'ada@example.com', name: 'Ada Lovelace' },
				{ address: 'grace@example.com' },
			],
			subject: 'Your invoice',
			html: '<p>Attached.</p>',
		};
		await endpoints.messages.sendPlain(ctx, { message });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/send', {
			method: 'POST',
			body: { message },
		});
	});

	it('messages.sendPlain rejects an empty recipient array before any request', async () => {
		await expect(
			endpoints.messages.sendPlain(ctx, {
				message: { to: [], subject: 'Your invoice', html: '<p>Attached.</p>' },
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('messages.sendPlain requires the message envelope', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.messages.sendPlain(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});

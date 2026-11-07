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

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const SEQUENCE = {
	_id: 'seq-1',
	userId: 'user-1',
	name: 'Sales leads',
	createdAt: '2026-10-14T15:00:00.000Z',
	stages: ['stage-1'],
	variables: ['Email'],
	cc: [],
	bcc: [],
	sendStagesAsReplies: true,
	timezone: 'America/Los_Angeles',
};

const FOLDER = {
	_id: 'folder-1',
	userId: 'user-1',
	name: 'Outbound',
	sequenceIds: ['seq-1'],
	shared: {},
	createdAt: '2026-10-14T15:00:00.000Z',
	savedAt: '2026-10-14T15:00:00.000Z',
};

describe('Mixmax sequences endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('sequences.list sends GET /v1/sequences with documented query params', async () => {
		const page = { results: [SEQUENCE], hasNext: false, next: 'cursor-1' };
		request.mockResolvedValue(page);
		const result = await endpoints.sequences.list(ctx, {
			folder: 'personal',
			limit: 20,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequences', {
			method: 'GET',
			query: {
				name: undefined,
				folder: 'personal',
				expand: undefined,
				fields: undefined,
				limit: 20,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('sequences.search sends GET /v1/sequences/search with documented query params', async () => {
		const response = {
			sequences: { total: 0, results: [] },
			recipients: {
				total: 1,
				results: [
					{
						_id: 'r-1',
						recipientId: 'r-1',
						userId: 'user-1',
						sequenceId: 'seq-1',
						email: 'ada@example.com',
						state: 'active',
						isActive: 1,
						numOpens: 2,
						sequence: { _id: 'seq-1', name: 'Sales leads' },
					},
				],
			},
		};
		request.mockResolvedValue(response);
		const result = await endpoints.sequences.search(ctx, {
			query: 'ada@example.com',
			limit: 10,
			offset: 5,
			sortDesc: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequences/search', {
			method: 'GET',
			query: {
				query: 'ada@example.com',
				recipients: undefined,
				sequenceId: undefined,
				limit: 10,
				offset: 5,
				sortBy: undefined,
				sortDesc: true,
			},
		});
		expect(result).toEqual(response);
	});

	it('sequences.cancelAll posts /v1/sequences/cancel with the documented body', async () => {
		request.mockResolvedValue({ recipients: ['ada@example.com'] });
		const result = await endpoints.sequences.cancelAll(ctx, {
			emails: ['ada@example.com'],
			reason: 'manuallyCancelled',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequences/cancel', {
			method: 'POST',
			body: {
				emails: ['ada@example.com'],
				reason: 'manuallyCancelled',
				orgId: undefined,
			},
		});
		expect(result).toEqual({ recipients: ['ada@example.com'] });
	});

	it('sequences.cancel posts /v1/sequences/:id/cancel with the emails body', async () => {
		request.mockResolvedValue({
			recipients: ['ada@example.com', 'grace@example.com'],
		});
		const result = await endpoints.sequences.cancel(ctx, {
			id: 'seq-1',
			emails: ['ada@example.com'],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequences/seq-1/cancel', {
			method: 'POST',
			body: { emails: ['ada@example.com'] },
		});
		expect(result).toEqual({
			recipients: ['ada@example.com', 'grace@example.com'],
		});
	});

	it('sequences.recipients.list sends GET /v1/sequences/:id/recipients and parses the bare array', async () => {
		const recipients = [
			{
				_id: 'r-1',
				sequenceId: 'seq-1',
				userId: 'user-1',
				state: 'completed',
				createdAt: 1787678973,
				to: { email: 'ada@example.com', name: 'Ada' },
				analytics: { events: { opens: 2, clicks: 0, downloads: 0 } },
			},
		];
		// The endpoint answers with a bare JSON array, not a page object.
		request.mockResolvedValue(recipients);
		const result = await endpoints.sequences.recipients.list(ctx, {
			id: 'seq-1',
			limit: 50,
			query: 'ada@example.com',
			includeVariables: true,
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/sequences/seq-1/recipients',
			{
				method: 'GET',
				query: {
					limit: 50,
					offset: undefined,
					sortBy: undefined,
					sortDesc: undefined,
					query: 'ada@example.com',
					analyticsFrom: undefined,
					includeVariables: true,
				},
			},
		);
		expect(Array.isArray(result)).toBe(true);
		expect(result).toEqual(recipients);
	});

	it('sequences.recipients.add posts /v1/sequences/:id/recipients with the documented body', async () => {
		const response = {
			recipients: [
				{
					id: 'r-1',
					email: 'ada@example.com',
					stages: ['stage-1'],
					status: 'success',
				},
			],
		};
		request.mockResolvedValue(response);
		const result = await endpoints.sequences.recipients.add(ctx, {
			id: 'seq-1',
			recipients: [
				{
					email: 'ada@example.com',
					variables: { 'First Name': 'Ada' },
					// `false` keeps the recipient in the draft; the provider
					// declares this field as an opaque value.
					scheduledAt: false,
				},
			],
			scheduledAt: 1792560000000,
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/sequences/seq-1/recipients',
			{
				method: 'POST',
				body: {
					recipients: [
						{
							email: 'ada@example.com',
							variables: { 'First Name': 'Ada' },
							scheduledAt: false,
						},
					],
					scheduledAt: 1792560000000,
					enrich: undefined,
					allowMissingVariables: undefined,
				},
			},
		);
		expect(result).toEqual(response);
	});

	it('sequenceFolders.list sends GET /v1/sequencefolders', async () => {
		const page = { results: [FOLDER] };
		request.mockResolvedValue(page);
		const result = await endpoints.sequenceFolders.list(ctx, {});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequencefolders', {
			method: 'GET',
		});
		expect(result).toEqual(page);
	});

	it('sequenceFolders.create posts /v1/sequencefolders with the name and options', async () => {
		request.mockResolvedValue(FOLDER);
		const result = await endpoints.sequenceFolders.create(ctx, {
			name: 'Outbound',
			options: { enforceNameUniqueness: true },
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequencefolders', {
			method: 'POST',
			body: { name: 'Outbound', options: { enforceNameUniqueness: true } },
		});
		expect(result).toEqual(FOLDER);
	});

	it('sequenceFolders.get sends GET /v1/sequencefolders/:id', async () => {
		request.mockResolvedValue(FOLDER);
		const result = await endpoints.sequenceFolders.get(ctx, { id: 'folder-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequencefolders/folder-1', {
			method: 'GET',
		});
		expect(result).toEqual(FOLDER);
	});

	it('sequenceFolders.rename patches /v1/sequencefolders/:id with the name body', async () => {
		const renamed = { ...FOLDER, name: 'Outbound 2026' };
		request.mockResolvedValue(renamed);
		const result = await endpoints.sequenceFolders.rename(ctx, {
			id: 'folder-1',
			name: 'Outbound 2026',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequencefolders/folder-1', {
			method: 'PATCH',
			body: { name: 'Outbound 2026', options: undefined },
		});
		expect(result).toEqual(renamed);
	});

	it('sequenceFolders.delete sends DELETE /v1/sequencefolders/:id', async () => {
		const result = await endpoints.sequenceFolders.delete(ctx, {
			id: 'folder-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/sequencefolders/folder-1', {
			method: 'DELETE',
		});
		expect(result).toBeUndefined();
	});

	it('sequenceFolders.addSequences posts /v1/sequencefolders/:id/sequences with the documented body', async () => {
		const response = {
			results: [
				{ id: 'seq-1', success: true },
				{ id: 'seq-2', success: false, message: 'Sequence not found.' },
			],
		};
		request.mockResolvedValue(response);
		const result = await endpoints.sequenceFolders.addSequences(ctx, {
			id: 'folder-1',
			_id: 'seq-1',
			sequenceIds: ['seq-1', 'seq-2'],
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/sequencefolders/folder-1/sequences',
			{
				method: 'POST',
				body: { _id: 'seq-1', sequenceIds: ['seq-1', 'seq-2'] },
			},
		);
		expect(result).toEqual(response);
	});

	it('rejects missing ids and bodies before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.sequences.cancel(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.sequences.recipients.list(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.sequences.recipients.add(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.sequenceFolders.get(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.sequenceFolders.rename(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.sequenceFolders.delete(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.sequenceFolders.addSequences(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe path ids before any request', async () => {
		await expect(
			endpoints.sequences.cancel(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		await expect(
			endpoints.sequenceFolders.get(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).not.toHaveBeenCalled();
	});

	it('sequences.recipients.add rejects an empty recipients array', async () => {
		await expect(
			endpoints.sequences.recipients.add(ctx, {
				id: 'seq-1',
				recipients: [],
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('sequenceFolders.rename rejects a missing name before any request', async () => {
		// A request without `name` would CLEAR the folder's name on the
		// provider, so the schema requires it up front.
		await expect(
			endpoints.sequenceFolders.rename(ctx, { id: 'folder-1' } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('sequenceFolders.addSequences rejects a body with neither _id nor sequenceIds', async () => {
		await expect(
			endpoints.sequenceFolders.addSequences(ctx, {
				id: 'folder-1',
			} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});

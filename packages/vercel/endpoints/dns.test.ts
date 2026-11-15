import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { createRecord, deleteRecord, getRecords, updateRecord } from './dns';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-token',
	options: {},
	db: {},
} as unknown as VercelContext;

type CreateInput = Parameters<typeof createRecord>[1];

beforeEach(() => {
	jest.clearAllMocks();
});

describe('dns', () => {
	it('getRecords sends pagination and parses records with nulls and new fields', async () => {
		request.mockResolvedValueOnce({
			records: [
				{
					id: 'rec_1',
					slug: 'example.com.-address',
					name: '',
					type: 'A',
					value: '192.0.2.42',
					creator: 'u1',
					created: 1,
					updated: 2,
					createdAt: null,
					updatedAt: null,
					ttl: 60,
					comment: 'apex',
					somethingNew: 'kept',
				},
			],
			pagination: { count: 1, next: 1, prev: null },
		});

		const result = await getRecords(ctx, {
			domain: 'example.com',
			limit: 20,
			until: 99,
			teamId: 'team_1',
		});

		expect(request).toHaveBeenCalledWith(
			'/v5/domains/example.com/records',
			ctx,
			{
				teamId: 'team_1',
				query: { limit: 20, until: 99 },
			},
		);
		expect(result.records[0]?.createdAt).toBeNull();
		expect(result.records[0]?.somethingNew).toBe('kept');
		expect(result.pagination?.next).toBe(1);
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.dns.getRecords',
			expect.objectContaining({ domain: 'example.com' }),
			'completed',
		);
	});

	it('getRecords accepts an empty zone', async () => {
		request.mockResolvedValueOnce({
			records: [],
			pagination: { count: 0, next: null, prev: null },
		});
		const result = await getRecords(ctx, { domain: 'example.com' });
		expect(result.records).toEqual([]);
	});

	it('getRecords rejects a record without an id', async () => {
		request.mockResolvedValueOnce({ records: [{ name: 'www', type: 'A' }] });
		await expect(getRecords(ctx, { domain: 'example.com' })).rejects.toThrow();
	});

	it('createRecord posts an A record without teamId or domain in the body', async () => {
		request.mockResolvedValueOnce({ uid: 'rec_new' });
		const result = await createRecord(ctx, {
			domain: 'example.com',
			teamId: 'team_1',
			type: 'A',
			name: '',
			value: '192.0.2.42',
			ttl: 3600,
			comment: 'apex',
		});
		expect(request).toHaveBeenCalledWith(
			'/v2/domains/example.com/records',
			ctx,
			{
				method: 'POST',
				teamId: 'team_1',
				body: {
					type: 'A',
					name: '',
					value: '192.0.2.42',
					ttl: 3600,
					comment: 'apex',
				},
			},
		);
		expect(result.uid).toBe('rec_new');
	});

	it('createRecord sends MX priority, SRV and HTTPS data', async () => {
		request.mockResolvedValue({ uid: 'rec_x' });
		await createRecord(ctx, {
			domain: 'example.com',
			type: 'MX',
			name: '',
			value: 'mail.example.com',
			mxPriority: 10,
		});
		await createRecord(ctx, {
			domain: 'example.com',
			type: 'SRV',
			name: '_sip._tcp',
			srv: { priority: 10, weight: 5, port: 5060, target: 'sip.example.com' },
		});
		await createRecord(ctx, {
			domain: 'example.com',
			type: 'HTTPS',
			name: 'www',
			https: { priority: 1, target: '.', params: 'alpn=h2,h3' },
		});
		expect(request.mock.calls.map((call) => call[2]?.body)).toEqual([
			{ type: 'MX', name: '', value: 'mail.example.com', mxPriority: 10 },
			{
				type: 'SRV',
				name: '_sip._tcp',
				srv: { priority: 10, weight: 5, port: 5060, target: 'sip.example.com' },
			},
			{
				type: 'HTTPS',
				name: 'www',
				https: { priority: 1, target: '.', params: 'alpn=h2,h3' },
			},
		]);
	});

	it('createRecord accepts the older { updated } response', async () => {
		request.mockResolvedValueOnce({ updated: 1700000000000 });
		const result = await createRecord(ctx, {
			domain: 'example.com',
			type: 'TXT',
			name: '_verify',
			value: 'token',
		});
		expect(result.updated).toBe(1700000000000);
		expect(result.uid).toBeUndefined();
	});

	it.each<[string, Record<string, unknown>]>([
		[
			'an A record with a hostname',
			{ type: 'A', name: '', value: 'example.com' },
		],
		[
			'an AAAA record with an IPv4',
			{ type: 'AAAA', name: '', value: '192.0.2.1' },
		],
		[
			'an MX record without mxPriority',
			{ type: 'MX', name: '', value: 'mx.example.com' },
		],
		['a CNAME without a value', { type: 'CNAME', name: 'www' }],
		['an SRV record without srv', { type: 'SRV', name: '_sip._tcp' }],
		['a TTL under 60', { type: 'TXT', name: 'x', value: 'y', ttl: 30 }],
		['an unknown type', { type: 'PTR', name: 'x', value: 'y' }],
		['a missing name', { type: 'TXT', value: 'y' }],
	])(
		'createRecord rejects %s before calling Vercel',
		async (_label, fields) => {
			await expect(
				createRecord(ctx, {
					domain: 'example.com',
					...fields,
				} as unknown as CreateInput),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);

	it('updateRecord patches by record id with the team and keeps null', async () => {
		request.mockResolvedValueOnce({
			id: 'rec_1',
			name: 'www',
			value: 'cname.vercel-dns.com',
			recordType: 'CNAME',
			type: 'record',
			ttl: 120,
			domain: 'example.com',
			creator: 'u1',
			createdAt: null,
			comment: null,
			extra: 1,
		});
		const result = await updateRecord(ctx, {
			recordId: 'rec_1',
			teamId: 'team_1',
			value: 'cname.vercel-dns.com',
			ttl: 120,
			mxPriority: null,
		});
		expect(request).toHaveBeenCalledWith('/v1/domains/records/rec_1', ctx, {
			method: 'PATCH',
			teamId: 'team_1',
			body: { value: 'cname.vercel-dns.com', ttl: 120, mxPriority: null },
		});
		expect(result.recordType).toBe('CNAME');
		expect(result.comment).toBeNull();
	});

	it('updateRecord needs a field to change', async () => {
		await expect(updateRecord(ctx, { recordId: 'rec_1' })).rejects.toThrow(
			'Pass at least one field to change.',
		);
		expect(request).not.toHaveBeenCalled();
	});

	it('updateRecord rejects a response without an id', async () => {
		request.mockResolvedValueOnce({ name: 'www' });
		await expect(
			updateRecord(ctx, { recordId: 'rec_1', comment: 'x' }),
		).rejects.toThrow();
	});

	it('deleteRecord reports the deletion after an empty response', async () => {
		request.mockResolvedValueOnce({});
		await expect(
			deleteRecord(ctx, {
				domain: 'example.com',
				recordId: 'rec_1',
				teamId: 'team_1',
			}),
		).resolves.toEqual({
			deleted: true,
			domain: 'example.com',
			recordId: 'rec_1',
		});
		expect(request).toHaveBeenCalledWith(
			'/v2/domains/example.com/records/rec_1',
			ctx,
			{ method: 'DELETE', teamId: 'team_1' },
		);
	});

	it('encodes path segments', async () => {
		request.mockResolvedValueOnce({});
		await deleteRecord(ctx, { domain: 'a/b.com', recordId: 'rec 1' });
		expect(request.mock.calls[0]?.[0]).toBe(
			'/v2/domains/a%2Fb.com/records/rec%201',
		);
	});

	it('lets a Vercel error through unchanged', async () => {
		const error = Object.assign(new Error('Forbidden'), { status: 403 });
		request.mockRejectedValueOnce(error);
		await expect(
			deleteRecord(ctx, { domain: 'example.com', recordId: 'rec_1' }),
		).rejects.toBe(error);
		expect(logEvent).not.toHaveBeenCalled();
	});
});

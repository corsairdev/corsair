import { logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import * as client from './client';
import { Events, Milestones, Sites } from './endpoints';
import type { FathomContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeFathomRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeFathomRequest);
jest.mocked(logEventFromContext);

// unknown: the endpoints read only key, $getAccountId and options here, so the
// test builds that subset instead of a full plugin context.
const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'test-api-token',
	options: {},
	keys: {},
	db: {},
} as unknown as FathomContext;

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('path ids cannot change the request path', () => {
	// `new URL('/v1/sites/CDBUGS/milestones/..', base)` resolves to `/v1/sites/CDBUGS/`,
	// so an id of `..` would turn a milestone or event call into a call on the site itself.
	it.each(['.', '..'])(
		'milestones.delete rejects milestone_id %p',
		async (id) => {
			await expect(
				Milestones.delete(ctx, { site_id: 'CDBUGS', milestone_id: id }),
			).rejects.toThrow(ZodError);
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);

	it.each(['.', '..'])('events.delete rejects event_id %p', async (id) => {
		await expect(
			Events.delete(ctx, { site_id: 'CDBUGS', event_id: id }),
		).rejects.toThrow(ZodError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it.each(['.', '..'])('sites.delete rejects site_id %p', async (id) => {
		await expect(Sites.delete(ctx, { site_id: id })).rejects.toThrow(ZodError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('still accepts ids that contain dots', async () => {
		mockedRequest.mockResolvedValue({
			id: 'a..b',
			object: 'milestone',
			deleted: true,
		});
		await Milestones.delete(ctx, { site_id: 'CDBUGS', milestone_id: 'a..b' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sites/CDBUGS/milestones/a..b',
			'test-api-token',
			{ method: 'DELETE' },
		);
	});
});

describe('responses with fields or values the spec does not list', () => {
	it('sites.get keeps working when Fathom adds a field', async () => {
		mockedRequest.mockResolvedValue({
			id: 'CDBUGS',
			object: 'site',
			name: 'Bugs Bunny Portfolio',
			sharing: 'none',
			created_at: '2020-07-27 12:01:01',
			timezone: 'America/New_York',
			multi_domain: true,
		});
		const site = await Sites.get(ctx, { site_id: 'CDBUGS' });
		expect(site.name).toBe('Bugs Bunny Portfolio');
	});

	it('sites.list keeps working with a sharing value the spec does not list', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			url: '/v1/sites',
			has_more: false,
			data: [
				{
					id: 'CDBUGS',
					object: 'site',
					name: 'Bugs Bunny Portfolio',
					sharing: 'team',
					created_at: '2020-07-27 12:01:01',
					timezone: 'America/New_York',
				},
			],
		});
		const list = await Sites.list(ctx, {});
		expect(list.data[0]?.sharing).toBe('team');
	});

	it('milestones.list keeps working when Fathom adds a field', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			url: '/api/v1/CDBUGS/milestones',
			has_more: false,
			data: [
				{
					id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
					object: 'milestone',
					name: 'Launch',
					milestone_date: '2024-01-15 00:00:00',
					created_at: '2024-01-10 12:00:00',
					updated_at: '2024-01-10 12:00:00',
					site_id: 'CDBUGS',
				},
			],
		});
		const list = await Milestones.list(ctx, { site_id: 'CDBUGS' });
		expect(list.data).toHaveLength(1);
	});
});

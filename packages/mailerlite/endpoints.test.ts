jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { MailerLiteEndpointInputSchemas as Inputs } from './endpoints/types';
import {
	campaign,
	campaignsListResponse,
	fieldsListResponse,
	group,
	groupsListResponse,
	subscriber,
	subscriberActivityResponse,
	subscribersListResponse,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	noContent,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('output parsing', () => {
	it('parses a subscriber list with nulls and keeps the provider meta names', async () => {
		mockFetch(jsonResponse(subscribersListResponse));

		const result = await endpoints.subscribers.list(makeCtx(), {});

		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.ip_address).toBeNull();
		expect(result.data[0]?.fields?.last_name).toBe('Testerson');
		expect(result.meta.next_cursor).toBe('eyJuZXh0');
		expect(result.meta.prev_cursor).toBe('eyJwcmV2');
	});

	it('parses a single subscriber', async () => {
		mockFetch(jsonResponse({ data: subscriber }));

		const result = await endpoints.subscribers.get(makeCtx(), {
			subscriberId: '31986843064993537',
		});

		expect(result.data.email).toBe('dummy@example.com');
		expect(result.data.unsubscribed_at).toBeNull();
	});

	it('parses an upsert answer that carries the groups key', async () => {
		mockFetch(jsonResponse({ data: { ...subscriber, groups: ['42'] } }));

		const result = await endpoints.subscribers.upsert(makeCtx(), {
			email: 'dummy@example.com',
		});

		expect(result.data.groups).toEqual(['42']);
	});

	it('parses an empty page without inventing subscribers', async () => {
		mockFetch(
			jsonResponse({
				data: [],
				links: { first: null, last: null, prev: null, next: null },
				meta: { path: 'x', per_page: 25, next_cursor: null, prev_cursor: null },
			}),
		);

		const result = await endpoints.subscribers.list(makeCtx(), {});

		expect(result.data).toEqual([]);
		expect(result.meta.next_cursor).toBeNull();
	});

	it('derives a delete result from a bodyless 204', async () => {
		mockFetch(noContent());

		const result = await endpoints.subscribers.delete(makeCtx(), {
			subscriberId: '31986843064993537',
		});

		expect(result).toEqual({ deleted: true, id: '31986843064993537' });
	});

	it('derives a removeFromGroup result from a bodyless 204', async () => {
		mockFetch(noContent());

		const result = await endpoints.subscribers.removeFromGroup(makeCtx(), {
			subscriberId: '31986843064993537',
			groupId: '42',
		});

		expect(result).toEqual({ deleted: true, id: '31986843064993537' });
	});

	it('parses a group with the object open_rate shape', async () => {
		mockFetch(jsonResponse({ data: group }));

		const result = await endpoints.groups.create(makeCtx(), { name: 'g' });

		expect(result.data.open_rate).toEqual({ float: 0, string: '0%' });
	});

	it('parses a groups page with its page meta', async () => {
		mockFetch(jsonResponse(groupsListResponse));

		const result = await endpoints.groups.list(makeCtx(), {});

		expect(result.meta.total).toBe(1);
		expect(result.meta.last_page).toBe(1);
		expect(result.data[0]?.name).toBe('dummy group');
	});

	it('parses a fields page', async () => {
		mockFetch(jsonResponse(fieldsListResponse));

		const result = await endpoints.fields.list(makeCtx(), {});

		expect(result.data[0]).toMatchObject({ key: 'new_field', type: 'text' });
	});

	it('parses a campaigns page', async () => {
		mockFetch(jsonResponse(campaignsListResponse));

		const result = await endpoints.campaigns.list(makeCtx(), {});

		expect(result.data[0]?.status).toBe('draft');
		expect(result.meta.total).toBe(1);
	});

	it('parses a schedule answer that sent synchronously', async () => {
		mockFetch(jsonResponse({ data: campaign }));

		const result = await endpoints.campaigns.schedule(makeCtx(), {
			campaignId: '1',
			delivery: 'instant',
		});

		expect(result.data.status).toBe('sent');
		expect(result.data.started_at).toBe('2022-07-26 15:12:04');
	});

	it('parses a cancel answer returning the campaign to draft', async () => {
		mockFetch(
			jsonResponse({
				data: { ...campaign, status: 'draft', finished_at: null },
			}),
		);

		const result = await endpoints.campaigns.cancel(makeCtx(), {
			campaignId: '1',
		});

		expect(result.data.status).toBe('draft');
	});

	it('parses subscriber activity with aggregations', async () => {
		mockFetch(jsonResponse(subscriberActivityResponse));

		const result = await endpoints.campaigns.activity(makeCtx(), {
			campaignId: '66200823885989563',
		});

		expect(result.data[0]?.subscriber?.email).toBe('dummy@mailerlite.com');
		expect(result.meta.aggregations?.opened).toBe(1);
	});
});

describe('rejection shapes', () => {
	it('rejects a wrong-shaped payload instead of mapping it to a blank row', async () => {
		mockFetch(jsonResponse({ data: 'not-a-subscriber' }));

		await expect(
			endpoints.subscribers.get(makeCtx(), { subscriberId: '1' }),
		).rejects.toThrow();
	});

	it('rejects a malformed known field', async () => {
		mockFetch(jsonResponse({ data: { ...subscriber, email: 12345, id: '1' } }));

		await expect(
			endpoints.subscribers.get(makeCtx(), { subscriberId: '1' }),
		).rejects.toThrow();
	});

	it('rejects a present envelope whose data is missing', async () => {
		mockFetch(jsonResponse({ links: {}, meta: {} }));

		await expect(endpoints.groups.list(makeCtx(), {})).rejects.toThrow();
	});
});

describe('input constraint rejections', () => {
	it('rejects an invalid email on upsert', () => {
		expect(
			Inputs.subscribersUpsert.safeParse({ email: 'not-an-email' }).success,
		).toBe(false);
	});

	it('rejects a group name over 255 characters', () => {
		expect(
			Inputs.groupsCreate.safeParse({ name: 'x'.repeat(256) }).success,
		).toBe(false);
		expect(
			Inputs.groupsCreate.safeParse({ name: 'x'.repeat(255) }).success,
		).toBe(true);
	});

	it('rejects a subscriber limit over the 1000 cap', () => {
		expect(Inputs.subscribersList.safeParse({ limit: 1001 }).success).toBe(
			false,
		);
	});

	it('rejects a note longer than 10000 characters', () => {
		expect(
			Inputs.subscribersUpsert.safeParse({
				email: 'a@b.com',
				notes: ['x'.repeat(10001)],
			}).success,
		).toBe(false);
	});

	it('rejects a field type filter outside the documented enum', () => {
		expect(Inputs.fieldsList.safeParse({ filterType: 'banana' }).success).toBe(
			false,
		);
	});

	it('rejects a malformed sort field', () => {
		expect(Inputs.groupsList.safeParse({ sort: 'banana' }).success).toBe(false);
		expect(Inputs.groupsList.safeParse({ sort: '-active_count' }).success).toBe(
			true,
		);
	});

	it('rejects more than one email on a regular campaign', () => {
		const two = {
			name: 'c',
			type: 'regular' as const,
			emails: [
				{ subject: 's', from_name: 'n', from: 'sender@mailerlite.io' },
				{ subject: 's2', from_name: 'n', from: 'sender@mailerlite.io' },
			],
		};
		expect(Inputs.campaignsCreate.safeParse(two).success).toBe(false);
	});

	it('rejects a regular campaign email without sender fields', () => {
		expect(
			Inputs.campaignsCreate.safeParse({
				name: 'c',
				type: 'regular',
				emails: [{ subject: 's' }],
			}).success,
		).toBe(false);
	});

	it('rejects content alongside the simple editor', () => {
		expect(
			Inputs.campaignsCreate.safeParse({
				name: 'c',
				type: 'regular',
				emails: [
					{
						subject: 's',
						from_name: 'n',
						from: 'sender@mailerlite.io',
						editor: 'simple',
						content: '<p>html</p>',
					},
				],
			}).success,
		).toBe(false);
	});

	it('rejects an ab campaign without ab_settings', () => {
		expect(
			Inputs.campaignsCreate.safeParse({
				name: 'c',
				type: 'ab',
				emails: [
					{ subject: 's', from_name: 'n', from: 'sender@mailerlite.io' },
				],
			}).success,
		).toBe(false);
	});

	it('rejects a scheduled delivery without a date', () => {
		expect(
			Inputs.campaignsSchedule.safeParse({
				campaignId: '1',
				delivery: 'scheduled',
			}).success,
		).toBe(false);
	});

	it('rejects a scheduled delivery without hour and minute', () => {
		expect(
			Inputs.campaignsSchedule.safeParse({
				campaignId: '1',
				delivery: 'timezone_based',
				schedule: { date: '2026-12-01' },
			}).success,
		).toBe(false);
	});

	it('accepts a smart_sending delivery with only a date', () => {
		// smart_sending needs the date but not the clock time (docs table).
		expect(
			Inputs.campaignsSchedule.safeParse({
				campaignId: '1',
				delivery: 'smart_sending',
				schedule: { date: '2026-12-01' },
			}).success,
		).toBe(true);
	});

	it('rejects an activity limit outside the 10/25/50/100 enum', () => {
		expect(
			Inputs.campaignsActivity.safeParse({ campaignId: '1', limit: 30 })
				.success,
		).toBe(false);
		expect(
			Inputs.campaignsActivity.safeParse({ campaignId: '1', limit: 50 })
				.success,
		).toBe(true);
	});

	it('rejects an activity type filter outside the documented enum', () => {
		expect(
			Inputs.campaignsActivity.safeParse({
				campaignId: '1',
				filterType: 'forwarded_by_mars',
			}).success,
		).toBe(false);
	});
});

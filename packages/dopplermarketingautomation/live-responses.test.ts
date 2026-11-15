import type { DopplerMarketingAutomationContext } from './index';
import { dopplermarketingautomation } from './index';

// Replies seen on the 11-16 live run against a Doppler free trial, trimmed,
// with addresses replaced.
const context = { key: 'test-key' } as DopplerMarketingAutomationContext;
const endpoints = dopplermarketingautomation().endpoints!;

describe('Doppler live response shapes', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => fetchMock.mockReset());
	afterAll(() => fetchMock.mockRestore());

	it('parses a subscriber whose permission-history link has href null', async () => {
		const subscriber = {
			email: 'a@example.com',
			fields: [
				{
					name: 'CONSENT',
					value: 'false',
					predefined: true,
					private: false,
					readonly: false,
					type: 'consent',
				},
			],
			belongsToLists: [],
			status: 'active',
			score: 1,
			_links: [
				{
					href: '/accounts/team/unsubscribed',
					description: 'Unsubscribe.',
					rel: '/docs/rels/unsubscribe',
				},
				{
					href: null,
					description: 'Get the history of the changes of a permission field.',
					rel: '/docs/rels/get-permission-history',
				},
			],
		};
		fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(subscriber)));
		await expect(
			endpoints.subscribers.get(context, {
				accountName: 'team',
				email: 'a@example.com',
			}),
		).resolves.toMatchObject({ status: 'active' });
	});

	it('answers exists with true on 200 and false on 404', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
		await expect(
			endpoints.subscribers.exists(context, {
				accountName: 'team',
				email: 'a@example.com',
			}),
		).resolves.toBe(true);
		fetchMock.mockResolvedValueOnce(
			new Response(null, { status: 404, statusText: 'Not Found' }),
		);
		await expect(
			endpoints.subscribers.exists(context, {
				accountName: 'team',
				email: 'nobody@example.com',
			}),
		).resolves.toBe(false);
	});

	it('still parses a list status Doppler adds later', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					name: 'corsair-plugin-test',
					listId: 1,
					currentStatus: 'someNewStatus',
				}),
			),
		);
		await expect(
			endpoints.lists.get(context, { accountName: 'team', listId: 1 }),
		).resolves.toMatchObject({ currentStatus: 'someNewStatus' });
	});

	it('sends every request with a deadline', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ items: [] })),
		);
		await endpoints.lists.list(context, { accountName: 'team' });
		expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
	});
});

describe('Doppler campaign shipping input', () => {
	it('needs a date to schedule and refuses one for an immediate send', async () => {
		const ship = (shipping: {
			type: 'immediate' | 'scheduled';
			scheduledDate?: string;
		}) =>
			endpoints.campaigns.createShipping(context, {
				accountName: 'team',
				campaignId: 1,
				shipping,
			});
		await expect(ship({ type: 'scheduled' })).rejects.toThrow(
			'scheduledDate is required',
		);
		await expect(
			ship({ type: 'immediate', scheduledDate: '2027-01-01T10:00:00Z' }),
		).rejects.toThrow('scheduledDate must be empty');
	});
});

describe('Doppler risk levels', () => {
	it('marks sends, cancels, unsubscribes and content deletes destructive', () => {
		for (const operation of [
			'campaigns.createShipping',
			'campaigns.deleteShipping',
			'campaigns.deleteTextAlternative',
			'subscribers.doubleOptIn',
			'subscribers.unsubscribe',
			'subscribers.importUnsubscribed',
		] as const) {
			expect(
				dopplermarketingautomation().endpointMeta?.[operation]?.riskLevel,
			).toBe('destructive');
		}
	});
});

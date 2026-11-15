import { request } from 'corsair/http';
import {
	listAnsweredScorecards,
	listInteractionStats,
	listMultipleUsersAggregateActivity,
	listMultipleUsersAggregateByPeriod,
	listMultipleUsersDayByDayActivity,
} from './stats';
import { GongStatsInputSchemas, GongStatsOutputSchemas } from './stats-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'token',
	options: {
		authType: 'oauth_2' as const,
		baseUrl: 'https://us-123.api.gong.io',
	},
	$getAccountId: async () => 'account-id',
};
const dateBody = { filter: { fromDate: '2025-01-01', toDate: '2025-01-02' } };
const records = {};

describe('Gong stats endpoints', () => {
	beforeEach(() => mockedRequest.mockReset());

	it('validates required date filters and the interaction response envelope', () => {
		expect(
			GongStatsInputSchemas.listInteractionStats.safeParse({}).success,
		).toBe(false);
		expect(
			GongStatsInputSchemas.listInteractionStats.safeParse(dateBody).success,
		).toBe(true);
		expect(
			GongStatsOutputSchemas.listInteractionStats.safeParse({
				requestId: 'r1',
				records,
				peopleInteractionStats: [],
				fromDateTime: '2025-01-01',
				toDateTime: '2025-01-02',
				timeZone: 'UTC',
			}).success,
		).toBe(true);
	});

	it('posts interaction stats to the documented route', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r1',
			records,
			peopleInteractionStats: [],
			fromDateTime: '2025-01-01',
			toDateTime: '2025-01-02',
			timeZone: 'UTC',
		});
		await listInteractionStats(ctx, dateBody);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://us-123.api.gong.io',
				HEADERS: { Authorization: 'Bearer token' },
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/stats/interaction',
				body: dateBody,
			}),
		);
	});

	it('posts the answered-scorecards filter body', async () => {
		const body = { filter: {} };
		mockedRequest.mockResolvedValue({
			requestId: 'r2',
			records,
			answeredScorecards: [],
		});
		await listAnsweredScorecards(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/stats/activity/scorecards',
				body,
			}),
		);
	});

	it('posts the daily activity date filter', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r3',
			records,
			usersDetailedActivities: [],
		});
		await listMultipleUsersDayByDayActivity(ctx, dateBody);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/stats/activity/day-by-day',
				body: dateBody,
			}),
		);
	});

	it('posts the aggregate activity date filter', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r4',
			records,
			usersAggregateActivityStats: [],
		});
		await listMultipleUsersAggregateActivity(ctx, dateBody);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/stats/activity/aggregate',
				body: dateBody,
			}),
		);
	});

	it('sends the aggregation period and cursor in the documented body', async () => {
		const body = {
			...dateBody,
			aggregationPeriod: 'WEEK' as const,
			cursor: 'next',
		};
		mockedRequest.mockResolvedValue({
			requestId: 'r3',
			records,
			usersAggregateActivity: [],
		});
		await listMultipleUsersAggregateByPeriod(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/stats/activity/aggregate-by-period',
				body,
			}),
		);
		expect(
			GongStatsInputSchemas.listMultipleUsersAggregateByPeriod.safeParse({
				...body,
				aggregationPeriod: 'DECADE',
			}).success,
		).toBe(false);
	});
});

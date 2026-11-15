import { request } from 'corsair/http';
import { listBriefs, listScorecards, listTrackers } from './settings';
import {
	GongSettingsInputSchemas,
	GongSettingsOutputSchemas,
} from './settings-types';

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

describe('Gong settings endpoints', () => {
	beforeEach(() => mockedRequest.mockReset());

	it('validates optional workspace filters and the list response envelopes', () => {
		expect(
			GongSettingsInputSchemas.listTrackers.safeParse({ workspaceId: 'w1' })
				.success,
		).toBe(true);
		expect(
			GongSettingsOutputSchemas.listTrackers.safeParse({
				requestId: 'r1',
				keywordTrackers: [],
			}).success,
		).toBe(true);
		expect(
			GongSettingsOutputSchemas.listScorecards.safeParse({
				requestId: 'r1',
				scorecards: [],
			}).success,
		).toBe(true);
		expect(
			GongSettingsOutputSchemas.listBriefs.safeParse({
				requestId: 'r1',
				briefs: [],
			}).success,
		).toBe(true);
	});

	it.each([
		[
			'trackers',
			listTrackers,
			'/v2/settings/trackers',
			{ workspaceId: 'workspace-1' },
			{ requestId: 'r1', keywordTrackers: [] },
		],
		[
			'scorecards',
			listScorecards,
			'/v2/settings/scorecards',
			{},
			{ requestId: 'r2', scorecards: [] },
		],
		[
			'briefs',
			listBriefs,
			'/v2/settings/briefs',
			{ workspaceId: 'workspace-2' },
			{ requestId: 'r3', briefs: [] },
		],
	] as const)(
		'gets %s with the exact route and query',
		async (_label, handler, path, query, response) => {
			mockedRequest.mockResolvedValue(response);
			if (handler === listScorecards) await handler(ctx);
			else await handler(ctx, query);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({ method: 'GET', url: path, query }),
			);
		},
	);
});

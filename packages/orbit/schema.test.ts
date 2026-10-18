import { mergeBulk, mergeEnrich, mergeSearch } from './schema/database';

describe('orbit job merge', () => {
	it('keeps a finished search when a late poll is still running', () => {
		const merged = mergeSearch(
			{
				searchId: 'search_1',
				status: 'completed',
				requestId: 'req_1',
				updatedAt: '2026-10-18T00:00:00.000Z',
			},
			{
				searchId: 'search_1',
				status: 'running',
				updatedAt: '2026-10-17T00:00:00.000Z',
			},
		);
		expect(merged.status).toBe('completed');
		expect(merged.updatedAt).toBe('2026-10-18T00:00:00.000Z');
	});

	it('fills a missing charge without rewinding a finished enrichment', () => {
		const merged = mergeEnrich(
			{ requestId: 'req_1', status: 'completed' },
			{
				requestId: 'req_1',
				status: 'running',
				billing: { status: 'settled', consumedCredits: 2 },
			},
		);
		expect(merged.status).toBe('completed');
		expect(merged.billing?.consumedCredits).toBe(2);
	});

	it('does not rewind a canceled bulk job', () => {
		const merged = mergeBulk(
			{ jobId: 'job_1', status: 'canceled' },
			{ jobId: 'job_1', status: 'running' },
		);
		expect(merged.status).toBe('canceled');
	});
});

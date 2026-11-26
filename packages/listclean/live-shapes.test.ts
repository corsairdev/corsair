jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	LIVE_ANALYTICS,
	LIVE_LISTS_EMPTY,
	LIVE_LOGS,
	LIVE_UPLOAD_ROW,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
} from './test-helpers';

// Shapes the live API answered on 2026-11-26 that the spec describes
// differently.
describe('Listclean answers as the live API sends them', () => {
	beforeEach(installFetchMock);
	afterEach(restoreFetchMock);

	it('lists.listLists reads total sent as a string', async () => {
		mockFetch(ok(LIVE_LISTS_EMPTY));

		const result = await endpoints.lists.listLists(makeCtx(), {});

		expect(result.total).toBe('0');
		expect(result.lists).toEqual([]);
	});

	it('verify.getVerificationLogs reads the logs object with its total_count', async () => {
		mockFetch(ok(LIVE_LOGS));

		const result = await endpoints.verify.getVerificationLogs(makeCtx(), {
			start_date: '2026-11-25',
			end_date: '2026-11-26',
		});

		expect(result.total_count).toBe(1);
		expect(result.logs).toHaveLength(1);
		expect(result.logs[0]).toMatchObject({
			status: 'dirty',
			source: 'api',
			reason_code: 'EH3',
		});
	});

	it('verify.getAnalytics reads graph_summary as an object of parallel arrays', async () => {
		mockFetch(ok(LIVE_ANALYTICS));

		const result = await endpoints.verify.getAnalytics(makeCtx(), {
			start_date: '2026-11-25',
			end_date: '2026-11-26',
		});

		expect(result.total_summary?.dirty?.count).toBe(1);
		expect(result.datewise_summary?.['20261126']?.dirty?.count).toBe('1');
		expect(result.graph_summary?.dates).toEqual(['2026-11-25', '2026-11-26']);
		expect(result.graph_summary?.dirty_counts).toEqual([0, 1]);
	});

	it('uploads.listUploads reads rows keyed by id with a lowercase status', async () => {
		mockFetch(ok([LIVE_UPLOAD_ROW]));

		const result = await endpoints.uploads.listUploads(makeCtx(), {});

		expect(result[0]?.id).toBe(2);
		expect(result[0]?.status).toBe('success');
		expect(result[0]?.total_records).toBe(100);
	});
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	BATCH_ACCEPTED,
	CREDITS,
	LISTS_PAGE,
	RESULT_ROWS,
	SINGLE_LIST,
	VERIFY_RESULT,
} from './test-fixtures';
import {
	BASE,
	captureError,
	currentFetch,
	downloadResponse,
	endpoints,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Listclean request shapes', () => {
	it('verify.verifyEmail sends GET /verify/email/{email} with the address percent-encoded', async () => {
		mockFetch(ok(VERIFY_RESULT));

		await endpoints.verify.verifyEmail(makeCtx(), {
			email: 'myselfi.itba@gmail.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/verify/email/myselfi.itba%40gmail.com`,
		);
		expect(lastCall().init.method).toBe('GET');
		expect(sentHeader('X-Auth-Token')).toBe('test-token');
	});

	it('verify.startBatchVerification posts the emails and filename to /verify/email/batch', async () => {
		mockFetch(ok(BATCH_ACCEPTED));

		await endpoints.verify.startBatchVerification(makeCtx(), {
			emails: ['user1@example.com', 'user2@example.com'],
			filename: 'october-leads.csv',
		});

		expect(lastCall().url).toBe(`${BASE}/verify/email/batch`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			emails: ['user1@example.com', 'user2@example.com'],
			filename: 'october-leads.csv',
		});
	});

	it('verify.startBatchVerification omits the filename when unset, rather than sending null', async () => {
		mockFetch(ok(BATCH_ACCEPTED));

		await endpoints.verify.startBatchVerification(makeCtx(), {
			emails: ['user1@example.com'],
		});

		expect(sentBody()).toEqual({ emails: ['user1@example.com'] });
	});

	it('verify.getVerificationLogs sends the range and filters as query parameters', async () => {
		mockFetch(ok({ logs: [], total_count: 0 }));

		await endpoints.verify.getVerificationLogs(makeCtx(), {
			start_date: '2026-11-01',
			end_date: '2026-11-25',
			status: 'dirty',
			limit: 100,
		});

		expect(lastCall().url).toBe(
			`${BASE}/logs?start_date=2026-11-01&end_date=2026-11-25&limit=100&status=dirty`,
		);
		expect(lastCall().init.method).toBe('GET');
	});

	it('verify.getVerificationLogs omits every unset filter rather than sending null', async () => {
		mockFetch(ok({ logs: [], total_count: 0 }));

		await endpoints.verify.getVerificationLogs(makeCtx(), {
			start_date: '2026-11-01',
			end_date: '2026-11-25',
		});

		expect(lastCall().url).toBe(
			`${BASE}/logs?start_date=2026-11-01&end_date=2026-11-25`,
		);
	});

	it('verify.getAnalytics sends the range and optional filters to /analytics', async () => {
		mockFetch(ok({}));

		await endpoints.verify.getAnalytics(makeCtx(), {
			start_date: '2026-11-01',
			end_date: '2026-11-25',
			source: 'api',
		});

		expect(lastCall().url).toBe(
			`${BASE}/analytics?start_date=2026-11-01&end_date=2026-11-25&source=api`,
		);
	});

	it('lists.listLists uses the documented trailing slash on /lists/', async () => {
		mockFetch(ok(LISTS_PAGE));

		await endpoints.lists.listLists(makeCtx(), {});

		// /credits/ answers 404, so the slash is not optional everywhere; the
		// spec spelling is sent as documented.
		expect(lastCall().url).toBe(`${BASE}/lists/`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('lists.getList reads one list by path id', async () => {
		mockFetch(ok(SINGLE_LIST));

		await endpoints.lists.getList(makeCtx(), { list_id: 159261 });

		expect(lastCall().url).toBe(`${BASE}/lists/159261`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('lists.getListResults downloads the JSON stream for one type', async () => {
		mockFetch(downloadResponse(RESULT_ROWS));

		const result = await endpoints.lists.getListResults(makeCtx(), {
			list_id: 159261,
			type: 'clean',
		});

		expect(lastCall().url).toBe(`${BASE}/downloads/json/159261/clean`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.map((row) => row.status)).toEqual(['clean', 'dirty']);
	});

	it('lists.delete sends DELETE to the list path', async () => {
		mockFetch(ok({}));

		await endpoints.lists.delete(makeCtx(), { list_id: 159261 });

		expect(lastCall().url).toBe(`${BASE}/lists/159261`);
		expect(lastCall().init.method).toBe('DELETE');
	});

	it('account.getCredits reads the balance with no parameters', async () => {
		mockFetch(ok(CREDITS));

		const result = await endpoints.account.getCredits(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/credits`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.credits).toBe(99);
	});

	it('a rejected range never reaches the API', async () => {
		const error = await captureError(
			endpoints.verify.getVerificationLogs(makeCtx(), {
				start_date: '2026-11-25',
				end_date: '2026-11-01',
			}),
		);

		expect(error).toBeInstanceOf(Error);
		expect(fetchMockCalls()).toBe(0);
	});

	it('a batch over 3000 addresses is rejected before any request is sent', async () => {
		const error = await captureError(
			endpoints.verify.startBatchVerification(makeCtx(), {
				emails: Array.from({ length: 3001 }, (_, i) => `user${i}@example.com`),
			}),
		);

		expect(error).toBeInstanceOf(Error);
		expect(fetchMockCalls()).toBe(0);
	});
});

function fetchMockCalls(): number {
	return currentFetch().mock.calls.length;
}

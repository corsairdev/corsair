jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ListcleanAPIError } from './client';
import {
	ANALYTICS,
	BATCH_ACCEPTED,
	CREDITS,
	DELETE_OK,
	LIST_ROW,
	LISTS_PAGE,
	LOG_ROW,
	RESULT_ROWS,
	SINGLE_LIST,
	VERIFY_RESULT,
} from './test-fixtures';
import {
	captureError,
	downloadResponse,
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Listclean output parsing', () => {
	it('verify.verifyEmail parses the full result row', async () => {
		mockFetch(ok(VERIFY_RESULT));

		const result = await endpoints.verify.verifyEmail(makeCtx(), {
			email: 'myselfi.itba@gmail.com',
		});

		expect(result.status).toBe('dirty');
		expect(result.mx_found).toBe(true);
		expect(result.free_email).toBe(true);
	});

	it('verify.verifyEmail still parses when the optional fields are absent', async () => {
		mockFetch(
			ok({ ...VERIFY_RESULT, datetime: undefined, free_email: undefined }),
		);

		const result = await endpoints.verify.verifyEmail(makeCtx(), {
			email: 'someone@example.com',
		});

		expect(result.status).toBe('dirty');
		expect(result.free_email).toBeUndefined();
	});

	it('verify.startBatchVerification answers the list id', async () => {
		mockFetch(ok(BATCH_ACCEPTED));

		const result = await endpoints.verify.startBatchVerification(makeCtx(), {
			emails: ['user@example.com'],
		});

		expect(result.list_id).toBe(159261);
	});

	it('verify.getVerificationLogs parses the log rows', async () => {
		mockFetch(ok([LOG_ROW]));

		const result = await endpoints.verify.getVerificationLogs(makeCtx(), {
			start_date: '2026-11-01',
			end_date: '2026-11-25',
		});

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({ id: 21, credits_deducted: 1 });
		expect(typeof result[0]?.error_code).toBe('string');
	});

	it('verify.getAnalytics passes the undocumented summaries through untyped', async () => {
		mockFetch(ok(ANALYTICS));

		const result = await endpoints.verify.getAnalytics(makeCtx(), {
			start_date: '2026-11-01',
			end_date: '2026-11-25',
		});

		expect(result.total_summary).toEqual(ANALYTICS.total_summary);
		expect(result.graph_summary).toEqual(ANALYTICS.graph_summary);
	});

	it('lists.listLists parses counts as numbers or strings, whichever the list carries', async () => {
		mockFetch(ok(LISTS_PAGE));

		const result = await endpoints.lists.listLists(makeCtx(), {});

		const summary = result.lists[0]?.analytics?.summary;
		expect(summary?.dirty?.count).toBe(8);
		expect(summary?.clean?.count).toBe('4');
		expect(result.total).toBe(7);
	});

	it('lists.getList unwraps the one-element array Listclean sends, so the status reads at list.status', async () => {
		mockFetch(ok(SINGLE_LIST));

		const result = await endpoints.lists.getList(makeCtx(), {
			list_id: 159261,
		});

		expect(Array.isArray(result)).toBe(false);
		expect(result.list.status).toBe('COMPLETED');
		expect(result.list.list_id).toBe(159261);
	});

	it('lists.getList rejects an empty answer instead of returning a fake list', async () => {
		mockFetch(ok([]));

		const error = await captureError(
			endpoints.lists.getList(makeCtx(), { list_id: 159261 }),
		);

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).name).toBe('ZodError');
	});

	it('lists.getListResults parses the JSON stream rows', async () => {
		mockFetch(downloadResponse(RESULT_ROWS));

		const result = await endpoints.lists.getListResults(makeCtx(), {
			list_id: 159261,
			type: 'clean',
		});

		expect(result).toHaveLength(2);
		expect(result[0]?.email_domain).toBe('example.com');
	});

	it('lists.delete reports success only when the message string arrived', async () => {
		mockFetch(jsonResponse(DELETE_OK));

		const result = await endpoints.lists.delete(makeCtx(), { list_id: 159261 });

		expect(result.message).toBe('Lists deleted successfully');
	});

	it('account.getCredits parses the balance', async () => {
		mockFetch(ok(CREDITS));

		const result = await endpoints.account.getCredits(makeCtx(), {});

		expect(result.credits).toBe(99);
	});
});

describe('Listclean rejections', () => {
	it('rejects a wrong-shaped payload: a list page answering a bare array', async () => {
		mockFetch(ok([LIST_ROW]));

		const error = await captureError(endpoints.lists.listLists(makeCtx(), {}));

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).name).toBe('ZodError');
	});

	it('rejects a malformed known field: a verdict outside the documented vocabulary', async () => {
		mockFetch(ok({ ...VERIFY_RESULT, status: 'maybe' }));

		const error = await captureError(
			endpoints.verify.verifyEmail(makeCtx(), { email: 'a@example.com' }),
		);

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).name).toBe('ZodError');
	});

	it('rejects a delete whose answer lost the documented message string', async () => {
		// An envelope with no message at all: the delete must not count as a
		// success on evidence that is missing.
		mockFetch(jsonResponse({ success: 1, error_code: 0 }));

		const error = await captureError(
			endpoints.lists.delete(makeCtx(), { list_id: 159261 }),
		);

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).name).toBe('ZodError');
	});

	it('rejects an undated range before sending', async () => {
		mockFetch(ok([]));

		const error = await captureError(
			endpoints.verify.getAnalytics(makeCtx(), {
				start_date: '26 Nov 2026',
				end_date: '2026-11-25',
			}),
		);

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).name).toBe('ZodError');
	});

	it('surfaces an HTML 404 as a ListcleanAPIError, not an empty page', async () => {
		mockFetch(new Response('<!DOCTYPE html>', { status: 404 }));

		const error = await captureError(
			endpoints.lists.getList(makeCtx(), { list_id: 1 }),
		);

		expect(error).toBeInstanceOf(ListcleanAPIError);
		expect((error as ListcleanAPIError).status).toBe(404);
	});
});

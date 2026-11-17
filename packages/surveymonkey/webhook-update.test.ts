import { logEventFromContext } from 'corsair/core';
import { webhook } from './test-fixtures';
import {
	endpoints,
	fetchCount,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

beforeEach(installFetchMock);
afterEach(() => {
	restoreFetchMock();
	logEvent.mockClear();
});

describe('surveymonkey webhooks.update reads the stored object_ids', () => {
	it('records a failed update event when the read fails', async () => {
		mockFetch(
			jsonResponse(
				{
					error: {
						id: '1020',
						name: 'Resource Not Found',
						message: 'No webhook found',
						http_status_code: 404,
					},
				},
				{ status: 404 },
			),
		);

		await expect(
			endpoints.webhooks.update(makeCtx(), {
				webhook_id: '1234',
				name: 'Renamed',
			}),
		).rejects.toBeDefined();

		expect(fetchCount()).toBe(1);
		expect(logEvent).toHaveBeenCalledWith(
			expect.anything(),
			'surveymonkey.webhooks.update',
			expect.objectContaining({ failed: true }),
			'failed',
		);
	});

	it('does not read the webhook when object_ids are passed', async () => {
		mockFetch(jsonResponse(webhook));
		await endpoints.webhooks.update(makeCtx(), {
			webhook_id: '1234',
			name: 'Renamed',
			object_ids: ['1234'],
		});

		expect(fetchCount()).toBe(1);
	});
});

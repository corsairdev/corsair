import { makeAirtableRequest } from '../client';
import { airtable } from '../index';
import { fetchWebhookPayloads, getPayloads } from './webhook-payloads';

jest.mock('../client', () => {
	const original = jest.requireActual('../client');
	return {
		...original,
		makeAirtableRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeAirtableRequest);

function createContext(withRecords = true) {
	const records = {
		upsertByEntityId: jest.fn(
			async (_id: string, _record: Record<string, unknown>) => undefined,
		),
		deleteByEntityId: jest.fn(async (_id: string) => true),
	};
	return {
		ctx: { key: 'test-key', db: withRecords ? { records } : {} } as never,
		records,
	};
}

const BASE_ID = 'appBASE';
const WEBHOOK_ID = 'achWEBHOOK';

describe('Airtable webhooks.getPayloads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('requests the payloads endpoint for the base and webhook, from cursor 0 by default', async () => {
		mockRequest.mockResolvedValue({ payloads: [] });
		const { ctx } = createContext();

		await getPayloads(ctx, { baseId: BASE_ID, webhookId: WEBHOOK_ID });

		expect(mockRequest).toHaveBeenCalledWith(
			`bases/${BASE_ID}/webhooks/${WEBHOOK_ID}/payloads`,
			'test-key',
			{ method: 'GET', query: { cursor: 0 } },
		);
	});

	it('passes an explicit cursor through', async () => {
		mockRequest.mockResolvedValue({ payloads: [] });
		const { ctx } = createContext();

		await getPayloads(ctx, {
			baseId: BASE_ID,
			webhookId: WEBHOOK_ID,
			cursor: 42,
		});

		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			method: 'GET',
			query: { cursor: 42 },
		});
	});

	it('returns the parsed response and defaults missing payloads to an empty list', async () => {
		mockRequest.mockResolvedValue({ cursorForNextPayload: 7 });
		const { ctx } = createContext();

		const result = await getPayloads(ctx, {
			baseId: BASE_ID,
			webhookId: WEBHOOK_ID,
		});

		expect(result).toEqual({ cursorForNextPayload: 7, payloads: [] });
	});

	it('rejects a response that does not match the payloads schema', async () => {
		mockRequest.mockResolvedValue({ payloads: 'not-a-list' });
		const { ctx, records } = createContext();

		await expect(
			getPayloads(ctx, { baseId: BASE_ID, webhookId: WEBHOOK_ID }),
		).rejects.toThrow();
		expect(records.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('syncs records from per-record changes', async () => {
		mockRequest.mockResolvedValue({
			payloads: [
				{
					timestamp: '2026-10-01T00:00:00.000Z',
					changes: [
						{
							path: { tableId: 'tblA', recordId: 'recA' },
							cellValuesByFieldId: { fldName: 'Ada' },
						},
						// No record id: nothing to sync.
						{ path: { tableId: 'tblA' }, cellValuesByFieldId: { fld: 1 } },
					],
				},
			],
		});
		const { ctx, records } = createContext();

		await getPayloads(ctx, { baseId: BASE_ID, webhookId: WEBHOOK_ID });

		expect(records.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(records.upsertByEntityId).toHaveBeenCalledWith('recA', {
			id: 'recA',
			baseId: BASE_ID,
			tableId: 'tblA',
			fields: { fldName: 'Ada' },
		});
	});

	it('syncs created and changed records and deletes destroyed ones from table changes', async () => {
		mockRequest.mockResolvedValue({
			payloads: [
				{
					timestamp: '2026-10-01T00:00:00.000Z',
					changedTablesById: {
						tblA: {
							createdRecordsById: {
								recNew: { cellValuesByFieldId: { fldName: 'New' } },
							},
							changedRecordsById: {
								recOld: { cellValuesByFieldId: { fldName: 'Changed' } },
							},
							destroyedRecordIds: ['recGone1', 'recGone2'],
						},
						tblB: { destroyedRecordIds: 'recGone3' },
					},
				},
			],
		});
		const { ctx, records } = createContext();

		await getPayloads(ctx, { baseId: BASE_ID, webhookId: WEBHOOK_ID });

		expect(records.upsertByEntityId).toHaveBeenCalledWith('recNew', {
			id: 'recNew',
			baseId: BASE_ID,
			tableId: 'tblA',
			fields: { fldName: 'New' },
		});
		expect(records.upsertByEntityId).toHaveBeenCalledWith('recOld', {
			id: 'recOld',
			baseId: BASE_ID,
			tableId: 'tblA',
			fields: { fldName: 'Changed' },
		});
		expect(records.deleteByEntityId.mock.calls.map((call) => call[0])).toEqual([
			'recGone1',
			'recGone2',
			'recGone3',
		]);
	});

	it('still returns the payloads when the local store is not configured', async () => {
		const response = {
			payloads: [
				{
					timestamp: '2026-10-01T00:00:00.000Z',
					changes: [{ path: { recordId: 'recA' }, cellValuesByFieldId: {} }],
				},
			],
		};
		mockRequest.mockResolvedValue(response);
		const { ctx } = createContext(false);

		const result = await getPayloads(ctx, {
			baseId: BASE_ID,
			webhookId: WEBHOOK_ID,
		});

		expect(result.payloads).toHaveLength(1);
	});

	it('returns the payloads when writing to the local store fails', async () => {
		mockRequest.mockResolvedValue({
			payloads: [
				{
					timestamp: '2026-10-01T00:00:00.000Z',
					changes: [{ path: { recordId: 'recA' }, cellValuesByFieldId: {} }],
				},
			],
		});
		const { ctx, records } = createContext();
		records.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await getPayloads(ctx, {
			baseId: BASE_ID,
			webhookId: WEBHOOK_ID,
		});

		expect(result.payloads).toHaveLength(1);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('fetchWebhookPayloads delegates to the endpoint with the given cursor', async () => {
		mockRequest.mockResolvedValue({ payloads: [] });
		const { ctx } = createContext();

		await fetchWebhookPayloads(ctx, BASE_ID, WEBHOOK_ID, 5);

		expect(mockRequest).toHaveBeenCalledWith(
			`bases/${BASE_ID}/webhooks/${WEBHOOK_ID}/payloads`,
			'test-key',
			{ method: 'GET', query: { cursor: 5 } },
		);
	});

	it('is the function the plugin registers at webhooks.getPayloads', () => {
		const plugin = airtable({});
		expect(plugin.endpoints?.webhooks.getPayloads).toBe(getPayloads);
	});
});

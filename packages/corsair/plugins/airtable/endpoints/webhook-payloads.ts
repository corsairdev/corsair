import type { AirtableContext } from '..';
import { makeAirtableRequest } from '../client';
import {
	AirtableWebhookPayloadsResponseSchema,
	type AirtableWebhookPayloadsResponse,
} from '../webhooks/types';

type WebhooksGetPayloadsInput = {
	baseId: string;
	webhookId: string;
	cursor?: number;
};

type WebhooksGetPayloadsResponse = AirtableWebhookPayloadsResponse;

export const getPayloads = async (
	ctx: AirtableContext,
	input: WebhooksGetPayloadsInput,
): Promise<WebhooksGetPayloadsResponse> => {

	const response = await makeAirtableRequest(
		`bases/${input.baseId}/webhooks/${input.webhookId}/payloads`,
		ctx.key,
		{
			method: 'GET',
			query: {
				cursor: input.cursor ?? 0,
			},
		},
	);

    const parsed = AirtableWebhookPayloadsResponseSchema.parse(response);

	if (parsed.payloads && ctx.db.records) {
		try {
			for (const payload of parsed.payloads) {
				if (payload.changes) {
					for (const change of payload.changes) {
						if (change.path?.recordId && change.cellValuesByFieldId) {
							await ctx.db.records.upsertByEntityId(change.path.recordId, {
								id: change.path.recordId,
								baseId: input.baseId,
								tableId: change.path.tableId,
								fields: {
									...(change.cellValuesByFieldId as Record<string, unknown>),
								},
							});
						}
					}
				}

				if (payload.changedTablesById) {
					for (const [tableId, tableData] of Object.entries(
						payload.changedTablesById,
					)) {
						const tableInfo = tableData as Record<string, unknown>;
						
						if (tableInfo.changedRecordsById) {
							const changedRecords = tableInfo.changedRecordsById as Record<
								string,
								unknown
							>;
							
							for (const [recordId, recordData] of Object.entries(
								changedRecords,
							)) {
								const recordInfo = recordData as Record<string, unknown>;
								
								if (recordInfo.cellValuesByFieldId) {
									await ctx.db.records.upsertByEntityId(recordId, {
										id: recordId,
										baseId: input.baseId,
										tableId: tableId,
										fields: {
											...(recordInfo.cellValuesByFieldId as Record<
												string,
												unknown
											>),
										},
									});
								}
							}
						}

						if (tableInfo.createdRecordsById) {
							const createdRecords = tableInfo.createdRecordsById as Record<
								string,
								unknown
							>;
							
							for (const [recordId, recordData] of Object.entries(
								createdRecords,
							)) {
								const recordInfo = recordData as Record<string, unknown>;
								
								if (recordInfo.cellValuesByFieldId) {
									await ctx.db.records.upsertByEntityId(recordId, {
										id: recordId,
										baseId: input.baseId,
										tableId: tableId,
										fields: {
											...(recordInfo.cellValuesByFieldId as Record<
												string,
												unknown
											>),
										},
									});
								}
							}
						}

						if (tableInfo.destroyedRecordIds) {
							const destroyedIds = Array.isArray(tableInfo.destroyedRecordIds)
								? tableInfo.destroyedRecordIds
								: [tableInfo.destroyedRecordIds];
							
							for (const recordId of destroyedIds) {
								if (typeof recordId === 'string') {
									await ctx.db.records.deleteByEntityId(recordId);
								}
							}
						}
					}
				}
			}
		} catch (error) {
			console.warn('Failed to save webhook payload records to database:', error);
		}
	}

	return parsed;
};

export async function fetchWebhookPayloads(
	ctx: AirtableContext,
	baseId: string,
	webhookId: string,
	cursor: number = 0,
): Promise<AirtableWebhookPayloadsResponse> {
	return getPayloads(ctx, { baseId, webhookId, cursor });
}


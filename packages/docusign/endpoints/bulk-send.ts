import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const ApplyActionToBulkSendEnvelopesInputSchema = z.object({
	bulkSendBatchId: z.string(),
	bulkAction: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ApplyActionToBulkSendEnvelopesOutputSchema = z
	.object({})
	.passthrough();

export type ApplyActionToBulkSendEnvelopesParams = z.infer<
	typeof ApplyActionToBulkSendEnvelopesInputSchema
>;

export const applyActionToBulkSendEnvelopes = async (
	ctxOrClient: DocusignExecutionContext,
	params: ApplyActionToBulkSendEnvelopesParams,
) => {
	const input = ApplyActionToBulkSendEnvelopesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/bulk_send_batch/${input.bulkSendBatchId}/${input.bulkAction}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return ApplyActionToBulkSendEnvelopesOutputSchema.parse(data);
};

export const CreateBulkSendRequestInputSchema = z.object({
	bulkSendListId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateBulkSendRequestOutputSchema = z.object({}).passthrough();

export type CreateBulkSendRequestParams = z.infer<
	typeof CreateBulkSendRequestInputSchema
>;

export const createBulkSendRequest = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateBulkSendRequestParams,
) => {
	const input = CreateBulkSendRequestInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/bulk_send_lists/${input.bulkSendListId}/send`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateBulkSendRequestOutputSchema.parse(data);
};

export const CreateBulkSendTestRequestInputSchema = z.object({
	bulkSendListId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateBulkSendTestRequestOutputSchema = z.object({}).passthrough();

export type CreateBulkSendTestRequestParams = z.infer<
	typeof CreateBulkSendTestRequestInputSchema
>;

export const createBulkSendTestRequest = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateBulkSendTestRequestParams,
) => {
	const input = CreateBulkSendTestRequestInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/bulk_send_lists/${input.bulkSendListId}/test`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateBulkSendTestRequestOutputSchema.parse(data);
};

export const GetBulkSendBatchStatusInputSchema = z.object({
	bulkSendBatchId: z.string(),
});

export const GetBulkSendBatchStatusOutputSchema = z.object({}).passthrough();

export type GetBulkSendBatchStatusParams = z.infer<
	typeof GetBulkSendBatchStatusInputSchema
>;

export const getBulkSendBatchStatus = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetBulkSendBatchStatusParams,
) => {
	const input = GetBulkSendBatchStatusInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/bulk_send_batch/${input.bulkSendBatchId}`,
		{
			method: 'GET',
		},
	);
	return GetBulkSendBatchStatusOutputSchema.parse(data);
};

export const GetBulkSendListsInformationInputSchema = z.object({});

export const GetBulkSendListsInformationOutputSchema = z
	.object({})
	.passthrough();

export type GetBulkSendListsInformationParams = z.infer<
	typeof GetBulkSendListsInformationInputSchema
>;

export const getBulkSendListsInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetBulkSendListsInformationParams,
) => {
	const input = GetBulkSendListsInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/bulk_send_lists`, {
		method: 'GET',
	});
	return GetBulkSendListsInformationOutputSchema.parse(data);
};

export const ListBulkSendBatchSummariesInputSchema = z.object({
	batch_ids: z.string().optional(),
	count: z.string().optional(),
	from_date: z.string().optional(),
	search_text: z.string().optional(),
	start_position: z.string().optional(),
	status: z.string().optional(),
	to_date: z.string().optional(),
	user_id: z.string().optional(),
});

export const ListBulkSendBatchSummariesOutputSchema = z
	.object({})
	.passthrough();

export type ListBulkSendBatchSummariesParams = z.infer<
	typeof ListBulkSendBatchSummariesInputSchema
>;

export const listBulkSendBatchSummaries = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListBulkSendBatchSummariesParams,
) => {
	const input = ListBulkSendBatchSummariesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.batch_ids !== undefined)
		query.append('batch_ids', String(input.batch_ids));
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.from_date !== undefined)
		query.append('from_date', String(input.from_date));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.status !== undefined) query.append('status', String(input.status));
	if (input.to_date !== undefined)
		query.append('to_date', String(input.to_date));
	if (input.user_id !== undefined)
		query.append('user_id', String(input.user_id));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/bulk_send_batch` + qs, {
		method: 'GET',
	});
	return ListBulkSendBatchSummariesOutputSchema.parse(data);
};

export const RemoveBulkSendListInputSchema = z.object({
	bulkSendListId: z.string(),
});

export const RemoveBulkSendListOutputSchema = z.object({}).passthrough();

export type RemoveBulkSendListParams = z.infer<
	typeof RemoveBulkSendListInputSchema
>;

export const removeBulkSendList = async (
	ctxOrClient: DocusignExecutionContext,
	params: RemoveBulkSendListParams,
) => {
	const input = RemoveBulkSendListInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/bulk_send_lists/${input.bulkSendListId}`,
		{
			method: 'DELETE',
		},
	);
	return RemoveBulkSendListOutputSchema.parse(data);
};

export const UpdateBulkSendBatchNameInputSchema = z.object({
	bulkSendBatchId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateBulkSendBatchNameOutputSchema = z.object({}).passthrough();

export type UpdateBulkSendBatchNameParams = z.infer<
	typeof UpdateBulkSendBatchNameInputSchema
>;

export const updateBulkSendBatchName = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateBulkSendBatchNameParams,
) => {
	const input = UpdateBulkSendBatchNameInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/bulk_send_batch/${input.bulkSendBatchId}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateBulkSendBatchNameOutputSchema.parse(data);
};

export const BulkSendInputSchemas = {
	applyActionToBulkSendEnvelopes: ApplyActionToBulkSendEnvelopesInputSchema,
	createBulkSendRequest: CreateBulkSendRequestInputSchema,
	createBulkSendTestRequest: CreateBulkSendTestRequestInputSchema,
	getBulkSendBatchStatus: GetBulkSendBatchStatusInputSchema,
	getBulkSendListsInformation: GetBulkSendListsInformationInputSchema,
	listBulkSendBatchSummaries: ListBulkSendBatchSummariesInputSchema,
	removeBulkSendList: RemoveBulkSendListInputSchema,
	updateBulkSendBatchName: UpdateBulkSendBatchNameInputSchema,
};

export const BulkSendOutputSchemas = {
	applyActionToBulkSendEnvelopes: ApplyActionToBulkSendEnvelopesOutputSchema,
	createBulkSendRequest: CreateBulkSendRequestOutputSchema,
	createBulkSendTestRequest: CreateBulkSendTestRequestOutputSchema,
	getBulkSendBatchStatus: GetBulkSendBatchStatusOutputSchema,
	getBulkSendListsInformation: GetBulkSendListsInformationOutputSchema,
	listBulkSendBatchSummaries: ListBulkSendBatchSummariesOutputSchema,
	removeBulkSendList: RemoveBulkSendListOutputSchema,
	updateBulkSendBatchName: UpdateBulkSendBatchNameOutputSchema,
};

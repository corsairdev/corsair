import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const CreateCustomTabWithPropertiesInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateCustomTabWithPropertiesOutputSchema = z
	.object({})
	.passthrough();

export type CreateCustomTabWithPropertiesParams = z.infer<
	typeof CreateCustomTabWithPropertiesInputSchema
>;

export const createCustomTabWithProperties = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateCustomTabWithPropertiesParams,
) => {
	const input = CreateCustomTabWithPropertiesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/tab_definitions`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateCustomTabWithPropertiesOutputSchema.parse(data);
};

export const DeleteCustomTabInformationInputSchema = z.object({
	customTabId: z.string(),
});

export const DeleteCustomTabInformationOutputSchema = z
	.object({})
	.passthrough();

export type DeleteCustomTabInformationParams = z.infer<
	typeof DeleteCustomTabInformationInputSchema
>;

export const deleteCustomTabInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteCustomTabInformationParams,
) => {
	const input = DeleteCustomTabInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/tab_definitions/${input.customTabId}`, {
		method: 'DELETE',
	});
	return DeleteCustomTabInformationOutputSchema.parse(data);
};

export const RetrieveAllAccountTabsInputSchema = z.object({
	custom_tab_only: z.string().optional(),
});

export const RetrieveAllAccountTabsOutputSchema = z.object({}).passthrough();

export type RetrieveAllAccountTabsParams = z.infer<
	typeof RetrieveAllAccountTabsInputSchema
>;

export const retrieveAllAccountTabs = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAllAccountTabsParams,
) => {
	const input = RetrieveAllAccountTabsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.custom_tab_only !== undefined)
		query.append('custom_tab_only', String(input.custom_tab_only));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/tab_definitions` + qs, {
		method: 'GET',
	});
	return RetrieveAllAccountTabsOutputSchema.parse(data);
};

export const RetrieveCustomTabInformationInputSchema = z.object({
	customTabId: z.string(),
});

export const RetrieveCustomTabInformationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveCustomTabInformationParams = z.infer<
	typeof RetrieveCustomTabInformationInputSchema
>;

export const retrieveCustomTabInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveCustomTabInformationParams,
) => {
	const input = RetrieveCustomTabInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/tab_definitions/${input.customTabId}`, {
		method: 'GET',
	});
	return RetrieveCustomTabInformationOutputSchema.parse(data);
};

export const UpdateCustomTabInformationForAccountInputSchema = z.object({
	customTabId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateCustomTabInformationForAccountOutputSchema = z
	.object({})
	.passthrough();

export type UpdateCustomTabInformationForAccountParams = z.infer<
	typeof UpdateCustomTabInformationForAccountInputSchema
>;

export const updateCustomTabInformationForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateCustomTabInformationForAccountParams,
) => {
	const input = UpdateCustomTabInformationForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/tab_definitions/${input.customTabId}`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateCustomTabInformationForAccountOutputSchema.parse(data);
};

export const CustomTabsInputSchemas = {
	createCustomTabWithProperties: CreateCustomTabWithPropertiesInputSchema,
	deleteCustomTabInformation: DeleteCustomTabInformationInputSchema,
	retrieveAllAccountTabs: RetrieveAllAccountTabsInputSchema,
	retrieveCustomTabInformation: RetrieveCustomTabInformationInputSchema,
	updateCustomTabInformationForAccount:
		UpdateCustomTabInformationForAccountInputSchema,
};

export const CustomTabsOutputSchemas = {
	createCustomTabWithProperties: CreateCustomTabWithPropertiesOutputSchema,
	deleteCustomTabInformation: DeleteCustomTabInformationOutputSchema,
	retrieveAllAccountTabs: RetrieveAllAccountTabsOutputSchema,
	retrieveCustomTabInformation: RetrieveCustomTabInformationOutputSchema,
	updateCustomTabInformationForAccount:
		UpdateCustomTabInformationForAccountOutputSchema,
};

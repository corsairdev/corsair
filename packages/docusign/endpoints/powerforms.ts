import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const DeletePowerFormByIdInputSchema = z.object({
	powerFormId: z.string(),
});

export const DeletePowerFormByIdOutputSchema = z.object({}).passthrough();

export type DeletePowerFormByIdParams = z.infer<
	typeof DeletePowerFormByIdInputSchema
>;

export const deletePowerFormById = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeletePowerFormByIdParams,
) => {
	const input = DeletePowerFormByIdInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/powerforms/${input.powerFormId}`, {
		method: 'DELETE',
	});
	return DeletePowerFormByIdOutputSchema.parse(data);
};

export const GetPowerFormSendersInputSchema = z.object({
	start_position: z.string().optional(),
});

export const GetPowerFormSendersOutputSchema = z.object({}).passthrough();

export type GetPowerFormSendersParams = z.infer<
	typeof GetPowerFormSendersInputSchema
>;

export const getPowerFormSenders = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetPowerFormSendersParams,
) => {
	const input = GetPowerFormSendersInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/powerforms/senders` + qs, {
		method: 'GET',
	});
	return GetPowerFormSendersOutputSchema.parse(data);
};

export const RetrievePowerFormDataEntriesInputSchema = z.object({
	powerFormId: z.string(),
	data_layout: z.string().optional(),
	from_date: z.string().optional(),
	to_date: z.string().optional(),
});

export const RetrievePowerFormDataEntriesOutputSchema = z
	.object({})
	.passthrough();

export type RetrievePowerFormDataEntriesParams = z.infer<
	typeof RetrievePowerFormDataEntriesInputSchema
>;

export const retrievePowerFormDataEntries = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrievePowerFormDataEntriesParams,
) => {
	const input = RetrievePowerFormDataEntriesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.data_layout !== undefined)
		query.append('data_layout', String(input.data_layout));
	if (input.from_date !== undefined)
		query.append('from_date', String(input.from_date));
	if (input.to_date !== undefined)
		query.append('to_date', String(input.to_date));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/powerforms/${input.powerFormId}/form_data` + qs,
		{
			method: 'GET',
		},
	);
	return RetrievePowerFormDataEntriesOutputSchema.parse(data);
};

export const PowerformsInputSchemas = {
	deletePowerFormById: DeletePowerFormByIdInputSchema,
	getPowerFormSenders: GetPowerFormSendersInputSchema,
	retrievePowerFormDataEntries: RetrievePowerFormDataEntriesInputSchema,
};

export const PowerformsOutputSchemas = {
	deletePowerFormById: DeletePowerFormByIdOutputSchema,
	getPowerFormSenders: GetPowerFormSendersOutputSchema,
	retrievePowerFormDataEntries: RetrievePowerFormDataEntriesOutputSchema,
};

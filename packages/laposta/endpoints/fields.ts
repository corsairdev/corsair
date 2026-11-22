import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	CreateFieldInput,
	CreateFieldOutput,
	DeleteFieldInput,
	DeleteFieldOutput,
	GetFieldInput,
	GetFieldOutput,
	GetFieldsInput,
	GetFieldsOutput,
	UpdateFieldInput,
	UpdateFieldOutput,
} from './types';
import {
	CreateFieldOutputSchema,
	DeleteFieldOutputSchema,
	GetFieldOutputSchema,
	GetFieldsOutputSchema,
	LapostaEndpointInputSchemas,
	UpdateFieldOutputSchema,
} from './types';

export const fields = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetFieldsInput,
	): Promise<GetFieldsOutput> => {
		const parsedInput = LapostaEndpointInputSchemas['fields.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/field', ctx.key, {
			method: 'GET',
			query: { list_id: parsedInput.list_id },
		});
		return GetFieldsOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetFieldInput,
	): Promise<GetFieldOutput> => {
		const parsedInput = LapostaEndpointInputSchemas['fields.get'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/field/${encodeURIComponent(parsedInput.field_id)}`,
			ctx.key,
			{
				method: 'GET',
				query: { list_id: parsedInput.list_id },
			},
		);
		return GetFieldOutputSchema.parse(raw);
	},

	create: async (
		ctx: LapostaPluginContext,
		input: CreateFieldInput,
	): Promise<CreateFieldOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['fields.create'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/field', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateFieldOutputSchema.parse(raw);
	},

	update: async (
		ctx: LapostaPluginContext,
		input: UpdateFieldInput,
	): Promise<UpdateFieldOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['fields.update'].parse(input);
		const { field_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/field/${encodeURIComponent(field_id)}`,
			ctx.key,
			{
				method: 'POST',
				body,
				// Laposta specifically requires JSON for the complete options_full set.
				bodyEncoding: parsedInput.options_full === undefined ? 'form' : 'json',
			},
		);
		return UpdateFieldOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LapostaPluginContext,
		input: DeleteFieldInput,
	): Promise<DeleteFieldOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['fields.delete'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/field/${encodeURIComponent(parsedInput.field_id)}`,
			ctx.key,
			{
				method: 'DELETE',
				query: { list_id: parsedInput.list_id },
			},
		);
		return DeleteFieldOutputSchema.parse(raw);
	},
};

import { makeLapostaRequest } from '../client';
import type {
	CreateFieldInput,
	CreateFieldOutput,
	DeleteFieldInput,
	DeleteFieldOutput,
	GetFieldInput,
	GetFieldOutput,
	GetFieldsInput,
	GetFieldsOutput,
} from './types';
import {
	CreateFieldOutputSchema,
	DeleteFieldOutputSchema,
	GetFieldOutputSchema,
	GetFieldsOutputSchema,
} from './types';

export const fields = {
	list: async (
		input: GetFieldsInput,
		apiKey?: string,
	): Promise<GetFieldsOutput> => {
		const raw = await makeLapostaRequest<unknown>('/field', apiKey, {
			method: 'GET',
			query: { list_id: input.list_id },
		});
		return GetFieldsOutputSchema.parse(raw);
	},

	get: async (
		input: GetFieldInput,
		apiKey?: string,
	): Promise<GetFieldOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/field/${encodeURIComponent(input.field_id)}`,
			apiKey,
			{
				method: 'GET',
				query: { list_id: input.list_id },
			},
		);
		return GetFieldOutputSchema.parse(raw);
	},

	create: async (
		input: CreateFieldInput,
		apiKey?: string,
	): Promise<CreateFieldOutput> => {
		const raw = await makeLapostaRequest<unknown>('/field', apiKey, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		return CreateFieldOutputSchema.parse(raw);
	},

	delete: async (
		input: DeleteFieldInput,
		apiKey?: string,
	): Promise<DeleteFieldOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/field/${encodeURIComponent(input.field_id)}`,
			apiKey,
			{
				method: 'DELETE',
				query: { list_id: input.list_id },
			},
		);
		return DeleteFieldOutputSchema.parse(raw);
	},
};

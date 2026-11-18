import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
import type {
	CreateMemoryInput,
	CreateMemoryOutput,
	DeleteMemoryInput,
	DeleteMemoryOutput,
	GetMemoryInput,
	GetMemoryOutput,
	ListMemoryInput,
	ListMemoryOutput,
} from './types';
import {
	CreateMemoryOutputSchema,
	DeleteMemoryOutputSchema,
	GetMemoryOutputSchema,
	LangbaseEndpointInputSchemas,
	ListMemoryOutputSchema,
} from './types';

export const memory = {
	list: async (
		ctx: LangbasePluginContext,
		input: ListMemoryInput,
	): Promise<ListMemoryOutput> => {
		LangbaseEndpointInputSchemas['memory.list'].parse(input);
		// unknown because memory sets contain indexing state and metadata.
		const raw = await makeLangbaseRequest<unknown>('/memory', ctx.key, {
			method: 'GET',
		});
		return ListMemoryOutputSchema.parse(raw);
	},

	get: async (
		ctx: LangbasePluginContext,
		input: GetMemoryInput,
	): Promise<GetMemoryOutput> => {
		const parsedInput = LangbaseEndpointInputSchemas['memory.get'].parse(input);
		// unknown because memory details include vector dimension and document stats.
		const raw = await makeLangbaseRequest<unknown>(
			`/memory/${encodeURIComponent(parsedInput.name)}`,
			ctx.key,
			{ method: 'GET' },
		);
		return GetMemoryOutputSchema.parse(raw);
	},

	create: async (
		ctx: LangbasePluginContext,
		input: CreateMemoryInput,
	): Promise<CreateMemoryOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['memory.create'].parse(input);
		// unknown because created memory contains managed index metadata.
		const raw = await makeLangbaseRequest<unknown>('/memory', ctx.key, {
			method: 'POST',
			// unknown because request body is a dynamic JSON payload.
			body: parsedInput as Record<string, unknown>,
		});
		return CreateMemoryOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LangbasePluginContext,
		input: DeleteMemoryInput,
	): Promise<DeleteMemoryOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['memory.delete'].parse(input);
		// unknown because deleted memory response contains status confirmation.
		const raw = await makeLangbaseRequest<unknown>(
			`/memory/${encodeURIComponent(parsedInput.name)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		return DeleteMemoryOutputSchema.parse(raw);
	},
};

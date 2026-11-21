import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
import type {
	CreateMemoryInput,
	CreateMemoryOutput,
	DeleteMemoryInput,
	DeleteMemoryOutput,
	ListMemoryInput,
	ListMemoryOutput,
	RetrieveMemoryInput,
	RetrieveMemoryOutput,
} from './types';
import {
	CreateMemoryOutputSchema,
	DeleteMemoryOutputSchema,
	LangbaseEndpointInputSchemas,
	ListMemoryOutputSchema,
	RetrieveMemoryOutputSchema,
} from './types';

export const memory = {
	list: async (
		ctx: LangbasePluginContext,
		input: ListMemoryInput,
	): Promise<ListMemoryOutput> => {
		LangbaseEndpointInputSchemas['memory.list'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/memory', ctx.key, {
			method: 'GET',
		});
		return ListMemoryOutputSchema.parse(raw);
	},

	create: async (
		ctx: LangbasePluginContext,
		input: CreateMemoryInput,
	): Promise<CreateMemoryOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['memory.create'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/memory', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateMemoryOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LangbasePluginContext,
		input: DeleteMemoryInput,
	): Promise<DeleteMemoryOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['memory.delete'].parse(input);
		const path = `/memory/${encodeURIComponent(parsedInput.name)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'DELETE',
		});
		return DeleteMemoryOutputSchema.parse(raw);
	},

	retrieve: async (
		ctx: LangbasePluginContext,
		input: RetrieveMemoryInput,
	): Promise<RetrieveMemoryOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['memory.retrieve'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(
			'/memory/retrieve',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		return RetrieveMemoryOutputSchema.parse(raw);
	},
};

import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
import type {
	CreatePipeInput,
	CreatePipeOutput,
	GetPipeInput,
	GetPipeOutput,
	ListPipesInput,
	ListPipesOutput,
	RunPipeInput,
	RunPipeOutput,
	UpdatePipeInput,
	UpdatePipeOutput,
} from './types';
import {
	CreatePipeOutputSchema,
	GetPipeOutputSchema,
	LangbaseEndpointInputSchemas,
	ListPipesOutputSchema,
	RunPipeOutputSchema,
	UpdatePipeOutputSchema,
} from './types';

export const pipes = {
	run: async (
		ctx: LangbasePluginContext,
		input: RunPipeInput,
	): Promise<RunPipeOutput> => {
		const parsedInput = LangbaseEndpointInputSchemas['pipes.run'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/pipes/run', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return RunPipeOutputSchema.parse(raw);
	},

	list: async (
		ctx: LangbasePluginContext,
		input: ListPipesInput,
	): Promise<ListPipesOutput> => {
		LangbaseEndpointInputSchemas['pipes.list'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/pipes', ctx.key, {
			method: 'GET',
		});
		return ListPipesOutputSchema.parse(raw);
	},

	get: async (
		ctx: LangbasePluginContext,
		input: GetPipeInput,
	): Promise<GetPipeOutput> => {
		const parsedInput = LangbaseEndpointInputSchemas['pipes.get'].parse(input);
		const path = `/pipes/${encodeURIComponent(parsedInput.ownerLogin)}/${encodeURIComponent(parsedInput.pipeName)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'GET',
		});
		return GetPipeOutputSchema.parse(raw);
	},

	create: async (
		ctx: LangbasePluginContext,
		input: CreatePipeInput,
	): Promise<CreatePipeOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['pipes.create'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/pipes', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreatePipeOutputSchema.parse(raw);
	},

	update: async (
		ctx: LangbasePluginContext,
		input: UpdatePipeInput,
	): Promise<UpdatePipeOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['pipes.update'].parse(input);
		const path = `/pipes/${encodeURIComponent(parsedInput.name)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return UpdatePipeOutputSchema.parse(raw);
	},
};

import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	CreateSegmentInput,
	CreateSegmentOutput,
	DeleteSegmentInput,
	DeleteSegmentOutput,
	GetSegmentInput,
	GetSegmentOutput,
	GetSegmentsInput,
	GetSegmentsOutput,
	UpdateSegmentInput,
	UpdateSegmentOutput,
} from './types';
import {
	CreateSegmentOutputSchema,
	DeleteSegmentOutputSchema,
	GetSegmentOutputSchema,
	GetSegmentsOutputSchema,
	LapostaEndpointInputSchemas,
	UpdateSegmentOutputSchema,
} from './types';

export const segments = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetSegmentsInput,
	): Promise<GetSegmentsOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['segments.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/segment', ctx.key, {
			method: 'GET',
			query: parsedInput,
		});
		return GetSegmentsOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetSegmentInput,
	): Promise<GetSegmentOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['segments.get'].parse(input);
		const { segment_id, list_id } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/segment/${encodeURIComponent(segment_id)}`,
			ctx.key,
			{ method: 'GET', query: { list_id } },
		);
		return GetSegmentOutputSchema.parse(raw);
	},

	create: async (
		ctx: LapostaPluginContext,
		input: CreateSegmentInput,
	): Promise<CreateSegmentOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['segments.create'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/segment', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateSegmentOutputSchema.parse(raw);
	},

	update: async (
		ctx: LapostaPluginContext,
		input: UpdateSegmentInput,
	): Promise<UpdateSegmentOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['segments.update'].parse(input);
		const { segment_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/segment/${encodeURIComponent(segment_id)}`,
			ctx.key,
			{ method: 'POST', body },
		);
		return UpdateSegmentOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LapostaPluginContext,
		input: DeleteSegmentInput,
	): Promise<DeleteSegmentOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['segments.delete'].parse(input);
		const { segment_id, list_id } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/segment/${encodeURIComponent(segment_id)}`,
			ctx.key,
			{ method: 'DELETE', query: { list_id } },
		);
		return DeleteSegmentOutputSchema.parse(raw);
	},
};

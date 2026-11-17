import { z } from 'zod';
import {
	DocparserModelEntity,
	DocparserParserEntity,
	DocparserPingEntity,
	DocparserResultEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const ParserIdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9]+$/),
});
export type ParserIdInput = z.infer<typeof ParserIdInputSchema>;

export const ResultsInputSchema = ParserIdInputSchema.extend({
	limit: z.number().int().min(1).max(10000).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ResultsInput = z.infer<typeof ResultsInputSchema>;

export const PingResponseSchema = z.object({ ping: DocparserPingEntity });
export type PingResponse = z.infer<typeof PingResponseSchema>;

export const ParserListResponseSchema = z.object({
	parsers: z.array(DocparserParserEntity),
});
export type ParserListResponse = z.infer<typeof ParserListResponseSchema>;

export const ModelListResponseSchema = z.object({
	models: z.array(DocparserModelEntity),
});
export type ModelListResponse = z.infer<typeof ModelListResponseSchema>;

export const ResultListResponseSchema = z.object({
	results: z.array(DocparserResultEntity),
});
export type ResultListResponse = z.infer<typeof ResultListResponseSchema>;

export const EndpointInputSchemas = {
	ping: EmptyInputSchema,
	'parsers.list': EmptyInputSchema,
	'models.list': ParserIdInputSchema,
	'results.list': ResultsInputSchema,
};

export const EndpointOutputSchemas = {
	ping: PingResponseSchema,
	'parsers.list': ParserListResponseSchema,
	'models.list': ModelListResponseSchema,
	'results.list': ResultListResponseSchema,
};

import { z } from 'zod';
import {
	LinkupCreditEntity,
	LinkupResponseEntity,
	LinkupSourceEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const QueryInputSchema = z.object({
	q: z.string().min(1).max(2000),
});
export type QueryInput = z.infer<typeof QueryInputSchema>;

export const FetchInputSchema = z.object({
	url: z.string().url(),
});
export type FetchInput = z.infer<typeof FetchInputSchema>;

export const ResponseInputSchema = z.object({
	input: z.string().min(1).max(8000),
	model: z.string().regex(/^[A-Za-z0-9._:-]+$/),
});
export type ResponseInput = z.infer<typeof ResponseInputSchema>;

export const CreditResponseSchema = z.object({ credit: LinkupCreditEntity });
export type CreditResponse = z.infer<typeof CreditResponseSchema>;

export const SearchResponseSchema = z.object({
	results: z.array(LinkupSourceEntity),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const AnswerResponseSchema = z.object({
	answer: z.string(),
	sources: z.array(LinkupSourceEntity),
});
export type AnswerResponse = z.infer<typeof AnswerResponseSchema>;

export const FetchResponseSchema = z.object({ markdown: z.string() });
export type FetchResponse = z.infer<typeof FetchResponseSchema>;

export const ResponsesResponseSchema = z.object({
	response: LinkupResponseEntity,
});
export type ResponsesResponse = z.infer<typeof ResponsesResponseSchema>;

export const EndpointInputSchemas = {
	'credits.get': EmptyInputSchema,
	'search.run': QueryInputSchema,
	'answers.get': QueryInputSchema,
	'pages.fetch': FetchInputSchema,
	'responses.create': ResponseInputSchema,
};

export const EndpointOutputSchemas = {
	'credits.get': CreditResponseSchema,
	'search.run': SearchResponseSchema,
	'answers.get': AnswerResponseSchema,
	'pages.fetch': FetchResponseSchema,
	'responses.create': ResponsesResponseSchema,
};

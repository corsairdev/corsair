import { z } from 'zod';

// Get Event
const GetEventInputSchema = z.object({
	event_id: z.string(),
});
export type GetEventInput = z.infer<typeof GetEventInputSchema>;

const GetEventResponseSchema = z.object({
	data: z.unknown(),
});
export type GetEventResponse = z.infer<typeof GetEventResponseSchema>;

// Get Events
const GetEventsInputSchema = z.object({
	page: z.number(),
	since: z.string().optional(),
	pageSize: z.number().optional(),
	inFutureOnly: z.boolean().optional(),
	overrideLocation: z.string().optional(),
});
export type GetEventsInput = z.infer<typeof GetEventsInputSchema>;

const GetEventsResponseSchema = z.object({
	data: z.unknown(),
});
export type GetEventsResponse = z.infer<typeof GetEventsResponseSchema>;

// Get Tags
const GetTagsInputSchema = z.object({
	page: z.number(),
});
export type GetTagsInput = z.infer<typeof GetTagsInputSchema>;

const GetTagsResponseSchema = z.object({
	data: z.unknown(),
});
export type GetTagsResponse = z.infer<typeof GetTagsResponseSchema>;

export type HumanitixEndpointInputs = {
	getEvent: GetEventInput;
	getEvents: GetEventsInput;
	getTags: GetTagsInput;
};

export type HumanitixEndpointOutputs = {
	getEvent: GetEventResponse;
	getEvents: GetEventsResponse;
	getTags: GetTagsResponse;
};

export const HumanitixEndpointInputSchemas = {
	getEvent: GetEventInputSchema,
	getEvents: GetEventsInputSchema,
	getTags: GetTagsInputSchema,
};

export const HumanitixEndpointOutputSchemas = {
	getEvent: GetEventResponseSchema,
	getEvents: GetEventsResponseSchema,
	getTags: GetTagsResponseSchema,
};

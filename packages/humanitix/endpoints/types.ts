import { z } from 'zod';
import { HumanitixEvent, HumanitixTag } from '../schema/database';

const Page = z.number().int().min(1);
const PageSize = z.number().int().min(1).max(100);

const GetEventInputSchema = z.object({
	eventId: z.string().min(1),
});
export type GetEventInput = z.infer<typeof GetEventInputSchema>;
export type GetEventResponse = HumanitixEvent;

const GetEventsInputSchema = z.object({
	page: Page,
	pageSize: PageSize.optional(),
	inFutureOnly: z.boolean().optional(),
	since: z.string().optional(),
	overrideLocation: z.string().optional(),
});
export type GetEventsInput = z.infer<typeof GetEventsInputSchema>;

const GetEventsResponseSchema = z
	.object({
		total: z.number(),
		page: z.number(),
		pageSize: z.number(),
		events: z.array(HumanitixEvent),
	})
	.loose();
export type GetEventsResponse = z.infer<typeof GetEventsResponseSchema>;

const GetTagsInputSchema = z.object({
	page: Page,
	pageSize: PageSize.optional(),
});
export type GetTagsInput = z.infer<typeof GetTagsInputSchema>;

const GetTagsResponseSchema = z
	.object({
		total: z.number(),
		page: z.number(),
		pageSize: z.number(),
		tags: z.array(HumanitixTag),
	})
	.loose();
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
	getEvent: HumanitixEvent,
	getEvents: GetEventsResponseSchema,
	getTags: GetTagsResponseSchema,
};

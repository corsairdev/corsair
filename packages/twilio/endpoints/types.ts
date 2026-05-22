import { z } from 'zod';
import {
	TwilioCallEntity,
	TwilioMessageEntity,
} from '../schema/database';

const MessageListInputSchema = z.object({
	limit: z.number().int().min(1).max(1000).optional(),
	to: z.string().optional(),
	from: z.string().optional(),
	dateSentAfter: z.string().optional(),
	dateSentBefore: z.string().optional(),
	pageSize: z.number().int().min(1).max(1000).optional(),
});

export type TwilioMessagesListInput = z.infer<typeof MessageListInputSchema>;

const MessageGetInputSchema = z.object({
	sid: z.string().min(1),
});

export type TwilioMessagesGetInput = z.infer<typeof MessageGetInputSchema>;

const CallListInputSchema = z.object({
	limit: z.number().int().min(1).max(1000).optional(),
	to: z.string().optional(),
	from: z.string().optional(),
	status: z
		.enum(['queued', 'ringing', 'in-progress', 'canceled', 'completed', 'busy', 'failed', 'no-answer'])
		.optional(),
	startTimeAfter: z.string().optional(),
	startTimeBefore: z.string().optional(),
	endTimeAfter: z.string().optional(),
	endTimeBefore: z.string().optional(),
	pageSize: z.number().int().min(1).max(1000).optional(),
});

export type TwilioCallsListInput = z.infer<typeof CallListInputSchema>;

const CallGetInputSchema = z.object({
	sid: z.string().min(1),
});

export type TwilioCallsGetInput = z.infer<typeof CallGetInputSchema>;

export type TwilioEndpointInputs = {
	messagesList: TwilioMessagesListInput;
	messagesGet: TwilioMessagesGetInput;
	callsList: TwilioCallsListInput;
	callsGet: TwilioCallsGetInput;
};

export type TwilioEndpointOutputs = {
	messagesList: {
		messages: Array<z.infer<typeof TwilioMessageEntity>>;
		end?: number;
		first_page_uri?: string | null;
		next_page_uri?: string | null;
		page?: number;
		page_size?: number;
		previous_page_uri?: string | null;
		start?: number;
		uri?: string;
	};
	messagesGet: z.infer<typeof TwilioMessageEntity>;
	callsList: {
		calls: Array<z.infer<typeof TwilioCallEntity>>;
		end?: number;
		first_page_uri?: string | null;
		next_page_uri?: string | null;
		page?: number;
		page_size?: number;
		previous_page_uri?: string | null;
		start?: number;
		uri?: string;
	};
	callsGet: z.infer<typeof TwilioCallEntity>;
};

export const TwilioEndpointInputSchemas = {
	messagesList: MessageListInputSchema,
	messagesGet: MessageGetInputSchema,
	callsList: CallListInputSchema,
	callsGet: CallGetInputSchema,
} as const;

export const TwilioEndpointOutputSchemas = {
	messagesList: z.object({
		messages: z.array(TwilioMessageEntity),
		end: z.number().optional(),
		first_page_uri: z.string().nullable().optional(),
		next_page_uri: z.string().nullable().optional(),
		page: z.number().optional(),
		page_size: z.number().optional(),
		previous_page_uri: z.string().nullable().optional(),
		start: z.number().optional(),
		uri: z.string().optional(),
	}),
	messagesGet: TwilioMessageEntity,
	callsList: z.object({
		calls: z.array(TwilioCallEntity),
		end: z.number().optional(),
		first_page_uri: z.string().nullable().optional(),
		next_page_uri: z.string().nullable().optional(),
		page: z.number().optional(),
		page_size: z.number().optional(),
		previous_page_uri: z.string().nullable().optional(),
		start: z.number().optional(),
		uri: z.string().optional(),
	}),
	callsGet: TwilioCallEntity,
} as const;

import { z } from 'zod';

const recordsSchema = z
	.object({
		cursor: z.string().optional(),
		currentPageNumber: z.number().optional(),
		totalRecords: z.number().optional(),
		pageSize: z.number().optional(),
	})
	.passthrough();

const callSchema = z.record(z.string(), z.unknown());
const callsFilter = z
	.object({
		fromDateTime: z.string().optional(),
		toDateTime: z.string().optional(),
		workspaceId: z.string().optional(),
		callIds: z.array(z.string()).optional(),
		primaryUserIds: z.array(z.string()).optional(),
	})
	.passthrough();

export const GongCallsInputSchemas = {
	addCall: z
		.object({
			clientUniqueId: z.string(),
			actualStart: z.string(),
			parties: z.array(z.record(z.string(), z.unknown())),
			direction: z.string(),
			primaryUser: z.string(),
		})
		.passthrough(),
	listCalls: z.object({
		fromDateTime: z.string().min(1),
		toDateTime: z.string().min(1),
		workspaceId: z.string().optional(),
		cursor: z.string().optional(),
	}),
	getCall: z.object({ id: z.string().regex(/^\d{1,20}$/) }),
	listCallsExtensive: z.object({
		cursor: z.string().optional(),
		filter: callsFilter,
		contentSelector: z.record(z.string(), z.unknown()).optional(),
	}),
	getCallTranscripts: z.object({
		filter: callsFilter,
		cursor: z.string().optional(),
	}),
	addCallRecording: z.object({
		id: z.string().regex(/^\d{1,20}$/),
		mediaFile: z.instanceof(Blob),
	}),
} as const;

export const GongCallsOutputSchemas = {
	addCall: z
		.object({ requestId: z.string(), callId: z.string() })
		.passthrough(),
	listCalls: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			calls: z.array(callSchema),
		})
		.passthrough(),
	getCall: z.object({ requestId: z.string(), call: callSchema }).passthrough(),
	listCallsExtensive: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			calls: z.array(callSchema),
		})
		.passthrough(),
	getCallTranscripts: z
		.object({
			requestId: z.string(),
			records: recordsSchema.optional(),
			callTranscripts: z.array(callSchema).optional(),
		})
		.passthrough(),
	addCallRecording: z
		.object({
			requestId: z.string(),
			callId: z.string(),
			url: z.string().url(),
		})
		.passthrough(),
} as const;

export type GongCallsInputs = {
	[K in keyof typeof GongCallsInputSchemas]: z.infer<
		(typeof GongCallsInputSchemas)[K]
	>;
};
export type GongCallsOutputs = {
	[K in keyof typeof GongCallsOutputSchemas]: z.infer<
		(typeof GongCallsOutputSchemas)[K]
	>;
};

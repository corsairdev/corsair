import { z } from 'zod';

const PhoneInputSchema = z.object({
	phone: z.string().min(1),
});

export type PhoneInput = z.infer<typeof PhoneInputSchema>;

const CallerApiResponseSchema = z.record(z.string(), z.unknown());

export type CallerApiResponse = z.infer<typeof CallerApiResponseSchema>;

export type CallerapiEndpointInputs = {
	lookup: PhoneInput;
	ported: PhoneInput;
	portingHistory: PhoneInput;
	onlinePresence: PhoneInput;
};

export type CallerapiEndpointOutputs = {
	lookup: CallerApiResponse;
	ported: CallerApiResponse;
	portingHistory: CallerApiResponse;
	onlinePresence: CallerApiResponse;
};

export const CallerapiEndpointInputSchemas = {
	lookup: PhoneInputSchema,
	ported: PhoneInputSchema,
	portingHistory: PhoneInputSchema,
	onlinePresence: PhoneInputSchema,
} as const;

export const CallerapiEndpointOutputSchemas = {
	lookup: CallerApiResponseSchema,
	ported: CallerApiResponseSchema,
	portingHistory: CallerApiResponseSchema,
	onlinePresence: CallerApiResponseSchema,
} as const;

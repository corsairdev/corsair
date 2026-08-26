import { z } from 'zod';

const GetCurrentUserInputSchema = z.object({});

export type GetCurrentUserInput = z.infer<typeof GetCurrentUserInputSchema>;

const GetCurrentUserResponseSchema = z.object({
	id: z.string(),
	username: z.string().optional(),
	display_name: z.string().optional(),
	email: z.string().optional(),
});

export type GetCurrentUserResponse = z.infer<
	typeof GetCurrentUserResponseSchema
>;

export type WakaTimeEndpointInputs = {
	getCurrentUser: GetCurrentUserInput;
};

export type WakaTimeEndpointOutputs = {
	getCurrentUser: GetCurrentUserResponse;
};

export const WakaTimeEndpointInputSchemas = {
	getCurrentUser: GetCurrentUserInputSchema,
} as const;

export const WakaTimeEndpointOutputSchemas = {
	getCurrentUser: GetCurrentUserResponseSchema,
} as const;

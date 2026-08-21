import { z } from 'zod';

// Create Project
const CreateProjectInputSchema = z.object({
	name: z.string().min(2).max(100),
});
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

const CreateProjectResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	created_at_ts: z.number(),
});
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

// Get Designs
const GetDesignsInputSchema = z.object({
	project_id: z.string().uuid().optional(),
	type: z
		.enum(['static', 'animated', 'printer', 'printer_multipage'])
		.optional(),
});
export type GetDesignsInput = z.infer<typeof GetDesignsInputSchema>;

const DesignSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	type: z.string(),
	project_id: z.string().uuid(),
	project_name: z.string(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	preview_url: z.string().optional(),
});
const GetDesignsResponseSchema = z.array(DesignSchema);
export type GetDesignsResponse = z.infer<typeof GetDesignsResponseSchema>;

// Get Fonts
const GetFontsInputSchema = z.object({
	type: z.enum(['google', 'custom']).optional(),
});
export type GetFontsInput = z.infer<typeof GetFontsInputSchema>;

const FontSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['google', 'custom']),
	available_weights: z.array(z.union([z.number(), z.string()])),
});
const GetFontsResponseSchema = z.array(FontSchema);
export type GetFontsResponse = z.infer<typeof GetFontsResponseSchema>;

// Test Auth
const TestAuthInputSchema = z.object({});
export type TestAuthInput = z.infer<typeof TestAuthInputSchema>;

const TestAuthResponseSchema = z.object({
	company: z.string(),
});
export type TestAuthResponse = z.infer<typeof TestAuthResponseSchema>;

export type AbyssaleEndpointInputs = {
	createProject: CreateProjectInput;
	getDesigns: GetDesignsInput;
	getFonts: GetFontsInput;
	testAuth: TestAuthInput;
};

export type AbyssaleEndpointOutputs = {
	createProject: CreateProjectResponse;
	getDesigns: GetDesignsResponse;
	getFonts: GetFontsResponse;
	testAuth: TestAuthResponse;
};

export const AbyssaleEndpointInputSchemas = {
	createProject: CreateProjectInputSchema,
	getDesigns: GetDesignsInputSchema,
	getFonts: GetFontsInputSchema,
	testAuth: TestAuthInputSchema,
} as const;

export const AbyssaleEndpointOutputSchemas = {
	createProject: CreateProjectResponseSchema,
	getDesigns: GetDesignsResponseSchema,
	getFonts: GetFontsResponseSchema,
	testAuth: TestAuthResponseSchema,
} as const;

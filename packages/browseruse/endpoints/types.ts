import { z } from 'zod';
import { BrowserUseBrowser, BrowserUseRun, RunStatus } from '../schema';

/** ISO 3166-1 alpha-2, lowercase (e.g. `us`, `de`). `null` disables the proxy. */
const ProxyCountryCode = z
	.string()
	.regex(/^[a-z]{2}$/)
	.nullable();

const Id = z.object({ id: z.string().uuid() });

export const BrowsersCreateInputSchema = z.object({
	profileId: z.string().uuid().optional(),
	proxyCountryCode: ProxyCountryCode.optional(),
	/** Minutes, 1-240. Defaults to 60. */
	timeout: z.number().int().min(1).max(240).optional(),
	browserScreenWidth: z.number().int().min(320).max(6144).optional(),
	browserScreenHeight: z.number().int().min(320).max(3456).optional(),
	allowResizing: z.boolean().optional(),
	solveCaptchas: z.boolean().optional(),
	enableRecording: z.boolean().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	customProxy: z
		.object({
			host: z.string().min(1).max(255),
			port: z.number().int().min(1).max(65535),
			username: z.string().optional(),
			password: z.string().optional(),
			ignoreCertErrors: z.boolean().optional(),
		})
		.optional(),
});
export const BrowsersCreateOutputSchema = BrowserUseBrowser;

export const BrowsersGetInputSchema = Id;
export const BrowsersGetOutputSchema = BrowserUseBrowser;

export const BrowsersListInputSchema = z.object({
	pageSize: z.number().int().min(1).max(100).optional(),
	pageNumber: z.number().int().min(1).optional(),
	filterBy: z.enum(['active', 'stopped']).optional(),
});
export const BrowsersListOutputSchema = z.object({
	items: z.array(BrowserUseBrowser),
	totalItems: z.number().int(),
	pageNumber: z.number().int(),
	pageSize: z.number().int(),
});

export const BrowsersStopInputSchema = Id;
export const BrowsersStopOutputSchema = BrowserUseBrowser;

export const RunsCreateInputSchema = z.object({
	task: z.string().min(1),
	/** Model id, e.g. `gpt-6-luna` (default) or `claude-sonnet-5`. */
	model: z.string().min(1).optional(),
	modelParams: z.record(z.string(), z.unknown()).optional(),
	/** JSON Schema for structured output. */
	outputSchema: z.record(z.string(), z.unknown()).optional(),
	/** Continue an existing conversation. */
	sessionId: z.string().uuid().optional(),
	workspaceId: z.string().uuid().optional(),
	browserSettings: z
		.object({
			profileId: z.string().optional(),
			proxyCountryCode: ProxyCountryCode.optional(),
			record: z.boolean().optional(),
		})
		.optional(),
	/** Seconds the browser stays open after the run, 120-14400. */
	keepAlive: z.number().int().min(120).max(14400).optional(),
	maxCostUsd: z.number().positive().optional(),
});
export const RunsCreateOutputSchema = z.object({
	id: z.string(),
	status: RunStatus,
	model: z.string(),
	sessionId: z.string(),
	workspaceId: z.string(),
	eventsUrl: z.string(),
	missingFileIds: z.array(z.string()).optional(),
	skippedVaultItems: z.array(z.string()).optional(),
});

export const RunsGetInputSchema = Id;
export const RunsGetOutputSchema = BrowserUseRun;

export const RunsCancelInputSchema = Id;
export const RunsCancelOutputSchema = BrowserUseRun;

export const BrowserUseEndpointInputSchemas = {
	browsersCreate: BrowsersCreateInputSchema,
	browsersGet: BrowsersGetInputSchema,
	browsersList: BrowsersListInputSchema,
	browsersStop: BrowsersStopInputSchema,
	runsCreate: RunsCreateInputSchema,
	runsGet: RunsGetInputSchema,
	runsCancel: RunsCancelInputSchema,
} as const;

export const BrowserUseEndpointOutputSchemas = {
	browsersCreate: BrowsersCreateOutputSchema,
	browsersGet: BrowsersGetOutputSchema,
	browsersList: BrowsersListOutputSchema,
	browsersStop: BrowsersStopOutputSchema,
	runsCreate: RunsCreateOutputSchema,
	runsGet: RunsGetOutputSchema,
	runsCancel: RunsCancelOutputSchema,
} as const;

export type BrowserUseEndpointInputs = {
	[K in keyof typeof BrowserUseEndpointInputSchemas]: z.infer<
		(typeof BrowserUseEndpointInputSchemas)[K]
	>;
};

export type BrowserUseEndpointOutputs = {
	[K in keyof typeof BrowserUseEndpointOutputSchemas]: z.infer<
		(typeof BrowserUseEndpointOutputSchemas)[K]
	>;
};

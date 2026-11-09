import { z } from 'zod';

const rowSchema = z.record(z.string(), z.unknown());

export const GongSettingsInputSchemas = {
	listTrackers: z.object({ workspaceId: z.string().optional() }),
	listScorecards: z.object({}),
	listBriefs: z.object({ workspaceId: z.string().optional() }),
} as const;

export const GongSettingsOutputSchemas = {
	listTrackers: z
		.object({ requestId: z.string(), keywordTrackers: z.array(rowSchema) })
		.passthrough(),
	listScorecards: z
		.object({ requestId: z.string(), scorecards: z.array(rowSchema) })
		.passthrough(),
	listBriefs: z
		.object({ requestId: z.string(), briefs: z.array(rowSchema) })
		.passthrough(),
} as const;

export type GongSettingsInputs = {
	[K in keyof typeof GongSettingsInputSchemas]: z.infer<
		(typeof GongSettingsInputSchemas)[K]
	>;
};
export type GongSettingsOutputs = {
	[K in keyof typeof GongSettingsOutputSchemas]: z.infer<
		(typeof GongSettingsOutputSchemas)[K]
	>;
};

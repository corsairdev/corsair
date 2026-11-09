import { z } from 'zod';

const integrationTypeSetting = z.record(z.string(), z.unknown());
export const GongIntegrationSettingsInputSchemas = {
	update: z.object({
		integrationTypeSettings: z.array(integrationTypeSetting),
	}),
} as const;
export const GongIntegrationSettingsOutputSchemas = {
	update: z
		.object({ requestId: z.string(), integrationId: z.number() })
		.passthrough(),
} as const;
export type GongIntegrationSettingsInputs = {
	[K in keyof typeof GongIntegrationSettingsInputSchemas]: z.infer<
		(typeof GongIntegrationSettingsInputSchemas)[K]
	>;
};
export type GongIntegrationSettingsOutputs = {
	[K in keyof typeof GongIntegrationSettingsOutputSchemas]: z.infer<
		(typeof GongIntegrationSettingsOutputSchemas)[K]
	>;
};

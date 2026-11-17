import { z } from 'zod';

// Microsoft lists dimensions but does not publish wire values for every label.
const dimension = z.string().min(1);
export const InsightsGetInputSchema = z.object({
	numOfDays: z.number().int().min(1).max(3),
	dimension1: dimension.optional(),
	dimension2: dimension.optional(),
	dimension3: dimension.optional(),
});
// Information fields vary by metric and selected dimensions; Microsoft only
// publishes a sample, not exhaustive schemas. Live responses differ from that
// sample: counts come back as numbers (the sample shows strings), averages are
// null when a project has no traffic, and the keys are distinctUserCount and
// pagesPerSessionPercentage. Known keys accept either spelling and type; every
// other key passes through.
const count = z.union([z.string(), z.number()]).nullish();
const InsightInformationSchema = z
	.object({
		totalSessionCount: count,
		totalBotSessionCount: count,
		distinctUserCount: count,
		distantUserCount: count,
		pagesPerSessionPercentage: z.number().nullish(),
		PagesPerSessionPercentage: z.number().nullish(),
		OS: z.string().nullish(),
	})
	.loose();
export const InsightsGetResponseSchema = z.array(
	z
		.object({
			metricName: z.string(),
			information: z.array(InsightInformationSchema),
		})
		.loose(),
);
export type InsightsGetInput = z.infer<typeof InsightsGetInputSchema>;
export type InsightsGetResponse = z.infer<typeof InsightsGetResponseSchema>;
export type MicrosoftClarityEndpointInputs = { insightsGet: InsightsGetInput };
export type MicrosoftClarityEndpointOutputs = {
	insightsGet: InsightsGetResponse;
};
export const MicrosoftClarityEndpointInputSchemas = {
	insightsGet: InsightsGetInputSchema,
} as const;
export const MicrosoftClarityEndpointOutputSchemas = {
	insightsGet: InsightsGetResponseSchema,
} as const;

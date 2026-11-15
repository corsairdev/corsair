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
// publishes a sample, not exhaustive schemas for other metric records.
const InsightInformationSchema = z
	.object({
		totalSessionCount: z.string().optional(),
		totalBotSessionCount: z.string().optional(),
		distantUserCount: z.string().optional(),
		PagesPerSessionPercentage: z.number().optional(),
		OS: z.string().optional(),
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

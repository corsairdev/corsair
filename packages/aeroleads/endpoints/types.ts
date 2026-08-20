import { z } from 'zod';

const GetDetailsFromLinkedinUrlInputSchema = z.object({
  linkedin_url: z.string().url(),
});

export type GetDetailsFromLinkedinUrlInput = z.infer<typeof GetDetailsFromLinkedinUrlInputSchema>;

const GetDetailsFromLinkedinUrlResponseSchema = z.record(z.string(), z.unknown());

export type GetDetailsFromLinkedinUrlResponse = z.infer<typeof GetDetailsFromLinkedinUrlResponseSchema>;

export type AeroleadsEndpointInputs = {
  getDetailsFromLinkedinUrl: GetDetailsFromLinkedinUrlInput;
};

export type AeroleadsEndpointOutputs = {
  getDetailsFromLinkedinUrl: GetDetailsFromLinkedinUrlResponse;
};

export const AeroleadsEndpointInputSchemas = {
  getDetailsFromLinkedinUrl: GetDetailsFromLinkedinUrlInputSchema,
} as const;

export const AeroleadsEndpointOutputSchemas = {
  getDetailsFromLinkedinUrl: GetDetailsFromLinkedinUrlResponseSchema,
} as const;
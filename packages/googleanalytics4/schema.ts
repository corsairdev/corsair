import { z } from 'zod';

export const GA4Schema = z.object({
  account_id: z.string().describe('Google Analytics account ID'),
  property_id: z.string().describe('Google Analytics property ID'),
  measurement_id: z.string().optional().describe('Measurement ID for Measurement Protocol'),
  api_secret: z.string().optional().describe('API secret for Measurement Protocol'),
});

export type GA4SchemaType = z.infer<typeof GA4Schema>;

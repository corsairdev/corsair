import { z } from 'zod';

// Restrict to linkedin.com hostnames to prevent SSRF / unintended targets
// (the endpoint hits an external API keyed off the supplied URL). Accepts:
//   - linkedin.com
//   - www.linkedin.com
//   - any subdomain of linkedin.com (e.g. <region>.linkedin.com)
// lnkd.in and other shorteners are intentionally excluded — add them back
// when the API spec confirms they are valid upstream targets.
const LINKEDIN_HOST_PATTERN =
  /^(www\.)?linkedin\.com$|^[a-z0-9-]+\.linkedin\.com$/i;

const LinkedinUrlSchema = z
  .string()
  .url()
  .refine(
    (value) => {
      try {
        const host = new URL(value).hostname.toLowerCase();
        return LINKEDIN_HOST_PATTERN.test(host);
      } catch {
        return false;
      }
    },
    { message: 'linkedin_url must be a linkedin.com hostname' },
  );

const GetDetailsFromLinkedinUrlInputSchema = z.object({
  linkedin_url: LinkedinUrlSchema,
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
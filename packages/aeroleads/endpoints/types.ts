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
    { error: 'linkedin_url must be a linkedin.com hostname' },
  );

const GetDetailsFromLinkedinUrlInputSchema = z.object({
  linkedin_url: LinkedinUrlSchema,
});

export type GetDetailsFromLinkedinUrlInput = z.infer<typeof GetDetailsFromLinkedinUrlInputSchema>;

// AeroLeads LinkedIn profile response — see https://aeroleads.com/api
// Fields are typed per the public spec; everything is optional because the
// API omits fields it does not have data for. `.loose()` allows additional
// fields the provider may add without breaking the schema.
const AeroleadsEmailSchema = z
  .object({
    email: z.string(),
    status: z.string().optional(),
  })
  .loose();

const AeroleadsPhoneSchema = z
  .object({
    number: z.string().optional(),
    type: z.string().optional(),
  })
  .loose();

const GetDetailsFromLinkedinUrlResponseSchema = z
  .object({
    // Identity
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    full_name: z.string().optional(),
    gender: z.string().optional(),
    profile_picture_url: z.string().optional(),
    // Location
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    // Job
    job_summary: z.string().optional(),
    job_title_role: z.string().optional(),
    job_title_level: z.string().optional(),
    job_title_detailed_role_s2: z.string().optional(),
    job_description: z.string().optional(),
    job_company_name: z.string().optional(),
    job_company_website: z.string().optional(),
    job_company_linkedin_url: z.string().optional(),
    job_company_size: z.string().optional(),
    industry: z.string().optional(),
    // Lists — typed as unknown arrays because the provider's element shape
    // varies; consumers can narrow per-field as needed.
    education: z.array(z.unknown()).optional(),
    experience: z.array(z.unknown()).optional(),
    interests: z.array(z.unknown()).optional(),
    skills: z.array(z.unknown()).optional(),
    languages: z.array(z.unknown()).optional(),
    emails: z.array(AeroleadsEmailSchema).optional(),
    phone_numbers: z.array(AeroleadsPhoneSchema).optional(),
    // Enrichment / ranking
    cb_rank: z.string().optional(),
    db_logo_url: z.string().optional(),
    organization_founded_year_s2: z.string().optional(),
    organization_facebook_url_s2: z.string().optional(),
    organization_twitter_url_s2: z.string().optional(),
    organization_current_technologies_s2: z.array(z.unknown()).optional(),
    emails_s2: z.array(AeroleadsEmailSchema).optional(),
    phone_numbers_s2: z.array(AeroleadsPhoneSchema).optional(),
  })
  .loose();

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
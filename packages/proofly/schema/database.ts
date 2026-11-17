import { z } from 'zod';

/**
 * One campaign from GET /api/campaigns.
 * https://proofly.io/developers
 * The example id is a number. The row key is that number as a decimal string.
 * domain and subdomains are domain.domain and domain.subdomains.
 */
export const ProoflyCampaignEntity = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	domain: z.string().optional(),
	subdomains: z.boolean().optional(),
	enabled: z.boolean().optional(),
	created: z.string().optional(),
});

export type ProoflyCampaignEntity = z.infer<typeof ProoflyCampaignEntity>;

/**
 * The signed-in user from GET /api/user.
 * email is the row key. pixel.key is a credential and is not a column.
 */
export const ProoflyUserEntity = z.object({
	email: z.string().min(1),
	name: z.string().optional(),
	logins: z.number().optional(),
	registered: z.string().optional(),
	impressionsPeriod: z.number().optional(),
	impressionsTotal: z.number().optional(),
});

export type ProoflyUserEntity = z.infer<typeof ProoflyUserEntity>;

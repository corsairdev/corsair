import { z } from 'zod';

/**
 * An issuance, typed from the reference's field table and from the response the
 * live API sent for `example.com`.
 *
 * Most fields are only present when the matching `expand` value is requested,
 * and the API omits rather than nulls them, so every expanded field is
 * `.nullish()`. `revoked` is the one documented three-state field: it can be
 * `true`, `false` or `null` when revocation status is unknown.
 */
const IssuerSchema = z
	.object({
		friendly_name: z.string().nullish(),
		website: z.string().nullish(),
		caa_domains: z.array(z.string()).nullish(),
		operator: z
			.object({
				name: z.string().nullish(),
				website: z.string().nullish(),
			})
			.loose()
			.nullish(),
		pubkey_sha256: z.string().nullish(),
		pubkey_der: z.string().nullish(),
		name: z.string().nullish(),
		name_der: z.string().nullish(),
	})
	.loose();

const RevocationSchema = z
	.object({
		time: z.string().nullish(),
		reason: z.number().nullish(),
		checked_at: z.string().nullish(),
	})
	.loose();

const PublicKeySchema = z
	.object({
		type: z.string().nullish().describe('rsa, ecdsa, or unknown'),
		bit_length: z.number().nullish().describe('Present when type is rsa'),
		curve: z.string().nullish().describe('Present when type is ecdsa'),
	})
	.loose();

const IssuanceSchema = z
	.object({
		id: z.string().describe('Opaque ID; pass the last one as `after` to page'),
		tbs_sha256: z.string(),
		cert_sha256: z.string(),
		pubkey_sha256: z.string(),
		not_before: z.string(),
		not_after: z.string(),
		revoked: z
			.boolean()
			.nullish()
			.describe('null when revocation status is unknown'),
		dns_names: z
			.array(z.string())
			.nullish()
			.describe('Requires expand=dns_names'),
		pubkey_der: z.string().nullish().describe('Requires expand=pubkey'),
		pubkey: PublicKeySchema.nullish().describe('Requires expand=pubkey'),
		issuer: IssuerSchema.nullish().describe('Requires expand=issuer'),
		revocation: RevocationSchema.nullish().describe(
			'Requires expand=revocation',
		),
		problem_reporting: z
			.string()
			.nullish()
			.describe('Requires expand=problem_reporting'),
		cert_der: z.string().nullish().describe('Requires expand=cert_der'),
	})
	.loose();
export type IssuanceOutput = z.output<typeof IssuanceSchema>;

/**
 * The `expand` values the reference documents, including the nested ones. A
 * path with a dot expands a field inside another expanded field.
 */
const ExpandSchema = z.enum([
	'dns_names',
	'issuer',
	'issuer.website',
	'issuer.caa_domains',
	'issuer.operator',
	'issuer.pubkey_der',
	'issuer.name_der',
	'pubkey',
	'pubkey_der',
	'revocation',
	'problem_reporting',
	'cert_der',
]);

const ListIssuancesInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.describe(
			'Registered domain or a name under it, e.g. "example.com" or "www.example.com"; a bare TLD is rejected',
		),
	include_subdomains: z
		.boolean()
		.optional()
		.describe('Also return issuances valid for sub-domains; default false'),
	match_wildcards: z
		.boolean()
		.optional()
		.describe(
			'Also return wildcard matches, e.g. *.example.com; default false',
		),
	after: z
		.string()
		.optional()
		.describe(
			'Return issuances discovered after this ID; take `id` from the last result of the previous page',
		),
	expand: z
		.array(ExpandSchema)
		.optional()
		.describe('Extra fields to include; repeated as one `expand` per value'),
});
export type ListIssuancesInput = z.input<typeof ListIssuancesInputSchema>;

const IssuancesOutputSchema = z.array(IssuanceSchema);
export type IssuancesOutput = z.output<typeof IssuancesOutputSchema>;

const FirehoseInputSchema = z.object({
	after: z
		.string()
		.optional()
		.describe(
			'Return issuances discovered after this ID; omit to start from about an hour ago',
		),
	expand: z.array(ExpandSchema).optional(),
});
export type FirehoseInput = z.input<typeof FirehoseInputSchema>;

export type CertSpotterEndpointInputs = {
	listIssuances: ListIssuancesInput;
	firehose: FirehoseInput;
};

export type CertSpotterEndpointOutputs = {
	listIssuances: IssuancesOutput;
	firehose: IssuancesOutput;
};

export const CertSpotterEndpointInputSchemas = {
	listIssuances: ListIssuancesInputSchema,
	firehose: FirehoseInputSchema,
} as const;

export const CertSpotterEndpointOutputSchemas = {
	listIssuances: IssuancesOutputSchema,
	firehose: IssuancesOutputSchema,
} as const;

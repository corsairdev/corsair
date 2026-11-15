import { z } from 'zod';
import { bool, str } from '../schema-helpers';

export const VerifiedDomainsInputSchemas = {
	verifiedDomainsList: z.object({}).strict(),
	verifiedDomainsAdd: z
		.object({
			domain: z.string().describe('Domain or URL of your website.'),
		})
		.strict(),
	verifiedDomainsVerify: z
		.object({
			uid: z
				.string()
				.min(1)
				.describe(
					'`uid` of the destination, from List verified destinations or Add a destination to verify.',
				),
		})
		.strict(),
	verifiedDomainsRemove: z
		.object({
			uid: z
				.string()
				.min(1)
				.describe(
					'`uid` of the destination, from List verified destinations or Add a destination to verify.',
				),
		})
		.strict(),
} as const;

export const VerifiedDomainsOutputSchemas = {
	verifiedDomainsList: z
		.object({
			success: bool.describe('`true` when the request worked.'),
			data: z
				.array(
					z
						.object({
							uid: str,
							domain: str,
							status: str,
							is_grandfathered: bool,
							verified_at: str,
							last_checked_at: str,
							last_error: str,
							created_at: str,
							txt_record: z
								.object({
									type: str,
									name: str,
									value: str,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe('Your destinations.'),
		})
		.loose(),
	verifiedDomainsAdd: z
		.object({
			success: bool.describe('`true` when the request worked.'),
			data: z
				.object({
					uid: str.describe(
						'ID of the destination. Use it with Verify a destination and Remove a destination.',
					),
					domain: str.describe(
						'Root domain of your website. Verifying it also covers its subdomains.',
					),
					status: str.describe(
						'`pending`: added, not verified yet. `verified`: you can mask your domains to it. `failed`: the last check did not find the TXT record.',
					),
					is_grandfathered: bool.describe(
						'`true` if you were already masking to this website before verification was required, so no TXT check was needed.',
					),
					verified_at: str.describe(
						'When the website was verified. `null` until then.',
					),
					last_checked_at: str.describe(
						'When the TXT record was last checked. `null` if it was never checked.',
					),
					last_error: str.describe(
						'Why the last check failed, for example `ENOTFOUND` when the TXT record does not exist yet. Empty when there is no error.',
					),
					created_at: str.describe('When the website was added.'),
					txt_record: z
						.object({
							type: str,
							name: str,
							value: str,
						})
						.loose()
						.nullish()
						.describe('The DNS record to publish at your DNS provider.'),
				})
				.loose()
				.nullish()
				.describe('The destination you added.'),
		})
		.loose(),
	verifiedDomainsVerify: z
		.object({
			success: bool.describe('`true` when the check ran.'),
			verified: bool.describe('`true` when the TXT record was found.'),
			data: z
				.object({
					uid: str.describe(
						'ID of the destination. Use it with Verify a destination and Remove a destination.',
					),
					domain: str.describe(
						'Root domain of your website. Verifying it also covers its subdomains.',
					),
					status: str.describe(
						'`pending`: added, not verified yet. `verified`: you can mask your domains to it. `failed`: the last check did not find the TXT record.',
					),
					is_grandfathered: bool.describe(
						'`true` if you were already masking to this website before verification was required, so no TXT check was needed.',
					),
					verified_at: str.describe(
						'When the website was verified. `null` until then.',
					),
					last_checked_at: str.describe(
						'When the TXT record was last checked. `null` if it was never checked.',
					),
					last_error: str.describe(
						'Why the last check failed, for example `ENOTFOUND` when the TXT record does not exist yet. Empty when there is no error.',
					),
					created_at: str.describe('When the website was added.'),
					txt_record: z
						.object({
							type: str,
							name: str,
							value: str,
						})
						.loose()
						.nullish()
						.describe('The DNS record to publish at your DNS provider.'),
				})
				.loose()
				.nullish()
				.describe('The destination, with its updated status.'),
			message: str.describe('Result of the check.'),
		})
		.loose(),
	verifiedDomainsRemove: z
		.object({
			success: bool.describe('`true` when the destination was removed.'),
		})
		.loose(),
} as const;

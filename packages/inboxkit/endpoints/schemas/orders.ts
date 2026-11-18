import { z } from 'zod';
import { looseResult, WorkspaceId } from '../schema-helpers';

export const OrdersInputSchemas = {
	ordersPlace: z
		.object({
			workspaceId: WorkspaceId,
			contact_details: z
				.object({
					first_name: z.string().min(1).describe("Registrant's first name."),
					last_name: z.string().min(1).describe("Registrant's last name."),
					email: z.string().describe("Registrant's email address."),
					phone: z.string().min(1).describe("Registrant's phone number."),
					organization: z
						.string()
						.optional()
						.describe("Registrant's organization (optional)."),
					address_line1: z.string().min(1).describe('Primary address line.'),
					address_line2: z
						.string()
						.optional()
						.describe('Secondary address line (optional).'),
					city: z.string().min(1).describe('City of registrant.'),
					state: z.string().min(1).describe('State or province.'),
					country: z.string().min(1).describe('Country.'),
					postal_code: z.string().min(1).describe('Postal or ZIP code.'),
				})
				.strict()
				.optional()
				.describe(
					'Top-level contact details for domain registration. If provided and valid, used for all domains unless overridden.',
				),
			domains: z
				.array(
					z
						.object({
							name: z
								.string()
								.describe('Domain name to register (e.g. example.com).'),
							redirect_url: z
								.string()
								.describe(
									'Where the domain sends visitors, including `https://`. This is a standard redirect. URL masking is not available on orders.',
								),
							registration_years: z
								.number()
								.int()
								.min(1)
								.max(10)
								.optional()
								.describe(
									'Number of years to register the domain (1-10, default 1).',
								),
							contact_details: z
								.object({
									first_name: z
										.string()
										.min(1)
										.describe("Registrant's first name."),
									last_name: z
										.string()
										.min(1)
										.describe("Registrant's last name."),
									email: z.string().describe("Registrant's email address."),
									phone: z
										.string()
										.min(1)
										.describe("Registrant's phone number."),
									organization: z
										.string()
										.optional()
										.describe("Registrant's organization (optional)."),
									address_line1: z
										.string()
										.min(1)
										.describe('Primary address line.'),
									address_line2: z
										.string()
										.optional()
										.describe('Secondary address line (optional).'),
									city: z.string().min(1).describe('City of registrant.'),
									state: z.string().min(1).describe('State or province.'),
									country: z.string().min(1).describe('Country.'),
									postal_code: z
										.string()
										.min(1)
										.describe('Postal or ZIP code.'),
								})
								.strict()
								.optional()
								.describe(
									'Per-domain contact details. Required if top-level contact_details is missing or invalid.',
								),
							mailboxes: z
								.array(
									z
										.object({
											email: z
												.string()
												.describe(
													'Mailbox email address (must match domain, e.g. user@example.com).',
												),
											first_name: z
												.string()
												.min(1)
												.describe("Mailbox user's first name."),
											last_name: z
												.string()
												.min(1)
												.describe("Mailbox user's last name."),
											platform: z
												.enum(['GOOGLE', 'MICROSOFT', 'AZURE'])
												.optional()
												.describe(
													'Mailbox platform. All mailboxes in a domain must use the same platform. Note: GOOGLE and MICROSOFT support up to 5 mailboxes per domain; AZURE supports up to 100. Default "GOOGLE".',
												),
											sequencer_uid: z
												.string()
												.optional()
												.describe(
													'UID of the sequencer to export to (must exist for workspace/team, optional).',
												),
											profile_pic_url: z
												.string()
												.optional()
												.describe(
													'Optional profile picture URL for mailbox user (must be valid if provided).',
												),
										})
										.strict(),
								)
								.min(1)
								.max(100)
								.describe(
									'List of mailboxes to create for this domain. The maximum number of mailboxes depends on the platform: up to 5 for GOOGLE or MICROSOFT, up to 100 for AZURE.',
								),
							consent_screen_url: z
								.string()
								.optional()
								.describe('URLs for connecting to sequencer'),
						})
						.strict(),
				)
				.min(1)
				.describe('List of domains to register and provision mailboxes for.'),
			warmup_addon_enabled: z
				.boolean()
				.optional()
				.describe(
					'Adds warmup to every mailbox in this order. The first month of warmup for each mailbox is charged to your wallet when the order is placed, at your warmup price (see Get Warmup Pricing). Default false.',
				),
		})
		.strict(),
} as const;

export const OrdersOutputSchemas = {
	ordersPlace: looseResult,
} as const;

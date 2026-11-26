import { z } from 'zod';
import {
	ArtworkSchema,
	BillingGroupIdSchema,
	FscSchema,
	IdempotencyKeySchema,
	IntCountrySchema,
	IntlVerificationSchema,
	LobLetterSchema,
	LobPostcardSchema,
	LobRowErrorSchema,
	LooseRecord,
	MailFromAnySchema,
	MailToSchema,
	MailTypeSchema,
	MergeVariablesSchema,
	MetadataInputSchema,
	MetadataOutputSchema,
	PrintSpeedSchema,
	QrCodeInputSchema,
	SendDateSchema,
	UseTypeSchema,
} from './types-base';

// The rest of Lob's public API (OpenAPI 1.22.0, github.com/lob/lob-openapi):
// the mail products beyond postcards and letters, bank accounts, billing
// groups, buckslips, cards, campaigns, creatives, Informed Delivery, QR code
// analytics, the URL shortener, resource proofs, templates, uploads, reverse
// geocoding and identity validation. Inputs follow the spec; create and update
// bodies are `.loose()` so a field Lob documents later still goes through.
// Outputs are `.loose()` with nullish fields, like the original operations.

// ── shared pieces ─────────────────────────────────────────────────────────

const idOf = (what: string, prefix: string) =>
	z.string().min(1).describe(`The ${what}'s ID, prefixed with ${prefix}.`);

const Str = z.string().nullish();
const Num = z.number().nullish();
const Bool = z.boolean().nullish();
// unknown: nested Lob objects (expanded addresses, template versions,
// thumbnails, tracking events) passed through as Lob sends them.
const Any = z.unknown().optional();

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Rows per page, 1-100. Defaults to 10.');

const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Rows to skip. Defaults to 0.');

const DateFilterSchema = z
	.object({
		gt: z.string().optional(),
		gte: z.string().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
	})
	.optional();

const IncludeSchema = z
	.array(z.literal('total_count'))
	.max(1)
	.optional()
	.describe("Pass ['total_count'] to have total_count filled in.");

const MetadataFilterSchema = z
	.record(z.string(), z.string())
	.optional()
	.describe('Only rows whose metadata carries every given key and value.');

const cursorFields = {
	limit: LimitSchema,
	before: z
		.string()
		.optional()
		.describe('Cursor from previous_url: rows before this one.'),
	after: z
		.string()
		.optional()
		.describe('Cursor from next_url: rows after this one.'),
};

function oneCursor(
	value: { before?: string; after?: string },
	ctx: z.RefinementCtx,
) {
	if (value.before !== undefined && value.after !== undefined) {
		ctx.addIssue({ code: 'custom', message: 'Use before or after, not both' });
	}
}

/** Lob's cursor-paged list envelope. */
export const listOf = <T extends z.ZodType>(item: T) =>
	z
		.object({
			object: Str,
			next_url: Str.describe(
				'Pre-built URL for the next page; null on the last page.',
			),
			previous_url: Str,
			count: Num,
			total_count: Num.describe(
				"Present when the request passed include: ['total_count'].",
			),
			data: z.array(item),
		})
		.loose();

export const DeletedSchema = z
	.object({ id: Str, deleted: Bool })
	.loose()
	.describe('Lob confirms with the ID and deleted: true.');

const baseFields = {
	id: Str,
	description: Str,
	metadata: MetadataOutputSchema,
	date_created: Str,
	date_modified: Str,
	deleted: Bool,
	object: Str,
};

// ── mailpieces: checks, self mailers, snap packs, booklets ─────────────────

const mailpieceFields = {
	...baseFields,
	// unknown: an expanded address object, one shape per US/international.
	to: Any,
	from: Any,
	carrier: Str,
	// unknown: an array of {small, medium, large} signed thumbnail URLs.
	thumbnails: Any,
	expected_delivery_date: Str,
	url: Str.describe('Signed PDF preview; expires after 30 days.'),
	// unknown: tracking events, each {id, type, name, time, details, location}.
	tracking_events: Any,
	campaign_id: Str,
	use_type: Str,
	fsc: Bool,
	status: Str,
	// unknown: {status, message} when rendering failed.
	failure_reason: Any,
	mail_type: Str,
	// unknown: the template variables sent with the piece.
	merge_variables: Any,
	send_date: Str,
	size: Str,
};

export const LobCheckSchema = z
	.object({
		...mailpieceFields,
		amount: Num,
		memo: Str,
		check_number: Num,
		message: Str,
		// unknown: the expanded bank account object.
		bank_account: Any,
		check_bottom_template_id: Str,
		attachment_template_id: Str,
		check_bottom_template_version_id: Str,
		attachment_template_version_id: Str,
	})
	.loose();

export const LobSelfMailerSchema = z
	.object({
		...mailpieceFields,
		inside_template_id: Str,
		outside_template_id: Str,
		inside_template_version_id: Str,
		outside_template_version_id: Str,
	})
	.loose();

export const LobSnapPackSchema = LobSelfMailerSchema.extend({
	color: Bool,
}).loose();

export const LobBookletSchema = z
	.object({
		...mailpieceFields,
		template_id: Str,
		template_version_id: Str,
		pages: Num,
		source_material: Str,
	})
	.loose();

const mailSendFields = {
	to: MailToSchema,
	from: MailFromAnySchema.optional(),
	use_type: UseTypeSchema,
	mail_type: MailTypeSchema,
	merge_variables: MergeVariablesSchema,
	send_date: SendDateSchema,
	description: z.string().max(255).optional(),
	metadata: MetadataInputSchema,
	billing_group_id: BillingGroupIdSchema,
	print_speed: PrintSpeedSchema,
	idempotency_key: IdempotencyKeySchema,
};

const CheckSendInputSchema = z
	.object({
		...mailSendFields,
		from: MailFromAnySchema,
		bank_account: z
			.string()
			.min(1)
			.describe('bank_ ID of a verified bank account to draw on.'),
		amount: z
			.number()
			.positive()
			.max(999_999.99)
			.describe('Check amount in dollars, up to 999999.99.'),
		mail_type: z
			.enum(['usps_first_class'])
			.optional()
			.describe("Checks mail only 'usps_first_class'."),
		memo: z.string().max(40).optional(),
		check_number: z.number().int().min(1).optional(),
		message: z
			.string()
			.max(400)
			.optional()
			.describe('Text printed on the check bottom. Use this or check_bottom.'),
		logo: z
			.string()
			.optional()
			.describe('https URL of a square PNG or JPG logo.'),
		check_bottom: ArtworkSchema.optional().describe(
			'Artwork for the check bottom. Use this or message.',
		),
		attachment: ArtworkSchema.optional().describe(
			'Artwork for a page attached after the check.',
		),
		service_request_number: z.string().optional(),
	})
	.loose()
	.superRefine((value, ctx) => {
		if (value.message === undefined && value.check_bottom === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide message or check_bottom',
			});
		}
		if (value.message !== undefined && value.check_bottom !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Use message or check_bottom, not both',
			});
		}
	});

const SelfMailerSendInputSchema = z
	.object({
		...mailSendFields,
		inside: ArtworkSchema,
		outside: ArtworkSchema,
		size: z
			.enum(['6x18_bifold', '11x9_bifold', '12x9_bifold', '17.75x9_trifold'])
			.optional()
			.describe("Self mailer size. Defaults to '6x18_bifold'."),
		qr_code: QrCodeInputSchema,
		fsc: FscSchema,
		service_request_number: z.string().optional(),
	})
	.loose();

const SnapPackSendInputSchema = z
	.object({
		...mailSendFields,
		inside: ArtworkSchema,
		outside: ArtworkSchema,
		size: z.enum(['8.5x11']).optional().describe("Only '8.5x11'."),
		color: z.boolean().optional().describe('Print in color.'),
		qr_code: QrCodeInputSchema,
	})
	.loose();

const BookletSendInputSchema = z
	.object({
		...mailSendFields,
		from: MailFromAnySchema,
		file: ArtworkSchema,
		pages: z.number().int().min(1).describe('Page count of the booklet.'),
		size: z.enum(['8.375x5.375']).describe("Only '8.375x5.375'."),
		source_material: z.enum(['60# Gloss Text']).optional(),
		qr_code: QrCodeInputSchema,
		fsc: FscSchema,
	})
	.loose();

const MailListInputBase = z.object({
	...cursorFields,
	include: IncludeSchema,
	date_created: DateFilterSchema.describe(
		'ISO 8601 bounds on the creation time.',
	),
	metadata: MetadataFilterSchema,
	campaign_id: z.string().optional(),
	status: z
		.enum(['processed', 'rendered', 'failed'])
		.optional()
		.describe('Render status.'),
	scheduled: z
		.boolean()
		.optional()
		.describe('True for pieces with a future send_date only.'),
	send_date: DateFilterSchema.describe('ISO 8601 bounds on send_date.'),
	mail_type: z.enum(['usps_first_class', 'usps_standard']).optional(),
	sort_by: z
		.union([
			z.object({ date_created: z.enum(['asc', 'desc']) }),
			z.object({ send_date: z.enum(['asc', 'desc']) }),
		])
		.optional()
		.describe('Sort by date_created or send_date, not both.'),
});

const PostcardListInputSchema = MailListInputBase.extend({
	size: z
		.array(z.enum(['4x6', '6x9', '6x11']))
		.optional()
		.describe('Only these sizes.'),
}).superRefine(oneCursor);

const LetterListInputSchema = MailListInputBase.extend({
	color: z.boolean().optional().describe('Only color or black-and-white.'),
}).superRefine(oneCursor);

const CheckListInputSchema = MailListInputBase.omit({
	campaign_id: true,
}).superRefine(oneCursor);

const SelfMailerListInputSchema = MailListInputBase.extend({
	size: z
		.array(
			z.enum(['6x18_bifold', '11x9_bifold', '12x9_bifold', '17.75x9_trifold']),
		)
		.optional(),
}).superRefine(oneCursor);

const PlainMailListInputSchema = MailListInputBase.superRefine(oneCursor);

const idInput = (what: string, prefix: string) =>
	z.object({ id: idOf(what, prefix) });

// ── verifications: intl bulk, reverse geocode, identity validation ─────────

const IntlBulkInputSchema = z.object({
	addresses: z
		.array(
			z
				.object({
					recipient: z.string().max(500).optional(),
					primary_line: z.string().max(200),
					secondary_line: z.string().max(200).optional(),
					city: z.string().max(200).optional(),
					state: z.string().max(200).optional(),
					postal_code: z.string().max(12).optional(),
					country: IntCountrySchema,
				})
				.loose(),
		)
		.min(1)
		.max(20)
		.describe('Up to 20 international addresses.'),
});

const IntlBulkResponseSchema = z
	.object({
		addresses: z
			.array(z.union([IntlVerificationSchema, LobRowErrorSchema]))
			.nullish(),
		errors: Bool.describe('True when at least one row failed.'),
	})
	.loose();

const ReverseGeocodeInputSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	size: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('How many nearby ZIP+4 areas to return. Defaults to 5.'),
});

const ReverseGeocodeResponseSchema = z
	.object({
		id: Str,
		// unknown: each {components: {zip_code, zip_code_plus_4}, location_analysis: {latitude, longitude, distance}}.
		addresses: z.array(LooseRecord).nullish(),
		object: Str,
	})
	.loose();

const IdentityValidationInputSchema = z
	.object({
		recipient: z.string().max(500).optional(),
		company: z.string().max(500).optional(),
		primary_line: z.string().max(200),
		secondary_line: z.string().max(200).optional(),
		urbanization: z.string().max(200).optional(),
		city: z.string().max(200).optional(),
		state: z.string().max(50).optional(),
		zip_code: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.recipient && !value.company) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide recipient or company',
			});
		}
		const hasCityState = value.city !== undefined && value.state !== undefined;
		if (!hasCityState && value.zip_code === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide city with state, or zip_code',
			});
		}
	});

const IdentityValidationResponseSchema = z
	.object({
		id: Str,
		recipient: Str,
		company: Str,
		primary_line: Str,
		secondary_line: Str,
		urbanization: Str,
		last_line: Str,
		score: Num.describe(
			'0-100 likelihood the name is associated with the address.',
		),
		confidence: Str.describe('high, medium, low or none.'),
		object: Str,
	})
	.loose();

// ── bank accounts ─────────────────────────────────────────────────────────

const LobBankAccountSchema = z
	.object({
		...baseFields,
		routing_number: Str,
		account_number: Str,
		account_type: Str,
		signatory: Str,
		check_template: Str,
		fractional_routing_number: Str,
		city: Str,
		state: Str,
		zipcode: Str,
		signature_url: Str,
		bank_name: Str,
		verified: Bool,
		microdeposit_type: Str.describe('amounts or descriptor_code.'),
	})
	.loose();

const BankAccountCreateInputSchema = z
	.object({
		routing_number: z
			.string()
			.regex(/^\d{9}$/, 'A 9-digit ABA routing number.'),
		account_number: z.string().min(1).max(17),
		account_type: z.enum(['company', 'individual']),
		signatory: z
			.string()
			.min(1)
			.max(30)
			.describe('Name of the person who signs checks drawn on it.'),
		check_template: z.enum(['common', 'jpm']).optional(),
		fractional_routing_number: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zipcode: z.string().optional(),
		description: z.string().max(255).optional(),
		metadata: MetadataInputSchema,
	})
	.loose();

const BankAccountVerifyInputSchema = z
	.object({
		id: idOf('bank account', 'bank_'),
		amounts: z
			.array(z.number().int())
			.length(2)
			.optional()
			.describe(
				'The two micro-deposit amounts in cents, when microdeposit_type is amounts.',
			),
		descriptor_code: z
			.string()
			.regex(/^[Ss][Mm][A-Za-z0-9]{4}$/, 'Six characters starting with SM.')
			.optional()
			.describe(
				'The 6-character code from the deposit, when microdeposit_type is descriptor_code.',
			),
	})
	.superRefine((value, ctx) => {
		if (
			(value.amounts === undefined) ===
			(value.descriptor_code === undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide amounts or descriptor_code (one of the two)',
			});
		}
	});

const SimpleListInputSchema = z
	.object({
		...cursorFields,
		include: IncludeSchema,
		date_created: DateFilterSchema,
		metadata: MetadataFilterSchema,
	})
	.superRefine(oneCursor);

// ── billing groups ────────────────────────────────────────────────────────

const LobBillingGroupSchema = z.object({ ...baseFields, name: Str }).loose();

const BillingGroupListInputSchema = z.object({
	limit: LimitSchema,
	offset: OffsetSchema,
	include: IncludeSchema,
	date_created: DateFilterSchema,
	date_modified: DateFilterSchema,
	sort_by: z
		.union([
			z.object({ date_created: z.enum(['asc', 'desc']) }),
			z.object({ date_modified: z.enum(['asc', 'desc']) }),
		])
		.optional(),
});

const BillingGroupCreateInputSchema = z
	.object({
		name: z.string().min(1).max(255),
		description: z.string().max(255).optional(),
	})
	.loose();

const BillingGroupUpdateInputSchema = z
	.object({
		id: idOf('billing group', 'bg_'),
		name: z.string().min(1).max(255).optional(),
		description: z.string().max(255).optional(),
	})
	.loose();

// ── buckslips and cards (inventory printed ahead of mailing) ───────────────

const inventoryFields = {
	...baseFields,
	size: Str,
	url: Str,
	raw_url: Str,
	front_original_url: Str,
	back_original_url: Str,
	thumbnails: Any,
	auto_reorder: Bool,
	reorder_quantity: Num,
	threshold_amount: Num,
	available_quantity: Num,
	pending_quantity: Num,
	status: Str,
};

const LobBuckslipSchema = z
	.object({
		...inventoryFields,
		allocated_quantity: Num,
		onhand_quantity: Num,
		projected_quantity: Num,
		// unknown: the buckslip's order objects.
		buckslip_orders: Any,
		stock: Str,
		weight: Str,
		finish: Str,
	})
	.loose();

const LobCardSchema = z
	.object({ ...inventoryFields, orientation: Str })
	.loose();

const orderFields = {
	...baseFields,
	status: Str,
	quantity_ordered: Num,
	unit_price: Num,
	inventory: Num,
	cancelled_reason: Str,
	availability_date: Str,
	expected_availability_date: Str,
};

const LobBuckslipOrderSchema = z
	.object({ ...orderFields, buckslip_id: Str })
	.loose();
const LobCardOrderSchema = z.object({ ...orderFields, card_id: Str }).loose();

const SideArtworkSchema = z
	.string()
	.min(1)
	.describe('https URL of a PDF, PNG or JPG file for this side.');

const BuckslipCreateInputSchema = z
	.object({
		front: SideArtworkSchema,
		back: SideArtworkSchema.optional(),
		size: z.enum(['8.75x3.75']).optional(),
		description: z.string().max(255).optional(),
	})
	.loose();

const CardCreateInputSchema = z
	.object({
		front: SideArtworkSchema,
		back: SideArtworkSchema.optional(),
		size: z
			.enum(['3.375x2.125', '2.125x3.375'])
			.optional()
			.describe("Card size and orientation. Defaults to '2.125x3.375'."),
		description: z.string().max(255).optional(),
	})
	.loose();

const inventoryUpdateFields = {
	description: z.string().max(255).optional(),
	auto_reorder: z
		.boolean()
		.optional()
		.describe('Reorder automatically when stock falls below the threshold.'),
	reorder_quantity: z.number().int().min(1).optional(),
};

const BuckslipUpdateInputSchema = z
	.object({ id: idOf('buckslip', 'bck_'), ...inventoryUpdateFields })
	.loose();
const CardUpdateInputSchema = z
	.object({ id: idOf('card', 'card_'), ...inventoryUpdateFields })
	.loose();

const InventoryListInputSchema = z
	.object({ ...cursorFields, include: IncludeSchema })
	.superRefine(oneCursor);

const OrderListInputSchema = (what: string, prefix: string) =>
	z.object({
		id: idOf(what, prefix),
		limit: LimitSchema,
		offset: OffsetSchema,
	});

const OrderCreateInputSchema = (what: string, prefix: string, min: number) =>
	z.object({
		id: idOf(what, prefix),
		quantity: z
			.number()
			.int()
			.min(min)
			.max(10_000_000)
			.describe(`Pieces to print; Lob bills the order. Minimum ${min}.`),
	});

const orderListOf = <T extends z.ZodType>(item: T) => listOf(item);

// ── campaigns and creatives ───────────────────────────────────────────────

const LobCampaignSchema = z
	.object({
		...baseFields,
		billing_group_id: Str,
		name: Str,
		schedule_type: Str,
		target_delivery_date: Str,
		send_date: Str,
		cancel_window_campaign_minutes: Num,
		use_type: Str,
		auto_cancel_if_ncoa: Bool,
		print_speed: Str,
		is_draft: Bool,
		// unknown: creative and upload objects attached to the campaign.
		creatives: Any,
		uploads: Any,
	})
	.loose();

const campaignBodyFields = {
	description: z.string().max(255).optional(),
	schedule_type: z
		.enum(['immediate'])
		.describe("When the campaign goes out. Only 'immediate'."),
	target_delivery_date: z.string().optional(),
	send_date: z.string().optional(),
	cancel_window_campaign_minutes: z.number().int().min(0).optional(),
	metadata: MetadataInputSchema,
	use_type: UseTypeSchema,
	auto_cancel_if_ncoa: z
		.boolean()
		.optional()
		.describe('Cancel pieces whose recipient filed a change of address.'),
};

const CampaignCreateInputSchema = z
	.object({
		name: z.string().min(1).max(255),
		billing_group_id: BillingGroupIdSchema,
		print_speed: PrintSpeedSchema,
		...campaignBodyFields,
	})
	.loose();

const CampaignUpdateInputSchema = z
	.object({
		id: idOf('campaign', 'cmp_'),
		name: z.string().min(1).max(255).optional(),
		...campaignBodyFields,
		schedule_type: campaignBodyFields.schedule_type.optional(),
		use_type: UseTypeSchema.optional(),
		is_draft: z.boolean().optional(),
	})
	.loose();

const CampaignListInputSchema = z
	.object({ ...cursorFields, include: IncludeSchema })
	.superRefine(oneCursor);

const LobCreativeSchema = z
	.object({
		...baseFields,
		campaigns: Any,
		resource_type: Str,
		// unknown: per-format details and template references.
		details: Any,
		from: Any,
		template_preview_urls: Any,
		template_previews: Any,
	})
	.loose();

const CreativeCreateInputSchema = z
	.object({
		campaign_id: z.string().min(1).describe('cmp_ ID the creative belongs to.'),
		resource_type: z
			.enum(['postcard', 'letter', 'self_mailer'])
			.describe('The mail format.'),
		// unknown: format-specific options (size, color, mail_type, ...),
		// validated by Lob per resource_type.
		details: LooseRecord.describe(
			'Format details, such as { size: "4x6", mail_type: "usps_first_class" } for a postcard.',
		),
		from: MailFromAnySchema.optional(),
		front: ArtworkSchema.optional().describe('Postcards: front artwork.'),
		back: ArtworkSchema.optional().describe('Postcards: back artwork.'),
		file: ArtworkSchema.optional().describe('Letters: the letter artwork.'),
		inside: ArtworkSchema.optional().describe('Self mailers: inside artwork.'),
		outside: ArtworkSchema.optional().describe(
			'Self mailers: outside artwork.',
		),
		description: z.string().max(255).optional(),
		metadata: MetadataInputSchema,
	})
	.loose()
	.superRefine((value, ctx) => {
		const need: Record<string, string[]> = {
			postcard: ['front', 'back'],
			letter: ['file', 'from'],
			self_mailer: ['inside', 'outside'],
		};
		const record = value as Record<string, unknown>;
		const missing = (need[value.resource_type] ?? []).filter(
			(key) => record[key] === undefined,
		);
		if (missing.length > 0) {
			ctx.addIssue({
				code: 'custom',
				message: `A ${value.resource_type} creative needs ${missing.join(' and ')}`,
			});
		}
	});

const CreativeUpdateInputSchema = z
	.object({
		id: idOf('creative', 'crv_'),
		from: MailFromAnySchema.optional(),
		description: z.string().max(255).optional(),
		metadata: MetadataInputSchema,
	})
	.loose();

// ── Informed Delivery campaigns (USPS email previews) ─────────────────────

const LobInformedDeliverySchema = z
	.object({
		...baseFields,
		quantity: Num,
		status: Str,
		ride_along_url: Str,
		start_date: Str,
		end_date: Str,
		brand_name: Str,
		usps_title: Str,
		lob_campaign_id: Str,
		account_id: Str,
		usps_campaign_id: Str,
		start_serial: Num,
		end_serial: Num,
		ride_along_image_s3_link: Str,
		representative_image_s3_link: Str,
		mode: Str,
		campaign_code: Str,
		service_request_number: Str,
	})
	.loose();

// unknown: core's file input (URL, {url}, or {base64}), resolved to bytes
// and sent as a multipart file part.
const ImageFileSchema = z
	.union([
		z.string().min(1),
		z.object({
			url: z.string().min(1),
			filename: z.string().optional(),
			contentType: z.string().optional(),
		}),
		z.object({
			base64: z.string().min(1),
			filename: z.string().optional(),
			contentType: z.string().optional(),
		}),
	])
	.describe(
		'An image: a public URL, {url, filename?, contentType?}, or {base64, filename?, contentType?}.',
	);

const informedDeliveryFields = {
	quantity: z.number().int().min(1).optional(),
	ride_along_url: z
		.string()
		.optional()
		.describe('Where the ride-along image links to.'),
	start_date: z.string().optional().describe('YYYY-MM-DD.'),
	brand_name: z.string().optional(),
	usps_title: z.string().optional(),
	lob_campaign_id: z.string().optional(),
	ride_along_image: ImageFileSchema.optional(),
	representative_image: ImageFileSchema.optional(),
};

const InformedDeliveryCreateInputSchema = z.object({
	...informedDeliveryFields,
	status: z.enum(['pending_approval']).optional(),
});

const InformedDeliveryUpdateInputSchema = z.object({
	id: z.string().min(1).describe('The usps_campaign_id.'),
	...informedDeliveryFields,
	status: z
		.enum(['approved'])
		.optional()
		.describe("Pass 'approved' to approve the campaign."),
});

// ── QR code analytics ─────────────────────────────────────────────────────

const QrCodeListInputSchema = z.object({
	limit: LimitSchema,
	offset: OffsetSchema,
	include: IncludeSchema,
	date_created: DateFilterSchema,
	scanned: z.boolean().optional().describe('Only scanned or unscanned codes.'),
	resource_ids: z
		.array(z.string())
		.max(100)
		.optional()
		.describe('Only these mailpiece IDs.'),
});

const QrCodeListResponseSchema = z
	.object({
		object: Str,
		count: Num,
		total_count: Num,
		scanned_count: Num,
		data: z.array(
			z
				.object({
					resource_id: Str,
					date_created: Str,
					number_of_scans: Num,
					// unknown: per-scan {ip_location, scan_date}.
					scans: Any,
				})
				.loose(),
		),
	})
	.loose();

// ── URL shortener: domains and links ──────────────────────────────────────

const LobDomainSchema = z
	.object({
		id: Str,
		domain: Str,
		error_redirect_link: Str,
		status: Str.describe('configured or not_configured.'),
		created_at: Str,
		updated_at: Str,
		object: Str,
	})
	.loose();

const LobLinkSchema = z
	.object({
		id: Str,
		title: Str,
		domain_id: Str,
		redirect_link: Str,
		short_link: Str,
		metadata: Any,
		created_at: Str,
		updated_at: Str,
		object: Str,
	})
	.loose();

const DomainCreateInputSchema = z
	.object({
		domain: z.string().min(1).describe('A domain you own, such as lob.st.'),
		error_redirect_link: z
			.string()
			.optional()
			.describe('Where unknown short links redirect.'),
	})
	.loose();

const DomainListInputSchema = z
	.object({
		...cursorFields,
		status: z.enum(['configured', 'not_configured']).optional(),
	})
	.superRefine(oneCursor);

const LinkCreateInputSchema = z
	.object({
		redirect_link: z.string().min(1).describe('The long URL.'),
		title: z.string().optional(),
		domain: z
			.string()
			.optional()
			.describe("A configured custom domain; Lob's own domain when omitted."),
		slug: z.string().optional().describe('Custom path for the short link.'),
		metadata: MetadataInputSchema,
	})
	.loose();

const LinkUpdateInputSchema = z
	.object({
		id: z.string().min(1).describe("The short link's ID."),
		redirect_link: z.string().min(1),
		title: z.string().optional(),
		metadata: MetadataInputSchema,
	})
	.loose();

const LinkListInputSchema = z
	.object({
		...cursorFields,
		campaign_id: z.string().optional(),
		domain_id: z.string().optional(),
	})
	.superRefine(oneCursor);

// ── resource proofs ───────────────────────────────────────────────────────

const LobResourceProofSchema = z
	.object({
		...baseFields,
		resource_type: Str,
		template_id: Str,
		// unknown: the mailpiece parameters the proof was rendered from.
		resource_parameters: Any,
		status: Str,
		url: Str,
		thumbnails: Any,
	})
	.loose();

const ResourceProofCreateInputSchema = z.object({
	resource_type: z.enum(['postcard', 'letter', 'self_mailer']),
	// unknown: the same fields a postcards/letters/selfMailers send takes
	// (to, from, front/back, file, inside/outside, ...), validated by Lob.
	resource_parameters: LooseRecord.describe(
		'The mailpiece fields to render, as for a send, such as { to, front, back } for a postcard.',
	),
	template_id: z.string().nullish(),
});

const ResourceProofUpdateInputSchema = z.object({
	id: idOf('resource proof', 'res_prf_'),
	template_id: z.string().min(1).describe('tmpl_ ID to render instead.'),
});

// ── templates and template versions ───────────────────────────────────────

const LobTemplateSchema = z
	.object({
		...baseFields,
		// unknown: template version objects.
		versions: Any,
		published_version: Any,
	})
	.loose();

const LobTemplateVersionSchema = z
	.object({
		...baseFields,
		html: Str,
		engine: Str,
		required_vars: z.array(z.string()).nullish(),
		suggest_json_editor: Bool,
		merge_variables: Any,
	})
	.loose();

const EngineSchema = z
	.enum(['legacy', 'handlebars'])
	.optional()
	.describe("Template engine. Defaults to 'legacy'.");

const TemplateCreateInputSchema = z
	.object({
		html: z.string().min(1).max(100_000),
		description: z.string().max(255).optional(),
		metadata: MetadataInputSchema,
		engine: EngineSchema,
		required_vars: z.array(z.string()).optional(),
	})
	.loose();

const TemplateUpdateInputSchema = z
	.object({
		id: idOf('template', 'tmpl_'),
		description: z.string().max(255).optional(),
		published_version: z.string().optional().describe('vrsn_ ID to publish.'),
	})
	.loose();

const TemplateVersionListInputSchema = z
	.object({
		template_id: idOf('template', 'tmpl_'),
		...cursorFields,
		include: IncludeSchema,
		date_created: DateFilterSchema,
	})
	.superRefine(oneCursor);

const TemplateVersionCreateInputSchema = z
	.object({
		template_id: idOf('template', 'tmpl_'),
		html: z.string().min(1).max(100_000),
		description: z.string().max(255).optional(),
		engine: EngineSchema,
		required_vars: z.array(z.string()).optional(),
	})
	.loose();

const TemplateVersionIdInputSchema = z.object({
	template_id: idOf('template', 'tmpl_'),
	id: idOf('template version', 'vrsn_'),
});

const TemplateVersionUpdateInputSchema = TemplateVersionIdInputSchema.extend({
	description: z.string().max(255).optional(),
	engine: EngineSchema,
	required_vars: z.array(z.string()).optional(),
}).loose();

// ── uploads (campaign audience files) ─────────────────────────────────────

const LobUploadSchema = z
	.object({
		id: Str,
		accountId: Str,
		campaignId: Str,
		mode: Str,
		failuresUrl: Str,
		originalFilename: Str,
		state: Str,
		totalMailpieces: Num,
		failedMailpieces: Num,
		validatedMailpieces: Num,
		bytesProcessed: Num,
		dateCreated: Str,
		dateModified: Str,
		// unknown: column mappings and metadata as stored.
		requiredAddressColumnMapping: Any,
		optionalAddressColumnMapping: Any,
		mergeVariableColumnMapping: Any,
		metadata: Any,
	})
	.loose();

// unknown: column-name maps (Lob field -> CSV column header).
const ColumnMapSchema = z.record(z.string(), z.string().nullable()).optional();

const uploadBodyFields = {
	requiredAddressColumnMapping: ColumnMapSchema.describe(
		'CSV column for each required address field (name, address_line1, address_city, address_state, address_zip).',
	),
	optionalAddressColumnMapping: ColumnMapSchema,
	mergeVariableColumnMapping: ColumnMapSchema.describe(
		'CSV column for each template merge variable.',
	),
	// unknown: metadata settings ({ columns: [...] }) as Lob documents them.
	metadata: LooseRecord.optional(),
};

const UploadCreateInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('cmp_ ID the audience is for.'),
		...uploadBodyFields,
	})
	.loose();

const UploadUpdateInputSchema = z
	.object({
		id: idOf('upload', 'upl_'),
		originalFilename: z.string().optional(),
		...uploadBodyFields,
	})
	.loose();

const UploadFileInputSchema = z.object({
	id: idOf('upload', 'upl_'),
	file: z
		.union([
			z.string().min(1),
			z.object({
				url: z.string().min(1),
				filename: z.string().optional(),
				contentType: z.string().optional(),
			}),
			z.object({
				base64: z.string().min(1),
				filename: z.string().optional(),
				contentType: z.string().optional(),
			}),
		])
		.describe(
			'The audience CSV: a public URL, {url, filename?}, or {base64, filename?}.',
		),
});

const UploadFileResponseSchema = z
	.object({ message: Str, filename: Str })
	.loose();

const UploadExportCreateInputSchema = z.object({
	id: idOf('upload', 'upl_'),
	type: z
		.enum(['all', 'failures', 'successes'])
		.optional()
		.describe('Which rows to export. Defaults to all.'),
});

const UploadExportCreateResponseSchema = z
	.object({ message: Str, exportId: Str })
	.loose();

const UploadExportSchema = z
	.object({
		id: Str,
		dateCreated: Str,
		dateModified: Str,
		deleted: Bool,
		s3Url: Str.describe('Signed download URL once the export is done.'),
		state: Str,
		type: Str,
		uploadId: Str,
	})
	.loose();

const UploadReportInputSchema = z.object({
	id: idOf('upload', 'upl_'),
	status: z.enum(['Validated', 'Failed', 'Processing']).optional(),
	limit: LimitSchema,
	offset: OffsetSchema,
});

const UploadReportSchema = z
	.object({
		// unknown: one row per CSV line with its status and errors.
		data: z.array(LooseRecord).nullish(),
		next_url: Str,
		prev_url: Str,
		count: Num,
		total_count: Num,
	})
	.loose();

const UploadDeleteResponseSchema = z
	.object({ id: Str, deleted: Bool })
	.loose()
	.describe('Lob answers 204 with no body; the plugin returns the ID.');

const UploadListInputSchema = z.object({
	campaignId: z.string().optional().describe('Only uploads for this cmp_ ID.'),
});

// ── registry ──────────────────────────────────────────────────────────────

export const LobExtraInputSchemas = {
	intlVerificationsBulk: IntlBulkInputSchema,
	reverseGeocodeLookup: ReverseGeocodeInputSchema,
	identityValidationValidate: IdentityValidationInputSchema,
	postcardsList: PostcardListInputSchema,
	postcardsCancel: idInput('postcard', 'psc_'),
	lettersList: LetterListInputSchema,
	lettersCancel: idInput('letter', 'ltr_'),
	checksSend: CheckSendInputSchema,
	checksGet: idInput('check', 'chk_'),
	checksList: CheckListInputSchema,
	checksCancel: idInput('check', 'chk_'),
	selfMailersSend: SelfMailerSendInputSchema,
	selfMailersGet: idInput('self mailer', 'sfm_'),
	selfMailersList: SelfMailerListInputSchema,
	selfMailersCancel: idInput('self mailer', 'sfm_'),
	snapPacksSend: SnapPackSendInputSchema,
	snapPacksGet: idInput('snap pack', 'ord_'),
	snapPacksList: PlainMailListInputSchema,
	snapPacksCancel: idInput('snap pack', 'ord_'),
	bookletsSend: BookletSendInputSchema,
	bookletsGet: idInput('booklet', 'ord_'),
	bookletsList: PlainMailListInputSchema,
	bookletsCancel: idInput('booklet', 'ord_'),
	bankAccountsCreate: BankAccountCreateInputSchema,
	bankAccountsGet: idInput('bank account', 'bank_'),
	bankAccountsList: SimpleListInputSchema,
	bankAccountsDelete: idInput('bank account', 'bank_'),
	bankAccountsVerify: BankAccountVerifyInputSchema,
	billingGroupsCreate: BillingGroupCreateInputSchema,
	billingGroupsGet: idInput('billing group', 'bg_'),
	billingGroupsList: BillingGroupListInputSchema,
	billingGroupsUpdate: BillingGroupUpdateInputSchema,
	buckslipsCreate: BuckslipCreateInputSchema,
	buckslipsGet: idInput('buckslip', 'bck_'),
	buckslipsList: InventoryListInputSchema,
	buckslipsUpdate: BuckslipUpdateInputSchema,
	buckslipsDelete: idInput('buckslip', 'bck_'),
	buckslipsListOrders: OrderListInputSchema('buckslip', 'bck_'),
	buckslipsCreateOrder: OrderCreateInputSchema('buckslip', 'bck_', 5_000),
	cardsCreate: CardCreateInputSchema,
	cardsGet: idInput('card', 'card_'),
	cardsList: InventoryListInputSchema,
	cardsUpdate: CardUpdateInputSchema,
	cardsDelete: idInput('card', 'card_'),
	cardsListOrders: OrderListInputSchema('card', 'card_'),
	cardsCreateOrder: OrderCreateInputSchema('card', 'card_', 10_000),
	campaignsCreate: CampaignCreateInputSchema,
	campaignsGet: idInput('campaign', 'cmp_'),
	campaignsList: CampaignListInputSchema,
	campaignsUpdate: CampaignUpdateInputSchema,
	campaignsDelete: idInput('campaign', 'cmp_'),
	campaignsSend: idInput('campaign', 'cmp_'),
	creativesCreate: CreativeCreateInputSchema,
	creativesGet: idInput('creative', 'crv_'),
	creativesUpdate: CreativeUpdateInputSchema,
	informedDeliveryList: z.object({}),
	informedDeliveryCreate: InformedDeliveryCreateInputSchema,
	informedDeliveryGet: z.object({
		id: z.string().min(1).describe('The usps_campaign_id.'),
	}),
	informedDeliveryUpdate: InformedDeliveryUpdateInputSchema,
	qrCodesList: QrCodeListInputSchema,
	domainsCreate: DomainCreateInputSchema,
	domainsGet: z.object({ id: z.string().min(1).describe("The domain's ID.") }),
	domainsList: DomainListInputSchema,
	domainsDelete: z.object({
		id: z.string().min(1).describe("The domain's ID."),
	}),
	linksCreate: LinkCreateInputSchema,
	linksGet: z.object({
		id: z.string().min(1).describe("The short link's ID."),
	}),
	linksList: LinkListInputSchema,
	linksUpdate: LinkUpdateInputSchema,
	linksDelete: z.object({
		id: z.string().min(1).describe("The short link's ID."),
	}),
	resourceProofsCreate: ResourceProofCreateInputSchema,
	resourceProofsGet: idInput('resource proof', 'res_prf_'),
	resourceProofsUpdate: ResourceProofUpdateInputSchema,
	templatesCreate: TemplateCreateInputSchema,
	templatesGet: idInput('template', 'tmpl_'),
	templatesList: SimpleListInputSchema,
	templatesUpdate: TemplateUpdateInputSchema,
	templatesDelete: idInput('template', 'tmpl_'),
	templateVersionsCreate: TemplateVersionCreateInputSchema,
	templateVersionsGet: TemplateVersionIdInputSchema,
	templateVersionsList: TemplateVersionListInputSchema,
	templateVersionsUpdate: TemplateVersionUpdateInputSchema,
	templateVersionsDelete: TemplateVersionIdInputSchema,
	uploadsCreate: UploadCreateInputSchema,
	uploadsGet: idInput('upload', 'upl_'),
	uploadsList: UploadListInputSchema,
	uploadsUpdate: UploadUpdateInputSchema,
	uploadsDelete: idInput('upload', 'upl_'),
	uploadsUploadFile: UploadFileInputSchema,
	uploadsCreateExport: UploadExportCreateInputSchema,
	uploadsGetExport: z.object({
		id: idOf('upload', 'upl_'),
		export_id: idOf('export', 'ex_'),
	}),
	uploadsGetReport: UploadReportInputSchema,
} as const;

export const LobExtraOutputSchemas = {
	intlVerificationsBulk: IntlBulkResponseSchema,
	reverseGeocodeLookup: ReverseGeocodeResponseSchema,
	identityValidationValidate: IdentityValidationResponseSchema,
	postcardsList: listOf(LobPostcardSchema),
	postcardsCancel: DeletedSchema,
	lettersList: listOf(LobLetterSchema),
	lettersCancel: DeletedSchema,
	checksSend: LobCheckSchema,
	checksGet: LobCheckSchema,
	checksList: listOf(LobCheckSchema),
	checksCancel: DeletedSchema,
	selfMailersSend: LobSelfMailerSchema,
	selfMailersGet: LobSelfMailerSchema,
	selfMailersList: listOf(LobSelfMailerSchema),
	selfMailersCancel: DeletedSchema,
	snapPacksSend: LobSnapPackSchema,
	snapPacksGet: LobSnapPackSchema,
	snapPacksList: listOf(LobSnapPackSchema),
	snapPacksCancel: DeletedSchema,
	bookletsSend: LobBookletSchema,
	bookletsGet: LobBookletSchema,
	bookletsList: listOf(LobBookletSchema),
	bookletsCancel: DeletedSchema,
	bankAccountsCreate: LobBankAccountSchema,
	bankAccountsGet: LobBankAccountSchema,
	bankAccountsList: listOf(LobBankAccountSchema),
	bankAccountsDelete: DeletedSchema,
	bankAccountsVerify: LobBankAccountSchema,
	billingGroupsCreate: LobBillingGroupSchema,
	billingGroupsGet: LobBillingGroupSchema,
	billingGroupsList: listOf(LobBillingGroupSchema),
	billingGroupsUpdate: LobBillingGroupSchema,
	buckslipsCreate: LobBuckslipSchema,
	buckslipsGet: LobBuckslipSchema,
	buckslipsList: listOf(LobBuckslipSchema),
	buckslipsUpdate: LobBuckslipSchema,
	buckslipsDelete: DeletedSchema,
	buckslipsListOrders: orderListOf(LobBuckslipOrderSchema),
	buckslipsCreateOrder: LobBuckslipOrderSchema,
	cardsCreate: LobCardSchema,
	cardsGet: LobCardSchema,
	cardsList: listOf(LobCardSchema),
	cardsUpdate: LobCardSchema,
	cardsDelete: DeletedSchema,
	cardsListOrders: orderListOf(LobCardOrderSchema),
	cardsCreateOrder: LobCardOrderSchema,
	campaignsCreate: LobCampaignSchema,
	campaignsGet: LobCampaignSchema,
	campaignsList: listOf(LobCampaignSchema),
	campaignsUpdate: LobCampaignSchema,
	campaignsDelete: DeletedSchema,
	campaignsSend: LobCampaignSchema,
	creativesCreate: LobCreativeSchema,
	creativesGet: LobCreativeSchema,
	creativesUpdate: LobCreativeSchema,
	informedDeliveryList: listOf(LobInformedDeliverySchema),
	informedDeliveryCreate: LobInformedDeliverySchema,
	informedDeliveryGet: LobInformedDeliverySchema,
	informedDeliveryUpdate: LobInformedDeliverySchema,
	qrCodesList: QrCodeListResponseSchema,
	domainsCreate: LobDomainSchema,
	domainsGet: LobDomainSchema,
	domainsList: listOf(LobDomainSchema),
	domainsDelete: DeletedSchema,
	linksCreate: LobLinkSchema,
	linksGet: LobLinkSchema,
	linksList: listOf(LobLinkSchema),
	linksUpdate: LobLinkSchema,
	linksDelete: DeletedSchema,
	resourceProofsCreate: LobResourceProofSchema,
	resourceProofsGet: LobResourceProofSchema,
	resourceProofsUpdate: LobResourceProofSchema,
	templatesCreate: LobTemplateSchema,
	templatesGet: LobTemplateSchema,
	templatesList: listOf(LobTemplateSchema),
	templatesUpdate: LobTemplateSchema,
	templatesDelete: DeletedSchema,
	templateVersionsCreate: LobTemplateVersionSchema,
	templateVersionsGet: LobTemplateVersionSchema,
	templateVersionsList: listOf(LobTemplateVersionSchema),
	templateVersionsUpdate: LobTemplateVersionSchema,
	templateVersionsDelete: DeletedSchema,
	uploadsCreate: LobUploadSchema,
	uploadsGet: LobUploadSchema,
	uploadsList: z.array(LobUploadSchema),
	uploadsUpdate: LobUploadSchema,
	uploadsDelete: UploadDeleteResponseSchema,
	uploadsUploadFile: UploadFileResponseSchema,
	uploadsCreateExport: UploadExportCreateResponseSchema,
	uploadsGetExport: UploadExportSchema,
	uploadsGetReport: UploadReportSchema,
} as const;

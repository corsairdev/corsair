import { z } from 'zod';
import { EchtpostTemplateEntity } from '../schema/database';

export const ListTemplatesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(200).optional(),
});

export const ListTemplatesResponseSchema = z.object({
	templates: z.array(EchtpostTemplateEntity),
});

export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export const EchtpostEndpointInputSchemas = {
	'templates.list': ListTemplatesInputSchema,
};

export const EchtpostEndpointOutputSchemas = {
	'templates.list': ListTemplatesResponseSchema,
};

// ── Shared pieces (https://api.echtpost.de/v2/openapi.json) ──
// Responses are parsed loosely: optional and nullable fields, open enums, and
// extra fields kept, so a new field from EchtPost does not fail a call.

const Id = z.union([z.number().int(), z.string().regex(/^\d+$/)]);
const PathId = Id.transform((value) => String(value));

const Paging = {
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(200).optional(),
};
const Direction = z.enum(['asc', 'desc']).optional();

export const FontSchema = z
	.object({
		family: z
			.string()
			.optional()
			.describe('architects_daughter, reenie_beanie, special_elite or mynerve'),
		size: z.number().int().optional(),
		color: z.string().optional().describe('black, blue or a hex value'),
		line_height: z.number().optional(),
	})
	.describe('Optional; EchtPost picks architects_daughter at a middle size');

const GreetingStyle = z
	.enum([
		'informal',
		'formal',
		'official',
		'dear_first_name',
		'dear_last_name',
		'good_day_first_name',
		'good_day_last_name',
		'custom',
	])
	.describe('How {anrede} is written for this recipient');

const RecipientFields = {
	first_name: z.string().optional(),
	last_name: z.string().min(1),
	title: z.string().optional(),
	greeting_style: GreetingStyle.optional(),
	custom_salutation: z.string().optional(),
	gender: z.string().optional(),
	company_name: z.string().optional(),
	department: z.string().optional(),
	street: z.string().min(1),
	zip: z.string().min(1),
	city: z.string().min(1),
	state_code: z.string().optional(),
	country_code: z.string().min(2).describe('ISO 3166-1 alpha-2, e.g. DE'),
	birthdate: z.string().optional().describe('YYYY-MM-DD'),
	external_id: z.string().optional(),
};

export const RecipientInputSchema = z.object(RecipientFields);

// ── Outputs ──

export const ContactSchema = z
	.object({
		id: z.number(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		company_name: z.string().nullish(),
		street: z.string().nullish(),
		zip: z.string().nullish(),
		city: z.string().nullish(),
		country_code: z.string().nullish(),
		greeting_style: z.string().nullish(),
		greeting: z.string().nullish(),
		external_id: z.string().nullish(),
		group_ids: z.array(z.number()).nullish(),
		card_ids: z.array(z.string()).nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export const GroupSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		external_id: z.string().nullish(),
		recipient_count: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export const TemplateSchema = z
	.object({
		id: z.number(),
		motive_id: z.number().nullish(),
		content: z.string().nullish(),
		content_ps: z.string().nullish(),
		content_vertical: z.string().nullish(),
		font: FontSchema.nullish(),
		qr_code_url: z.string().nullish(),
		preview_url: z.string().nullish(),
		source: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export const MotiveSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		desc: z.string().nullish(),
		orientation: z.string().nullish(),
		content_available: z.boolean().nullish(),
		content_ps_available: z.boolean().nullish(),
		vertical_text_available: z.boolean().nullish(),
		qr_code_available: z.boolean().nullish(),
		has_back_side: z.boolean().nullish(),
		preview_image_url: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		temporary: z.boolean().nullish(),
	})
	.loose();

export const CardSchema = z
	.object({
		id: z.string(),
		motive_id: z.number().nullish(),
		template_id: z.number().nullish(),
		status: z
			.string()
			.nullish()
			.describe('pending, scheduled, sent or canceled'),
		type: z.string().nullish(),
		content: z.string().nullish(),
		content_ps: z.string().nullish(),
		content_vertical: z.string().nullish(),
		font: FontSchema.nullish(),
		contacts_count: z.number().nullish(),
		deliver_at: z.string().nullish(),
		cancelable: z.boolean().nullish(),
		web_url: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const Balance = {
	credits_eur: z.string().nullish(),
	cards_regular: z.number().nullish(),
	cards_foreign: z.number().nullish(),
	currency: z.string().nullish(),
};

export const MeSchema = z
	.object({
		account: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				country_code: z.string().nullish(),
				default_greeting_style: z.string().nullish(),
			})
			.loose()
			.nullish(),
		user: z
			.object({ id: z.number().nullish(), email: z.string().nullish() })
			.loose()
			.nullish(),
		api_key: z
			.object({
				id: z.number().nullish(),
				last_used_on: z.string().nullish(),
				created_at: z.string().nullish(),
			})
			.loose()
			.nullish(),
		balance: z.object(Balance).loose().nullish(),
	})
	.loose();

export const CreditsSchema = z
	.object({
		...Balance,
		price_per_card_eur: z.string().nullish(),
		price_per_foreign_card_eur: z.string().nullish(),
	})
	.loose();

export const PreviewFitSchema = z
	.object({
		fits: z.boolean(),
		lines_used: z.number().nullish(),
		max_lines: z.number().nullish(),
		overflow_line: z.number().nullish(),
		suggested_font_size: z.number().nullish(),
	})
	.loose();

export const CancelSchema = z
	.object({
		id: z.string(),
		status: z.string().nullish(),
		cancelable: z.boolean().nullish(),
	})
	.loose();

export const DeletedSchema = z.object({
	deleted: z.literal(true),
	id: z.string(),
});

// ── Inputs ──

export const EmptyInputSchema = z.object({});

export const ContactsListInputSchema = z.object({
	...Paging,
	country_code: z.string().optional(),
	group_id: z.number().int().optional(),
	external_id: z.string().optional(),
	search: z
		.string()
		.optional()
		.describe('Substring of first name, last name, company or city'),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	company_name: z.string().optional(),
	street: z.string().optional(),
	zip: z.string().optional(),
	city: z.string().optional(),
	sort: z.enum(['last_name', 'created_at', 'updated_at']).optional(),
	direction: Direction,
	include: z
		.string()
		.optional()
		.describe(
			'groups and/or cards, comma separated, to add group_ids/card_ids',
		),
});
export const ContactIdInputSchema = z.object({ id: PathId });
export const ContactCreateInputSchema = z.object({
	...RecipientFields,
	group_ids: z.array(z.number().int()).optional(),
	group_names: z
		.array(z.string())
		.optional()
		.describe('Group names; missing groups are created'),
});
export const ContactUpdateInputSchema = z.object({
	id: PathId,
	first_name: z.string().optional(),
	last_name: z.string().min(1).optional(),
	title: z.string().optional(),
	greeting_style: GreetingStyle.optional(),
	custom_salutation: z.string().optional(),
	gender: z.string().optional(),
	company_name: z.string().optional(),
	department: z.string().optional(),
	street: z.string().min(1).optional(),
	zip: z.string().min(1).optional(),
	city: z.string().min(1).optional(),
	state_code: z.string().optional(),
	country_code: z.string().min(2).optional(),
	birthdate: z.string().optional(),
	external_id: z.string().optional(),
});

export const GroupsListInputSchema = z.object({
	...Paging,
	sort: z.enum(['name', 'created_at', 'updated_at']).optional(),
	direction: Direction,
});
export const GroupIdInputSchema = z.object({ id: PathId });
export const GroupCreateInputSchema = z.object({
	name: z.string().min(1),
	external_id: z.string().optional(),
});
export const GroupUpdateInputSchema = z.object({
	id: PathId,
	name: z.string().min(1).optional(),
	external_id: z.string().optional(),
});

export const TemplateIdInputSchema = z.object({ id: PathId });

export const MotivesListInputSchema = z.object({
	...Paging,
	search: z.string().optional(),
	temporary: z.boolean().optional().describe('Only uploaded temporary motives'),
	sort: z.enum(['name', 'created_at']).optional(),
	direction: Direction,
});
export const MotiveIdInputSchema = z.object({ id: PathId });

export const CardsListInputSchema = z.object({
	...Paging,
	status: z
		.string()
		.optional()
		.describe('pending, scheduled, sent or canceled'),
	deliver_at: z.string().optional().describe('YYYY-MM-DD'),
	motive_id: z.number().int().optional(),
	sort: z.enum(['created_at', 'deliver_at']).optional(),
	direction: Direction,
});
export const CardIdInputSchema = z.object({
	id: z.string().min(1).describe('Card id (UUID)'),
});

const Delivery = {
	deliver_at: z
		.string()
		.optional()
		.describe(
			'YYYY-MM-DD, today, asap, tomorrow or N-days-from-now; at most 90 days out',
		),
	move_to_next_print_date: z.boolean().optional(),
	recipient_ids: z.array(z.number().int()).optional(),
	group_ids: z.array(z.number().int()).optional(),
	recipients: z
		.array(RecipientInputSchema)
		.optional()
		.describe('New recipients by postal address'),
};

const NotificationSchema = z.object({
	type: z.enum(['after_sent', 'before_send']),
	email: z.string().email(),
	send_on: z.string().optional(),
});

export const CardCreateInputSchema = z.object({
	motive_id: z.number().int(),
	content: z
		.string()
		.optional()
		.describe('Card text; {anrede} becomes each recipient salutation'),
	content_ps: z.string().max(40).optional(),
	content_vertical: z.string().optional(),
	qr_code_url: z.string().optional(),
	deduplicate_recipients: z.boolean().optional(),
	font: FontSchema.optional(),
	notifications: z.array(NotificationSchema).optional(),
	...Delivery,
});
export const CardFromTemplateInputSchema = z.object({
	template_id: z.number().int(),
	content_vertical: z.string().max(80).nullable().optional(),
	...Delivery,
});
export const PreviewFitInputSchema = z.object({
	content: z.string().min(1),
	sample_greeting: z.string().optional(),
	font: z
		.object({
			family: z.string().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});

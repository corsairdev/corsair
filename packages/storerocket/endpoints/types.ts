import { z } from 'zod';

// Field reference: https://docs.storerocket.io/api/* (introduction,
// authentication, errors, user, projects, locations/{list,get,create,update,
// put,delete}, special-hours). Output objects are .loose() and optional
// fields nullish, so a field the API adds cannot fail a call that already
// happened.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();

const recordId = z.string().min(1);

// "Project and location IDs are the public IDs returned by the API. Keep
// them as strings."
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

const coordinate = z.number().min(-90).max(90);
// unknown: the longitude bound differs from latitude, so a second constant
// keeps the documented ranges distinct.
const longitude = z.number().min(-180).max(180);

// ── Shared response objects ───────────────────────────────────────────────

// Weekday values are time-range strings, "closed", or null; never objects.
const HoursSchema = z
	.object({
		name: str,
		mon: str,
		tue: str,
		wed: str,
		thu: str,
		fri: str,
		sat: str,
		sun: str,
	})
	.loose();

export type StorerocketHours = z.infer<typeof HoursSchema>;

// Every V2 create, PUT and PATCH response includes `geocoding` next to
// `data`; it is null when the request looked nothing up.
export const GeocodingSchema = z
	.object({
		status: z.enum([
			'found',
			'approximate',
			'not_found',
			'unavailable',
			'queued',
		]),
		match: z
			.enum([
				'address',
				'road',
				'place',
				'postcode',
				'city',
				'region',
				'country',
			])
			.nullish(),
	})
	.loose();

export type StorerocketGeocoding = z.infer<typeof GeocodingSchema>;

// Custom fields and calls to action are arrays in responses, even though
// writes use named objects.
export const CustomFieldSchema = z
	.object({
		id: str,
		name: str,
		// unknown: custom-field values are operator-defined JSON.
		value: z.unknown().nullish(),
	})
	.loose();

export const CallToActionSchema = z
	.object({
		id: str,
		title: str,
		value: str,
	})
	.loose();

export const LocationSchema = z
	.object({
		id: recordId,
		name: str,
		slug: str,
		visible: bool,
		address: str,
		address_line_1: str,
		address_line_2: str,
		display_address: str,
		city: str,
		state: str,
		postcode: str,
		country: str,
		lat: num,
		lng: num,
		phone: str,
		email: str,
		url: str,
		timezone: str,
		// A name or null; the id lives in the undocumented location_type_id.
		location_type: str,
		marker_id: num,
		marker_url: str,
		cover_image_url: str,
		hours: HoursSchema.nullish(),
		// unknown: the response format of filter entries is not documented;
		// writes send filter names as strings.
		filters: z.array(z.unknown()).nullish(),
		fields: z.array(CustomFieldSchema).nullish(),
		callsToAction: z.array(CallToActionSchema).nullish(),
	})
	.loose();

export type StorerocketLocation = z.infer<typeof LocationSchema>;

export const UserSchema = z
	.object({
		id: recordId,
		name: str,
		email: str,
		company: str,
		profile_photo_url: str,
	})
	.loose();

export type StorerocketUser = z.infer<typeof UserSchema>;

export const ProjectSchema = z
	.object({
		id: recordId,
		name: str,
		locations: num,
		status: str,
		plan: str,
	})
	.loose();

export type StorerocketProject = z.infer<typeof ProjectSchema>;

// Laravel-style pagination: from/to are null on an empty page.
export const LinksSchema = z
	.object({
		first: str,
		last: str,
		prev: str,
		next: str,
	})
	.loose();

export const MetaSchema = z
	.object({
		current_page: num,
		from: num,
		last_page: num,
		path: str,
		per_page: num,
		to: num,
		total: num,
	})
	.loose();

// ── Special-hours rules ───────────────────────────────────────────────────

export const AppliesToSchema = z
	.object({
		type: z.enum(['all', 'countries', 'regions', 'filters', 'locations']),
		values: z.array(z.string()).nullish(),
	})
	.loose();

export type StorerocketAppliesTo = z.infer<typeof AppliesToSchema>;

const HoursRangeSchema = z
	.object({
		opens: z.string().min(1),
		closes: z.string().min(1),
	})
	.loose();

// "closed", "regular", "open_24_hours", or up to six ranges.
export const RuleHoursSchema = z.union([
	z.enum(['closed', 'regular', 'open_24_hours']),
	z.array(HoursRangeSchema).max(6),
]);

export const SpecialHoursRuleSchema = z
	.object({
		id: recordId,
		name: str,
		holiday_key: str,
		holiday_region: str,
		start_date: str,
		end_date: str,
		until_further_notice: bool,
		hours: RuleHoursSchema.nullish(),
		repeats_yearly: bool,
		note: str,
		applies_to: AppliesToSchema.nullish(),
		source: str,
		created_at: str,
		updated_at: str,
	})
	.loose();

export type StorerocketSpecialHoursRule = z.infer<
	typeof SpecialHoursRuleSchema
>;

// ── Write bodies ──────────────────────────────────────────────────────────

// Short keys and full weekday names are both accepted; values are
// time-range strings, "closed", or null.
const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const WeekdayValue = z
	.union([z.string(), z.null()])
	.describe(
		'A time range such as "09:00-17:00", "closed", or null for an unset day.',
	);

const HoursWriteSchema = z
	.object({
		name: z.string().optional(),
		mon: WeekdayValue.optional(),
		tue: WeekdayValue.optional(),
		wed: WeekdayValue.optional(),
		thu: WeekdayValue.optional(),
		fri: WeekdayValue.optional(),
		sat: WeekdayValue.optional(),
		sun: WeekdayValue.optional(),
	})
	.loose();

export type StorerocketHoursWrite = z.infer<typeof HoursWriteSchema>;

/**
 * A nonempty POST or PUT hours object must include all seven days. `{}` is
 * valid and leaves hours unchanged. Counts a day once whether it is spelled
 * with the short or the full name.
 */
export function countHoursDays(hours: StorerocketHoursWrite): number {
	const names = Object.keys(hours).filter((key) => key !== 'name');
	const days = new Set<string>();
	for (const key of names) {
		const short = key.slice(0, 3).toLowerCase();
		days.add(
			WEEKDAYS.includes(short as (typeof WEEKDAYS)[number])
				? short
				: key.toLowerCase(),
		);
	}
	return days.size;
}

// unknown: attachment values are operator-defined JSON (strings, urls,
// nested objects), so the record stays open.
const NamedAttachmentsSchema = z.record(z.string(), z.unknown());

export const LocationWriteFieldsSchema = {
	slug: z.string().optional().describe('Location slug.'),
	address: z.string().nullish().optional(),
	address_line_1: z.string().nullish().optional(),
	address_line_2: z.string().nullish().optional(),
	display_address: z.string().nullish().optional(),
	state: z.string().nullish().optional(),
	postcode: z.string().nullish().optional(),
	country: z.string().nullish().optional(),
	lat: coordinate.nullish().optional(),
	lng: longitude.nullish().optional(),
	phone: z.string().nullish().optional(),
	email: z.string().nullish().optional(),
	url: z.string().nullish().optional(),
	timezone: z.string().nullish().optional(),
	location_type: z
		.string()
		.nullish()
		.optional()
		.describe(
			'Name of a location type in the project; null restores the default.',
		),
	marker_id: z
		.number()
		.int()
		.nullish()
		.optional()
		.describe(
			'Integer ID of a marker in the project; null restores the default.',
		),
	cover: z
		.string()
		.nullish()
		.optional()
		.describe(
			'Image URL or the project stored image name; null clears the cover.',
		),
	visible: z.boolean().optional(),
	hours: HoursWriteSchema.nullish().optional(),
	filters: z
		.array(z.string())
		.nullish()
		.optional()
		.describe('Filter names; replaces the list, [] or null clears it.'),
	fields: NamedAttachmentsSchema.nullish()
		.optional()
		.describe(
			'Named custom fields, such as {"Manager":"Sam"}; a null value removes the attachment.',
		),
	callsToAction: NamedAttachmentsSchema.nullish()
		.optional()
		.describe(
			'Named calls to action, such as {"Book":"https://example.com/book"}; a null value removes the attachment.',
		),
	facebook: z.string().nullish().optional(),
	instagram: z.string().nullish().optional(),
	twitter: z.string().nullish().optional(),
	yelp: z.string().nullish().optional(),
	youtube: z.string().nullish().optional(),
	tiktok: z.string().nullish().optional(),
} as const;

// ── Inputs ────────────────────────────────────────────────────────────────

const UsersGetInputSchema = z.object({});

const ProjectsListInputSchema = z.object({});

// Include flags are numeric 1/0; booleans are encoded to that wire form.
const IncludeFlagsSchema = {
	includeHours: z.boolean().optional(),
	includeSpecialHours: z.boolean().optional(),
	includeFilters: z.boolean().optional(),
	includeFields: z.boolean().optional(),
	includeCallsToAction: z.boolean().optional(),
} as const;

// unknown: the filter values are caller data matched against location fields.
const ListFilterSchema = z.object({
	field: z.enum(['name', 'address', 'city', 'state', 'country', 'postalCode']),
	op: z.enum(['eq', 'ne', 'like']),
	value: z.string().min(1),
});

/**
 * The documented operator table: name also supports ne; postalCode only eq.
 * https://docs.storerocket.io/api/locations/list
 */
export function isSupportedFilter(field: string, op: string): boolean {
	if (field === 'name') return op === 'eq' || op === 'ne' || op === 'like';
	if (field === 'postalCode') return op === 'eq';
	return op === 'eq' || op === 'like';
}

const LocationsListInputSchema = z
	.object({
		projectId: recordId,
		page: z.number().int().positive().optional(),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Page size from 1 to 100; the API defaults to 15.'),
		...IncludeFlagsSchema,
		filters: z.array(ListFilterSchema).max(20).optional(),
	})
	.superRefine((input, ctx) => {
		for (const filter of input.filters ?? []) {
			if (!isSupportedFilter(filter.field, filter.op)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Filter ${filter.field} does not support the ${filter.op} operator`,
					path: ['filters'],
				});
			}
		}
	});

const LocationsGetInputSchema = z.object({
	projectId: recordId,
	locationId: recordId,
	...IncludeFlagsSchema,
});

const LocationsCreateInputSchema = z
	.object({
		projectId: recordId,
		// POST and PUT retain name and city as requirements.
		name: z.string().min(1),
		city: z.string().min(1),
		...LocationWriteFieldsSchema,
	})
	.superRefine((input, ctx) => {
		if (
			input.hours &&
			typeof input.hours === 'object' &&
			Object.keys(input.hours).length > 0 &&
			countHoursDays(input.hours) !== 7
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'A nonempty hours object must include all seven days; send {} for no hours',
				path: ['hours'],
			});
		}
	});

const LocationsUpdateInputSchema = z
	.object({
		projectId: recordId,
		locationId: recordId,
		name: z.string().min(1).nullish().optional(),
		city: z.string().min(1).nullish().optional(),
		...LocationWriteFieldsSchema,
	})
	.superRefine((input, ctx) => {
		// PATCH accepts subsets; only a nonempty object that names fewer than
		// the seven days stays valid, so there is no completeness check here.
		if (input.hours !== null && typeof input.hours === 'object') {
			const conflicts = Object.keys(input.hours).filter((key) => {
				const short = key.slice(0, 3).toLowerCase();
				return (
					WEEKDAYS.includes(short as (typeof WEEKDAYS)[number]) &&
					key.length > 3 &&
					input.hours !== null &&
					// unknown: the hours object is a loose record until zod
					// narrows it, so the conflict check reads it untyped.
					short in (input.hours as Record<string, unknown>)
				);
			});
			if (conflicts.length > 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Avoid conflicting short and full weekday names: ${conflicts.join(', ')}`,
					path: ['hours'],
				});
			}
		}
	});

const LocationsReplaceInputSchema = z
	.object({
		projectId: recordId,
		locationId: recordId,
		// PUT retains the name and city requirements.
		name: z.string().min(1),
		city: z.string().min(1),
		...LocationWriteFieldsSchema,
	})
	.superRefine((input, ctx) => {
		if (
			input.hours &&
			typeof input.hours === 'object' &&
			Object.keys(input.hours).length > 0 &&
			countHoursDays(input.hours) !== 7
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'A nonempty hours object must include all seven days; use PATCH for partial weeks',
				path: ['hours'],
			});
		}
	});

const LocationsDeleteInputSchema = z.object({
	projectId: recordId,
	locationId: recordId,
});

const SpecialHoursListInputSchema = z.object({
	projectId: recordId,
});

const SpecialHoursGetInputSchema = z.object({
	projectId: recordId,
	ruleId: recordId,
});

const AppliesToWriteSchema = z
	.object({
		type: z.enum(['all', 'countries', 'regions', 'filters', 'locations']),
		// A missing or null applies_to is refused with 422, never read as
		// every location; empty values are refused for anything but all.
		values: z.array(z.string().min(1)).optional(),
	})
	.loose();

const SpecialHoursCreateInputSchema = z
	.object({
		projectId: recordId,
		name: z.string().min(1).max(120),
		start_date: isoDate,
		end_date: isoDate.optional(),
		until_further_notice: z.boolean().optional(),
		hours: RuleHoursSchema,
		repeats_yearly: z.boolean().optional(),
		holiday_key: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Stable holiday identifier such as US:thanksgiving-day; needed for repeats_yearly.',
			),
		holiday_region: z
			.string()
			.min(1)
			.optional()
			.describe('Where a repeating holiday date is read, e.g. AU-QLD.'),
		note: z.string().max(255).nullish().optional(),
		applies_to: AppliesToWriteSchema,
		idempotencyKey: z
			.string()
			.min(1)
			.max(255)
			.optional()
			.describe(
				'Sent as the Idempotency-Key header; the same key with the same body replays the first answer.',
			),
	})
	.superRefine((input, ctx) => {
		if (input.until_further_notice && input.end_date) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'An open-ended closure takes no end_date; end it later with a PATCH',
				path: ['end_date'],
			});
		}
		const { type, values } = input.applies_to;
		if (type === 'all') {
			if (values !== undefined) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'The all type takes no values',
					path: ['applies_to'],
				});
			}
		} else if (!values || values.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Choose at least one ${type} value, or use the all type`,
				path: ['applies_to'],
			});
		}
		if (input.repeats_yearly) {
			if (!input.holiday_key) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'repeats_yearly needs a holiday_key',
					path: ['holiday_key'],
				});
			}
			if (input.end_date && input.end_date !== input.start_date) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Only a single day can repeat yearly; end_date must equal start_date',
					path: ['end_date'],
				});
			}
		}
	});

const SpecialHoursUpdateInputSchema = z
	.object({
		projectId: recordId,
		ruleId: recordId,
		name: z.string().min(1).max(120).optional(),
		start_date: isoDate.optional(),
		end_date: isoDate.nullish().optional(),
		until_further_notice: z.boolean().optional(),
		hours: RuleHoursSchema.optional(),
		repeats_yearly: z.boolean().optional(),
		holiday_key: z.string().min(1).nullish().optional(),
		holiday_region: z.string().min(1).nullish().optional(),
		note: z.string().max(255).nullish().optional(),
		applies_to: AppliesToWriteSchema.optional(),
		idempotencyKey: z.string().min(1).max(255).optional(),
	})
	.superRefine((input, ctx) => {
		if (input.until_further_notice && input.end_date) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'An open-ended closure takes no end_date; end it by sending only an end_date instead',
				path: ['end_date'],
			});
		}
		if (input.applies_to) {
			const { type, values } = input.applies_to;
			if (type === 'all') {
				if (values !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'The all type takes no values',
						path: ['applies_to'],
					});
				}
			} else if (!values || values.length === 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'An empty values list is refused; clearing the locations never makes a rule account-wide',
					path: ['applies_to'],
				});
			}
		}
		if (input.repeats_yearly) {
			if (input.holiday_key === undefined || input.holiday_key === null) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'repeats_yearly needs a holiday_key',
					path: ['holiday_key'],
				});
			}
			if (
				input.end_date &&
				input.start_date &&
				input.end_date !== input.start_date
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Only a single day can repeat yearly; end_date must equal start_date',
					path: ['end_date'],
				});
			}
		}
	});

const SpecialHoursDeleteInputSchema = z.object({
	projectId: recordId,
	ruleId: recordId,
});

export const StorerocketEndpointInputSchemas = {
	usersGet: UsersGetInputSchema,
	projectsList: ProjectsListInputSchema,
	locationsList: LocationsListInputSchema,
	locationsGet: LocationsGetInputSchema,
	locationsCreate: LocationsCreateInputSchema,
	locationsUpdate: LocationsUpdateInputSchema,
	locationsReplace: LocationsReplaceInputSchema,
	locationsDelete: LocationsDeleteInputSchema,
	specialHoursList: SpecialHoursListInputSchema,
	specialHoursGet: SpecialHoursGetInputSchema,
	specialHoursCreate: SpecialHoursCreateInputSchema,
	specialHoursUpdate: SpecialHoursUpdateInputSchema,
	specialHoursDelete: SpecialHoursDeleteInputSchema,
};

// ── Outputs ───────────────────────────────────────────────────────────────

export const StorerocketEndpointOutputSchemas = {
	usersGet: z.object({ data: UserSchema }).loose(),
	projectsList: z.object({ data: z.array(ProjectSchema) }).loose(),
	locationsList: z
		.object({
			data: z.array(LocationSchema),
			links: LinksSchema.nullish(),
			meta: MetaSchema.nullish(),
		})
		.loose(),
	locationsGet: z.object({ data: LocationSchema }).loose(),
	locationsCreate: z
		.object({ data: LocationSchema, geocoding: GeocodingSchema.nullish() })
		.loose(),
	locationsUpdate: z
		.object({ data: LocationSchema, geocoding: GeocodingSchema.nullish() })
		.loose(),
	locationsReplace: z
		.object({ data: LocationSchema, geocoding: GeocodingSchema.nullish() })
		.loose(),
	locationsDelete: z.object({ success: z.literal(true) }).loose(),
	specialHoursList: z.object({ data: z.array(SpecialHoursRuleSchema) }).loose(),
	specialHoursGet: z.object({ data: SpecialHoursRuleSchema }).loose(),
	specialHoursCreate: z.object({ data: SpecialHoursRuleSchema }).loose(),
	specialHoursUpdate: z.object({ data: SpecialHoursRuleSchema }).loose(),
	// The 204 has no body; the endpoint shapes it to this contract.
	specialHoursDelete: z.object({ id: recordId, success: z.literal(true) }),
};

export type StorerocketEndpointInputs = {
	[K in keyof typeof StorerocketEndpointInputSchemas]: z.input<
		(typeof StorerocketEndpointInputSchemas)[K]
	>;
};

export type StorerocketEndpointOutputs = {
	[K in keyof typeof StorerocketEndpointOutputSchemas]: z.infer<
		(typeof StorerocketEndpointOutputSchemas)[K]
	>;
};

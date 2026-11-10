import { z } from 'zod';

// Inputs use CodeREADr's own variable names. A variable the docs describe as
// "an integer or a comma-separated list" is an array here and is joined before
// it is sent. Outputs are `.loose()` with documented fields nullish, so a node
// the API adds or omits cannot fail a call that has already happened.
// Field reference: https://developer.codereadr.com/1.0/api/

/** CodeREADr returns numeric IDs as XML attributes, so they arrive as strings. */
const IdSchema = z.number().int().positive();

/** "1005, 1010" or "all": sent as a comma-joined string. */
const IdListSchema = z.union([z.array(IdSchema).min(1), z.literal('all')]);

/** Scan status: 1 valid, 0 invalid, -1 could not be validated offline. */
// A string rather than the enum: an unknown status must not fail a read.
const ScanStatusSchema = z
	.string()
	.nullish()
	.describe('`1` valid, `0` invalid, `-1` could not be validated offline.');

// ── scans.list ────────────────────────────────────────────────────────────

export const SCANS_DEFAULT_LIMIT = 10_000;

const ScansListInputSchema = z.object({
	keyword: z.string().optional().describe('Free-text search across scans.'),
	service_id: IdListSchema.optional().describe(
		'Services to search. `all` by default.',
	),
	device_id: IdListSchema.optional().describe(
		'Devices that made the scans. `all` by default.',
	),
	user_id: IdListSchema.optional().describe(
		'Users who made the scans. `all` by default.',
	),
	scan_id: IdListSchema.optional().describe('Only these scans.'),
	// The API takes 1, 0 and -1. Both spellings are accepted because the docs
	// and catalog render string enums without quotes, so a caller reading
	// `(1 | 0 | -1)[]` there sends numbers.
	status: z
		.array(
			z.union([
				z.literal(1),
				z.literal(0),
				z.literal(-1),
				z.enum(['1', '0', '-1']),
			]),
		)
		.min(1)
		.optional()
		.describe(
			'`1` valid, `0` invalid, `-1` could not be validated offline, as numbers or strings. All statuses by default.',
		),
	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe('YYYY-MM-DD. Scans made on or after this date.'),
	start_time: z
		.string()
		.regex(/^\d{2}:\d{2}:\d{2}$/)
		.optional()
		.describe('HH:mm:ss, 24-hour. Only valid with `start_date`.'),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe('YYYY-MM-DD. Scans made on or before this date.'),
	end_time: z
		.string()
		.regex(/^\d{2}:\d{2}:\d{2}$/)
		.optional()
		.describe('HH:mm:ss, 24-hour. Only valid with `end_date`.'),
	upload_id: IdListSchema.optional().describe('Only scans from these uploads.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(`Page size. Defaults to ${SCANS_DEFAULT_LIMIT}.`),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe(
			`Rows to skip. The API ignores it without \`limit\`, so the default ${SCANS_DEFAULT_LIMIT} is sent when \`limit\` is omitted.`,
		),
	show_properties: z
		.boolean()
		.optional()
		.describe("Include each scan's stored properties. Defaults to false."),
	include_property: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only scans carrying these properties.'),
	exclude_property: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Drop scans carrying any of these properties.'),
	with_property: z
		.record(z.string(), z.string())
		.optional()
		.describe('Exact-match property filters, such as `{ mode: "auto" }`.'),
	without_property: z
		.record(z.string(), z.string())
		.optional()
		.describe('Exact-match property exclusions, such as `{ mode: "auto" }`.'),
	value: z
		.string()
		.optional()
		.describe('Exact match on the scanned barcode value.'),
	valuelike: z
		.string()
		.optional()
		.describe('Partial match on the scanned barcode value.'),
	response: z
		.string()
		.optional()
		.describe('Exact match on the scan response text.'),
	responselike: z
		.string()
		.optional()
		.describe('Partial match on the scan response text.'),
	timestamp_received: z
		.boolean()
		.optional()
		.describe(
			'Include when CodeREADr received each scan; also filters the dates on that timestamp.',
		),
	timestamp_modified: z
		.boolean()
		.optional()
		.describe(
			'Include when each scan was last edited; also filters the dates on that timestamp.',
		),
	modified_diff: z
		.string()
		.optional()
		.describe(
			'Filter on the gap between creation and last edit, such as `< 2 minute` or `> 1 hour`.',
		),
	timezone: z
		.string()
		.optional()
		.describe(
			'IANA name for the returned timestamps, such as `Europe/London`. Defaults to `America/New_York`, not the account timezone; pass `account` to use the one set on the account.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'Sort keys, comma-separated, such as `timestamp_desc`. Append `_desc` for descending. Keys: barcode, device_name, device_id, response, scan_id, service_id, service_name, status, timestamp, timestamp_received, timestamp_modified, user_id, user_name.',
		),
	only_recent: z
		.boolean()
		.optional()
		.describe(
			'Return only the most recent scan per barcode. Defaults to false.',
		),
});

export type ScansListInput = z.input<typeof ScansListInputSchema>;

const ScanAnswerSchema = z
	.object({
		question_id: z.number().nullish(),
		question_text: z.string().nullish(),
		answer: z.string().nullish(),
	})
	.loose();

export type CodereadrScanAnswer = z.infer<typeof ScanAnswerSchema>;

const ScanEndpointRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const ScanSchema = z
	.object({
		id: z.number().nullish(),
		barcode_value: z
			.string()
			.nullish()
			.describe('The scanned value, `tid` in XML.'),
		response: z
			.string()
			.nullish()
			.describe('The text shown in the scanner app.'),
		status: ScanStatusSchema.describe(
			'`1` valid, `0` invalid, `-1` unvalidated.',
		),
		timestamp: z.string().nullish(),
		timestamp_received: z.string().nullish(),
		timestamp_modified: z.string().nullish(),
		device: ScanEndpointRefSchema.nullish(),
		service: ScanEndpointRefSchema.nullish(),
		user: ScanEndpointRefSchema.nullish(),
		answers: z.array(ScanAnswerSchema).nullish(),
		properties: z
			.record(z.string(), z.string())
			.nullish()
			.describe(
				'Stored scan properties, only returned with `show_properties`.',
			),
	})
	.loose();

export type CodereadrScan = z.infer<typeof ScanSchema>;

const ScansListResponseSchema = z
	.object({
		count: z.number().nullish().describe('Rows in this response.'),
		scans: z.array(ScanSchema),
		next_offset: z
			.number()
			.nullish()
			.describe(
				'Pass as `offset` for the next page while this page came back full; absent on the last page.',
			),
	})
	.loose();

export type ScansListResponse = z.infer<typeof ScansListResponseSchema>;

// ── scans.delete ──────────────────────────────────────────────────────────

const ScansDeleteInputSchema = z.object({
	scan_id: z
		.array(IdSchema)
		.min(1)
		.describe('The scans to delete. Deletion cannot be undone.'),
});

export type ScansDeleteInput = z.input<typeof ScansDeleteInputSchema>;

const ScansDeleteResponseSchema = z.object({
	success: z.literal(true),
	scan_ids: z.array(z.number()),
});

export type ScansDeleteResponse = z.infer<typeof ScansDeleteResponseSchema>;

// ── services ──────────────────────────────────────────────────────────────

const VALIDATION_METHODS = [
	'record',
	'ondevicerecord',
	'database',
	'ondevicedatabase',
	'webview',
	'postback',
] as const;

const ValidationMethodSchema = z.enum(VALIDATION_METHODS);

const ServiceSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		// A string rather than the enum: a method the API adds later must not
		// fail the whole services.list read.
		validation_method: z
			.string()
			.nullish()
			.describe(
				'`record`, `ondevicerecord`, `database`, `ondevicedatabase`, `webview` or `postback`.',
			),
		postback_url: z.string().nullish(),
		database_id: z.number().nullish(),
		duplicate_scan_value: z.number().nullish(),
		user_ids: z.array(z.number()).nullish(),
		question_ids: z.array(z.number()).nullish(),
	})
	.loose();

export type CodereadrService = z.infer<typeof ServiceSchema>;

const ServicesListInputSchema = z.object({
	service_id: IdListSchema.optional().describe(
		'Services to list. `all` by default.',
	),
});

export type ServicesListInput = z.input<typeof ServicesListInputSchema>;

const ServicesListResponseSchema = z
	.object({
		services: z.array(ServiceSchema),
	})
	.loose();

export type ServicesListResponse = z.infer<typeof ServicesListResponseSchema>;

const ServiceScanBehaviour = {
	device_duplicate_value: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('Status to give a duplicate scan found on the device.'),
	period_start_date: z
		.string()
		.optional()
		.describe('YYYY-MM-DD or MM/DD/YYYY. Defaults to always active.'),
	period_start_time: z
		.string()
		.optional()
		.describe('hh:mm:ss or hh:mma. Defaults to 12:00AM on the start date.'),
	period_end_date: z
		.string()
		.optional()
		.describe('YYYY-MM-DD or MM/DD/YYYY. Defaults to always active.'),
	period_end_time: z
		.string()
		.optional()
		.describe('hh:mm:ss or hh:mma. Defaults to 11:59:59PM on the end date.'),
	upload_email: z
		.string()
		.optional()
		.describe('Email address that receives a CSV of scans after each upload.'),
	upload_email_format: z
		.enum(['regular', 'properties'])
		.optional()
		.describe(
			'Whether the emailed CSV carries scan properties. Defaults to `regular`.',
		),
	view_other_scans: z
		.boolean()
		.optional()
		.describe(
			'Let an authorized user see every scan on the service. Defaults to true.',
		),
	direct_history_url: z
		.string()
		.optional()
		.describe("Page opened by the app's History button. Empty disables it."),
	direct_lookup_url: z
		.string()
		.optional()
		.describe("Page opened by the app's Lookup button. Empty disables it."),
	enable_direct_scan: z
		.boolean()
		.optional()
		.describe(
			'Postback services only: send scans straight to your server. Defaults to false.',
		),
	postback_receiver_only: z
		.boolean()
		.optional()
		.describe(
			'Set when the postback URL cannot answer with the expected XML. Defaults to false.',
		),
	postback_real_time_scans: z
		.boolean()
		.optional()
		.describe(
			'Post each online scan to `postback_url` on a non-postback service.',
		),
	postback_uploaded_scans: z
		.boolean()
		.optional()
		.describe(
			'Post each uploaded on-device scan to `postback_url` on a non-postback service.',
		),
	regex_response_pattern: z
		.string()
		.optional()
		.describe(
			'Regex applied to the response text. Needs `regex_response_replacement`.',
		),
	regex_response_replacement: z
		.string()
		.optional()
		.describe('Replacement for `regex_response_pattern`.'),
	regex_scan_pattern: z
		.string()
		.optional()
		.describe(
			'Regex applied to the scanned value. Needs `regex_scan_replacement`.',
		),
	regex_scan_replacement: z
		.string()
		.optional()
		.describe('Replacement for `regex_scan_pattern`.'),
	symbologies: z
		.array(z.number().int().positive())
		.min(1)
		.optional()
		.describe(
			'Symbology IDs the app will decode. Omitting this on an update resets the service to the default set.',
		),
	auto_next_scan: z
		.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
		.optional()
		.describe(
			'0 off, 1 only when valid, 2 always and save on error, 3 always and discard on error.',
		),
	auto_next_scan_delay: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe(
			'Seconds before Auto-Next Scan fires. Only with `auto_next_scan`.',
		),
	enable_gps: z
		.boolean()
		.optional()
		.describe(
			'Attach the device location to every scan as a property. Defaults to false.',
		),
	block_camera_scan: z
		.boolean()
		.optional()
		.describe('Prevent scanning with the device camera. Defaults to false.'),
	block_manual_scan: z
		.boolean()
		.optional()
		.describe('Prevent typing a value by hand. Defaults to false.'),
	block_db_search: z
		.boolean()
		.optional()
		.describe('Prevent looking values up in the database. Defaults to false.'),
	auto_sync: z
		.boolean()
		.optional()
		.describe(
			'Sync on-device scans up and database updates down. On-device databases are capped at 50,000 values.',
		),
	auto_sync_up_url: z
		.string()
		.optional()
		.describe(
			'Sync scans straight to your own URL instead of CodeREADr. Only with `auto_sync`.',
		),
	auto_sync_up_delay: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Seconds between upload attempts. Defaults to 2. Only with `auto_sync`.',
		),
	auto_sync_down_url: z
		.boolean()
		.optional()
		.describe(
			'Whether database updates download automatically. Only with `auto_sync`.',
		),
	auto_sync_down_delay: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Seconds between database update checks. Defaults to 120. Only with `auto_sync`.',
		),
	decoder_config: z
		.string()
		.optional()
		.describe(
			'Scanner configuration as a JSON string, produced by the website UI. An empty object `{}` clears it. Setting this locks the scanner settings for the service.',
		),
};

const ServicesCreateInputSchema = z
	.object({
		validation_method: ValidationMethodSchema.describe(
			'How scans are validated.',
		),
		database_id: IdSchema.optional().describe(
			'Required when `validation_method` is `database` or `ondevicedatabase`.',
		),
		postback_url: z
			.string()
			.optional()
			.describe('Required when `validation_method` is `postback`.'),
		description: z
			.string()
			.optional()
			.describe(
				'Web content for `webview` services: HTML, or a URL wrapped as `<curl>https://…</curl>`.',
			),
		service_name: z
			.string()
			.optional()
			.describe('Defaults to `Service N` for the next free number.'),
		duplicate_value: z
			.union([z.literal(0), z.literal(1)])
			.optional()
			.describe('Status to give a duplicate scan. Defaults to 1 (valid).'),
		...ServiceScanBehaviour,
	})
	.superRefine((value, ctx) => {
		// The API requires the companion field for three of the six methods and
		// rejects the request without it, which also spends an API call.
		if (
			(value.validation_method === 'database' ||
				value.validation_method === 'ondevicedatabase') &&
			value.database_id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['database_id'],
				message: `database_id is required for a ${value.validation_method} service`,
			});
		}
		if (
			value.validation_method === 'postback' &&
			value.postback_url === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['postback_url'],
				message: 'postback_url is required for a postback service',
			});
		}
	});

export type ServicesCreateInput = z.input<typeof ServicesCreateInputSchema>;

const ServicesCreateResponseSchema = z.object({
	success: z.literal(true),
	service_id: z.number().describe('The new service.'),
});

export type ServicesCreateResponse = z.infer<
	typeof ServicesCreateResponseSchema
>;

const ServicesUpdateInputSchema = z.object({
	service_id: IdSchema.describe('The service to update.'),
	service_name: z.string().optional().describe('New name for the service.'),
	description: z
		.string()
		.optional()
		.describe('New description for the service.'),
	database_id: IdSchema.optional().describe('Database to validate against.'),
	postback_url: z.string().optional().describe('Where scans are forwarded.'),
	duplicate_value: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('Status to give a duplicate scan.'),
	...ServiceScanBehaviour,
});

export type ServicesUpdateInput = z.input<typeof ServicesUpdateInputSchema>;

const ServicesUpdateResponseSchema = z.object({
	success: z.literal(true),
	service_id: z.number(),
});

export type ServicesUpdateResponse = z.infer<
	typeof ServicesUpdateResponseSchema
>;

const ServicesDeleteInputSchema = z.object({
	service_id: IdListSchema.describe(
		'The services to delete. `all` deletes every service on the account.',
	),
});

export type ServicesDeleteInput = z.input<typeof ServicesDeleteInputSchema>;

const ServicesDeleteResponseSchema = z.object({
	success: z.literal(true),
});

export type ServicesDeleteResponse = z.infer<
	typeof ServicesDeleteResponseSchema
>;

// ── databases ─────────────────────────────────────────────────────────────

const DatabaseSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		count: z
			.number()
			.nullish()
			.describe('Stored values; omitted on faster info levels.'),
		service_ids: z.array(z.number()).nullish(),
	})
	.loose();

export type CodereadrDatabase = z.infer<typeof DatabaseSchema>;

const DatabasesListInputSchema = z.object({
	database_id: IdListSchema.optional().describe(
		'Databases to list. `all` by default.',
	),
	info_level: z
		.enum(['names', 'services'])
		.optional()
		.describe(
			'`names` returns names only, `services` adds linked services. Both skip the slower value count.',
		),
});

export type DatabasesListInput = z.input<typeof DatabasesListInputSchema>;

const DatabasesListResponseSchema = z
	.object({
		databases: z.array(DatabaseSchema),
	})
	.loose();

export type DatabasesListResponse = z.infer<typeof DatabasesListResponseSchema>;

const DatabasesCreateInputSchema = z.object({
	database_name: z.string().min(1).describe('Name for the new database.'),
	case_sensitivity: z
		.boolean()
		.optional()
		.describe(
			'Case-sensitive validation. Cannot be changed after creation. Defaults to false.',
		),
});

export type DatabasesCreateInput = z.input<typeof DatabasesCreateInputSchema>;

const DatabasesCreateResponseSchema = z.object({
	success: z.literal(true),
	database_id: z.number().describe('The new database.'),
});

export type DatabasesCreateResponse = z.infer<
	typeof DatabasesCreateResponseSchema
>;

const DatabasesUpdateInputSchema = z.object({
	database_id: IdSchema.describe('The database to rename.'),
	database_name: z.string().min(1).describe('New name.'),
});

export type DatabasesUpdateInput = z.input<typeof DatabasesUpdateInputSchema>;

const DatabasesUpdateResponseSchema = z.object({
	success: z.literal(true),
	database_id: z.number(),
});

export type DatabasesUpdateResponse = z.infer<
	typeof DatabasesUpdateResponseSchema
>;

const DatabaseTargetInputSchema = z.object({
	database_id: IdSchema.describe('The database to act on.'),
});

export type DatabaseTargetInput = z.input<typeof DatabaseTargetInputSchema>;

const DatabaseTargetResponseSchema = z.object({
	success: z.literal(true),
});

export type DatabaseTargetResponse = z.infer<
	typeof DatabaseTargetResponseSchema
>;

const DatabaseValueSchema = z
	.object({
		value: z.string().nullish().describe('The stored barcode value.'),
		response: z
			.string()
			.nullish()
			.describe('Text shown when the value is scanned.'),
		validity: z.number().nullish().describe('`1` valid, `0` invalid.'),
	})
	.loose();

export type CodereadrDatabaseValue = z.infer<typeof DatabaseValueSchema>;

const DatabasesShowValuesInputSchema = z
	.object({
		database_id: IdSchema.describe('The database to read.'),
		value: z.string().optional().describe('Exact match on the stored value.'),
		valuelike: z
			.string()
			.optional()
			.describe('Partial match on the stored value.'),
		response: z
			.string()
			.optional()
			.describe('Exact match on the response text.'),
		responselike: z
			.string()
			.optional()
			.describe('Partial match on the response text.'),
		validity: z
			.union([z.literal(1), z.literal(0)])
			.optional()
			.describe('`1` only valid values, `0` only invalid ones.'),
		limit: z.number().int().positive().optional().describe('Page size.'),
		offset: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('Rows to skip. Needs `limit`.'),
	})
	.superRefine((value, ctx) => {
		// The API ignores `offset` unless `limit` comes with it and has no
		// documented default page size here, so an offset on its own would
		// silently return the first rows again.
		if (value.offset !== undefined && value.limit === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['limit'],
				message:
					'limit is required with offset; CodeREADr ignores an offset sent without it',
			});
		}
	});

export type DatabasesShowValuesInput = z.input<
	typeof DatabasesShowValuesInputSchema
>;

const DatabasesShowValuesResponseSchema = z
	.object({
		count: z.number().nullish().describe('Rows in this response.'),
		values: z.array(DatabaseValueSchema),
		next_offset: z
			.number()
			.nullish()
			.describe(
				'Pass as `offset` for the next page while this page came back full.',
			),
	})
	.loose();

export type DatabasesShowValuesResponse = z.infer<
	typeof DatabasesShowValuesResponseSchema
>;

const DatabaseValueWriteSchema = z.object({
	database_id: IdSchema.optional().describe(
		'Overrides the request-wide database for this value.',
	),
	value: z
		.string()
		.min(1)
		.describe(
			'The barcode value. Longer than 500 characters is truncated without an error.',
		),
	response: z
		.string()
		.optional()
		.describe('Text shown when the value is scanned.'),
	validity: z
		.union([z.literal(1), z.literal(0)])
		.optional()
		.describe('`1` valid, `0` invalid. Defaults to 1.'),
	trim_value: z
		.boolean()
		.optional()
		.describe('Trim surrounding whitespace. Defaults to true.'),
});

export type CodereadrDatabaseValueWrite = z.input<
	typeof DatabaseValueWriteSchema
>;

const DatabasesUpsertValueInputSchema = z.object({
	// Required by the API for this action. Only the bulk action has a per-value
	// database to fall back on.
	database_id: IdSchema.describe('The database to write the value to.'),
	value: z
		.string()
		.min(1)
		.describe(
			'The barcode value. Longer than 500 characters is truncated without an error.',
		),
	response: z
		.string()
		.optional()
		.describe('Text shown when the value is scanned.'),
	validity: z
		.union([z.literal(1), z.literal(0)])
		.optional()
		.describe('`1` valid, `0` invalid. Defaults to 1.'),
	trim_value: z
		.boolean()
		.optional()
		.describe('Trim surrounding whitespace. Defaults to true.'),
});

export type DatabasesUpsertValueInput = z.input<
	typeof DatabasesUpsertValueInputSchema
>;

const DatabasesUpsertValuesInputSchema = z
	.object({
		database_id: IdSchema.optional().describe(
			'Database for every value that does not name its own. A value with neither is skipped.',
		),
		trim_value: z
			.boolean()
			.optional()
			.describe(
				'Trim surrounding whitespace for values that do not set their own.',
			),
		values: z
			.array(DatabaseValueWriteSchema)
			.min(1)
			.max(100)
			.describe('Up to 100 values to insert or update in one request.'),
	})
	.superRefine((value, ctx) => {
		// The API silently ignores a value with no database of its own and no
		// request-wide one to fall back on, then still answers success. Catching it
		// here keeps a partial write from looking like a complete one.
		if (value.database_id !== undefined) return;
		value.values.forEach((entry, index) => {
			if (entry.database_id === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['values', index, 'database_id'],
					message:
						'Needs a database_id here or a request-wide database_id, or CodeREADr skips this value',
				});
			}
		});
	});

export type DatabasesUpsertValuesInput = z.input<
	typeof DatabasesUpsertValuesInputSchema
>;

export type DatabaseValuesResponse = z.infer<
	typeof DatabaseTargetResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

const UserSchema = z
	.object({
		id: z.number().nullish(),
		username: z.string().nullish(),
		service_ids: z.array(z.number()).nullish(),
		device_limit: z
			.number()
			.nullish()
			.describe('Devices allowed per billing period; omitted when unlimited.'),
		created: z.string().nullish(),
	})
	.loose();

export type CodereadrUser = z.infer<typeof UserSchema>;

const UsersListInputSchema = z.object({
	user_id: IdListSchema.optional().describe('Users to list. `all` by default.'),
});

/**
 * CodeREADr decides invitation versus password account by whether the username
 * looks like an email address, so the same test is used here. It is a simple
 * shape check rather than full validation: the provider is the authority, and
 * rejecting a real address it would accept is worse than passing one through.
 */
function isEmailUsername(username: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
}

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z.object({
	users: z.array(UserSchema),
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersCreateInputSchema = z
	.object({
		username: z
			.string()
			.min(1)
			.describe(
				'Identifying name. An email address sends an invitation and ignores `password`; otherwise `password` is required.',
			),
		password: z
			.string()
			.optional()
			.describe('Required unless `username` is an email address.'),
		device_limit: z
			.number()
			.int()
			.min(-1)
			.optional()
			.describe(
				'Devices allowed per billing period. `0` unlimited (the default), `-1` blocks sign-in entirely.',
			),
	})
	.superRefine((value, ctx) => {
		// CodeREADr ignores `password` for an email address, which becomes an
		// invitation, and requires it for every other username. Catching the gap
		// here keeps a request that would be rejected from spending an API call.
		if (value.password !== undefined) return;
		if (isEmailUsername(value.username)) return;
		ctx.addIssue({
			code: 'custom',
			path: ['password'],
			message:
				'password is required unless username is an email address, which sends an invitation instead',
		});
	});

export type UsersCreateInput = z.input<typeof UsersCreateInputSchema>;

const UsersCreateResponseSchema = z.object({
	success: z.literal(true),
	user_id: z.number().describe('The new user.'),
});

export type UsersCreateResponse = z.infer<typeof UsersCreateResponseSchema>;

const UsersUpdateInputSchema = z.object({
	user_id: IdSchema.describe('The user to update.'),
	username: z.string().optional().describe('Rename the user.'),
	password: z.string().optional().describe('New password.'),
	device_limit: z
		.number()
		.int()
		.min(-1)
		.optional()
		.describe(
			'Devices allowed per billing period. `0` removes the limit, `-1` blocks sign-in. Works on its own.',
		),
});

export type UsersUpdateInput = z.input<typeof UsersUpdateInputSchema>;

const UsersUpdateResponseSchema = z.object({
	success: z.literal(true),
	user_id: z.number(),
});

export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

const UsersDeleteInputSchema = z.object({
	user_id: IdListSchema.describe(
		'The users to delete. `all` deletes every app user except the account owner.',
	),
});

export type UsersDeleteInput = z.input<typeof UsersDeleteInputSchema>;

const UsersDeleteResponseSchema = z.object({
	success: z.literal(true),
});

export type UsersDeleteResponse = z.infer<typeof UsersDeleteResponseSchema>;

// ── questions ─────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
	'barcode',
	'barcodemultiline',
	'barcodenumeric',
	'checkbox',
	'dropboximage',
	'dropdown',
	'gps',
	'manual',
	'manualmultiline',
	'manualnumeric',
	'option',
	'webcollect',
] as const;

const QuestionSchema = z
	.object({
		id: z.number().nullish(),
		text: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('A string, so a new type cannot fail a read.'),
		answers: z
			.array(ScanEndpointRefSchema)
			.nullish()
			.describe('Answer options with their IDs.'),
	})
	.loose();

export type CodereadrQuestion = z.infer<typeof QuestionSchema>;

const QuestionsListInputSchema = z.object({
	question_id: IdListSchema.optional().describe(
		'Questions to list. `all` by default.',
	),
});

export type QuestionsListInput = z.input<typeof QuestionsListInputSchema>;

const QuestionsListResponseSchema = z.object({
	questions: z.array(QuestionSchema),
});

export type QuestionsListResponse = z.infer<typeof QuestionsListResponseSchema>;

const QuestionsCreateInputSchema = z.object({
	question_text: z
		.string()
		.min(1)
		.describe('The question shown to the app user.'),
	question_type: z
		.enum(QUESTION_TYPES)
		.optional()
		.describe(
			'Defaults to `manual`. A value outside this list is rejected here before the request is sent. `checkbox`, `dropdown`, `option` and `webcollect` need answer options added afterward.',
		),
});

export type QuestionsCreateInput = z.input<typeof QuestionsCreateInputSchema>;

const QuestionsCreateResponseSchema = z.object({
	success: z.literal(true),
	question_id: z.number().describe('The new question.'),
});

export type QuestionsCreateResponse = z.infer<
	typeof QuestionsCreateResponseSchema
>;

// ── devices ───────────────────────────────────────────────────────────────

const DeviceSchema = z
	.object({
		id: z.number().nullish(),
		udid: z.string().nullish(),
		name: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type CodereadrDevice = z.infer<typeof DeviceSchema>;

const DevicesListInputSchema = z.object({
	device_id: IdListSchema.optional().describe(
		'Devices to list. `all` by default.',
	),
});

export type DevicesListInput = z.input<typeof DevicesListInputSchema>;

const DevicesListResponseSchema = z.object({
	devices: z.array(DeviceSchema),
});

export type DevicesListResponse = z.infer<typeof DevicesListResponseSchema>;

const DevicesUpdateInputSchema = z.object({
	device_id: IdSchema.describe('The device to rename.'),
	device_name: z.string().min(1).describe('New name for the device.'),
});

export type DevicesUpdateInput = z.input<typeof DevicesUpdateInputSchema>;

const DevicesUpdateResponseSchema = z.object({
	success: z.literal(true),
	device_id: z.number(),
});

export type DevicesUpdateResponse = z.infer<typeof DevicesUpdateResponseSchema>;

// ── uploads.list ──────────────────────────────────────────────────────────

const UploadSchema = z
	.object({
		id: z.number().nullish(),
		device_id: z.number().nullish(),
		service_id: z.number().nullish(),
		user_id: z.number().nullish(),
		status: z.number().nullish(),
		count: z.number().nullish().describe('Scans in the upload.'),
		timestamp: z.string().nullish(),
	})
	.loose();

export type CodereadrUpload = z.infer<typeof UploadSchema>;

const UploadsListInputSchema = z
	.object({
		service_id: IdListSchema.optional().describe(
			'Services to read uploads from. `all` by default.',
		),
		device_id: IdListSchema.optional().describe(
			'Devices that made the uploads. `all` by default.',
		),
		user_id: IdListSchema.optional().describe(
			'Users who made the uploads. `all` by default.',
		),
		limit: z.number().int().positive().optional().describe('Page size.'),
		offset: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('Rows to skip. Needs `limit`.'),
	})
	.superRefine((value, ctx) => {
		// The API ignores `offset` unless `limit` comes with it and has no
		// documented default page size here, so an offset on its own would
		// silently return the first rows again.
		if (value.offset !== undefined && value.limit === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['limit'],
				message:
					'limit is required with offset; CodeREADr ignores an offset sent without it',
			});
		}
	});

export type UploadsListInput = z.input<typeof UploadsListInputSchema>;

const UploadsListResponseSchema = z
	.object({
		count: z.number().nullish().describe('Rows in this response.'),
		uploads: z.array(UploadSchema),
		next_offset: z
			.number()
			.nullish()
			.describe(
				'Pass as `offset` for the next page while this page came back full.',
			),
	})
	.loose();

export type UploadsListResponse = z.infer<typeof UploadsListResponseSchema>;

// ── limits.retrieve ───────────────────────────────────────────────────────

const LimitWindowSchema = z
	.object({
		left: z.number().nullish().describe('Requests left in this window.'),
		limit: z
			.number()
			.nullish()
			.describe('Requests allowed; `-1` means unlimited.'),
	})
	.loose();

const LimitsRetrieveInputSchema = z.object({});

export type LimitsRetrieveInput = z.input<typeof LimitsRetrieveInputSchema>;

const LimitsRetrieveResponseSchema = z
	.object({
		minute: LimitWindowSchema.nullish().describe('Per-minute allowance.'),
		day: LimitWindowSchema.nullish().describe('Per-day allowance.'),
	})
	.loose();

export type LimitsRetrieveResponse = z.infer<
	typeof LimitsRetrieveResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type CodereadrEndpointInputs = {
	scansList: ScansListInput;
	scansDelete: ScansDeleteInput;
	servicesList: ServicesListInput;
	servicesCreate: ServicesCreateInput;
	servicesUpdate: ServicesUpdateInput;
	servicesDelete: ServicesDeleteInput;
	databasesList: DatabasesListInput;
	databasesCreate: DatabasesCreateInput;
	databasesUpdate: DatabasesUpdateInput;
	databasesDelete: DatabaseTargetInput;
	databasesClear: DatabaseTargetInput;
	databasesShowValues: DatabasesShowValuesInput;
	databasesUpsertValue: DatabasesUpsertValueInput;
	databasesUpsertValues: DatabasesUpsertValuesInput;
	usersList: UsersListInput;
	usersCreate: UsersCreateInput;
	usersUpdate: UsersUpdateInput;
	usersDelete: UsersDeleteInput;
	questionsList: QuestionsListInput;
	questionsCreate: QuestionsCreateInput;
	devicesList: DevicesListInput;
	devicesUpdate: DevicesUpdateInput;
	uploadsList: UploadsListInput;
	limitsRetrieve: LimitsRetrieveInput;
};

export type CodereadrEndpointOutputs = {
	scansList: ScansListResponse;
	scansDelete: ScansDeleteResponse;
	servicesList: ServicesListResponse;
	servicesCreate: ServicesCreateResponse;
	servicesUpdate: ServicesUpdateResponse;
	servicesDelete: ServicesDeleteResponse;
	databasesList: DatabasesListResponse;
	databasesCreate: DatabasesCreateResponse;
	databasesUpdate: DatabasesUpdateResponse;
	databasesDelete: DatabaseTargetResponse;
	databasesClear: DatabaseTargetResponse;
	databasesShowValues: DatabasesShowValuesResponse;
	databasesUpsertValue: DatabaseTargetResponse;
	databasesUpsertValues: DatabaseTargetResponse;
	usersList: UsersListResponse;
	usersCreate: UsersCreateResponse;
	usersUpdate: UsersUpdateResponse;
	usersDelete: UsersDeleteResponse;
	questionsList: QuestionsListResponse;
	questionsCreate: QuestionsCreateResponse;
	devicesList: DevicesListResponse;
	devicesUpdate: DevicesUpdateResponse;
	uploadsList: UploadsListResponse;
	limitsRetrieve: LimitsRetrieveResponse;
};

export const CodereadrEndpointInputSchemas = {
	scansList: ScansListInputSchema,
	scansDelete: ScansDeleteInputSchema,
	servicesList: ServicesListInputSchema,
	servicesCreate: ServicesCreateInputSchema,
	servicesUpdate: ServicesUpdateInputSchema,
	servicesDelete: ServicesDeleteInputSchema,
	databasesList: DatabasesListInputSchema,
	databasesCreate: DatabasesCreateInputSchema,
	databasesUpdate: DatabasesUpdateInputSchema,
	databasesDelete: DatabaseTargetInputSchema,
	databasesClear: DatabaseTargetInputSchema,
	databasesShowValues: DatabasesShowValuesInputSchema,
	databasesUpsertValue: DatabasesUpsertValueInputSchema,
	databasesUpsertValues: DatabasesUpsertValuesInputSchema,
	usersList: UsersListInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersDelete: UsersDeleteInputSchema,
	questionsList: QuestionsListInputSchema,
	questionsCreate: QuestionsCreateInputSchema,
	devicesList: DevicesListInputSchema,
	devicesUpdate: DevicesUpdateInputSchema,
	uploadsList: UploadsListInputSchema,
	limitsRetrieve: LimitsRetrieveInputSchema,
} as const;

export const CodereadrEndpointOutputSchemas = {
	scansList: ScansListResponseSchema,
	scansDelete: ScansDeleteResponseSchema,
	servicesList: ServicesListResponseSchema,
	servicesCreate: ServicesCreateResponseSchema,
	servicesUpdate: ServicesUpdateResponseSchema,
	servicesDelete: ServicesDeleteResponseSchema,
	databasesList: DatabasesListResponseSchema,
	databasesCreate: DatabasesCreateResponseSchema,
	databasesUpdate: DatabasesUpdateResponseSchema,
	databasesDelete: DatabaseTargetResponseSchema,
	databasesClear: DatabaseTargetResponseSchema,
	databasesShowValues: DatabasesShowValuesResponseSchema,
	databasesUpsertValue: DatabaseTargetResponseSchema,
	databasesUpsertValues: DatabaseTargetResponseSchema,
	usersList: UsersListResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	usersDelete: UsersDeleteResponseSchema,
	questionsList: QuestionsListResponseSchema,
	questionsCreate: QuestionsCreateResponseSchema,
	devicesList: DevicesListResponseSchema,
	devicesUpdate: DevicesUpdateResponseSchema,
	uploadsList: UploadsListResponseSchema,
	limitsRetrieve: LimitsRetrieveResponseSchema,
} as const;

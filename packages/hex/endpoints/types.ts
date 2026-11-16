import { z } from 'zod';

/**
 * Response enums accept values Hex adds later: a new status or type must not
 * fail the whole response. Input schemas keep strict z.enum.
 */
const openEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
	z.union([z.enum(values), z.string()]);

// Every schema in this file mirrors the official Hex REST API OpenAPI specification
// (v1.0.0, base URL https://app.hex.tech/api).
// Reference: https://learn.hex.tech/docs/api-integrations/api/reference
// OpenAPI: https://static.hex.site/openapi.json

// ── Component Schemas from Hex OpenAPI Specification ──────────────────────────

export const AgentUsageRunSchema = z
	.object({
		runId: z.string(),
		runTimestamp: z.string(),
		userId: z.string(),
		model: z.string(),
		creditsChargedToUser: z.number(),
		creditsChargedToWorkspace: z.number(),
		totalCreditsCharged: z.number(),
		billingCycleStart: z.string().nullable(),
		billingCycleEnd: z.string().nullable(),
		threadId: z.string().nullable(),
		evalCaseRunId: z.string().nullable(),
	})
	.passthrough();
export type AgentUsageRun = z.infer<typeof AgentUsageRunSchema>;

export const PaginationSchema = z
	.object({
		before: z.string().nullable(),
		after: z.string().nullable(),
	})
	.passthrough();
export type Pagination = z.infer<typeof PaginationSchema>;

/** Number of results to fetch per page for paginated requests */
export const PageSizeSchema = z.number().int().min(1).max(100);
export type PageSize = z.infer<typeof PageSizeSchema>;

export const EnumValues_typeofListCollectionsSortByEnum_Schema = z.enum([
	'NAME',
]);
export type EnumValues_typeofListCollectionsSortByEnum_ = z.infer<
	typeof EnumValues_typeofListCollectionsSortByEnum_Schema
>;

export const ListCollectionsSortByEnumSchema =
	EnumValues_typeofListCollectionsSortByEnum_Schema;
export type ListCollectionsSortByEnum = z.infer<
	typeof ListCollectionsSortByEnumSchema
>;

/** Unique ID for a collection. */
export const CollectionIdSchema = z.string().uuid();
export type CollectionId = z.infer<typeof CollectionIdSchema>;

export const NameSchema = z.string().min(1);
export type Name = z.infer<typeof NameSchema>;

/** Unique ID for a user. This can be found from the users page (in Settings). */
export const UserIdSchema = z.string().uuid();
export type UserId = z.infer<typeof UserIdSchema>;

export const EnumValues_typeofCollectionAccess_Schema = z.string();
export type EnumValues_typeofCollectionAccess_ = z.infer<
	typeof EnumValues_typeofCollectionAccess_Schema
>;

export const CollectionAccessSchema = EnumValues_typeofCollectionAccess_Schema;
export type CollectionAccess = z.infer<typeof CollectionAccessSchema>;

/** Unique ID for a group. This can be found from the groups page (in Settings). */
export const GroupIdSchema = z.string().uuid();
export type GroupId = z.infer<typeof GroupIdSchema>;

export const CollectionApiResourceSharingSchema = z
	.object({
		users: z
			.array(
				z
					.object({
						access: CollectionAccessSchema,
						id: UserIdSchema,
					})
					.passthrough(),
			)
			.optional(),
		groups: z
			.array(
				z
					.object({
						access: CollectionAccessSchema,
						id: GroupIdSchema,
					})
					.passthrough(),
			)
			.optional(),
		workspace: z
			.object({
				members: CollectionAccessSchema.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type CollectionApiResourceSharing = z.infer<
	typeof CollectionApiResourceSharingSchema
>;

export const CollectionApiResourceSchema = z
	.object({
		id: CollectionIdSchema,
		name: NameSchema,
		description: z.string().optional(),
		creator: z
			.object({
				email: z.string(),
				id: UserIdSchema,
			})
			.passthrough()
			.optional(),
		sharing: CollectionApiResourceSharingSchema,
	})
	.passthrough();
export type CollectionApiResource = z.infer<typeof CollectionApiResourceSchema>;

/** A cursor string used with `before` and `after` parameters to paginate through a list
of items on the API. */
export const ApiPaginationCursorSchema = z.string();
export type ApiPaginationCursor = z.infer<typeof ApiPaginationCursorSchema>;

export const PaginationApiResourceSchema = z
	.object({
		after: ApiPaginationCursorSchema.nullable(),
		before: ApiPaginationCursorSchema.nullable(),
	})
	.passthrough();
export type PaginationApiResource = z.infer<typeof PaginationApiResourceSchema>;

export const ListCollectionsResponseSchema = z
	.object({
		values: z.array(CollectionApiResourceSchema),
		pagination: PaginationApiResourceSchema,
	})
	.passthrough();
export type ListCollectionsResponse = z.infer<
	typeof ListCollectionsResponseSchema
>;

export const CreditGrantSchema = z
	.object({
		id: z.string(),
		transactionDate: z.string(),
		transactionAmountCents: z.number(),
		unitPriceCents: z.number(),
		quantity: z.number(),
		grantType: z.string().nullable(),
		expirationDate: z.string(),
	})
	.passthrough();
export type CreditGrant = z.infer<typeof CreditGrantSchema>;

export const DataConnectionSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: openEnum([
			'alloydb',
			'athena',
			'bigquery',
			'clickhouse',
			'cloudsql__mysql',
			'cloudsql__postgres',
			'cloudsql__sqlserver',
			'databricks',
			'dremio',
			'mariadb',
			'materialize',
			'motherduck',
			'mysql',
			'postgres',
			'prestodb',
			'rds__mysql',
			'rds__postgres',
			'redshift',
			'snowflake',
			'sqlserver',
			'starburst',
			'transform',
			'trino',
		]),
		description: z.string().optional(),
		sensitivity: z
			.object({
				configured: z.boolean(),
				effective: z.boolean(),
				overrideReason: openEnum(['USER_SCOPED_OAUTH_RESULTS']).nullable(),
			})
			.passthrough(),
		connectionDetails: z
			.union([
				z
					.object({
						athena: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								s3OutputPath: z.string().optional(),
								catalog: z.string().nullable().optional(),
								workgroup: z.string().nullable().optional(),
								accessKeyId: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						bigquery: z
							.object({
								projectId: z.string().optional(),
								enableDriveAccess: z.boolean().optional(),
								enableStorageApi: z.boolean().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						clickhouse: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						databricks: z
							.object({
								jdbcUrl: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						postgres: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						redshift: z
							.object({
								host: z.string().optional(),
								port: z.number().optional(),
								database: z.string().optional(),
								username: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						snowflake: z
							.object({
								accountName: z.string().optional(),
								warehouse: z.string().optional(),
								database: z.string().optional(),
								schema: z.string().nullable().optional(),
								username: z.string().optional(),
								role: z.string().nullable().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						trino: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								catalog: z.string().optional(),
								schema: z.string().optional(),
								sessionProperties: z
									.array(
										z
											.object({
												key: z.string(),
												value: z.string(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						rds__mysql: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
								region: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						rds__postgres: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
								region: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						alloydb: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						cloudsql__mysql: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						cloudsql__postgres: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						cloudsql__sqlserver: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						dremio: z
							.object({
								jdbcUrl: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						mariadb: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						materialize: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						motherduck: z
							.object({
								defaultDatabase: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						mysql: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
								region: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						prestodb: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								catalog: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						sqlserver: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
								database: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						starburst: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
				z
					.object({
						transform: z
							.object({
								hostname: z.string().optional(),
								port: z.number().optional(),
								username: z.string().optional(),
							})
							.passthrough(),
					})
					.passthrough(),
			])
			.nullable(),
		connectViaSsh: z.boolean(),
		includeMagic: z.boolean(),
		allowWritebackCells: z.boolean(),
		schemaFilters: z
			.object({
				databases: z
					.object({
						include: z
							.object({
								matchType: openEnum(['EXACT', 'PREFIX', 'REGEX', 'SUFFIX']),
								values: z.array(z.string()),
							})
							.passthrough()
							.optional(),
						exclude: z
							.object({
								matchType: openEnum(['EXACT', 'PREFIX', 'REGEX', 'SUFFIX']),
								values: z.array(z.string()),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				schemas: z
					.object({
						include: z
							.object({
								matchType: openEnum(['EXACT', 'PREFIX', 'REGEX', 'SUFFIX']),
								values: z.array(z.string()),
							})
							.passthrough()
							.optional(),
						exclude: z
							.object({
								matchType: openEnum(['EXACT', 'PREFIX', 'REGEX', 'SUFFIX']),
								values: z.array(z.string()),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				tables: z
					.object({
						include: z
							.object({
								matchType: openEnum(['EXACT', 'PREFIX', 'REGEX', 'SUFFIX']),
								values: z.array(z.string()),
							})
							.passthrough()
							.optional(),
						exclude: z
							.object({
								matchType: openEnum(['EXACT', 'PREFIX', 'REGEX', 'SUFFIX']),
								values: z.array(z.string()),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		schemaRefreshSchedule: z
			.object({
				cadence: openEnum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']),
				enabled: z.boolean(),
				daily: z
					.object({
						hour: z.number().int(),
						minute: z.number().int(),
						timezoneString: z.string(),
					})
					.passthrough()
					.nullable()
					.optional(),
				weekly: z
					.object({
						dayOfWeek: openEnum([
							'SUNDAY',
							'MONDAY',
							'TUESDAY',
							'WEDNESDAY',
							'THURSDAY',
							'FRIDAY',
							'SATURDAY',
						]),
						hour: z.number().int(),
						minute: z.number().int(),
						timezoneString: z.string(),
					})
					.passthrough()
					.nullable()
					.optional(),
				monthly: z
					.object({
						day: z.number().int(),
						hour: z.number().int(),
						minute: z.number().int(),
						timezoneString: z.string(),
					})
					.passthrough()
					.nullable()
					.optional(),
				custom: z
					.object({
						cron: z.string(),
						timezoneString: z.string(),
					})
					.passthrough()
					.nullable()
					.optional(),
			})
			.passthrough()
			.optional(),
		schemaRefreshAccess: openEnum(['ADMINS', 'USERS_WITH_QUERY_ACCESS']),
		sharing: z
			.object({
				groups: z
					.array(
						z
							.object({
								group: z
									.object({
										id: z.string(),
										name: z.string(),
									})
									.passthrough(),
								access: openEnum(['NONE', 'QUERY', 'VIEW_RESULTS']),
							})
							.passthrough(),
					)
					.optional(),
				workspace: z
					.object({
						members: openEnum(['NONE', 'QUERY', 'VIEW_RESULTS']).optional(),
						guests: openEnum(['NONE', 'QUERY', 'VIEW_RESULTS']).optional(),
						public: openEnum(['NONE', 'QUERY', 'VIEW_RESULTS']).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();
export type DataConnection = z.infer<typeof DataConnectionSchema>;

export const DataConnectionBasicSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: openEnum([
			'alloydb',
			'athena',
			'bigquery',
			'clickhouse',
			'cloudsql__mysql',
			'cloudsql__postgres',
			'cloudsql__sqlserver',
			'databricks',
			'dremio',
			'mariadb',
			'materialize',
			'motherduck',
			'mysql',
			'postgres',
			'prestodb',
			'rds__mysql',
			'rds__postgres',
			'redshift',
			'snowflake',
			'sqlserver',
			'starburst',
			'transform',
			'trino',
		]),
		description: z.string().optional(),
		sensitivity: z
			.object({
				configured: z.boolean(),
				effective: z.boolean(),
				overrideReason: openEnum(['USER_SCOPED_OAUTH_RESULTS']).nullable(),
			})
			.passthrough(),
	})
	.passthrough();
export type DataConnectionBasic = z.infer<typeof DataConnectionBasicSchema>;

export const EnumValues_typeofDataConnectionPublicSharingAccessLevelEnum_Schema =
	z.enum(['NONE', 'VIEW_RESULTS']);
export type EnumValues_typeofDataConnectionPublicSharingAccessLevelEnum_ =
	z.infer<
		typeof EnumValues_typeofDataConnectionPublicSharingAccessLevelEnum_Schema
	>;

export const DataConnectionPublicSharingAccessLevelEnumSchema =
	EnumValues_typeofDataConnectionPublicSharingAccessLevelEnum_Schema;
export type DataConnectionPublicSharingAccessLevelEnum = z.infer<
	typeof DataConnectionPublicSharingAccessLevelEnumSchema
>;

export const EnumValues_typeofDataConnectionSharingAccessLevelEnum_Schema =
	z.enum(['NONE', 'QUERY', 'VIEW_RESULTS']);
export type EnumValues_typeofDataConnectionSharingAccessLevelEnum_ = z.infer<
	typeof EnumValues_typeofDataConnectionSharingAccessLevelEnum_Schema
>;

export const DataConnectionSharingAccessLevelEnumSchema =
	EnumValues_typeofDataConnectionSharingAccessLevelEnum_Schema;
export type DataConnectionSharingAccessLevelEnum = z.infer<
	typeof DataConnectionSharingAccessLevelEnumSchema
>;

export const EnumValues_typeofDataConnectionSchemaRefreshAccess_Schema = z.enum(
	['ADMINS', 'USERS_WITH_QUERY_ACCESS'],
);
export type EnumValues_typeofDataConnectionSchemaRefreshAccess_ = z.infer<
	typeof EnumValues_typeofDataConnectionSchemaRefreshAccess_Schema
>;

export const DataConnectionSchemaRefreshAccessSchema =
	EnumValues_typeofDataConnectionSchemaRefreshAccess_Schema;
export type DataConnectionSchemaRefreshAccess = z.infer<
	typeof DataConnectionSchemaRefreshAccessSchema
>;

export const EnumValues_typeofScheduleCadenceApiEnum_Schema = z.enum([
	'HOURLY',
	'DAILY',
	'WEEKLY',
	'MONTHLY',
	'CUSTOM',
]);
export type EnumValues_typeofScheduleCadenceApiEnum_ = z.infer<
	typeof EnumValues_typeofScheduleCadenceApiEnum_Schema
>;

/** Types of cadence of a schedule for a Hex project. */
export const ScheduleCadenceApiEnumSchema =
	EnumValues_typeofScheduleCadenceApiEnum_Schema;
export type ScheduleCadenceApiEnum = z.infer<
	typeof ScheduleCadenceApiEnumSchema
>;

export const TimezoneStringDesignatorSchema = z.string();
export type TimezoneStringDesignator = z.infer<
	typeof TimezoneStringDesignatorSchema
>;

/** An ISO 8601 timezone designator like +08:00. */
export const TimezoneDesignatorSchema = z.string();
export type TimezoneDesignator = z.infer<typeof TimezoneDesignatorSchema>;

export const EnumValues_typeofDayOfWeekApiEnum_Schema = z.enum([
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
]);
export type EnumValues_typeofDayOfWeekApiEnum_ = z.infer<
	typeof EnumValues_typeofDayOfWeekApiEnum_Schema
>;

export const DayOfWeekApiEnumSchema = EnumValues_typeofDayOfWeekApiEnum_Schema;
export type DayOfWeekApiEnum = z.infer<typeof DayOfWeekApiEnumSchema>;

export const SchemaRefreshScheduleApiResourceSchema = z
	.object({
		cadence: ScheduleCadenceApiEnumSchema,
		enabled: z.boolean(),
		daily: z
			.object({
				timezoneString: TimezoneStringDesignatorSchema,
				minute: z.number().int().min(0).max(59),
				hour: z.number().int().min(0).max(23),
			})
			.passthrough()
			.nullable()
			.optional(),
		weekly: z
			.object({
				timezoneString: TimezoneDesignatorSchema,
				minute: z.number().int().min(0).max(59),
				hour: z.number().int().min(0).max(23),
				dayOfWeek: DayOfWeekApiEnumSchema,
			})
			.passthrough()
			.nullable()
			.optional(),
		monthly: z
			.object({
				timezoneString: TimezoneDesignatorSchema,
				minute: z.number().int().min(0).max(59),
				hour: z.number().int().min(0).max(23),
				day: z.number().int().min(1).max(28),
			})
			.passthrough()
			.nullable()
			.optional(),
		custom: z
			.object({
				timezoneString: TimezoneDesignatorSchema,
				cron: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();
export type SchemaRefreshScheduleApiResource = z.infer<
	typeof SchemaRefreshScheduleApiResourceSchema
>;

export const EnumValues_typeofSchemaFilterMatchType_Schema = z.enum([
	'EXACT',
	'PREFIX',
	'REGEX',
	'SUFFIX',
]);
export type EnumValues_typeofSchemaFilterMatchType_ = z.infer<
	typeof EnumValues_typeofSchemaFilterMatchType_Schema
>;

export const SchemaFilterMatchTypeSchema =
	EnumValues_typeofSchemaFilterMatchType_Schema;
export type SchemaFilterMatchType = z.infer<typeof SchemaFilterMatchTypeSchema>;

export const SchemaEntityFilterSchema = z
	.object({
		exclude: z
			.object({
				values: z.array(z.string()),
				matchType: SchemaFilterMatchTypeSchema,
			})
			.passthrough()
			.optional(),
		include: z
			.object({
				values: z.array(z.string()),
				matchType: SchemaFilterMatchTypeSchema,
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type SchemaEntityFilter = z.infer<typeof SchemaEntityFilterSchema>;

export const CreateConnectionDetailsSchema = z.union([
	z
		.object({
			athena: z
				.object({
					secretAccessKey: z.string(),
					accessKeyId: z.string(),
					workgroup: z.string().nullable().optional(),
					catalog: z.string().nullable().optional(),
					s3OutputPath: z.string(),
					port: z.number(),
					hostname: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			bigquery: z
				.object({
					serviceAccountJsonConfig: z.string(),
					enableStorageApi: z.boolean().optional(),
					enableDriveAccess: z.boolean().optional(),
					projectId: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			databricks: z
				.object({
					accessToken: z.string(),
					jdbcUrl: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			postgres: z
				.object({
					password: z.string(),
					username: z.string(),
					database: z.string(),
					port: z.number(),
					hostname: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			redshift: z
				.object({
					sslRootCert: z.string().nullable().optional(),
					password: z.string(),
					username: z.string(),
					database: z.string(),
					port: z.number(),
					host: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			snowflake: z
				.object({
					role: z.string().nullable().optional(),
					passphrase: z.string(),
					privateKey: z.string(),
					username: z.string(),
					schema: z.string().nullable().optional(),
					database: z.string(),
					warehouse: z.string(),
					accountName: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			trino: z
				.object({
					sessionProperties: z
						.array(
							z
								.object({
									value: z.string(),
									key: z.string(),
								})
								.passthrough(),
						)
						.nullable()
						.optional(),
					password: z.string().optional(),
					username: z.string(),
					schema: z.string().optional(),
					catalog: z.string().optional(),
					port: z.number(),
					hostname: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
]);
export type CreateConnectionDetails = z.infer<
	typeof CreateConnectionDetailsSchema
>;

export const EnumValues_typeofDataConnectionApiType_Schema = z.enum([
	'alloydb',
	'athena',
	'bigquery',
	'clickhouse',
	'cloudsql__mysql',
	'cloudsql__postgres',
	'cloudsql__sqlserver',
	'databricks',
	'dremio',
	'mariadb',
	'materialize',
	'motherduck',
	'mysql',
	'postgres',
	'prestodb',
	'rds__mysql',
	'rds__postgres',
	'redshift',
	'snowflake',
	'sqlserver',
	'starburst',
	'transform',
	'trino',
]);
export type EnumValues_typeofDataConnectionApiType_ = z.infer<
	typeof EnumValues_typeofDataConnectionApiType_Schema
>;

export const DataConnectionApiTypeSchema =
	EnumValues_typeofDataConnectionApiType_Schema;
export type DataConnectionApiType = z.infer<typeof DataConnectionApiTypeSchema>;

/** Unique ID for a data connection. */
export const DataConnectionIdSchema = z.string().uuid();
export type DataConnectionId = z.infer<typeof DataConnectionIdSchema>;

export const DataConnectionSensitivityApiResourceSchema = z
	.object({
		configured: z.boolean(),
		effective: z.boolean(),
		overrideReason: openEnum(['USER_SCOPED_OAUTH_RESULTS']).nullable(),
	})
	.passthrough();
export type DataConnectionSensitivityApiResource = z.infer<
	typeof DataConnectionSensitivityApiResourceSchema
>;

export const HostPortDatabaseUsernameConnectionDetailsSchema = z
	.object({
		hostname: z.string().optional(),
		port: z.number().optional(),
		username: z.string().optional(),
		database: z.string().optional(),
	})
	.passthrough();
export type HostPortDatabaseUsernameConnectionDetails = z.infer<
	typeof HostPortDatabaseUsernameConnectionDetailsSchema
>;

export const HostPortUsernameConnectionDetailsSchema = z
	.object({
		hostname: z.string().optional(),
		port: z.number().optional(),
		username: z.string().optional(),
	})
	.passthrough();
export type HostPortUsernameConnectionDetails = z.infer<
	typeof HostPortUsernameConnectionDetailsSchema
>;

export const ReadableConnectionDetailsSchema = z.union([
	z
		.object({
			athena: z
				.object({
					accessKeyId: z.string().optional(),
					workgroup: z.string().nullable().optional(),
					catalog: z.string().nullable().optional(),
					s3OutputPath: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			bigquery: z
				.object({
					enableStorageApi: z.boolean().optional(),
					enableDriveAccess: z.boolean().optional(),
					projectId: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			clickhouse: z
				.object({
					username: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			databricks: z
				.object({
					jdbcUrl: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			postgres: z
				.object({
					username: z.string().optional(),
					database: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			redshift: z
				.object({
					username: z.string().optional(),
					database: z.string().optional(),
					port: z.number().optional(),
					host: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			snowflake: z
				.object({
					role: z.string().nullable().optional(),
					username: z.string().optional(),
					schema: z.string().nullable().optional(),
					database: z.string().optional(),
					warehouse: z.string().optional(),
					accountName: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			trino: z
				.object({
					sessionProperties: z
						.array(
							z
								.object({
									value: z.string(),
									key: z.string(),
								})
								.passthrough(),
						)
						.optional(),
					username: z.string().optional(),
					schema: z.string().optional(),
					catalog: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			rds__mysql: z
				.object({
					region: z.string().optional(),
					username: z.string().optional(),
					database: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			rds__postgres: z
				.object({
					region: z.string().optional(),
					username: z.string().optional(),
					database: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			alloydb: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			cloudsql__mysql: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			cloudsql__postgres: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			cloudsql__sqlserver: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			dremio: z
				.object({
					jdbcUrl: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			mariadb: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			materialize: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			motherduck: z
				.object({
					defaultDatabase: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			mysql: z.intersection(
				HostPortDatabaseUsernameConnectionDetailsSchema,
				z
					.object({
						region: z.string().optional(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	z
		.object({
			prestodb: z
				.object({
					username: z.string().optional(),
					catalog: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			sqlserver: HostPortDatabaseUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			starburst: HostPortUsernameConnectionDetailsSchema,
		})
		.passthrough(),
	z
		.object({
			transform: HostPortUsernameConnectionDetailsSchema,
		})
		.passthrough(),
]);
export type ReadableConnectionDetails = z.infer<
	typeof ReadableConnectionDetailsSchema
>;

export const DataConnectionWithSensitiveFieldsApiResourceSchema = z
	.object({
		id: DataConnectionIdSchema,
		name: NameSchema,
		type: z.union([DataConnectionApiTypeSchema, z.string()]),
		description: z.string().optional(),
		sensitivity: DataConnectionSensitivityApiResourceSchema,
		connectionDetails: ReadableConnectionDetailsSchema.nullable(),
		connectViaSsh: z.boolean(),
		includeMagic: z.boolean(),
		allowWritebackCells: z.boolean(),
		schemaFilters: z
			.object({
				tables: SchemaEntityFilterSchema.optional(),
				schemas: SchemaEntityFilterSchema.optional(),
				databases: SchemaEntityFilterSchema.optional(),
			})
			.passthrough()
			.optional(),
		schemaRefreshSchedule: SchemaRefreshScheduleApiResourceSchema.optional(),
		schemaRefreshAccess: z.union([
			DataConnectionSchemaRefreshAccessSchema,
			z.string(),
		]),
		sharing: z
			.object({
				workspace: z
					.object({
						public: z
							.union([DataConnectionSharingAccessLevelEnumSchema, z.string()])
							.optional(),
						guests: z
							.union([DataConnectionSharingAccessLevelEnumSchema, z.string()])
							.optional(),
						members: z
							.union([DataConnectionSharingAccessLevelEnumSchema, z.string()])
							.optional(),
					})
					.passthrough()
					.optional(),
				groups: z
					.array(
						z
							.object({
								access: z.union([
									DataConnectionSharingAccessLevelEnumSchema,
									z.string(),
								]),
								group: z
									.object({
										name: z.string(),
										id: GroupIdSchema,
									})
									.passthrough(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();
export type DataConnectionWithSensitiveFieldsApiResource = z.infer<
	typeof DataConnectionWithSensitiveFieldsApiResourceSchema
>;

export const EditConnectionDetailsSchema = z.union([
	z
		.object({
			athena: z
				.object({
					secretAccessKey: z.string().optional(),
					accessKeyId: z.string().optional(),
					workgroup: z.string().nullable().optional(),
					catalog: z.string().nullable().optional(),
					s3OutputPath: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			bigquery: z
				.object({
					serviceAccountJsonConfig: z.string().optional(),
					enableStorageApi: z.boolean().optional(),
					enableDriveAccess: z.boolean().optional(),
					projectId: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			databricks: z
				.object({
					accessToken: z.string().optional(),
					jdbcUrl: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			postgres: z
				.object({
					password: z.string().optional(),
					username: z.string().optional(),
					database: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			redshift: z
				.object({
					sslRootCert: z.string().nullable().optional(),
					password: z.string().optional(),
					username: z.string().optional(),
					database: z.string().optional(),
					port: z.number().optional(),
					host: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			snowflake: z
				.object({
					role: z.string().nullable().optional(),
					passphrase: z.string().optional(),
					privateKey: z.string().optional(),
					username: z.string().optional(),
					schema: z.string().nullable().optional(),
					database: z.string().optional(),
					warehouse: z.string().optional(),
					accountName: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
	z
		.object({
			trino: z
				.object({
					sessionProperties: z
						.array(
							z
								.object({
									value: z.string(),
									key: z.string(),
								})
								.passthrough(),
						)
						.nullable()
						.optional(),
					password: z.string().optional(),
					username: z.string().optional(),
					schema: z.string().optional(),
					catalog: z.string().optional(),
					port: z.number().optional(),
					hostname: z.string().optional(),
				})
				.passthrough(),
		})
		.passthrough(),
]);
export type EditConnectionDetails = z.infer<typeof EditConnectionDetailsSchema>;

/** Schema object update request - specifies a status change for a database, schema, or table.
Currently, only status updates are supported. */
export const SchemaObjectUpdateSchema = z
	.object({
		type: z.enum(['DATABASE', 'SCHEMA', 'TABLE']),
		name: z.string(),
		status: z.string().nullable(),
	})
	.passthrough();
export type SchemaObjectUpdate = z.infer<typeof SchemaObjectUpdateSchema>;

/** Request body for updating data connection schema object statuses
Currently, only status updates are supported. */
export const UpdateDataConnectionSchemaRequestSchema = z
	.object({
		updates: z.array(SchemaObjectUpdateSchema),
	})
	.passthrough();
export type UpdateDataConnectionSchemaRequest = z.infer<
	typeof UpdateDataConnectionSchemaRequestSchema
>;

/** Response body for successful schema object status updates */
export const UpdateDataConnectionSchemaResponseSchema = z
	.object({
		updated: z
			.object({
				tables: z.array(
					z
						.object({
							status: z.string().nullable(),
							name: z.string(),
						})
						.passthrough(),
				),
				schemas: z.array(
					z
						.object({
							status: z.string().nullable(),
							name: z.string(),
						})
						.passthrough(),
				),
				databases: z.array(
					z
						.object({
							status: z.string().nullable(),
							name: z.string(),
						})
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export type UpdateDataConnectionSchemaResponse = z.infer<
	typeof UpdateDataConnectionSchemaResponseSchema
>;

/** Unique ID for a Hex project. This can be found in the Variables side bar of the Logic View of a project, or by visiting the Project, and copying the UUID after `hex` in the URL. */
export const ProjectIdSchema = z.string().uuid();
export type ProjectId = z.infer<typeof ProjectIdSchema>;

export const EmbeddingRequestSchema = z
	.object({
		hexUserAttributes: z.record(z.string(), z.string()).optional(),
		scope: z.array(z.string()).optional(),
		// Hex input names and values are caller-defined serialized app state.
		inputParameters: z.record(z.string(), z.unknown()).optional(),
		expiresIn: z.number().optional(),
		displayOptions: z
			.object({
				theme: z.enum(['light', 'dark']).optional(),
				showEmbeddedRunButton: z.boolean().optional(),
				noEmbedHeaderPadding: z.boolean().optional(),
				noEmbedBasePadding: z.boolean().optional(),
				noEmbedOutline: z.boolean().optional(),
				noEmbedFooter: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		testMode: z.boolean().optional(),
	})
	.passthrough();
export type EmbeddingRequest = z.infer<typeof EmbeddingRequestSchema>;

export const EmbeddingResponseSchema = z
	.object({
		url: z.string(),
	})
	.passthrough();
export type EmbeddingResponse = z.infer<typeof EmbeddingResponseSchema>;

/** Number of results to fetch per page for paginated requests */
export const LargerPageSizeSchema = z.number().int().min(1).max(500);
export type LargerPageSize = z.infer<typeof LargerPageSizeSchema>;

export const EnumValues_typeofListGroupsSortByEnum_Schema = z.enum([
	'CREATED_AT',
	'NAME',
]);
export type EnumValues_typeofListGroupsSortByEnum_ = z.infer<
	typeof EnumValues_typeofListGroupsSortByEnum_Schema
>;

export const ListGroupsSortByEnumSchema =
	EnumValues_typeofListGroupsSortByEnum_Schema;
export type ListGroupsSortByEnum = z.infer<typeof ListGroupsSortByEnumSchema>;

export const EnumValues_typeofSortDirectionEnum_Schema = z.enum([
	'DESC',
	'ASC',
]);
export type EnumValues_typeofSortDirectionEnum_ = z.infer<
	typeof EnumValues_typeofSortDirectionEnum_Schema
>;

export const SortDirectionEnumSchema =
	EnumValues_typeofSortDirectionEnum_Schema;
export type SortDirectionEnum = z.infer<typeof SortDirectionEnumSchema>;

/** An ISO 8601 timestamp with timezone like 1970-01-01T00:00:00Z. */
export const TimestampSchema = z.string();
export type Timestamp = z.infer<typeof TimestampSchema>;

export const GroupApiResourceSchema = z
	.object({
		id: GroupIdSchema,
		name: z.string(),
		createdAt: TimestampSchema,
	})
	.passthrough();
export type GroupApiResource = z.infer<typeof GroupApiResourceSchema>;

export const ListGroupsResponseSchema = z
	.object({
		values: z.array(GroupApiResourceSchema),
		pagination: PaginationApiResourceSchema,
	})
	.passthrough();
export type ListGroupsResponse = z.infer<typeof ListGroupsResponseSchema>;

export const GroupMembersSchema = z
	.object({
		users: z
			.array(
				z
					.object({
						id: UserIdSchema,
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type GroupMembers = z.infer<typeof GroupMembersSchema>;

export const CreateGroupResponseSchema = z
	.object({
		id: GroupIdSchema,
		name: NameSchema,
		members: GroupMembersSchema,
	})
	.passthrough();
export type CreateGroupResponse = z.infer<typeof CreateGroupResponseSchema>;

export const UnknownExternalSourceLocatorInputSchema = z
	.object({
		id: z.string().optional(),
		source: z.enum(['unknown']),
	})
	.passthrough();
export type UnknownExternalSourceLocatorInput = z.infer<
	typeof UnknownExternalSourceLocatorInputSchema
>;

export const UnknownExternalSourceInputSchema =
	UnknownExternalSourceLocatorInputSchema;
export type UnknownExternalSourceInput = z.infer<
	typeof UnknownExternalSourceInputSchema
>;

export const GithubExternalSourceLocatorInputSchema = z
	.object({
		repo: z.string(),
		owner: z.string(),
		base: z.string().optional(),
		source: z.enum(['github']),
	})
	.passthrough();
export type GithubExternalSourceLocatorInput = z.infer<
	typeof GithubExternalSourceLocatorInputSchema
>;

export const GithubExternalSourceLocatorWithMetadataInputSchema =
	z.intersection(
		GithubExternalSourceLocatorInputSchema,
		z
			.object({
				branch: z.string(),
				commitHash: z.string(),
			})
			.passthrough(),
	);
export type GithubExternalSourceLocatorWithMetadataInput = z.infer<
	typeof GithubExternalSourceLocatorWithMetadataInputSchema
>;

export const GithubExternalSourceInputSchema = z.intersection(
	GithubExternalSourceLocatorWithMetadataInputSchema,
	z
		.object({
			path: z.string(),
		})
		.passthrough(),
);
export type GithubExternalSourceInput = z.infer<
	typeof GithubExternalSourceInputSchema
>;

/** A unique identifier for a file that is sourced from an external source.
This is used to track the where the guide file was authored from and where we expect updates to come from. */
export const ExternalContextSourceInputSchema = z.union([
	UnknownExternalSourceInputSchema,
	GithubExternalSourceInputSchema,
]);
export type ExternalContextSourceInput = z.infer<
	typeof ExternalContextSourceInputSchema
>;

export const UpsertGuideDraftRequestBodySchema = z
	.object({
		forceWrite: z.boolean().optional(),
		files: z.array(
			z
				.object({
					externalSource: ExternalContextSourceInputSchema.optional(),
					contents: z.string().max(100000),
					filePath: z.string(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type UpsertGuideDraftRequestBody = z.infer<
	typeof UpsertGuideDraftRequestBodySchema
>;

/** Unique ID for a guide file. This can be found by going into the menu of a guide file in the guide files side bar. */
export const OrgGuideFileIdSchema = z.string().uuid();
export type OrgGuideFileId = z.infer<typeof OrgGuideFileIdSchema>;

export const GuideFileApiResourceSchema = z
	.object({
		id: OrgGuideFileIdSchema,
		filePath: z.string(),
	})
	.passthrough();
export type GuideFileApiResource = z.infer<typeof GuideFileApiResourceSchema>;

/** A unique identifier for this API request. The Hex Support team may request this value when debugging an issue. */
export const TraceIdSchema = z.string();
export type TraceId = z.infer<typeof TraceIdSchema>;

export const UpsertGuideDraftResponsePayloadSchema = z
	.object({
		files: z.array(GuideFileApiResourceSchema),
		warnings: z.array(
			z
				.object({
					message: z.string(),
					filePath: z.string(),
				})
				.passthrough(),
		),
		traceId: TraceIdSchema,
	})
	.passthrough();
export type UpsertGuideDraftResponsePayload = z.infer<
	typeof UpsertGuideDraftResponsePayloadSchema
>;

export const PublishGuidesRequestBodySchema = z
	.object({
		orgGuideFileIds: z.array(OrgGuideFileIdSchema).optional(),
		publishAllDraftGuides: z.boolean().optional(),
	})
	.passthrough();
export type PublishGuidesRequestBody = z.infer<
	typeof PublishGuidesRequestBodySchema
>;

export const PublishGuidesResponsePayloadSchema = z
	.object({
		message: z.string(),
		publishedGuides: z.array(GuideFileApiResourceSchema),
		traceId: TraceIdSchema,
	})
	.passthrough();
export type PublishGuidesResponsePayload = z.infer<
	typeof PublishGuidesResponsePayloadSchema
>;

export const EnumValues_typeofSortByEnum_Schema = z.enum([
	'CREATED_AT',
	'LAST_EDITED_AT',
	'LAST_PUBLISHED_AT',
]);
export type EnumValues_typeofSortByEnum_ = z.infer<
	typeof EnumValues_typeofSortByEnum_Schema
>;

export const SortByEnumSchema = EnumValues_typeofSortByEnum_Schema;
export type SortByEnum = z.infer<typeof SortByEnumSchema>;

export const EnumValues_typeofProjectTypeApiEnum_Schema = openEnum([
	'PROJECT',
	'COMPONENT',
]);
export type EnumValues_typeofProjectTypeApiEnum_ = z.infer<
	typeof EnumValues_typeofProjectTypeApiEnum_Schema
>;

/** The type of the ProjectApiResource being returned. */
export const ProjectTypeApiEnumSchema =
	EnumValues_typeofProjectTypeApiEnum_Schema;
export type ProjectTypeApiEnum = z.infer<typeof ProjectTypeApiEnumSchema>;

export const ProjectComputeProfileApiResourceSchema = z
	.object({
		kernelImage: z.string(),
		kernelSize: z.string(),
	})
	.passthrough();
export type ProjectComputeProfileApiResource = z.infer<
	typeof ProjectComputeProfileApiResourceSchema
>;

export const ScheduleApiResourceSchema = z
	.object({
		cadence: z.union([ScheduleCadenceApiEnumSchema, z.string()]),
		enabled: z.boolean(),
		hourly: z
			.object({
				timezone: TimezoneDesignatorSchema,
				minute: z.number().int().min(0).max(59),
			})
			.passthrough()
			.nullable(),
		daily: z
			.object({
				timezone: TimezoneDesignatorSchema,
				minute: z.number().int().min(0).max(59),
				hour: z.number().int().min(0).max(23),
			})
			.passthrough()
			.nullable(),
		weekly: z
			.object({
				timezone: TimezoneDesignatorSchema,
				minute: z.number().int().min(0).max(59),
				hour: z.number().int().min(0).max(23),
				dayOfWeek: z.union([DayOfWeekApiEnumSchema, z.string()]),
			})
			.passthrough()
			.nullable(),
		monthly: z
			.object({
				timezone: TimezoneDesignatorSchema,
				minute: z.number().int().min(0).max(59),
				hour: z.number().int().min(0).max(23),
				day: z.number().int().min(1).max(28),
			})
			.passthrough()
			.nullable(),
		custom: z
			.object({
				timezone: TimezoneDesignatorSchema,
				cron: z.string(),
			})
			.passthrough()
			.nullable(),
	})
	.passthrough();
export type ScheduleApiResource = z.infer<typeof ScheduleApiResourceSchema>;

export const EnumValues_typeofAccessLevelEnum_Schema = z.enum([
	'NONE',
	'APP_ONLY',
	'CAN_VIEW',
	'CAN_EDIT',
	'FULL_ACCESS',
]);
export type EnumValues_typeofAccessLevelEnum_ = z.infer<
	typeof EnumValues_typeofAccessLevelEnum_Schema
>;

/** Access level granted by sharing endpoints.
For projects, `CAN_VIEW` is the API value that corresponds to the UI permission labeled "Can explore".
`APP_ONLY` is the API value that corresponds to the UI permission labeled "Can view app". */
export const AccessLevelEnumSchema = EnumValues_typeofAccessLevelEnum_Schema;
export type AccessLevelEnum = z.infer<typeof AccessLevelEnumSchema>;

export const SharingResourceSchema = z
	.object({
		users: z.array(
			z
				.object({
					access: z.union([AccessLevelEnumSchema, z.string()]),
					user: z
						.object({
							email: z.string(),
						})
						.passthrough(),
				})
				.passthrough(),
		),
		collections: z.array(
			z
				.object({
					access: z.union([AccessLevelEnumSchema, z.string()]),
					collection: z
						.object({
							name: z.string(),
						})
						.passthrough(),
				})
				.passthrough(),
		),
		groups: z.array(
			z
				.object({
					access: z.union([AccessLevelEnumSchema, z.string()]),
					group: z
						.object({
							name: z.string(),
						})
						.passthrough(),
				})
				.passthrough(),
		),
		workspace: z
			.object({
				access: z.union([AccessLevelEnumSchema, z.string()]),
			})
			.passthrough(),
		publicWeb: z
			.object({
				access: z.union([AccessLevelEnumSchema, z.string()]),
			})
			.passthrough(),
		support: z
			.object({
				access: z.union([AccessLevelEnumSchema, z.string()]),
			})
			.passthrough(),
	})
	.passthrough();
export type SharingResource = z.infer<typeof SharingResourceSchema>;

export const ProjectApiResourceSchema = z
	.object({
		id: ProjectIdSchema,
		title: z.string(),
		description: z.string().nullable(),
		type: ProjectTypeApiEnumSchema,
		computeProfile: z
			.object({
				PUBLISHED: ProjectComputeProfileApiResourceSchema.optional(),
				LOGIC: ProjectComputeProfileApiResourceSchema,
			})
			.passthrough(),
		creator: z
			.object({
				email: z.string(),
			})
			.passthrough(),
		owner: z
			.object({
				email: z.string(),
			})
			.passthrough(),
		status: z
			.object({
				name: z.string(),
			})
			.passthrough()
			.nullable(),
		categories: z.array(
			z
				.object({
					description: z.string().nullable(),
					name: z.string(),
				})
				.passthrough(),
		),
		reviews: z
			.object({
				required: z.boolean(),
			})
			.passthrough(),
		analytics: z
			.object({
				publishedResultsUpdatedAt: TimestampSchema.nullable(),
				lastViewedAt: TimestampSchema.nullable(),
				appViews: z
					.object({
						lastThirtyDays: z.number().int(),
						lastFourteenDays: z.number().int(),
						lastSevenDays: z.number().int(),
						allTime: z.number().int(),
					})
					.passthrough(),
			})
			.passthrough(),
		lastEditedAt: TimestampSchema,
		lastPublishedAt: TimestampSchema.nullable(),
		createdAt: TimestampSchema,
		archivedAt: TimestampSchema.nullable(),
		trashedAt: TimestampSchema.nullable(),
		schedules: z.array(ScheduleApiResourceSchema),
		sharing: SharingResourceSchema.optional(),
		folderEntryId: z.string().nullable(),
	})
	.passthrough();
export type ProjectApiResource = z.infer<typeof ProjectApiResourceSchema>;

export const ProjectsListApiResourceSchema = z
	.object({
		values: z.array(ProjectApiResourceSchema),
		pagination: PaginationApiResourceSchema,
	})
	.passthrough();
export type ProjectsListApiResource = z.infer<
	typeof ProjectsListApiResourceSchema
>;

export const ProjectComputeProfileDetailsSchema = z
	.object({
		kernelImage: z.string(),
		kernelSize: z.string(),
	})
	.passthrough();
export type ProjectComputeProfileDetails = z.infer<
	typeof ProjectComputeProfileDetailsSchema
>;

export const ProjectComputeProfileSchema = z
	.object({
		LOGIC: ProjectComputeProfileDetailsSchema,
		PUBLISHED: ProjectComputeProfileDetailsSchema.optional(),
	})
	.passthrough();
export type ProjectComputeProfile = z.infer<typeof ProjectComputeProfileSchema>;

export const ProjectSharingSchema = z
	.object({
		users: z.array(
			z
				.object({
					user: z
						.object({
							email: z.string(),
						})
						.passthrough(),
					access: openEnum([
						'NONE',
						'APP_ONLY',
						'CAN_VIEW',
						'CAN_EDIT',
						'FULL_ACCESS',
					]),
				})
				.passthrough(),
		),
		collections: z.array(
			z
				.object({
					collection: z
						.object({
							name: z.string(),
						})
						.passthrough(),
					access: openEnum([
						'NONE',
						'APP_ONLY',
						'CAN_VIEW',
						'CAN_EDIT',
						'FULL_ACCESS',
					]),
				})
				.passthrough(),
		),
		groups: z.array(
			z
				.object({
					group: z
						.object({
							name: z.string(),
						})
						.passthrough(),
					access: openEnum([
						'NONE',
						'APP_ONLY',
						'CAN_VIEW',
						'CAN_EDIT',
						'FULL_ACCESS',
					]),
				})
				.passthrough(),
		),
		workspace: z
			.object({
				access: openEnum([
					'NONE',
					'APP_ONLY',
					'CAN_VIEW',
					'CAN_EDIT',
					'FULL_ACCESS',
				]),
			})
			.passthrough(),
		publicWeb: z
			.object({
				access: openEnum([
					'NONE',
					'APP_ONLY',
					'CAN_VIEW',
					'CAN_EDIT',
					'FULL_ACCESS',
				]),
			})
			.passthrough(),
		support: z
			.object({
				access: openEnum([
					'NONE',
					'APP_ONLY',
					'CAN_VIEW',
					'CAN_EDIT',
					'FULL_ACCESS',
				]),
			})
			.passthrough(),
	})
	.passthrough();
export type ProjectSharing = z.infer<typeof ProjectSharingSchema>;

export const ProjectSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		type: openEnum(['PROJECT', 'COMPONENT']),
		computeProfile: ProjectComputeProfileSchema,
		creator: z
			.object({
				email: z.string(),
			})
			.passthrough(),
		owner: z
			.object({
				email: z.string(),
			})
			.passthrough(),
		status: z
			.object({
				name: z.string(),
			})
			.passthrough()
			.nullable(),
		categories: z.array(
			z
				.object({
					name: z.string(),
					description: z.string().nullable(),
				})
				.passthrough(),
		),
		reviews: z
			.object({
				required: z.boolean(),
			})
			.passthrough(),
		analytics: z
			.object({
				appViews: z
					.object({
						allTime: z.number().int(),
						lastSevenDays: z.number().int(),
						lastFourteenDays: z.number().int(),
						lastThirtyDays: z.number().int(),
					})
					.passthrough(),
				lastViewedAt: z.string().nullable(),
				publishedResultsUpdatedAt: z.string().nullable(),
			})
			.passthrough(),
		lastEditedAt: z.string(),
		lastPublishedAt: z.string().nullable(),
		createdAt: z.string(),
		archivedAt: z.string().nullable(),
		trashedAt: z.string().nullable(),
		schedules: z.array(
			z
				.object({
					cadence: openEnum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']),
					enabled: z.boolean(),
					hourly: z
						.object({
							minute: z.number().int(),
							timezone: z.string(),
						})
						.passthrough()
						.nullable(),
					daily: z
						.object({
							hour: z.number().int(),
							minute: z.number().int(),
							timezone: z.string(),
						})
						.passthrough()
						.nullable(),
					weekly: z
						.object({
							dayOfWeek: openEnum([
								'SUNDAY',
								'MONDAY',
								'TUESDAY',
								'WEDNESDAY',
								'THURSDAY',
								'FRIDAY',
								'SATURDAY',
							]),
							hour: z.number().int(),
							minute: z.number().int(),
							timezone: z.string(),
						})
						.passthrough()
						.nullable(),
					monthly: z
						.object({
							day: z.number().int(),
							hour: z.number().int(),
							minute: z.number().int(),
							timezone: z.string(),
						})
						.passthrough()
						.nullable(),
					custom: z
						.object({
							cron: z.string(),
							timezone: z.string(),
						})
						.passthrough()
						.nullable(),
				})
				.passthrough(),
		),
		sharing: ProjectSharingSchema.optional(),
		folderEntryId: z.string().nullable(),
	})
	.passthrough();
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectQueriedTableResourceSchema = z
	.object({
		dataConnectionId: DataConnectionIdSchema,
		dataConnectionName: z.string(),
		tableName: z.string(),
	})
	.passthrough();
export type ProjectQueriedTableResource = z.infer<
	typeof ProjectQueriedTableResourceSchema
>;

export const ProjectQueriedTablesApiResourceSchema = z
	.object({
		values: z.array(ProjectQueriedTableResourceSchema),
		pagination: PaginationApiResourceSchema,
		traceId: z.string(),
	})
	.passthrough();
export type ProjectQueriedTablesApiResource = z.infer<
	typeof ProjectQueriedTablesApiResourceSchema
>;

export const NotificationRecipientSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		isPrivate: z.boolean().optional(),
	})
	.passthrough();
export type NotificationRecipient = z.infer<typeof NotificationRecipientSchema>;

export const ProjectRunNotificationRecipientSchema = z
	.object({
		type: openEnum(['SUCCESS', 'FAILURE', 'ALL']),
		subject: z.string().optional(),
		body: z.string().optional(),
		recipientType: openEnum(['USER', 'GROUP', 'SLACK_CHANNEL']),
		includeSuccessScreenshot: z.boolean(),
		screenshotFormat: z.array(openEnum(['png', 'pdf'])).optional(),
		recipient: NotificationRecipientSchema,
	})
	.passthrough();
export type ProjectRunNotificationRecipient = z.infer<
	typeof ProjectRunNotificationRecipientSchema
>;

export const ProjectRunStateEventSchema = z
	.object({
		type: z.string(),
		value: z.string(),
		timestamp: z.string(),
	})
	.passthrough();
export type ProjectRunStateEvent = z.infer<typeof ProjectRunStateEventSchema>;

export const ProjectRunSchema = z
	.object({
		projectId: z.string(),
		projectVersion: z.string(),
		runId: z.string(),
		runUrl: z.string(),
		status: openEnum([
			'PENDING',
			'RUNNING',
			'ERRORED',
			'COMPLETED',
			'KILLED',
			'UNABLE_TO_ALLOCATE_KERNEL',
		]),
		runTrigger: openEnum(['API', 'SCHEDULED', 'APP_REFRESH']),
		startTime: z.string().nullable(),
		endTime: z.string().nullable(),
		elapsedTime: z.number().nullable(),
		flagConfigOverride: z.string().optional(),
		traceId: z.string(),
		notifications: z.array(ProjectRunNotificationRecipientSchema).optional(),
		stateEvents: z.array(ProjectRunStateEventSchema).optional(),
	})
	.passthrough();
export type ProjectRun = z.infer<typeof ProjectRunSchema>;

export const ProjectRunNotificationSchema = z
	.object({
		type: z.enum(['SUCCESS', 'FAILURE', 'ALL']),
		includeSuccessScreenshot: z.boolean(),
		screenshotFormat: z.enum(['png', 'pdf']).optional(),
		slackChannelIds: z.array(z.string()).optional(),
		userIds: z.array(z.string()).optional(),
		groupIds: z.array(z.string()).optional(),
		subject: z.string().optional(),
		body: z.string().optional(),
	})
	.passthrough();
export type ProjectRunNotification = z.infer<
	typeof ProjectRunNotificationSchema
>;

export const RunProjectRequestBodySchema = z
	.object({
		// Published app input names and values are caller-defined serialized state.
		inputParams: z.record(z.string(), z.unknown()).optional(),
		dryRun: z.boolean().optional(),
		updateCache: z.boolean().optional(),
		notifications: z.array(ProjectRunNotificationSchema).optional(),
		updatePublishedResults: z.boolean().optional(),
		useCachedSqlResults: z.boolean().optional(),
		viewId: z.string().optional(),
	})
	.passthrough();
export type RunProjectRequestBody = z.infer<typeof RunProjectRequestBodySchema>;

/** Unique ID for a run of a Hex project. This ID is part of the response returned by the RunProject endpoint. The GetProjectRuns endpoint can also be used to find the specific runs for a project. */
export const InputRunIdSchema = z.string().uuid();
export type InputRunId = z.infer<typeof InputRunIdSchema>;

export const ShareProjectWithCollectionErrorSchema = z
	.object({
		collectionIds: z.array(CollectionIdSchema),
		reason: z.string(),
	})
	.passthrough();
export type ShareProjectWithCollectionError = z.infer<
	typeof ShareProjectWithCollectionErrorSchema
>;

export const EditProjectSharingCollectionsResponseSchema = z
	.object({
		project: ProjectApiResourceSchema,
		errors: z.array(ShareProjectWithCollectionErrorSchema).optional(),
	})
	.passthrough();
export type EditProjectSharingCollectionsResponse = z.infer<
	typeof EditProjectSharingCollectionsResponseSchema
>;

export const BatchUpdateComputeProfileProjectSchema = z
	.object({
		projectId: z.string(),
		kernelImage: z.string().nullable(),
		kernelSize: z.string().nullable(),
	})
	.passthrough();
export type BatchUpdateComputeProfileProject = z.infer<
	typeof BatchUpdateComputeProfileProjectSchema
>;

/** Unique ID for a Hex semantic project. This can be found from the semantic
projects admin panel (in Settings). */
export const SemanticProjectIdSchema = z.string().uuid();
export type SemanticProjectId = z.infer<typeof SemanticProjectIdSchema>;

/** A single update for a semantic object (dataset or view)
Currently, only status updates are supported. */
export const SemanticObjectUpdateSchema = z
	.object({
		type: z.enum(['DATASET', 'VIEW']),
		name: z.string(),
		status: z.string().nullable(),
	})
	.passthrough();
export type SemanticObjectUpdate = z.infer<typeof SemanticObjectUpdateSchema>;

/** Request body for updating semantic datasets and views
Currently, only status updates are supported. */
export const UpdateSemanticProjectRequestSchema = z
	.object({
		updates: z.array(SemanticObjectUpdateSchema),
	})
	.passthrough();
export type UpdateSemanticProjectRequest = z.infer<
	typeof UpdateSemanticProjectRequestSchema
>;

/** Response body for successful status updates */
export const UpdateSemanticProjectResponseSchema = z
	.object({
		updated: z
			.object({
				views: z.array(
					z
						.object({
							status: z.string().nullable(),
							name: z.string(),
						})
						.passthrough(),
				),
				datasets: z.array(
					z
						.object({
							status: z.string().nullable(),
							name: z.string(),
						})
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export type UpdateSemanticProjectResponse = z.infer<
	typeof UpdateSemanticProjectResponseSchema
>;

export const ProblemSeveritySchema = z.enum(['fatal', 'error', 'warning']);
export type ProblemSeverity = z.infer<typeof ProblemSeveritySchema>;

export const ProblemMessageSchema = z.string();
export type ProblemMessage = z.infer<typeof ProblemMessageSchema>;

export const ProblemKeyPathSchema = z.array(z.union([z.string(), z.number()]));
export type ProblemKeyPath = z.infer<typeof ProblemKeyPathSchema>;

/** A problem encountered during the import of a public HexSL project. */
export const HexSLTypes_PublicProblemSchema = z
	.object({
		severity: ProblemSeveritySchema,
		message: ProblemMessageSchema,
		cause_paths: z.array(ProblemKeyPathSchema),
		impact_paths: z.array(ProblemKeyPathSchema),
		validated_by_json_schema: z.boolean().optional(),
	})
	.passthrough();
export type HexSLTypes_PublicProblem = z.infer<
	typeof HexSLTypes_PublicProblemSchema
>;

export const HexSLProblemWithDisplaySchema = z.intersection(
	HexSLTypes_PublicProblemSchema,
	z
		.object({
			display: z.string(),
		})
		.passthrough(),
);
export type HexSLProblemWithDisplay = z.infer<
	typeof HexSLProblemWithDisplaySchema
>;

/** Construct a type with a set of properties K of type T */
export const Record_string_Record_string_HexSLTypes_DataType__Schema = z
	.object({})
	.passthrough();
export type Record_string_Record_string_HexSLTypes_DataType__ = z.infer<
	typeof Record_string_Record_string_HexSLTypes_DataType__Schema
>;

export const MetricflowModelSchemasSchema =
	Record_string_Record_string_HexSLTypes_DataType__Schema;
export type MetricflowModelSchemas = z.infer<
	typeof MetricflowModelSchemasSchema
>;

export const SemanticProjectsSyncResponsePayloadSchema = z
	.object({
		traceId: z.string(),
		contents: z.array(z.string()),
		warnings: z.array(z.string()).optional(),
		skipped: z.object({}).passthrough().optional(),
		problems: z.array(HexSLProblemWithDisplaySchema).optional(),
		debug: z
			.object({
				metricflowModelSchemas: MetricflowModelSchemasSchema.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type SemanticProjectsSyncResponsePayload = z.infer<
	typeof SemanticProjectsSyncResponsePayloadSchema
>;

export const ReviewAgentStatusSchema = openEnum([
	'RUNNING',
	'COMPLETED',
	'NO_OP',
	'FAILED',
]);
export type ReviewAgentStatus = z.infer<typeof ReviewAgentStatusSchema>;

export const SuggestionProposedChangeSchema = z
	.object({
		updateType: openEnum(['FILE_UPDATE', 'DATA_WAREHOUSE_UPDATE']),
	})
	.passthrough();
export type SuggestionProposedChange = z.infer<
	typeof SuggestionProposedChangeSchema
>;

export const SuggestionInspectionSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		summary: z.string(),
		status: openEnum([
			'OPEN',
			'COMPLETED',
			'DISMISSED',
			'IN_PROGRESS',
			'RESOLVED',
		]),
		createdDate: z.string(),
		lastSourceAddedDate: z.string().nullable(),
		reviewAgentStatus: ReviewAgentStatusSchema.nullable(),
		latestReview: z
			.object({
				id: z.string(),
				status: openEnum(['RUNNING', 'COMPLETED', 'NO_OP', 'FAILED']),
				startedAt: z.string(),
			})
			.passthrough()
			.nullable(),
		sources: z.array(
			z
				.object({
					id: z.string(),
					sourceType: openEnum([
						'THREAD_WARNING',
						'USER_REPORT',
						'USER_CONTEXT_EXHAUST',
					]),
					threadId: z.string(),
					agentChatThread: z
						.object({
							id: z.string(),
							title: z.string().nullable(),
							user: z
								.object({
									id: z.string(),
									name: z.string().nullable(),
								})
								.passthrough()
								.nullable(),
							intent: z.string().nullable(),
						})
						.passthrough(),
					threadTitle: z.string(),
					threadUrl: z.string(),
					createdAt: z.string(),
					agentChatMessageId: z.string().nullable(),
					warning: z
						.object({
							id: z.string(),
							type: openEnum([
								'agent_caveat',
								'user_doubt',
								'missing_context',
								'other',
							]),
							summary: z.string(),
							reasoning: z.string(),
							suggestedContext: z.string(),
						})
						.passthrough()
						.nullable(),
					userReport: z
						.object({
							selectedReason: z.string().nullable(),
							userComment: z.string().nullable(),
						})
						.passthrough()
						.nullable(),
					verifiedUserContext: z.array(z.string()).nullable(),
				})
				.passthrough(),
		),
		unavailableSourceCount: z.number().int().min(0),
		nextCursor: z.string().nullable(),
		proposedChanges: z.array(SuggestionProposedChangeSchema),
		reviewCoverage: z.string(),
	})
	.passthrough();
export type SuggestionInspection = z.infer<typeof SuggestionInspectionSchema>;

// ── Endpoint Input and Output Schemas ─────────────────────────────────────────

export const adminListAgentUsageInputSchema = z
	.object({
		startingAt: z.string().nullable().optional(),
		endingAt: z.string().nullable().optional(),
		userIds: z.string().nullable().optional(),
		threadIds: z.string().nullable().optional(),
		limit: z.number().min(1).max(500).optional(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
	})
	.strict();
export type AdminListAgentUsageInput = z.infer<
	typeof adminListAgentUsageInputSchema
>;

export const adminListAgentUsageOutputSchema = z
	.object({
		runs: z.array(AgentUsageRunSchema),
		pagination: PaginationSchema,
	})
	.passthrough();
export type AdminListAgentUsageOutput = z.infer<
	typeof adminListAgentUsageOutputSchema
>;

export const cellsListInputSchema = z
	.object({
		projectId: z.string(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().min(1).max(100).optional(),
	})
	.strict();
export type CellsListInput = z.infer<typeof cellsListInputSchema>;

export const cellsListOutputSchema = z
	.object({
		values: z.array(
			z
				.object({
					id: z.string(),
					staticId: z.string(),
					cellType: openEnum([
						'CODE',
						'MARKDOWN',
						'DISPLAY_TABLE',
						'INPUT',
						'SQL',
						'VEGA_CHART',
						'CELL_GROUP',
						'METRIC',
						'TEXT',
						'MAP',
						'WRITEBACK',
						'DBT_METRIC',
						'PIVOT',
						'FILTER',
						'COMPONENT_IMPORT',
						'CHART',
						'BLOCK',
						'EXPLORE',
						'COLLAPSIBLE',
					]),
					label: z.string().nullable(),
					dataConnectionId: z.string().nullable(),
					contents: z
						.object({
							codeCell: z
								.object({
									source: z.string(),
								})
								.passthrough()
								.nullable(),
							sqlCell: z
								.object({
									source: z.string(),
									outputDataframe: z.string(),
								})
								.passthrough()
								.nullable(),
							markdownCell: z
								.object({
									source: z.string(),
								})
								.passthrough()
								.nullable(),
						})
						.passthrough(),
					projectId: z.string(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type CellsListOutput = z.infer<typeof cellsListOutputSchema>;

export const cellsCreateInputSchema = z
	.object({
		projectId: z.string(),
		cellType: z.enum(['CODE', 'SQL', 'MARKDOWN']),
		label: z.string().optional(),
		contents: z.union([
			z
				.object({
					codeCell: z
						.object({
							source: z.string(),
						})
						.strict(),
				})
				.strict(),
			z
				.object({
					sqlCell: z
						.object({
							source: z.string(),
							dataConnectionId: z.string().optional(),
							isDataframeSql: z.boolean().optional(),
							outputDataframe: z.string().optional(),
						})
						.strict(),
				})
				.strict(),
			z
				.object({
					markdownCell: z
						.object({
							source: z.string(),
						})
						.strict(),
				})
				.strict(),
		]),
		location: z
			.object({
				insertAfterCellId: z.string().optional(),
				parentCellId: z.string().optional(),
				childPosition: z.enum(['FIRST', 'LAST']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export type CellsCreateInput = z.infer<typeof cellsCreateInputSchema>;

export const cellsCreateOutputSchema = z
	.object({
		id: z.string(),
		staticId: z.string(),
		cellType: openEnum([
			'CODE',
			'MARKDOWN',
			'DISPLAY_TABLE',
			'INPUT',
			'SQL',
			'VEGA_CHART',
			'CELL_GROUP',
			'METRIC',
			'TEXT',
			'MAP',
			'WRITEBACK',
			'DBT_METRIC',
			'PIVOT',
			'FILTER',
			'COMPONENT_IMPORT',
			'CHART',
			'BLOCK',
			'EXPLORE',
			'COLLAPSIBLE',
		]),
		label: z.string().nullable(),
		dataConnectionId: z.string().nullable(),
		contents: z
			.object({
				codeCell: z
					.object({
						source: z.string(),
					})
					.passthrough()
					.nullable(),
				sqlCell: z
					.object({
						source: z.string(),
						outputDataframe: z.string(),
					})
					.passthrough()
					.nullable(),
				markdownCell: z
					.object({
						source: z.string(),
					})
					.passthrough()
					.nullable(),
			})
			.passthrough(),
		projectId: z.string(),
	})
	.passthrough();
export type CellsCreateOutput = z.infer<typeof cellsCreateOutputSchema>;

export const cellsDeleteInputSchema = z
	.object({
		cellId: z.string(),
	})
	.strict();
export type CellsDeleteInput = z.infer<typeof cellsDeleteInputSchema>;

export const cellsDeleteOutputSchema = z
	.object({
		cellId: z.string(),
	})
	.passthrough();
export type CellsDeleteOutput = z.infer<typeof cellsDeleteOutputSchema>;

export const cellsGetInputSchema = z
	.object({
		cellId: z.string(),
	})
	.strict();
export type CellsGetInput = z.infer<typeof cellsGetInputSchema>;

export const cellsGetOutputSchema = z
	.object({
		id: z.string(),
		staticId: z.string(),
		cellType: openEnum([
			'CODE',
			'MARKDOWN',
			'DISPLAY_TABLE',
			'INPUT',
			'SQL',
			'VEGA_CHART',
			'CELL_GROUP',
			'METRIC',
			'TEXT',
			'MAP',
			'WRITEBACK',
			'DBT_METRIC',
			'PIVOT',
			'FILTER',
			'COMPONENT_IMPORT',
			'CHART',
			'BLOCK',
			'EXPLORE',
			'COLLAPSIBLE',
		]),
		label: z.string().nullable(),
		dataConnectionId: z.string().nullable(),
		contents: z
			.object({
				codeCell: z
					.object({
						source: z.string(),
					})
					.passthrough()
					.nullable(),
				sqlCell: z
					.object({
						source: z.string(),
						outputDataframe: z.string(),
					})
					.passthrough()
					.nullable(),
				markdownCell: z
					.object({
						source: z.string(),
					})
					.passthrough()
					.nullable(),
			})
			.passthrough(),
		projectId: z.string(),
	})
	.passthrough();
export type CellsGetOutput = z.infer<typeof cellsGetOutputSchema>;

export const cellsUpdateInputSchema = z
	.object({
		cellId: z.string(),
		dataConnectionId: z.string().nullable().optional(),
		contents: z
			.object({
				codeCell: z
					.object({
						source: z.string(),
					})
					.strict()
					.optional(),
				sqlCell: z
					.object({
						source: z.string(),
						outputDataframe: z.string().optional(),
					})
					.strict()
					.optional(),
				markdownCell: z
					.object({
						source: z.string(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export type CellsUpdateInput = z.infer<typeof cellsUpdateInputSchema>;

export const cellsUpdateOutputSchema = z
	.object({
		id: z.string(),
		staticId: z.string(),
		cellType: openEnum([
			'CODE',
			'MARKDOWN',
			'DISPLAY_TABLE',
			'INPUT',
			'SQL',
			'VEGA_CHART',
			'CELL_GROUP',
			'METRIC',
			'TEXT',
			'MAP',
			'WRITEBACK',
			'DBT_METRIC',
			'PIVOT',
			'FILTER',
			'COMPONENT_IMPORT',
			'CHART',
			'BLOCK',
			'EXPLORE',
			'COLLAPSIBLE',
		]),
		label: z.string().nullable(),
		dataConnectionId: z.string().nullable(),
		contents: z
			.object({
				codeCell: z
					.object({
						source: z.string(),
					})
					.passthrough()
					.nullable(),
				sqlCell: z
					.object({
						source: z.string(),
						outputDataframe: z.string(),
					})
					.passthrough()
					.nullable(),
				markdownCell: z
					.object({
						source: z.string(),
					})
					.passthrough()
					.nullable(),
			})
			.passthrough(),
		projectId: z.string(),
	})
	.passthrough();
export type CellsUpdateOutput = z.infer<typeof cellsUpdateOutputSchema>;

export const cellsGetChartImageInputSchema = z
	.object({
		cellId: z.string(),
		width: z.number().int().min(100).max(2000).optional(),
		height: z.number().int().min(100).max(2000).optional(),
		includeTitle: z.boolean().optional(),
	})
	.strict();
export type CellsGetChartImageInput = z.infer<
	typeof cellsGetChartImageInputSchema
>;

export const cellsGetChartImageOutputSchema = z
	.object({
		cellId: z.string(),
		imageBase64: z.string(),
		mimeType: z.string(),
	})
	.passthrough();
export type CellsGetChartImageOutput = z.infer<
	typeof cellsGetChartImageOutputSchema
>;

export const cellsGetOutputInputSchema = z
	.object({
		cellId: z.string(),
	})
	.strict();
export type CellsGetOutputInput = z.infer<typeof cellsGetOutputInputSchema>;

export const cellsGetOutputOutputSchema = z
	.object({
		projectId: z.string(),
		runId: z.string(),
		cell: z
			.object({
				id: z.string(),
				staticId: z.string(),
				cellType: openEnum([
					'CODE',
					'MARKDOWN',
					'DISPLAY_TABLE',
					'INPUT',
					'SQL',
					'VEGA_CHART',
					'CELL_GROUP',
					'METRIC',
					'TEXT',
					'MAP',
					'WRITEBACK',
					'DBT_METRIC',
					'PIVOT',
					'FILTER',
					'COMPONENT_IMPORT',
					'CHART',
					'BLOCK',
					'EXPLORE',
					'COLLAPSIBLE',
				]),
			})
			.passthrough(),
		result: z.union([
			z
				.object({
					type: z.literal('table'),
					rowLimit: z.number(),
					rowsReturned: z.number(),
					totalRows: z.number().nullable(),
					totalRowsKind: openEnum(['EXACT', 'LOWER_BOUND', 'UNKNOWN']),
					truncated: z.boolean(),
					columns: z.array(
						z
							.object({
								name: z.string(),
								type: z.string(),
							})
							.passthrough(),
					),
					rows: z.array(z.object({}).passthrough()),
				})
				.passthrough(),
			z
				.object({
					type: z.literal('cell_run_error'),
					message: z.string(),
					traceback: z.string().nullable(),
				})
				.passthrough(),
			// A result type Hex adds later still parses; known types keep literal tags for
			// narrowing, and a known type with bad fields still fails.
			z
				.object({
					type: z
						.string()
						.refine((t) => !['table', 'cell_run_error'].includes(t)),
				})
				.passthrough(),
		]),
	})
	.passthrough();
export type CellsGetOutputOutput = z.infer<typeof cellsGetOutputOutputSchema>;

export const collectionsListInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: PageSizeSchema.optional(),
		sortBy: ListCollectionsSortByEnumSchema.optional(),
	})
	.strict();
export type CollectionsListInput = z.infer<typeof collectionsListInputSchema>;

export const collectionsListOutputSchema = ListCollectionsResponseSchema;
export type CollectionsListOutput = z.infer<typeof collectionsListOutputSchema>;

export const collectionsCreateInputSchema = z
	.object({
		sharing: CollectionApiResourceSharingSchema.optional(),
		description: z.string().optional(),
		name: z.string(),
	})
	.strict();
export type CollectionsCreateInput = z.infer<
	typeof collectionsCreateInputSchema
>;

export const collectionsCreateOutputSchema = CollectionApiResourceSchema;
export type CollectionsCreateOutput = z.infer<
	typeof collectionsCreateOutputSchema
>;

export const collectionsGetInputSchema = z
	.object({
		collectionId: CollectionIdSchema,
	})
	.strict();
export type CollectionsGetInput = z.infer<typeof collectionsGetInputSchema>;

export const collectionsGetOutputSchema = CollectionApiResourceSchema;
export type CollectionsGetOutput = z.infer<typeof collectionsGetOutputSchema>;

export const collectionsUpdateInputSchema = z
	.object({
		collectionId: CollectionIdSchema,
		sharing: z
			.object({
				upsert: CollectionApiResourceSharingSchema.optional(),
			})
			.strict()
			.optional(),
		description: z.string().optional(),
		name: NameSchema.optional(),
	})
	.strict();
export type CollectionsUpdateInput = z.infer<
	typeof collectionsUpdateInputSchema
>;

export const collectionsUpdateOutputSchema = CollectionApiResourceSchema;
export type CollectionsUpdateOutput = z.infer<
	typeof collectionsUpdateOutputSchema
>;

export const adminListTopicsInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().min(1).max(100).optional(),
	})
	.strict();
export type AdminListTopicsInput = z.infer<typeof adminListTopicsInputSchema>;

export const adminListTopicsOutputSchema = z
	.object({
		topics: z.array(
			z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type AdminListTopicsOutput = z.infer<typeof adminListTopicsOutputSchema>;

export const adminListCreditGrantsInputSchema = z
	.object({
		startingAt: z.string().nullable().optional(),
		endingAt: z.string().nullable().optional(),
		limit: z.number().min(1).max(500).optional(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
	})
	.strict();
export type AdminListCreditGrantsInput = z.infer<
	typeof adminListCreditGrantsInputSchema
>;

export const adminListCreditGrantsOutputSchema = z
	.object({
		creditGrants: z.array(CreditGrantSchema),
		pagination: PaginationSchema,
	})
	.passthrough();
export type AdminListCreditGrantsOutput = z.infer<
	typeof adminListCreditGrantsOutputSchema
>;

export const dataConnectionsListInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().min(1).max(100).optional(),
		sortBy: z.enum(['NAME', 'CREATED_AT']).optional(),
		sortDirection: z.enum(['ASC', 'DESC']).optional(),
	})
	.strict();
export type DataConnectionsListInput = z.infer<
	typeof dataConnectionsListInputSchema
>;

export const dataConnectionsListOutputSchema = z
	.object({
		values: z.array(z.union([DataConnectionSchema, DataConnectionBasicSchema])),
		pagination: PaginationSchema,
	})
	.passthrough();
export type DataConnectionsListOutput = z.infer<
	typeof dataConnectionsListOutputSchema
>;

export const dataConnectionsCreateInputSchema = z
	.object({
		sharing: z
			.object({
				workspace: z
					.object({
						public: DataConnectionPublicSharingAccessLevelEnumSchema.optional(),
						guests: DataConnectionSharingAccessLevelEnumSchema.optional(),
						members: DataConnectionSharingAccessLevelEnumSchema.optional(),
					})
					.strict()
					.optional(),
				groups: z
					.array(
						z
							.object({
								access: DataConnectionSharingAccessLevelEnumSchema,
								group: z
									.object({
										id: GroupIdSchema,
									})
									.strict(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict()
			.optional(),
		schemaRefreshAccess: DataConnectionSchemaRefreshAccessSchema.optional(),
		schemaRefreshSchedule: SchemaRefreshScheduleApiResourceSchema.optional(),
		schemaFilters: z
			.object({
				tables: SchemaEntityFilterSchema.optional(),
				schemas: SchemaEntityFilterSchema.optional(),
				databases: SchemaEntityFilterSchema.optional(),
			})
			.strict()
			.optional(),
		sensitivity: z
			.object({
				configured: z.boolean(),
			})
			.strict()
			.optional(),
		allowWritebackCells: z.boolean().optional(),
		includeMagic: z.boolean().optional(),
		connectViaSsh: z.boolean().optional(),
		description: z.string().optional(),
		connectionDetails: CreateConnectionDetailsSchema,
		type: DataConnectionApiTypeSchema,
		name: NameSchema,
	})
	.strict();
export type DataConnectionsCreateInput = z.infer<
	typeof dataConnectionsCreateInputSchema
>;

export const dataConnectionsCreateOutputSchema =
	DataConnectionWithSensitiveFieldsApiResourceSchema;
export type DataConnectionsCreateOutput = z.infer<
	typeof dataConnectionsCreateOutputSchema
>;

export const dataConnectionsGetInputSchema = z
	.object({
		dataConnectionId: z.string(),
	})
	.strict();
export type DataConnectionsGetInput = z.infer<
	typeof dataConnectionsGetInputSchema
>;

export const dataConnectionsGetOutputSchema = DataConnectionSchema;
export type DataConnectionsGetOutput = z.infer<
	typeof dataConnectionsGetOutputSchema
>;

export const dataConnectionsUpdateInputSchema = z
	.object({
		dataConnectionId: DataConnectionIdSchema,
		sharing: z
			.object({
				workspace: z
					.object({
						public: DataConnectionPublicSharingAccessLevelEnumSchema.optional(),
						guests: DataConnectionSharingAccessLevelEnumSchema.optional(),
						members: DataConnectionSharingAccessLevelEnumSchema.optional(),
					})
					.strict()
					.optional(),
				groups: z
					.object({
						upsert: z
							.array(
								z
									.object({
										access: DataConnectionSharingAccessLevelEnumSchema,
										group: z
											.object({
												id: GroupIdSchema,
											})
											.strict(),
									})
									.strict(),
							)
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		schemaRefreshAccess: DataConnectionSchemaRefreshAccessSchema.optional(),
		schemaRefreshSchedule:
			SchemaRefreshScheduleApiResourceSchema.nullable().optional(),
		schemaFilters: z
			.object({
				tables: SchemaEntityFilterSchema.optional(),
				schemas: SchemaEntityFilterSchema.optional(),
				databases: SchemaEntityFilterSchema.optional(),
			})
			.strict()
			.optional(),
		sensitivity: z
			.object({
				configured: z.boolean(),
			})
			.strict()
			.optional(),
		allowWritebackCells: z.boolean().optional(),
		includeMagic: z.boolean().optional(),
		connectViaSsh: z.boolean().optional(),
		description: z.string().optional(),
		connectionDetails: EditConnectionDetailsSchema.optional(),
		name: z.string().optional(),
	})
	.strict();
export type DataConnectionsUpdateInput = z.infer<
	typeof dataConnectionsUpdateInputSchema
>;

export const dataConnectionsUpdateOutputSchema =
	DataConnectionWithSensitiveFieldsApiResourceSchema;
export type DataConnectionsUpdateOutput = z.infer<
	typeof dataConnectionsUpdateOutputSchema
>;

export const dataConnectionsUpdateSchemaInputSchema = z
	.object({
		dataConnectionId: DataConnectionIdSchema,
		updates: z.array(SchemaObjectUpdateSchema),
	})
	.strict();
export type DataConnectionsUpdateSchemaInput = z.infer<
	typeof dataConnectionsUpdateSchemaInputSchema
>;

export const dataConnectionsUpdateSchemaOutputSchema =
	UpdateDataConnectionSchemaResponseSchema;
export type DataConnectionsUpdateSchemaOutput = z.infer<
	typeof dataConnectionsUpdateSchemaOutputSchema
>;

export const embeddingCreatePresignedUrlInputSchema = z
	.object({
		projectId: ProjectIdSchema,
		hexUserAttributes: z.record(z.string(), z.string()).optional(),
		scope: z.array(z.string()).optional(),
		// Hex input names and values are caller-defined serialized app state.
		inputParameters: z.record(z.string(), z.unknown()).optional(),
		expiresIn: z.number().optional(),
		displayOptions: z
			.object({
				theme: z.enum(['light', 'dark']).optional(),
				showEmbeddedRunButton: z.boolean().optional(),
				noEmbedHeaderPadding: z.boolean().optional(),
				noEmbedBasePadding: z.boolean().optional(),
				noEmbedOutline: z.boolean().optional(),
				noEmbedFooter: z.boolean().optional(),
			})
			.strict()
			.optional(),
		testMode: z.boolean().optional(),
	})
	.strict();
export type EmbeddingCreatePresignedUrlInput = z.infer<
	typeof embeddingCreatePresignedUrlInputSchema
>;

export const embeddingCreatePresignedUrlOutputSchema = EmbeddingResponseSchema;
export type EmbeddingCreatePresignedUrlOutput = z.infer<
	typeof embeddingCreatePresignedUrlOutputSchema
>;

export const groupsListInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: LargerPageSizeSchema.optional(),
		sortBy: ListGroupsSortByEnumSchema.optional(),
		sortDirection: SortDirectionEnumSchema.optional(),
		userId: z.string().optional(),
	})
	.strict();
export type GroupsListInput = z.infer<typeof groupsListInputSchema>;

export const groupsListOutputSchema = ListGroupsResponseSchema;
export type GroupsListOutput = z.infer<typeof groupsListOutputSchema>;

export const groupsCreateInputSchema = z
	.object({
		members: GroupMembersSchema.optional(),
		name: NameSchema,
	})
	.strict();
export type GroupsCreateInput = z.infer<typeof groupsCreateInputSchema>;

export const groupsCreateOutputSchema = CreateGroupResponseSchema;
export type GroupsCreateOutput = z.infer<typeof groupsCreateOutputSchema>;

export const groupsDeleteInputSchema = z
	.object({
		groupId: GroupIdSchema,
	})
	.strict();
export type GroupsDeleteInput = z.infer<typeof groupsDeleteInputSchema>;

export const groupsDeleteOutputSchema = z.void();
export type GroupsDeleteOutput = z.infer<typeof groupsDeleteOutputSchema>;

export const groupsGetInputSchema = z
	.object({
		groupId: GroupIdSchema,
	})
	.strict();
export type GroupsGetInput = z.infer<typeof groupsGetInputSchema>;

export const groupsGetOutputSchema = GroupApiResourceSchema;
export type GroupsGetOutput = z.infer<typeof groupsGetOutputSchema>;

export const groupsUpdateInputSchema = z
	.object({
		groupId: GroupIdSchema,
		members: z
			.object({
				remove: GroupMembersSchema.optional(),
				add: GroupMembersSchema.optional(),
			})
			.strict()
			.optional(),
		name: NameSchema.optional(),
	})
	.strict();
export type GroupsUpdateInput = z.infer<typeof groupsUpdateInputSchema>;

export const groupsUpdateOutputSchema = GroupApiResourceSchema;
export type GroupsUpdateOutput = z.infer<typeof groupsUpdateOutputSchema>;

export const guidesUpsertDraftInputSchema = z
	.object({
		forceWrite: z.boolean().optional(),
		files: z.array(
			z
				.object({
					externalSource: ExternalContextSourceInputSchema.optional(),
					contents: z.string().max(100000),
					filePath: z.string(),
				})
				.strict(),
		),
	})
	.strict();
export type GuidesUpsertDraftInput = z.infer<
	typeof guidesUpsertDraftInputSchema
>;

export const guidesUpsertDraftOutputSchema =
	UpsertGuideDraftResponsePayloadSchema;
export type GuidesUpsertDraftOutput = z.infer<
	typeof guidesUpsertDraftOutputSchema
>;

export const guidesDeleteDraftInputSchema = z
	.object({
		orgGuideFileId: OrgGuideFileIdSchema,
	})
	.strict();
export type GuidesDeleteDraftInput = z.infer<
	typeof guidesDeleteDraftInputSchema
>;

export const guidesDeleteDraftOutputSchema = z.void();
export type GuidesDeleteDraftOutput = z.infer<
	typeof guidesDeleteDraftOutputSchema
>;

export const guidesListDraftsInputSchema = z
	.object({
		limit: z.number().min(1).max(100).optional(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		externalSource: z.string().nullable().optional(),
	})
	.strict();
export type GuidesListDraftsInput = z.infer<typeof guidesListDraftsInputSchema>;

export const guidesListDraftsOutputSchema = z
	.object({
		values: z.array(
			z
				.object({
					id: z.string(),
					filePath: z.string(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type GuidesListDraftsOutput = z.infer<
	typeof guidesListDraftsOutputSchema
>;

export const guidesPublishInputSchema = z
	.object({
		orgGuideFileIds: z.array(OrgGuideFileIdSchema).optional(),
		publishAllDraftGuides: z.boolean().optional(),
	})
	.strict();
export type GuidesPublishInput = z.infer<typeof guidesPublishInputSchema>;

export const guidesPublishOutputSchema = PublishGuidesResponsePayloadSchema;
export type GuidesPublishOutput = z.infer<typeof guidesPublishOutputSchema>;

export const projectsListInputSchema = z
	.object({
		includeArchived: z.boolean().optional(),
		includeComponents: z.boolean().optional(),
		includeTrashed: z.boolean().optional(),
		includeUnlisted: z.boolean().optional(),
		includeSharing: z.boolean().optional(),
		statuses: z.array(z.string()).optional(),
		categories: z.array(z.string()).optional(),
		creatorEmail: z.string().optional(),
		ownerEmail: z.string().optional(),
		collectionId: z.string().optional(),
		limit: PageSizeSchema.optional(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		sortBy: SortByEnumSchema.optional(),
		sortDirection: SortDirectionEnumSchema.optional(),
	})
	.strict();
export type ProjectsListInput = z.infer<typeof projectsListInputSchema>;

export const projectsListOutputSchema = ProjectsListApiResourceSchema;
export type ProjectsListOutput = z.infer<typeof projectsListOutputSchema>;

export const projectsCreateInputSchema = z
	.object({
		title: z.string(),
		description: z.string().optional(),
	})
	.strict();
export type ProjectsCreateInput = z.infer<typeof projectsCreateInputSchema>;

export const projectsCreateOutputSchema = ProjectSchema;
export type ProjectsCreateOutput = z.infer<typeof projectsCreateOutputSchema>;

export const projectsGetInputSchema = z
	.object({
		projectId: z.string(),
		includeSharing: z.boolean().optional(),
		includeUnlisted: z.boolean().optional(),
	})
	.strict();
export type ProjectsGetInput = z.infer<typeof projectsGetInputSchema>;

export const projectsGetOutputSchema = ProjectSchema;
export type ProjectsGetOutput = z.infer<typeof projectsGetOutputSchema>;

export const projectsUpdateInputSchema = z
	.object({
		projectId: z.string(),
		status: z.string().nullable().optional(),
	})
	.strict();
export type ProjectsUpdateInput = z.infer<typeof projectsUpdateInputSchema>;

export const projectsUpdateOutputSchema = ProjectSchema;
export type ProjectsUpdateOutput = z.infer<typeof projectsUpdateOutputSchema>;

export const projectsGetQueriedTablesInputSchema = z
	.object({
		projectId: ProjectIdSchema,
		limit: PageSizeSchema.optional(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
	})
	.strict();
export type ProjectsGetQueriedTablesInput = z.infer<
	typeof projectsGetQueriedTablesInputSchema
>;

export const projectsGetQueriedTablesOutputSchema =
	ProjectQueriedTablesApiResourceSchema;
export type ProjectsGetQueriedTablesOutput = z.infer<
	typeof projectsGetQueriedTablesOutputSchema
>;

export const projectRunsListInputSchema = z
	.object({
		projectId: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		statusFilter: z
			.enum([
				'PENDING',
				'RUNNING',
				'ERRORED',
				'COMPLETED',
				'KILLED',
				'UNABLE_TO_ALLOCATE_KERNEL',
			])
			.optional(),
		runTriggerFilter: z
			.enum(['SCHEDULED', 'API', 'APP_REFRESH', 'ALL'])
			.optional(),
	})
	.strict();
export type ProjectRunsListInput = z.infer<typeof projectRunsListInputSchema>;

export const projectRunsListOutputSchema = z
	.object({
		runs: z.array(ProjectRunSchema),
		nextPage: z.string().nullable(),
		previousPage: z.string().nullable(),
		traceId: z.string(),
	})
	.passthrough();
export type ProjectRunsListOutput = z.infer<typeof projectRunsListOutputSchema>;

export const projectRunsRunInputSchema = z
	.object({
		projectId: z.string(),
		// Published app input names and values are caller-defined serialized state.
		inputParams: z.record(z.string(), z.unknown()).optional(),
		dryRun: z.boolean().optional(),
		updateCache: z.boolean().optional(),
		notifications: z.array(ProjectRunNotificationSchema).optional(),
		updatePublishedResults: z.boolean().optional(),
		useCachedSqlResults: z.boolean().optional(),
		viewId: z.string().optional(),
	})
	.strict();
export type ProjectRunsRunInput = z.infer<typeof projectRunsRunInputSchema>;

export const projectRunsRunOutputSchema = z
	.object({
		projectId: z.string(),
		runId: z.string(),
		runUrl: z.string(),
		runStatusUrl: z.string(),
		traceId: z.string(),
		projectVersion: z.number().int(),
		notifications: z.array(ProjectRunNotificationRecipientSchema).optional(),
	})
	.passthrough();
export type ProjectRunsRunOutput = z.infer<typeof projectRunsRunOutputSchema>;

export const projectRunsCancelInputSchema = z
	.object({
		projectId: ProjectIdSchema,
		runId: InputRunIdSchema,
	})
	.strict();
export type ProjectRunsCancelInput = z.infer<
	typeof projectRunsCancelInputSchema
>;

export const projectRunsCancelOutputSchema = z.void();
export type ProjectRunsCancelOutput = z.infer<
	typeof projectRunsCancelOutputSchema
>;

export const projectRunsGetStatusInputSchema = z
	.object({
		projectId: z.string(),
		runId: z.string(),
		enableExpandedStats: z.string().optional(),
	})
	.strict();
export type ProjectRunsGetStatusInput = z.infer<
	typeof projectRunsGetStatusInputSchema
>;

export const projectRunsGetStatusOutputSchema = ProjectRunSchema;
export type ProjectRunsGetStatusOutput = z.infer<
	typeof projectRunsGetStatusOutputSchema
>;

export const projectRunsGetChartImageInputSchema = z
	.object({
		projectId: z.string(),
		runId: z.string(),
		staticId: z.string(),
		width: z.number().int().min(100).max(2000).optional(),
		height: z.number().int().min(100).max(2000).optional(),
		includeTitle: z.boolean().optional(),
	})
	.strict();
export type ProjectRunsGetChartImageInput = z.infer<
	typeof projectRunsGetChartImageInputSchema
>;

export const projectRunsGetChartImageOutputSchema = z
	.object({
		projectId: z.string(),
		runId: z.string(),
		staticId: z.string(),
		imageBase64: z.string(),
		mimeType: z.string(),
	})
	.passthrough();
export type ProjectRunsGetChartImageOutput = z.infer<
	typeof projectRunsGetChartImageOutputSchema
>;

export const projectsEditSharingCollectionsInputSchema = z
	.object({
		projectId: ProjectIdSchema,
		sharing: z
			.object({
				upsert: z
					.object({
						collections: z.array(
							z
								.object({
									access: AccessLevelEnumSchema,
									collection: z
										.object({
											id: CollectionIdSchema,
										})
										.strict(),
								})
								.strict(),
						),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();
export type ProjectsEditSharingCollectionsInput = z.infer<
	typeof projectsEditSharingCollectionsInputSchema
>;

export const projectsEditSharingCollectionsOutputSchema =
	EditProjectSharingCollectionsResponseSchema;
export type ProjectsEditSharingCollectionsOutput = z.infer<
	typeof projectsEditSharingCollectionsOutputSchema
>;

export const projectsEditSharingGroupsInputSchema = z
	.object({
		projectId: z.string(),
		sharing: z
			.object({
				upsert: z
					.object({
						groups: z.array(
							z
								.object({
									group: z
										.object({
											id: z.string(),
										})
										.strict(),
									access: z.enum([
										'NONE',
										'APP_ONLY',
										'CAN_VIEW',
										'CAN_EDIT',
										'FULL_ACCESS',
									]),
								})
								.strict(),
						),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();
export type ProjectsEditSharingGroupsInput = z.infer<
	typeof projectsEditSharingGroupsInputSchema
>;

export const projectsEditSharingGroupsOutputSchema = z
	.object({
		project: ProjectSchema,
		errors: z
			.array(
				z
					.object({
						groupIds: z.array(z.string()),
						reason: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type ProjectsEditSharingGroupsOutput = z.infer<
	typeof projectsEditSharingGroupsOutputSchema
>;

export const projectsEditSharingUsersInputSchema = z
	.object({
		projectId: z.string(),
		sharing: z
			.object({
				upsert: z
					.object({
						users: z.array(
							z
								.object({
									user: z
										.object({
											id: z.string(),
										})
										.strict(),
									access: z.enum([
										'NONE',
										'APP_ONLY',
										'CAN_VIEW',
										'CAN_EDIT',
										'FULL_ACCESS',
									]),
								})
								.strict(),
						),
					})
					.strict(),
			})
			.strict(),
		includeUnlisted: z.boolean().optional(),
	})
	.strict();
export type ProjectsEditSharingUsersInput = z.infer<
	typeof projectsEditSharingUsersInputSchema
>;

export const projectsEditSharingUsersOutputSchema = z
	.object({
		project: ProjectSchema,
		errors: z
			.array(
				z
					.object({
						userIds: z.array(z.string()),
						reason: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type ProjectsEditSharingUsersOutput = z.infer<
	typeof projectsEditSharingUsersOutputSchema
>;

export const projectsEditSharingOrgAndPublicInputSchema = z
	.object({
		projectId: z.string(),
		sharing: z
			.object({
				workspace: z
					.enum(['NONE', 'APP_ONLY', 'CAN_VIEW', 'CAN_EDIT', 'FULL_ACCESS'])
					.optional(),
				publicWeb: z
					.enum(['NONE', 'APP_ONLY', 'CAN_VIEW', 'CAN_EDIT', 'FULL_ACCESS'])
					.optional(),
			})
			.strict(),
	})
	.strict();
export type ProjectsEditSharingOrgAndPublicInput = z.infer<
	typeof projectsEditSharingOrgAndPublicInputSchema
>;

export const projectsEditSharingOrgAndPublicOutputSchema = z
	.object({
		project: ProjectSchema,
		errors: z
			.array(
				z
					.object({
						type: openEnum(['workspace', 'publicWeb']),
						reason: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type ProjectsEditSharingOrgAndPublicOutput = z.infer<
	typeof projectsEditSharingOrgAndPublicOutputSchema
>;

export const projectsBatchUpdateComputeProfileInputSchema = z
	.object({
		projectIds: z.array(z.string()),
		kernelImage: z.string().optional(),
		kernelSize: z
			.enum([
				'xsmall',
				'small',
				'medium',
				'large',
				'xlarge',
				'2xlarge',
				'4xlarge',
				'l4',
				'a10g',
			])
			.optional(),
	})
	.strict();
export type ProjectsBatchUpdateComputeProfileInput = z.infer<
	typeof projectsBatchUpdateComputeProfileInputSchema
>;

export const projectsBatchUpdateComputeProfileOutputSchema = z
	.object({
		projects: z.array(BatchUpdateComputeProfileProjectSchema),
	})
	.passthrough();
export type ProjectsBatchUpdateComputeProfileOutput = z.infer<
	typeof projectsBatchUpdateComputeProfileOutputSchema
>;

export const projectsExportInputSchema = z
	.object({
		projectId: z.string(),
		version: z
			.union([z.number().int().min(1), z.enum(['draft']), z.enum(['latest'])])
			.optional(),
	})
	.strict();
export type ProjectsExportInput = z.infer<typeof projectsExportInputSchema>;

export const projectsExportOutputSchema = z
	.object({
		filename: z.string(),
		content: z.string(),
	})
	.passthrough();
export type ProjectsExportOutput = z.infer<typeof projectsExportOutputSchema>;

export const semanticUpdateInputSchema = z
	.object({
		semanticProjectId: SemanticProjectIdSchema,
		updates: z.array(SemanticObjectUpdateSchema),
	})
	.strict();
export type SemanticUpdateInput = z.infer<typeof semanticUpdateInputSchema>;

export const semanticUpdateOutputSchema = UpdateSemanticProjectResponseSchema;
export type SemanticUpdateOutput = z.infer<typeof semanticUpdateOutputSchema>;

export const suggestionsListInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		sortBy: z
			.enum(['CREATED_DATE', 'EVIDENCE_COUNT', 'LAST_SOURCE_ADDED_DATE'])
			.optional(),
		sortDirection: z.enum(['ASC', 'DESC']).optional(),
		status: z
			.enum(['OPEN', 'COMPLETED', 'DISMISSED', 'IN_PROGRESS', 'RESOLVED'])
			.optional(),
		resourceType: z.enum(['WAREHOUSE', 'GUIDE', 'SEMANTIC_MODEL']).optional(),
	})
	.strict();
export type SuggestionsListInput = z.infer<typeof suggestionsListInputSchema>;

export const suggestionsListOutputSchema = z
	.object({
		values: z.array(
			z
				.object({
					id: z.string(),
					title: z.string(),
					summary: z.string(),
					status: openEnum([
						'OPEN',
						'COMPLETED',
						'DISMISSED',
						'IN_PROGRESS',
						'RESOLVED',
					]),
					createdDate: z.string(),
					lastSourceAddedDate: z.string().nullable(),
					reviewAgentStatus: ReviewAgentStatusSchema.nullable(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type SuggestionsListOutput = z.infer<typeof suggestionsListOutputSchema>;

export const suggestionsGetInputSchema = z
	.object({
		suggestionId: z.string(),
	})
	.strict();
export type SuggestionsGetInput = z.infer<typeof suggestionsGetInputSchema>;

export const suggestionsGetOutputSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		summary: z.string(),
		status: openEnum([
			'OPEN',
			'COMPLETED',
			'DISMISSED',
			'IN_PROGRESS',
			'RESOLVED',
		]),
		createdDate: z.string(),
		lastSourceAddedDate: z.string().nullable(),
		reviewAgentStatus: ReviewAgentStatusSchema.nullable(),
		sources: z.array(
			z
				.object({
					warning: z
						.object({
							warningType: z.string(),
							summary: z.string(),
						})
						.passthrough()
						.nullable(),
					agentChatThread: z
						.object({
							id: z.string(),
							title: z.string().nullable(),
							user: z
								.object({
									id: z.string(),
									name: z.string().nullable(),
								})
								.passthrough()
								.nullable(),
							intent: z.string().nullable(),
						})
						.passthrough()
						.nullable(),
				})
				.passthrough(),
		),
		proposedChanges: z.array(
			z
				.object({
					id: z.string(),
					status: openEnum(['NEEDS_REVIEW', 'COMPLETED', 'DISMISSED', 'STALE']),
					updateType: openEnum(['FILE_UPDATE', 'DATA_WAREHOUSE_UPDATE']),
					payload: z
						.object({
							updateType: openEnum([
								'CREATE_ORG_GUIDE_FILE',
								'EDIT_ORG_GUIDE_FILE',
								'EDIT_WORKSPACE_RULES',
								'UPDATE_DESCRIPTION',
								'UPDATE_STATUS',
							]),
							filePath: z.string().optional(),
							diff: z.string().optional(),
							dataConnectionName: z.string().nullable().optional(),
							databaseName: z.string().nullable().optional(),
							schemaName: z.string().nullable().optional(),
							tableName: z.string().nullable().optional(),
							columnName: z.string().nullable().optional(),
							descriptionUpdate: z
								.object({
									currentDescriptions: z
										.object({
											hexDescription: z.string().nullable(),
											warehouseComment: z.string().nullable(),
											dbtDescription: z.string().nullable(),
										})
										.passthrough(),
									newDescription: z.string().nullable(),
								})
								.passthrough()
								.nullable()
								.optional(),
							statusUpdate: z
								.object({
									currentStatusName: z.string().nullable(),
									newStatusName: z.string().nullable(),
								})
								.passthrough()
								.nullable()
								.optional(),
						})
						.passthrough(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type SuggestionsGetOutput = z.infer<typeof suggestionsGetOutputSchema>;

export const suggestionsUpdateInputSchema = z
	.object({
		suggestionId: z.string(),
		status: z.enum([
			'OPEN',
			'COMPLETED',
			'DISMISSED',
			'IN_PROGRESS',
			'RESOLVED',
		]),
		rejectionReason: z.string().nullable().optional(),
	})
	.strict();
export type SuggestionsUpdateInput = z.infer<
	typeof suggestionsUpdateInputSchema
>;

export const suggestionsUpdateOutputSchema = z
	.object({
		suggestion: z
			.object({
				id: z.string(),
				title: z.string(),
				summary: z.string(),
				status: openEnum([
					'OPEN',
					'COMPLETED',
					'DISMISSED',
					'IN_PROGRESS',
					'RESOLVED',
				]),
				createdDate: z.string(),
				lastSourceAddedDate: z.string().nullable(),
				reviewAgentStatus: ReviewAgentStatusSchema.nullable(),
			})
			.passthrough(),
	})
	.passthrough();
export type SuggestionsUpdateOutput = z.infer<
	typeof suggestionsUpdateOutputSchema
>;

export const suggestionsUpdateChangeInputSchema = z
	.object({
		suggestionId: z.string(),
		changeId: z.string(),
		updateTarget: z.enum(['FILE_UPDATE', 'DATA_WAREHOUSE_UPDATE']),
		status: z.enum(['NEEDS_REVIEW', 'COMPLETED', 'DISMISSED', 'STALE']),
		rejectionReason: z.string().nullable().optional(),
	})
	.strict();
export type SuggestionsUpdateChangeInput = z.infer<
	typeof suggestionsUpdateChangeInputSchema
>;

export const suggestionsUpdateChangeOutputSchema = z
	.object({
		suggestionUpdate: z
			.object({
				id: z.string(),
				status: openEnum(['NEEDS_REVIEW', 'COMPLETED', 'DISMISSED', 'STALE']),
				rejectionReason: z.string().nullable(),
			})
			.passthrough(),
	})
	.passthrough();
export type SuggestionsUpdateChangeOutput = z.infer<
	typeof suggestionsUpdateChangeOutputSchema
>;

export const suggestionsTriggerReviewInputSchema = z
	.object({
		suggestionId: z.string(),
	})
	.strict();
export type SuggestionsTriggerReviewInput = z.infer<
	typeof suggestionsTriggerReviewInputSchema
>;

export const suggestionsTriggerReviewOutputSchema = z
	.object({
		suggestion: z
			.object({
				id: z.string(),
				title: z.string(),
				summary: z.string(),
				status: openEnum([
					'OPEN',
					'COMPLETED',
					'DISMISSED',
					'IN_PROGRESS',
					'RESOLVED',
				]),
				createdDate: z.string(),
				lastSourceAddedDate: z.string().nullable(),
				reviewAgentStatus: ReviewAgentStatusSchema.nullable(),
			})
			.passthrough(),
	})
	.passthrough();
export type SuggestionsTriggerReviewOutput = z.infer<
	typeof suggestionsTriggerReviewOutputSchema
>;

export const threadsListInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().min(1).max(100).optional(),
		source: z.enum(['HEX', 'SLACK', 'MCP', 'PUBLIC_API']).nullable().optional(),
		userId: z.string().nullable().optional(),
		type: z.enum(['THREADS', 'NOTEBOOK', 'MODELING']).nullable().optional(),
		classification: z.enum(['ANALYSIS', 'APP_BUILDING']).nullable().optional(),
		numDays: z.number().int().min(0).nullable().optional(),
		hasFeedback: z.boolean().nullable().optional(),
		roles: z.string().nullable().optional(),
		warnings: z.string().nullable().optional(),
		topicIds: z.string().nullable().optional(),
		resourceIds: z.string().nullable().optional(),
	})
	.strict();
export type ThreadsListInput = z.infer<typeof threadsListInputSchema>;

export const threadsListOutputSchema = z
	.object({
		threads: z.array(
			z
				.object({
					title: z.string().nullable().optional(),
					creditsUsed: z.number().nullable().optional(),
					topics: z
						.array(
							z
								.object({
									id: z.string(),
									name: z.string(),
								})
								.passthrough(),
						)
						.optional(),
					warnings: z
						.array(
							z
								.object({
									id: z.string(),
									type: z.string(),
									summary: z.string(),
								})
								.passthrough(),
						)
						.optional(),
					feedback: z
						.array(
							z
								.object({
									id: z.string(),
									userFeedback: z.string(),
									type: openEnum(['THUMBS', 'FLAG']),
									selectedReason: z.string().nullable().optional(),
									userLiked: z.boolean(),
								})
								.passthrough(),
						)
						.optional(),
					warningsGeneratedAt: z.string().nullable().optional(),
					threadSummary: z.string().nullable().optional(),
					threadIntent: z.string().nullable().optional(),
					model: z.string().optional(),
					auto: z.boolean().optional(),
					effectiveModel: z.string().nullable().optional(),
					effortLevel: z.string().nullable().optional(),
					governedMode: z.boolean().nullable().optional(),
					userId: z.string().nullable(),
					type: z.string(),
					classification: z.string().nullable(),
					source: z.string(),
					createdAt: z.string(),
					updatedAt: z.string(),
					sensitive: z.boolean(),
					id: z.string(),
					orgId: z.string(),
					url: z.string(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type ThreadsListOutput = z.infer<typeof threadsListOutputSchema>;

export const threadsCreateInputSchema = z
	.object({
		prompt: z.string().min(1),
		attachments: z
			.object({
				dataConnectionId: z.string().nullable().optional(),
				tableIds: z.array(z.string()).optional(),
				semanticDatasetIds: z.array(z.string()).optional(),
				semanticViewIds: z.array(z.string()).optional(),
				projectIds: z.array(z.string()).optional(),
			})
			.strict()
			.optional(),
		previewId: z.string().nullable().optional(),
		projectId: z.string().nullable().optional(),
		newProject: z.boolean().nullable().optional(),
		muted: z.boolean().nullable().optional(),
	})
	.strict();
export type ThreadsCreateInput = z.infer<typeof threadsCreateInputSchema>;

export const threadsCreateOutputSchema = z
	.object({
		threadId: z.string(),
		url: z.string(),
		createdAt: z.string(),
		projectId: z.string().nullable(),
	})
	.passthrough();
export type ThreadsCreateOutput = z.infer<typeof threadsCreateOutputSchema>;

export const threadsGetInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();
export type ThreadsGetInput = z.infer<typeof threadsGetInputSchema>;

export const threadsGetOutputSchema = z
	.object({
		title: z.string().nullable(),
		creditsUsed: z.number().nullable(),
		topics: z.array(
			z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.passthrough(),
		),
		warnings: z.array(
			z
				.object({
					id: z.string(),
					type: z.string(),
					summary: z.string(),
				})
				.passthrough(),
		),
		feedback: z.array(
			z
				.object({
					id: z.string(),
					userFeedback: z.string(),
					type: openEnum(['THUMBS', 'FLAG']),
					selectedReason: z.string().nullable().optional(),
					userLiked: z.boolean(),
				})
				.passthrough(),
		),
		warningsGeneratedAt: z.string().nullable().optional(),
		threadSummary: z.string().nullable().optional(),
		threadIntent: z.string().nullable().optional(),
		model: z.string(),
		auto: z.boolean(),
		effectiveModel: z.string().nullable(),
		effortLevel: z.string().nullable(),
		governedMode: z.boolean().nullable(),
		userId: z.string().nullable(),
		type: z.string(),
		classification: z.string().nullable(),
		source: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		sensitive: z.boolean(),
		threadId: z.string(),
		status: openEnum(['IDLE', 'RUNNING', 'ERROR']),
		url: z.string(),
		error: z
			.object({
				type: openEnum([
					'NO_CONTEXT',
					'BAD_DATA',
					'AGENT_ERROR',
					'AGENT_OVERLOADED',
					'AGENT_RATE_LIMITED',
					'GENERIC_ERROR',
					'POSSIBLE_PROMPT_INJECTION',
					'OVER_LIMIT',
					'NO_DATA',
					'INVALID_RESPONSE',
					'HALLUCINATED_SCHEMA_ELEMENT',
					'NON_EXPRESSIBLE',
					'INVALID_JOIN',
					'EXPLORE_TIMED_OUT',
					'EXPLORE_ERRORED',
					'EXPLORE_TABLE_SWAPPED',
					'UNSUPPORTED_QUERY_ELEMENTS',
					'EXPLORE_NO_DATA',
					'CHART_ROW_LIMIT_EXCEEDED',
					'BYOK_AUTHENTICATION',
					'BYOK_KEY_MISSING',
					'AGENT_COMPRESSION_ERROR',
					'TOKEN_COUNTING_FAILURE',
					'REQUEST_CANCELLED',
					'INVALID_MESSAGE_HISTORY',
					'INVALID_REQUEST',
					'DATA_CONNECTION_NOT_AUTHORIZED',
					'MODEL_NOT_AVAILABLE',
					'PROVIDER_CONNECTION_INTERRUPTED',
					'AGENT_AUTH',
					'PROVIDER_QUOTA_EXCEEDED',
					'DEADLINE_EXCEEDED',
					'JOIN_VALIDATION_TIMEOUT',
				]),
				message: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		resources: z.array(
			z
				.object({
					id: z.string(),
					resourceType: z.string(),
					name: z.string(),
				})
				.passthrough(),
		),
		response: z
			.array(
				z.union([
					z
						.object({
							type: z.literal('text'),
							text: z.string(),
						})
						.passthrough(),
					z
						.object({
							type: z.literal('cell'),
							id: z.string(),
							staticId: z.string(),
							label: z.string().nullable(),
						})
						.passthrough(),
					z
						.object({
							type: z.literal('project'),
							id: z.string(),
							title: z.string().nullable(),
						})
						.passthrough(),
					z
						.object({
							type: z.literal('task'),
							title: z.string(),
						})
						.passthrough(),
					// A block type Hex adds later still parses; known types keep literal tags for
					// narrowing, and a known type with bad fields still fails.
					z
						.object({
							type: z
								.string()
								.refine(
									(t) => !['text', 'cell', 'project', 'task'].includes(t),
								),
						})
						.passthrough(),
				]),
			)
			.nullable(),
	})
	.passthrough();
export type ThreadsGetOutput = z.infer<typeof threadsGetOutputSchema>;

export const threadsContinueInputSchema = z
	.object({
		id: z.string(),
		prompt: z.string().min(1),
		attachments: z
			.object({
				dataConnectionId: z.string().nullable().optional(),
				tableIds: z.array(z.string()).optional(),
				semanticDatasetIds: z.array(z.string()).optional(),
				semanticViewIds: z.array(z.string()).optional(),
				projectIds: z.array(z.string()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export type ThreadsContinueInput = z.infer<typeof threadsContinueInputSchema>;

export const threadsContinueOutputSchema = z
	.object({
		threadId: z.string(),
		url: z.string(),
	})
	.passthrough();
export type ThreadsContinueOutput = z.infer<typeof threadsContinueOutputSchema>;

export const threadsGetMessagesInputSchema = z
	.object({
		threadId: z.string(),
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().min(1).max(50).optional(),
		full: z.boolean().optional(),
	})
	.strict();
export type ThreadsGetMessagesInput = z.infer<
	typeof threadsGetMessagesInputSchema
>;

export const threadsGetMessagesOutputSchema = z
	.object({
		content: z.array(
			z
				.object({
					type: openEnum(['text']),
					text: z.string(),
					createdAt: z.string(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type ThreadsGetMessagesOutput = z.infer<
	typeof threadsGetMessagesOutputSchema
>;

export const usersListInputSchema = z
	.object({
		after: z.string().nullable().optional(),
		before: z.string().nullable().optional(),
		limit: z.number().min(1).max(500).optional(),
		sortBy: z.enum(['NAME', 'EMAIL']).optional(),
		sortDirection: z.enum(['ASC', 'DESC']).optional(),
		groupId: z.string().nullable().optional(),
		userIds: z.string().nullable().optional(),
	})
	.strict();
export type UsersListInput = z.infer<typeof usersListInputSchema>;

export const usersListOutputSchema = z
	.object({
		values: z.array(
			z
				.object({
					id: z.string(),
					name: z.string().nullable(),
					email: z.string(),
					role: openEnum([
						'ADMIN',
						'MANAGER',
						'EDITOR',
						'EXPLORER',
						'MEMBER',
						'GUEST',
						'EMBEDDED_USER',
						'ANONYMOUS',
					]),
					lastLoginDate: z.string().nullable(),
				})
				.passthrough(),
		),
		pagination: PaginationSchema,
	})
	.passthrough();
export type UsersListOutput = z.infer<typeof usersListOutputSchema>;

export const usersDeactivateInputSchema = z
	.object({
		userId: z.string(),
	})
	.strict();
export type UsersDeactivateInput = z.infer<typeof usersDeactivateInputSchema>;

export const usersDeactivateOutputSchema = z
	.object({
		user: z
			.object({
				id: z.string(),
				name: z.string().nullable(),
				email: z.string(),
				role: openEnum([
					'ADMIN',
					'MANAGER',
					'EDITOR',
					'EXPLORER',
					'MEMBER',
					'GUEST',
					'EMBEDDED_USER',
					'ANONYMOUS',
				]),
				lastLoginDate: z.string().nullable(),
			})
			.passthrough(),
	})
	.passthrough();
export type UsersDeactivateOutput = z.infer<typeof usersDeactivateOutputSchema>;

export const usersMeInputSchema = z.object({}).strict();
export type UsersMeInput = z.infer<typeof usersMeInputSchema>;

export const usersMeOutputSchema = z.union([
	z
		.object({
			id: z.string(),
			name: z.string().nullable(),
			email: z.string(),
			role: openEnum([
				'ADMIN',
				'MANAGER',
				'EDITOR',
				'EXPLORER',
				'MEMBER',
				'GUEST',
				'EMBEDDED_USER',
				'ANONYMOUS',
			]),
			lastLoginDate: z.string().nullable(),
			org: z
				.object({
					id: z.string(),
				})
				.passthrough(),
			token: z
				.object({
					exp: z.number().nullable(),
				})
				.passthrough()
				.nullable()
				.optional(),
		})
		.passthrough(),
	z
		.object({
			org: z
				.object({
					id: z.string(),
				})
				.passthrough(),
			token: z
				.object({
					exp: z.number().nullable(),
				})
				.passthrough()
				.nullable()
				.optional(),
		})
		.passthrough(),
]);
export type UsersMeOutput = z.infer<typeof usersMeOutputSchema>;

export const suggestionsGetV2InputSchema = z
	.object({
		suggestionId: z.string(),
		previewProposalId: z.string().nullable().optional(),
		previewCursor: z.string().min(1).max(1024).nullable().optional(),
		cursor: z.string().min(1).max(1024).nullable().optional(),
	})
	.strict();
export type SuggestionsGetV2Input = z.infer<typeof suggestionsGetV2InputSchema>;

export const suggestionsGetV2OutputSchema = SuggestionInspectionSchema;
export type SuggestionsGetV2Output = z.infer<
	typeof suggestionsGetV2OutputSchema
>;

export type HexEndpointInputs = {
	adminListAgentUsage: AdminListAgentUsageInput;
	cellsList: CellsListInput;
	cellsCreate: CellsCreateInput;
	cellsDelete: CellsDeleteInput;
	cellsGet: CellsGetInput;
	cellsUpdate: CellsUpdateInput;
	cellsGetChartImage: CellsGetChartImageInput;
	cellsGetOutput: CellsGetOutputInput;
	collectionsList: CollectionsListInput;
	collectionsCreate: CollectionsCreateInput;
	collectionsGet: CollectionsGetInput;
	collectionsUpdate: CollectionsUpdateInput;
	adminListTopics: AdminListTopicsInput;
	adminListCreditGrants: AdminListCreditGrantsInput;
	dataConnectionsList: DataConnectionsListInput;
	dataConnectionsCreate: DataConnectionsCreateInput;
	dataConnectionsGet: DataConnectionsGetInput;
	dataConnectionsUpdate: DataConnectionsUpdateInput;
	dataConnectionsUpdateSchema: DataConnectionsUpdateSchemaInput;
	embeddingCreatePresignedUrl: EmbeddingCreatePresignedUrlInput;
	groupsList: GroupsListInput;
	groupsCreate: GroupsCreateInput;
	groupsDelete: GroupsDeleteInput;
	groupsGet: GroupsGetInput;
	groupsUpdate: GroupsUpdateInput;
	guidesUpsertDraft: GuidesUpsertDraftInput;
	guidesDeleteDraft: GuidesDeleteDraftInput;
	guidesListDrafts: GuidesListDraftsInput;
	guidesPublish: GuidesPublishInput;
	projectsList: ProjectsListInput;
	projectsCreate: ProjectsCreateInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsGetQueriedTables: ProjectsGetQueriedTablesInput;
	projectRunsList: ProjectRunsListInput;
	projectRunsRun: ProjectRunsRunInput;
	projectRunsCancel: ProjectRunsCancelInput;
	projectRunsGetStatus: ProjectRunsGetStatusInput;
	projectRunsGetChartImage: ProjectRunsGetChartImageInput;
	projectsEditSharingCollections: ProjectsEditSharingCollectionsInput;
	projectsEditSharingGroups: ProjectsEditSharingGroupsInput;
	projectsEditSharingUsers: ProjectsEditSharingUsersInput;
	projectsEditSharingOrgAndPublic: ProjectsEditSharingOrgAndPublicInput;
	projectsBatchUpdateComputeProfile: ProjectsBatchUpdateComputeProfileInput;
	projectsExport: ProjectsExportInput;
	semanticUpdate: SemanticUpdateInput;
	suggestionsList: SuggestionsListInput;
	suggestionsGet: SuggestionsGetInput;
	suggestionsUpdate: SuggestionsUpdateInput;
	suggestionsUpdateChange: SuggestionsUpdateChangeInput;
	suggestionsTriggerReview: SuggestionsTriggerReviewInput;
	threadsList: ThreadsListInput;
	threadsCreate: ThreadsCreateInput;
	threadsGet: ThreadsGetInput;
	threadsContinue: ThreadsContinueInput;
	threadsGetMessages: ThreadsGetMessagesInput;
	usersList: UsersListInput;
	usersDeactivate: UsersDeactivateInput;
	usersMe: UsersMeInput;
	suggestionsGetV2: SuggestionsGetV2Input;
};

export type HexEndpointOutputs = {
	adminListAgentUsage: AdminListAgentUsageOutput;
	cellsList: CellsListOutput;
	cellsCreate: CellsCreateOutput;
	cellsDelete: CellsDeleteOutput;
	cellsGet: CellsGetOutput;
	cellsUpdate: CellsUpdateOutput;
	cellsGetChartImage: CellsGetChartImageOutput;
	cellsGetOutput: CellsGetOutputOutput;
	collectionsList: CollectionsListOutput;
	collectionsCreate: CollectionsCreateOutput;
	collectionsGet: CollectionsGetOutput;
	collectionsUpdate: CollectionsUpdateOutput;
	adminListTopics: AdminListTopicsOutput;
	adminListCreditGrants: AdminListCreditGrantsOutput;
	dataConnectionsList: DataConnectionsListOutput;
	dataConnectionsCreate: DataConnectionsCreateOutput;
	dataConnectionsGet: DataConnectionsGetOutput;
	dataConnectionsUpdate: DataConnectionsUpdateOutput;
	dataConnectionsUpdateSchema: DataConnectionsUpdateSchemaOutput;
	embeddingCreatePresignedUrl: EmbeddingCreatePresignedUrlOutput;
	groupsList: GroupsListOutput;
	groupsCreate: GroupsCreateOutput;
	groupsDelete: GroupsDeleteOutput;
	groupsGet: GroupsGetOutput;
	groupsUpdate: GroupsUpdateOutput;
	guidesUpsertDraft: GuidesUpsertDraftOutput;
	guidesDeleteDraft: GuidesDeleteDraftOutput;
	guidesListDrafts: GuidesListDraftsOutput;
	guidesPublish: GuidesPublishOutput;
	projectsList: ProjectsListOutput;
	projectsCreate: ProjectsCreateOutput;
	projectsGet: ProjectsGetOutput;
	projectsUpdate: ProjectsUpdateOutput;
	projectsGetQueriedTables: ProjectsGetQueriedTablesOutput;
	projectRunsList: ProjectRunsListOutput;
	projectRunsRun: ProjectRunsRunOutput;
	projectRunsCancel: ProjectRunsCancelOutput;
	projectRunsGetStatus: ProjectRunsGetStatusOutput;
	projectRunsGetChartImage: ProjectRunsGetChartImageOutput;
	projectsEditSharingCollections: ProjectsEditSharingCollectionsOutput;
	projectsEditSharingGroups: ProjectsEditSharingGroupsOutput;
	projectsEditSharingUsers: ProjectsEditSharingUsersOutput;
	projectsEditSharingOrgAndPublic: ProjectsEditSharingOrgAndPublicOutput;
	projectsBatchUpdateComputeProfile: ProjectsBatchUpdateComputeProfileOutput;
	projectsExport: ProjectsExportOutput;
	semanticUpdate: SemanticUpdateOutput;
	suggestionsList: SuggestionsListOutput;
	suggestionsGet: SuggestionsGetOutput;
	suggestionsUpdate: SuggestionsUpdateOutput;
	suggestionsUpdateChange: SuggestionsUpdateChangeOutput;
	suggestionsTriggerReview: SuggestionsTriggerReviewOutput;
	threadsList: ThreadsListOutput;
	threadsCreate: ThreadsCreateOutput;
	threadsGet: ThreadsGetOutput;
	threadsContinue: ThreadsContinueOutput;
	threadsGetMessages: ThreadsGetMessagesOutput;
	usersList: UsersListOutput;
	usersDeactivate: UsersDeactivateOutput;
	usersMe: UsersMeOutput;
	suggestionsGetV2: SuggestionsGetV2Output;
};

export const HexEndpointInputSchemas = {
	adminListAgentUsage: adminListAgentUsageInputSchema,
	cellsList: cellsListInputSchema,
	cellsCreate: cellsCreateInputSchema,
	cellsDelete: cellsDeleteInputSchema,
	cellsGet: cellsGetInputSchema,
	cellsUpdate: cellsUpdateInputSchema,
	cellsGetChartImage: cellsGetChartImageInputSchema,
	cellsGetOutput: cellsGetOutputInputSchema,
	collectionsList: collectionsListInputSchema,
	collectionsCreate: collectionsCreateInputSchema,
	collectionsGet: collectionsGetInputSchema,
	collectionsUpdate: collectionsUpdateInputSchema,
	adminListTopics: adminListTopicsInputSchema,
	adminListCreditGrants: adminListCreditGrantsInputSchema,
	dataConnectionsList: dataConnectionsListInputSchema,
	dataConnectionsCreate: dataConnectionsCreateInputSchema,
	dataConnectionsGet: dataConnectionsGetInputSchema,
	dataConnectionsUpdate: dataConnectionsUpdateInputSchema,
	dataConnectionsUpdateSchema: dataConnectionsUpdateSchemaInputSchema,
	embeddingCreatePresignedUrl: embeddingCreatePresignedUrlInputSchema,
	groupsList: groupsListInputSchema,
	groupsCreate: groupsCreateInputSchema,
	groupsDelete: groupsDeleteInputSchema,
	groupsGet: groupsGetInputSchema,
	groupsUpdate: groupsUpdateInputSchema,
	guidesUpsertDraft: guidesUpsertDraftInputSchema,
	guidesDeleteDraft: guidesDeleteDraftInputSchema,
	guidesListDrafts: guidesListDraftsInputSchema,
	guidesPublish: guidesPublishInputSchema,
	projectsList: projectsListInputSchema,
	projectsCreate: projectsCreateInputSchema,
	projectsGet: projectsGetInputSchema,
	projectsUpdate: projectsUpdateInputSchema,
	projectsGetQueriedTables: projectsGetQueriedTablesInputSchema,
	projectRunsList: projectRunsListInputSchema,
	projectRunsRun: projectRunsRunInputSchema,
	projectRunsCancel: projectRunsCancelInputSchema,
	projectRunsGetStatus: projectRunsGetStatusInputSchema,
	projectRunsGetChartImage: projectRunsGetChartImageInputSchema,
	projectsEditSharingCollections: projectsEditSharingCollectionsInputSchema,
	projectsEditSharingGroups: projectsEditSharingGroupsInputSchema,
	projectsEditSharingUsers: projectsEditSharingUsersInputSchema,
	projectsEditSharingOrgAndPublic: projectsEditSharingOrgAndPublicInputSchema,
	projectsBatchUpdateComputeProfile:
		projectsBatchUpdateComputeProfileInputSchema,
	projectsExport: projectsExportInputSchema,
	semanticUpdate: semanticUpdateInputSchema,
	suggestionsList: suggestionsListInputSchema,
	suggestionsGet: suggestionsGetInputSchema,
	suggestionsUpdate: suggestionsUpdateInputSchema,
	suggestionsUpdateChange: suggestionsUpdateChangeInputSchema,
	suggestionsTriggerReview: suggestionsTriggerReviewInputSchema,
	threadsList: threadsListInputSchema,
	threadsCreate: threadsCreateInputSchema,
	threadsGet: threadsGetInputSchema,
	threadsContinue: threadsContinueInputSchema,
	threadsGetMessages: threadsGetMessagesInputSchema,
	usersList: usersListInputSchema,
	usersDeactivate: usersDeactivateInputSchema,
	usersMe: usersMeInputSchema,
	suggestionsGetV2: suggestionsGetV2InputSchema,
} as const;

export const HexEndpointOutputSchemas = {
	adminListAgentUsage: adminListAgentUsageOutputSchema,
	cellsList: cellsListOutputSchema,
	cellsCreate: cellsCreateOutputSchema,
	cellsDelete: cellsDeleteOutputSchema,
	cellsGet: cellsGetOutputSchema,
	cellsUpdate: cellsUpdateOutputSchema,
	cellsGetChartImage: cellsGetChartImageOutputSchema,
	cellsGetOutput: cellsGetOutputOutputSchema,
	collectionsList: collectionsListOutputSchema,
	collectionsCreate: collectionsCreateOutputSchema,
	collectionsGet: collectionsGetOutputSchema,
	collectionsUpdate: collectionsUpdateOutputSchema,
	adminListTopics: adminListTopicsOutputSchema,
	adminListCreditGrants: adminListCreditGrantsOutputSchema,
	dataConnectionsList: dataConnectionsListOutputSchema,
	dataConnectionsCreate: dataConnectionsCreateOutputSchema,
	dataConnectionsGet: dataConnectionsGetOutputSchema,
	dataConnectionsUpdate: dataConnectionsUpdateOutputSchema,
	dataConnectionsUpdateSchema: dataConnectionsUpdateSchemaOutputSchema,
	embeddingCreatePresignedUrl: embeddingCreatePresignedUrlOutputSchema,
	groupsList: groupsListOutputSchema,
	groupsCreate: groupsCreateOutputSchema,
	groupsDelete: groupsDeleteOutputSchema,
	groupsGet: groupsGetOutputSchema,
	groupsUpdate: groupsUpdateOutputSchema,
	guidesUpsertDraft: guidesUpsertDraftOutputSchema,
	guidesDeleteDraft: guidesDeleteDraftOutputSchema,
	guidesListDrafts: guidesListDraftsOutputSchema,
	guidesPublish: guidesPublishOutputSchema,
	projectsList: projectsListOutputSchema,
	projectsCreate: projectsCreateOutputSchema,
	projectsGet: projectsGetOutputSchema,
	projectsUpdate: projectsUpdateOutputSchema,
	projectsGetQueriedTables: projectsGetQueriedTablesOutputSchema,
	projectRunsList: projectRunsListOutputSchema,
	projectRunsRun: projectRunsRunOutputSchema,
	projectRunsCancel: projectRunsCancelOutputSchema,
	projectRunsGetStatus: projectRunsGetStatusOutputSchema,
	projectRunsGetChartImage: projectRunsGetChartImageOutputSchema,
	projectsEditSharingCollections: projectsEditSharingCollectionsOutputSchema,
	projectsEditSharingGroups: projectsEditSharingGroupsOutputSchema,
	projectsEditSharingUsers: projectsEditSharingUsersOutputSchema,
	projectsEditSharingOrgAndPublic: projectsEditSharingOrgAndPublicOutputSchema,
	projectsBatchUpdateComputeProfile:
		projectsBatchUpdateComputeProfileOutputSchema,
	projectsExport: projectsExportOutputSchema,
	semanticUpdate: semanticUpdateOutputSchema,
	suggestionsList: suggestionsListOutputSchema,
	suggestionsGet: suggestionsGetOutputSchema,
	suggestionsUpdate: suggestionsUpdateOutputSchema,
	suggestionsUpdateChange: suggestionsUpdateChangeOutputSchema,
	suggestionsTriggerReview: suggestionsTriggerReviewOutputSchema,
	threadsList: threadsListOutputSchema,
	threadsCreate: threadsCreateOutputSchema,
	threadsGet: threadsGetOutputSchema,
	threadsContinue: threadsContinueOutputSchema,
	threadsGetMessages: threadsGetMessagesOutputSchema,
	usersList: usersListOutputSchema,
	usersDeactivate: usersDeactivateOutputSchema,
	usersMe: usersMeOutputSchema,
	suggestionsGetV2: suggestionsGetV2OutputSchema,
} as const;

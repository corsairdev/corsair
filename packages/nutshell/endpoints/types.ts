import { z } from 'zod';
import type { NutshellOperationKey } from '../operations';

// Request and response schemas are generated from each current Nutshell REST
// reference OpenAPI definition. Recursive provider schemas are permissive at
// the recursion boundary because a finite Zod value cannot encode them inline.

// JSON Patch (RFC 6902) operation values may be any JSON value: Nutshell PATCH
// routes legitimately send numbers (employeeCount), booleans, arrays (phones),
// objects, and null as values, so the value field cannot be a string.
type NutshellJsonValue =
	| string
	| number
	| boolean
	| null
	| NutshellJsonValue[]
	| { [key: string]: NutshellJsonValue };
const NutshellJsonValueSchema: z.ZodType<NutshellJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(NutshellJsonValueSchema),
		z.record(z.string(), NutshellJsonValueSchema),
	]),
);

// Shared item shape of the JSON Patch arrays every Nutshell PATCH route takes.
// RFC 6902 requires `op` and `path` on every operation; `value` is absent on
// a remove.
const NutshellJsonPatchOperationSchema = z
	.object({
		op: z.enum(['add', 'remove', 'replace', 'move', 'copy']),
		path: z.string().min(1),
		value: NutshellJsonValueSchema.optional(),
	})
	.loose();

const NutshellStagesListInputSchema = z.object({}).strict();
const NutshellStagesListOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose(),
		links: z.object({}).loose(),
		stages: z.array(
			z
				.object({
					id: z.string().regex(new RegExp('^[0-9]+-stages$')),
					type: z.literal('stages'),
					name: z.string(),
					description: z.string(),
					position: z.number().int().min(0),
					activeAvatarUrl: z.string(),
					completeAvatarUrl: z.string(),
					incompleteAvatarUrl: z.string(),
					overdueAvatarUrl: z.string(),
					links: z
						.object({
							stageset: z.string().regex(new RegExp('^[0-9]+-stagesets$')),
						})
						.loose(),
				})
				.loose(),
		),
	})
	.loose();

const NutshellAudiencesListInputSchema = z.object({}).strict();
const NutshellAudiencesListOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
			name: z.string().nullish(),
			isWebFX: z.boolean().nullish(),
		})
		.loose(),
);

const NutshellLeadsListInputSchema = z
	.object({
		q: z.string().optional(),
		sort: z
			.enum([
				'-age',
				'-value',
				'-milestone',
				'-confidence',
				'-name',
				'-closedTime',
				'-owner',
				'-sources',
				'age',
				'value',
				'milestone',
				'confidence',
				'name',
				'closedTime',
				'owner',
				'sources',
			])
			.optional(),
		filter: z.object({}).catchall(z.string()).optional(),
		'page[page]': z.number().int().optional(),
		'page[limit]': z.number().int().optional(),
	})
	.strict();
const NutshellLeadsListOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: z.object({}).loose().nullish(),
		leads: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										avatarUrl: z.string().nullish(),
										initials: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									id: z.string().nullish(),
									deletedTime: z.string().nullish(),
									name: z.string().nullish(),
									value: z
										.object({
											formatted: z.string().nullish(),
											amount: z.string().nullish(),
											currency: z.string().nullish(),
										})
										.loose()
										.nullish(),
									number: z.number().int().nullish(),
									description: z.string().nullish(),
									createdTime: z
										.object({
											absoluteLocalizedString: z.string().nullish(),
											timestamp: z.number().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
									closedTime: z.string().nullish(),
									dueTime: z.string().nullish(),
									anticipatedClosedTime: z.string().nullish(),
									ownerType: z.string().nullish(),
									status: z.string().nullish(),
									lastContactedTime: z
										.unknown() /* OpenAPI schema has no recognized type */
										.nullish(),
									pieState: z.string().nullish(),
									isOverdue: z.boolean().nullish(),
									overdueTime: z.string().nullish(),
									href: z.string().nullish(),
									confidence: z.number().int().nullish(),
									priority: z.number().int().nullish(),
									isCurrentUserWatching: z.boolean().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellQuotesListInputSchema = z
	.object({
		'filter[lead]': z.string().optional(),
		'filter[dateMin]': z.string().optional(),
		'filter[dateMax]': z.string().optional(),
		'page[limit]': z.string().optional(),
		'page[page]': z.string().optional(),
	})
	.strict();
const NutshellQuotesListOutputSchema = z
	.object({
		quotes: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							acceptedTime: z.string().nullish(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: z.object({}).loose().nullish(),
	})
	.loose();

const NutshellAccountsCustomFieldAttributesInputSchema = z.object({}).strict();
const NutshellAccountsCustomFieldAttributesOutputSchema = z
	.object({
		customFields: z
			.array(
				z
					.object({
						id: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellOutcomesListInputSchema = z.object({}).strict();
const NutshellOutcomesListOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const NutshellTasksGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellTasksGetOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			recurrenceRule: z
				.intersection(
					z
						.object({
							htmlUrl: z.string().nullish(),
							htmlUrlPath: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							rule: z.string().nullish(),
							// Documented values: dueDate, completion. Kept open for later additions.
							mode: z.string().nullish(),
							id: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);

const NutshellLeadsReopenInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsReopenOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellMarketsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellMarketsGetOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		currency: z.string().nullish(),
		currencySymbol: z.string().nullish(),
		isDefault: z.boolean().nullish(),
	})
	.loose();

const NutshellProductsListInputSchema = z
	.object({
		q: z.string().optional(),
		sort: z.enum(['name', '-name', 'sku', '-sku']).optional(),
	})
	.strict();
const NutshellProductsListOutputSchema = z
	.object({
		products: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						description: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.string().nullish(),
						sku: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						productType: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						prices: z
							.object({
								'1-markets': z
									.object({
										amount: z.number().nullish(),
										currency: z.string().nullish(),
										formatted: z.string().nullish(),
										currencySymbol: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						price: z
							.object({
								amount: z.number().nullish(),
								currency: z.string().nullish(),
								formatted: z.string().nullish(),
								currencySymbol: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsListFieldsInputSchema = z.object({}).strict();
const NutshellLeadsListFieldsOutputSchema = z
	.object({
		properties: z
			.object({
				exampleProperty: z
					.object({
						type: z.string().nullish(),
						title: z.string().nullish(),
						description: z.string().nullish(),
						isFilterable: z.boolean().nullish(),
						isDisplayable: z.boolean().nullish(),
						isSortable: z.boolean().nullish(),
						isGoalable: z.boolean().nullish(),
						isAddable: z.boolean().nullish(),
						isBoardable: z.boolean().nullish(),
						isRequireable: z.boolean().nullish(),
						isAndable: z.boolean().nullish(),
						isNullable: z.boolean().nullish(),
						relationships: z.array(z.string()).nullish(),
						enum: z.array(z.string()).nullish(),
						format: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const NutshellAccountsCreateInputSchema = z
	.object({
		body: z
			.object({
				accounts: z
					.array(
						z
							.object({
								name: z.string().optional(),
								description: z.string().optional(),
								phones: z
									.array(
										z
											.object({
												isPrimary: z.boolean().optional(),
												name: z.string().optional(),
												value: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								emails: z
									.array(
										z
											.object({
												value: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								urls: z
									.array(
										z
											.object({
												value: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								addresses: z
									.array(
										z
											.object({
												name: z.string().optional(),
												isPrimary: z.boolean().optional(),
												value: z
													.object({
														address_1: z.string().optional(),
														city: z.string().optional(),
														state: z.string().optional(),
													})
													.loose()
													.optional(),
											})
											.loose(),
									)
									.optional(),
								links: z.object({}).loose().optional(),
								customFields: z.object({}).catchall(z.string()).optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellAccountsCreateOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z
				.object({
					id: z.string().nullish(),
					name: z.string().nullish(),
					description: z.string().nullish(),
					createdTime: z.number().int().nullish(),
					deletedTime: z.number().int().nullish(),
					emails: z
						.array(
							z
								.object({
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					addresses: z
						.array(
							z
								.object({
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z
										.object({
											location: z
												.object({
													longitude: z.number().nullish(),
													latitude: z.number().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose()
										.nullish(),
									locationAccuracy: z.string().nullish(),
									address_1: z.string().nullish(),
									address_2: z.string().nullish(),
									address_3: z.string().nullish(),
									city: z.string().nullish(),
									state: z.string().nullish(),
									postalCode: z.string().nullish(),
									country: z.string().nullish(),
									timezone: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					phones: z
						.array(
							z
								.object({
									isOptedOut: z.boolean().nullish(),
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z
										.object({
											countryCode: z.string().nullish(),
											number: z.string().nullish(),
											extension: z.string().nullish(),
											numberFormatted: z.string().nullish(),
											E164: z.string().nullish(),
											countryCodeAndNumber: z.string().nullish(),
										})
										.loose()
										.nullish(),
								})
								.loose(),
						)
						.nullish(),
					urls: z
						.array(
							z
								.object({
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
				})
				.loose(),
			z
				.object({
					avatarUrl: z.string().nullish(),
					initials: z.string().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			href: z.string().nullish(),
			revenue: z
				.object({
					amount: z.string().nullish(),
					formatted: z.string().nullish(),
				})
				.loose()
				.nullish(),
			employeeCount: z.number().int().nullish(),
		})
		.loose(),
);

const NutshellAccountsUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellAccountsUndeleteOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z
				.object({
					id: z.string().nullish(),
					name: z.string().nullish(),
					description: z.string().nullish(),
					createdTime: z.number().int().nullish(),
					deletedTime: z.number().int().nullish(),
					emails: z
						.array(
							z
								.object({
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					addresses: z
						.array(
							z
								.object({
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z
										.object({
											location: z
												.object({
													longitude: z.number().nullish(),
													latitude: z.number().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose()
										.nullish(),
									locationAccuracy: z.string().nullish(),
									address_1: z.string().nullish(),
									address_2: z.string().nullish(),
									address_3: z.string().nullish(),
									city: z.string().nullish(),
									state: z.string().nullish(),
									postalCode: z.string().nullish(),
									country: z.string().nullish(),
									timezone: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					phones: z
						.array(
							z
								.object({
									isOptedOut: z.boolean().nullish(),
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z
										.object({
											countryCode: z.string().nullish(),
											number: z.string().nullish(),
											extension: z.string().nullish(),
											numberFormatted: z.string().nullish(),
											E164: z.string().nullish(),
											countryCodeAndNumber: z.string().nullish(),
										})
										.loose()
										.nullish(),
								})
								.loose(),
						)
						.nullish(),
					urls: z
						.array(
							z
								.object({
									isPrimary: z.boolean().nullish(),
									name: z.string().nullish(),
									value: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
				})
				.loose(),
			z
				.object({
					avatarUrl: z.string().nullish(),
					initials: z.string().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			href: z.string().nullish(),
			revenue: z
				.object({
					amount: z.string().nullish(),
					formatted: z.string().nullish(),
				})
				.loose()
				.nullish(),
			employeeCount: z.number().int().nullish(),
		})
		.loose(),
);

const NutshellProductsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
// The reference documents 200 with this body or 204 with none.
const NutshellProductsDeleteOutputSchema = z
	.object({
		products: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						description: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.string().nullish(),
						sku: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						productType: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						prices: z
							.object({
								'1-markets': z
									.object({
										amount: z.number().nullish(),
										currency: z.string().nullish(),
										formatted: z.string().nullish(),
										currencySymbol: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						price: z
							.object({
								amount: z.number().nullish(),
								currency: z.string().nullish(),
								formatted: z.string().nullish(),
								currencySymbol: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose()
	.optional();

const NutshellActivitiesCreateInputSchema = z
	.object({
		body: z
			.object({
				activities: z
					.array(
						z
							.object({
								name: z.string().optional(),
								description: z.string().optional(),
								note: z.string().optional(),
								location: z.string().optional(),
								activityType: z.string().optional(),
								startTime: z.number().int().optional(),
								endTime: z.number().int().optional(),
								transcription: z.string().optional(),
								isFlagged: z.boolean().optional(),
								isLogged: z.boolean().optional(),
								isAllDay: z.boolean().optional(),
								links: z
									.object({
										participants: z.array(z.string()).optional(),
										leads: z.array(z.string()).optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellActivitiesCreateOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			activities: z
				.array(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										id: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								id: z.string().nullish(),
							})
							.loose(),
					),
				)
				.nullish(),
			id: z.string().nullish(),
			agenda: z
				.unknown() /* OpenAPI schema has no recognized type */
				.nullish(),
			createdTime: z.number().int().nullish(),
			endTime: z.number().int().nullish(),
			deletedTime: z.number().int().nullish(),
			href: z.string().nullish(),
			isAllDay: z.boolean().nullish(),
			isEditable: z.boolean().nullish(),
			isCancelled: z.boolean().nullish(),
			isFlagged: z.boolean().nullish(),
			isLogged: z.boolean().nullish(),
			isOverdue: z.boolean().nullish(),
			loggedTime: z.number().int().nullish(),
			modifiedTime: z.number().int().nullish(),
			name: z.string().nullish(),
			startTime: z.number().int().nullish(),
			isMediaLogged: z.boolean().nullish(),
			transcription: z.string().nullish(),
		})
		.loose(),
);

const NutshellLeadsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsDeleteOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellSourcesListInputSchema = z
	.object({
		q: z.string().optional(),
	})
	.strict();
const NutshellSourcesListOutputSchema = z
	.object({
		sources: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						channel: z
							.object({
								value: z.number().int().nullish(),
								display: z.string().nullish(),
							})
							.loose()
							.nullish(),
						deletedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellCompetitorsListInputSchema = z
	.object({
		q: z.string().optional(),
	})
	.strict();
const NutshellCompetitorsListOutputSchema = z
	.object({
		competitors: z
			.unknown() /* OpenAPI schema has no recognized type */
			.nullish(),
		id: z.string().nullish(),
		name: z.string().nullish(),
		modifiedTime: z.number().int().nullish(),
	})
	.loose();

const NutshellAccountsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellAccountsDeleteOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		accounts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z
										.object({
											id: z.string().nullish(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											createdTime: z.number().int().nullish(),
											deletedTime: z.number().int().nullish(),
											emails: z
												.array(
													z
														.object({
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z.string().nullish(),
														})
														.loose(),
												)
												.nullish(),
											addresses: z
												.array(
													z
														.object({
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z
																.object({
																	location: z
																		.object({
																			longitude: z.number().nullish(),
																			latitude: z.number().nullish(),
																		})
																		.loose()
																		.nullish(),
																})
																.loose()
																.nullish(),
															locationAccuracy: z.string().nullish(),
															address_1: z.string().nullish(),
															address_2: z.string().nullish(),
															address_3: z.string().nullish(),
															city: z.string().nullish(),
															state: z.string().nullish(),
															postalCode: z.string().nullish(),
															country: z.string().nullish(),
															timezone: z.string().nullish(),
														})
														.loose(),
												)
												.nullish(),
											phones: z
												.array(
													z
														.object({
															isOptedOut: z.boolean().nullish(),
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z
																.object({
																	countryCode: z.string().nullish(),
																	number: z.string().nullish(),
																	extension: z.string().nullish(),
																	numberFormatted: z.string().nullish(),
																	E164: z.string().nullish(),
																	countryCodeAndNumber: z.string().nullish(),
																})
																.loose()
																.nullish(),
														})
														.loose(),
												)
												.nullish(),
											urls: z
												.array(
													z
														.object({
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z.string().nullish(),
														})
														.loose(),
												)
												.nullish(),
										})
										.loose(),
									z
										.object({
											avatarUrl: z.string().nullish(),
											initials: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									href: z.string().nullish(),
									revenue: z
										.object({
											amount: z.string().nullish(),
											formatted: z.string().nullish(),
										})
										.loose()
										.nullish(),
									employeeCount: z.number().int().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		creators: z
			.array(
				z.intersection(
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							id: z.string().nullish(),
							name: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							firstName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							modifiedTime: z.number().int().nullish(),
							isEnabled: z.boolean().nullish(),
							hasSetPassword: z.boolean().nullish(),
							isAdministrator: z.boolean().nullish(),
							isViewingRestricted: z.boolean().nullish(),
							isHiddenFromFilters: z.boolean().nullish(),
							canAccessEmailMarketing: z.boolean().nullish(),
							permissions: z
								.object({
									canAccessSetup: z.boolean().nullish(),
									canAccessMarketing: z.boolean().nullish(),
									canBulkEdit: z.boolean().nullish(),
									canExport: z.boolean().nullish(),
									canViewSharedEmails: z.boolean().nullish(),
									canImport: z.boolean().nullish(),
									canMergeEntities: z.boolean().nullish(),
									canDeleteEntities: z.boolean().nullish(),
									canAssignEntities: z.boolean().nullish(),
									canAccessBilling: z.boolean().nullish(),
									canManageEmailTemplates: z.boolean().nullish(),
									canAccessCrm: z.boolean().nullish(),
									canAccessFullCampaigns: z.boolean().nullish(),
									canUsePeopleIQ: z.boolean().nullish(),
									canUseInbox: z.boolean().nullish(),
								})
								.loose()
								.nullish(),
							emails: z.array(z.string()).nullish(),
							phonecallerType: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		owners: z
			.array(
				z.intersection(
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							id: z.string().nullish(),
							name: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							firstName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							modifiedTime: z.number().int().nullish(),
							isEnabled: z.boolean().nullish(),
							hasSetPassword: z.boolean().nullish(),
							isAdministrator: z.boolean().nullish(),
							isViewingRestricted: z.boolean().nullish(),
							isHiddenFromFilters: z.boolean().nullish(),
							canAccessEmailMarketing: z.boolean().nullish(),
							permissions: z
								.object({
									canAccessSetup: z.boolean().nullish(),
									canAccessMarketing: z.boolean().nullish(),
									canBulkEdit: z.boolean().nullish(),
									canExport: z.boolean().nullish(),
									canViewSharedEmails: z.boolean().nullish(),
									canImport: z.boolean().nullish(),
									canMergeEntities: z.boolean().nullish(),
									canDeleteEntities: z.boolean().nullish(),
									canAssignEntities: z.boolean().nullish(),
									canAccessBilling: z.boolean().nullish(),
									canManageEmailTemplates: z.boolean().nullish(),
									canAccessCrm: z.boolean().nullish(),
									canAccessFullCampaigns: z.boolean().nullish(),
									canUsePeopleIQ: z.boolean().nullish(),
									canUseInbox: z.boolean().nullish(),
								})
								.loose()
								.nullish(),
							emails: z.array(z.string()).nullish(),
							phonecallerType: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		origins: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										avatarUrl: z.string().nullish(),
										initials: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									modifiedTime: z.number().int().nullish(),
									lastseenTime: z.number().int().nullish(),
									originType: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		contacts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									description: z.string().nullish(),
									createdTime: z.number().int().nullish(),
									deletedTime: z.number().int().nullish(),
									emails: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
									addresses: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z
														.object({
															location: z
																.object({
																	longitude: z.number().nullish(),
																	latitude: z.number().nullish(),
																})
																.loose()
																.nullish(),
														})
														.loose()
														.nullish(),
													locationAccuracy: z.string().nullish(),
													address_1: z.string().nullish(),
													address_2: z.string().nullish(),
													address_3: z.string().nullish(),
													city: z.string().nullish(),
													state: z.string().nullish(),
													postalCode: z.string().nullish(),
													country: z.string().nullish(),
													timezone: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
									phones: z
										.array(
											z
												.object({
													isOptedOut: z.boolean().nullish(),
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z
														.object({
															countryCode: z.string().nullish(),
															number: z.string().nullish(),
															extension: z.string().nullish(),
															numberFormatted: z.string().nullish(),
															E164: z.string().nullish(),
															countryCodeAndNumber: z.string().nullish(),
														})
														.loose()
														.nullish(),
												})
												.loose(),
										)
										.nullish(),
									urls: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
								})
								.loose(),
							z
								.object({
									avatarUrl: z.string().nullish(),
									initials: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							jobTitle: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							firstName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							lastName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							href: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		accountTypes: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
		industries: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsUpdateInstallmentsInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(
			z
				.object({
					id: z.string().optional(),
					dueTime: z.string(),
					description: z.string().optional(),
					value: z.string(),
					isFailed: z.boolean(),
				})
				.loose(),
		),
	})
	.strict();
const NutshellLeadsUpdateInstallmentsOutputSchema = z
	.object({
		installments: z.array(
			z
				.object({
					id: z.string().nullish(),
					dueTime: z.string().nullish(),
					description: z.string().nullish(),
					value: z
						.object({
							currency: z.string().nullish(),
							amount: z.number().nullish(),
						})
						.loose()
						.nullish(),
					failedTime: z.string().nullish(),
					isPaid: z.boolean().nullish(),
				})
				.loose(),
		),
	})
	.loose();

const NutshellTasksListInputSchema = z
	.object({
		q: z.string().optional(),
		'filter[assignee]': z.array(z.string()).optional(),
		'filter[relatedEntity]': z.string().optional(),
		'filter[dateMin]': z.string().optional(),
		'filter[dateMax]': z.string().optional(),
		'page[limit]': z.string().optional(),
		'page[page]': z.string().optional(),
	})
	.strict();
// Nutshell documents the /tasks list and create routes only as "a list of
// tasks"; both answer with the shared {meta?, links, tasks} envelope. The
// envelope is validated and the item fields mirror the documented /tasks/{id}
// response, kept loose for provider-added fields. The reference gives no body
// schema for either route, so no key is required.
const NutshellTasksEnvelopeSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: z.object({}).loose().nullish(),
		tasks: z
			.array(
				z.intersection(
					z
						.object({
							htmlUrl: z.string().nullish(),
							htmlUrlPath: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							id: z.string().nullish(),
							recurrenceRule: z
								.intersection(
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
									z
										.object({
											rule: z.string().nullish(),
											// Documented values: dueDate, completion. Kept open for later additions.
											mode: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose(),
								)
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();
const NutshellTasksListOutputSchema = NutshellTasksEnvelopeSchema;

const NutshellContactsCreateInputSchema = z
	.object({
		body: z
			.object({
				contacts: z
					.array(
						z
							.object({
								name: z.string().optional(),
								description: z.string().optional(),
								phones: z
									.array(
										z
											.object({
												isOptedOut: z.boolean().optional(),
												isPrimary: z.boolean().optional(),
												name: z.string().optional(),
												value: z
													.object({
														countryCode: z.string().optional(),
														number: z.string().optional(),
														extension: z.string().optional(),
														numberFormatted: z.string().optional(),
														E164: z.string().optional(),
														countryCodeAndNumber: z.string().optional(),
													})
													.loose()
													.optional(),
											})
											.loose(),
									)
									.optional(),
								emails: z
									.array(
										z
											.object({
												isPrimary: z.boolean().optional(),
												name: z.string().optional(),
												value: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								urls: z
									.array(
										z
											.object({
												isPrimary: z.boolean().optional(),
												name: z.string().optional(),
												value: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								addresses: z
									.array(
										z
											.object({
												isPrimary: z.boolean().optional(),
												name: z.string().optional(),
												value: z
													.object({
														location: z
															.object({
																longitude: z.number().optional(),
																latitude: z.number().optional(),
															})
															.loose()
															.optional(),
													})
													.loose()
													.optional(),
												locationAccuracy: z.string().optional(),
												address_1: z.string().optional(),
												address_2: z.string().optional(),
												address_3: z.string().optional(),
												city: z.string().optional(),
												state: z.string().optional(),
												postalCode: z.string().optional(),
												country: z.string().optional(),
												timezone: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								customFields: z.object({}).catchall(z.string()).optional(),
								links: z
									.object({
										accounts: z.array(z.string()).optional(),
										territory: z.string().optional(),
										owner: z.string().optional(),
										tags: z.array(z.string()).optional(),
										emAudiences: z.array(z.string()).optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellContactsCreateOutputSchema = z
	.object({
		links: z.object({}).loose().nullish(),
		contacts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z.intersection(
										z
											.object({
												id: z.string().nullish(),
												name: z.string().nullish(),
												description: z.string().nullish(),
												createdTime: z.number().int().nullish(),
												deletedTime: z.number().int().nullish(),
												emails: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												addresses: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		location: z
																			.object({
																				longitude: z.number().nullish(),
																				latitude: z.number().nullish(),
																			})
																			.loose()
																			.nullish(),
																	})
																	.loose()
																	.nullish(),
																locationAccuracy: z.string().nullish(),
																address_1: z.string().nullish(),
																address_2: z.string().nullish(),
																address_3: z.string().nullish(),
																city: z.string().nullish(),
																state: z.string().nullish(),
																postalCode: z.string().nullish(),
																country: z.string().nullish(),
																timezone: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												phones: z
													.array(
														z
															.object({
																isOptedOut: z.boolean().nullish(),
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		countryCode: z.string().nullish(),
																		number: z.string().nullish(),
																		extension: z.string().nullish(),
																		numberFormatted: z.string().nullish(),
																		E164: z.string().nullish(),
																		countryCodeAndNumber: z.string().nullish(),
																	})
																	.loose()
																	.nullish(),
															})
															.loose(),
													)
													.nullish(),
												urls: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
											})
											.loose(),
										z
											.object({
												avatarUrl: z.string().nullish(),
												initials: z.string().nullish(),
											})
											.loose(),
									),
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										jobTitle: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										firstName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										lastName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										href: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							links: z.object({}).loose().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellAccountsCustomfieldsInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellAccountsCustomfieldsOutputSchema = z
	.object({
		customFields: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							value: z.string().nullish(),
							id: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellActivitiesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellActivitiesGetOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			activities: z
				.array(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										id: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								id: z.string().nullish(),
							})
							.loose(),
					),
				)
				.nullish(),
			id: z.string().nullish(),
			agenda: z
				.unknown() /* OpenAPI schema has no recognized type */
				.nullish(),
			createdTime: z.number().int().nullish(),
			endTime: z.number().int().nullish(),
			deletedTime: z.number().int().nullish(),
			href: z.string().nullish(),
			isAllDay: z.boolean().nullish(),
			isEditable: z.boolean().nullish(),
			isCancelled: z.boolean().nullish(),
			isFlagged: z.boolean().nullish(),
			isLogged: z.boolean().nullish(),
			isOverdue: z.boolean().nullish(),
			loggedTime: z.number().int().nullish(),
			modifiedTime: z.number().int().nullish(),
			name: z.string().nullish(),
			startTime: z.number().int().nullish(),
			isMediaLogged: z.boolean().nullish(),
			transcription: z.string().nullish(),
		})
		.loose(),
);

const NutshellLeadsStagesInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsStagesOutputSchema = z
	.object({
		meta: z
			.intersection(
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						timeSpent: z
							.array(
								z
									.object({
										formatted: z.string().nullish(),
										prefix: z.string().nullish(),
										suffix: z.string().nullish(),
										value: z.number().nullish(),
										unit: z.string().nullish(),
									})
									.loose(),
							)
							.nullish(),
						stageset: z
							.object({
								id: z.string().nullish(),
								name: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
								default: z.boolean().nullish(),
								canAccess: z.boolean().nullish(),
								// Documented values: 1, 2, 3. Kept open for later additions.
								status: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		stages: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						description: z.string().nullish(),
						position: z.number().int().nullish(),
						activeAvatarUrl: z.string().nullish(),
						completeAvatarUrl: z.string().nullish(),
						incompleteAvatarUrl: z.string().nullish(),
						overdueAvatarUrl: z.string().nullish(),
						numSteps: z.number().nullish(),
						canAdvanceStage: z.boolean().nullish(),
						links: z
							.array(
								z
									.object({
										stageset: z.string().nullish(),
									})
									.loose(),
							)
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsListItemsInputSchema = z
	.object({
		filter: z.object({}).catchall(z.string()).optional(),
		q: z.string().optional(),
		sort: z
			.enum([
				'-age',
				'-value',
				'-milestone',
				'-confidence',
				'-name',
				'-closedTime',
				'-owner',
				'-sources',
				'age',
				'value',
				'milestone',
				'confidence',
				'name',
				'closedTime',
				'owner',
				'sources',
			])
			.optional(),
	})
	.strict();
const NutshellLeadsListItemsOutputSchema = z
	.object({
		meta: z
			.intersection(
				z.intersection(
					z
						.object({
							count: z.number().int().nullish(),
						})
						.loose(),
					z
						.object({
							total: z.number().int().nullish(),
						})
						.loose(),
				),
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		listItems: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										avatarUrl: z.string().nullish(),
										initials: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									id: z.string().nullish(),
									primaryName: z.string().nullish(),
									primaryInfo: z.string().nullish(),
									relatedName: z.string().nullish(),
									relatedInfo: z.string().nullish(),
									relatedType: z.string().nullish(),
									relatedUrl: z.string().nullish(),
									relatedUrlPath: z.string().nullish(),
									primaryContact: z.string().nullish(),
									primaryAccount: z.string().nullish(),
									latlon: z.string().nullish(),
									mapUrl: z.string().nullish(),
									isDeleted: z.boolean().nullish(),
									fields: z.array(z.object({}).loose()).nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellProductMapsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(NutshellJsonPatchOperationSchema),
	})
	.strict();
const NutshellProductMapsUpdateOutputSchema = z.undefined();

const NutshellLeadsUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsUndeleteOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellInvoicesListInputSchema = z
	.object({
		'filter[lead]': z.string().optional(),
		'filter[dateMin]': z.string().optional(),
		'filter[dateMax]': z.string().optional(),
		'page[limit]': z.string().optional(),
		'page[page]': z.string().optional(),
	})
	.strict();
const NutshellInvoicesListOutputSchema = z
	.object({
		invoices: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							paidTime: z.string().nullish(),
							completionComment: z.string().nullable().optional(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: z.object({}).loose().nullish(),
	})
	.loose();

const NutshellIndustriesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellIndustriesGetOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z
			.unknown() /* OpenAPI schema has no recognized type */
			.nullish(),
		modifiedTime: z.number().int().nullish(),
	})
	.loose();

const NutshellTagsListInputSchema = z
	.object({
		q: z.string().optional(),
		'filter[tagType]': z.enum(['leads', 'contacts', 'accounts']).optional(),
	})
	.strict();
const NutshellTagsListOutputSchema = z
	.object({
		tags: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.number().int().nullish(),
						tagType: z.string().nullish(),
						count: z.number().int().nullish(),
						colorType: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellEmailsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
// Nutshell does not document the GET /emails/{id} body; the route answers
// with the email entity itself, so validate that object shape and keep the
// message fields loose.
const NutshellEmailsGetOutputSchema = z
	.object({
		id: z.string().nullish(),
	})
	.loose();

const NutshellDashboardsListFieldsInputSchema = z.object({}).strict();
const NutshellDashboardsListFieldsOutputSchema = z
	.object({
		$schema: z.string(),
		type: z.literal('object'),
		description: z.string(),
		properties: z
			.object({
				stageset: z
					.object({
						type: z.literal('enum'),
						enum: z.array(
							z
								.object({
									id: z.string(),
									type: z.literal('stagesets'),
									name: z.string(),
								})
								.loose(),
						),
						title: z.string(),
						description: z.string(),
						isFilterable: z.boolean(),
						isDisplayable: z.boolean(),
						isSortable: z.boolean(),
						isAndable: z.boolean(),
						isNullable: z.boolean(),
						size: z.string(),
					})
					.loose()
					.nullish(),
			})
			.loose(),
	})
	.loose();

const NutshellAccountsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(NutshellJsonPatchOperationSchema),
	})
	.strict();
const NutshellAccountsUpdateOutputSchema = z.undefined();

const NutshellEditionsListInputSchema = z.object({}).strict();
const NutshellEditionsListOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const NutshellProductMapsListInputSchema = z.object({}).strict();
const NutshellProductMapsListOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		productMaps: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						relationship: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						price: z
							.object({
								formatted: z.string().nullish(),
								amount: z.string().nullish(),
								currency: z.string().nullish(),
							})
							.loose()
							.nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						unit: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						quantity: z.number().nullish(),
						productType: z.string().nullish(),
						links: z
							.object({
								product: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellContactsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellContactsDeleteOutputSchema = z.undefined();

const NutshellAccountsListFieldsInputSchema = z.object({}).strict();
const NutshellAccountsListFieldsOutputSchema = z
	.object({
		properties: z
			.object({
				exampleProperty: z
					.object({
						type: z.string().nullish(),
						title: z.string().nullish(),
						description: z.string().nullish(),
						isFilterable: z.boolean().nullish(),
						isDisplayable: z.boolean().nullish(),
						isSortable: z.boolean().nullish(),
						isGoalable: z.boolean().nullish(),
						isAddable: z.boolean().nullish(),
						isBoardable: z.boolean().nullish(),
						isRequireable: z.boolean().nullish(),
						isAndable: z.boolean().nullish(),
						isNullable: z.boolean().nullish(),
						relationships: z.array(z.string()).nullish(),
						enum: z.array(z.string()).nullish(),
						format: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const NutshellSourcesDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellSourcesDeleteOutputSchema = z
	.object({
		sources: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						channel: z
							.object({
								value: z.number().int().nullish(),
								display: z.string().nullish(),
							})
							.loose()
							.nullish(),
						deletedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellNotesUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellNotesUndeleteOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			createdTime: z.string().nullish(),
			deletedTime: z.string().nullish(),
			href: z.string().nullish(),
			body: z.string().nullish(),
			bodyHtml: z.string().nullish(),
			bodyMarkup: z.string().nullish(),
			isEditable: z.boolean().nullish(),
			parentType: z.string().nullish(),
		})
		.loose(),
);

const NutshellLeadsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(NutshellJsonPatchOperationSchema),
	})
	.strict();
const NutshellLeadsUpdateOutputSchema = z.undefined();

const NutshellQuotesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellQuotesGetOutputSchema = z
	.object({
		quotes: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							acceptedTime: z.string().nullish(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsCustomFieldAttributesInputSchema = z.object({}).strict();
const NutshellLeadsCustomFieldAttributesOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
		})
		.loose(),
);

const NutshellContactsCustomfieldsInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellContactsCustomfieldsOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
		})
		.loose(),
);

const NutshellTasksCreateInputSchema = z
	.object({
		body: z
			.object({
				// One task per request, inside a `tasks` array: a flat body gets 400.
				tasks: z
					.array(
						z
							.object({
								title: z.string().optional(),
								description: z.string().optional(),
								dueTime: z.string().optional(),
								recurrenceRule: z
									.intersection(
										z
											.object({
												htmlUrl: z.string().optional(),
												htmlUrlPath: z.string().optional(),
											})
											.loose(),
										z
											.object({
												rule: z.string().optional(),
												mode: z.enum(['dueDate', 'completion']).optional(),
												id: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								links: z
									.object({
										relatedEntity: z.string().optional(),
										assignee: z.string().optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellTasksCreateOutputSchema = NutshellTasksEnvelopeSchema.optional();

const NutshellTodosListInputSchema = z
	.object({
		'filter[assignee]': z
			.string()
			.regex(new RegExp('^[0-9]+-users$'))
			.optional(),
		'filter[type]': z
			.array(z.enum(['tasks', 'steps', 'follow-ups', 'follow-up tasks']))
			.optional(),
		'filter[stagesets]': z
			.array(z.string().regex(new RegExp('^[0-9]+-stagesets$')))
			.optional(),
		'filter[dueTime]': z.string().optional(),
		'filter[dueWindow]': z
			.enum(['overdue', 'today', 'tomorrow', 'upcoming'])
			.optional(),
		q: z.string().optional(),
		includeComplete: z.union([z.literal(0), z.literal(1)]).optional(),
		onlyComplete: z.union([z.literal(0), z.literal(1)]).optional(),
		includeDoneFacet: z.union([z.literal(0), z.literal(1)]).optional(),
		onlyDue: z.union([z.literal(0), z.literal(1)]).optional(),
		onlyHotLeads: z.union([z.literal(0), z.literal(1)]).optional(),
		singleStep: z.union([z.literal(0), z.literal(1)]).optional(),
		'page[startIndex]': z.number().int().optional(),
		'page[limit]': z.number().int().optional(),
		'page[endIndex]': z.number().int().optional(),
	})
	.strict();
const NutshellTodosListOutputSchema = z
	.object({
		todos: z.array(
			z
				.object({
					// Documented as <n>-tasks or <n>-steps; kept open with `type`.
					id: z.string(),
					// Documented values: tasks, steps (filter[type] also accepts follow-ups). Kept open for later additions.
					type: z.string(),
					title: z.string(),
					description: z.string().nullable().optional(),
					href: z.string().nullish(),
					dueTime: z.number().int().nullable().optional(),
					completedTime: z.number().int().nullable().optional(),
					isCompleted: z.boolean().nullish(),
					isOverdue: z.boolean().nullish(),
					isRecurring: z.boolean().nullish(),
					isSkipped: z.boolean().nullish(),
					delays: z
						.array(
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullable().optional(),
									displayLength: z.string().nullable().optional(),
								})
								.loose(),
						)
						.nullish(),
					links: z.object({}).loose().nullish(),
				})
				.loose(),
		),
		relatedEntities: z.array(z.object({}).loose()).nullish(),
		users: z.array(z.object({}).loose()).nullish(),
		meta: z
			.object({
				count: z.number().int().nullable(),
				facets: z
					.object({
						past: z.number().int().nullable(),
						today: z.number().int().nullable(),
						tomorrow: z.number().int().nullable(),
						future: z.number().int().nullable(),
						done: z.number().int().nullable().optional(),
					})
					.loose(),
				page: z
					.object({
						startIndex: z.number().int().min(0),
						endIndex: z.number().int().min(0),
					})
					.loose(),
			})
			.loose(),
		links: z.object({}).loose().nullish(),
	})
	.loose();

const NutshellUsersGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellUsersGetOutputSchema = z
	.object({
		meta: z
			.intersection(
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						next: z.string().nullish(),
						previous: z.string().nullish(),
						total: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
		users: z
			.array(
				z.intersection(
					z.intersection(
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
						z
							.object({
								id: z.string().nullish(),
								name: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
								firstName: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
								modifiedTime: z.number().int().nullish(),
								isEnabled: z.boolean().nullish(),
								hasSetPassword: z.boolean().nullish(),
								isAdministrator: z.boolean().nullish(),
								isViewingRestricted: z.boolean().nullish(),
								isHiddenFromFilters: z.boolean().nullish(),
								canAccessEmailMarketing: z.boolean().nullish(),
								permissions: z
									.object({
										canAccessSetup: z.boolean().nullish(),
										canAccessMarketing: z.boolean().nullish(),
										canBulkEdit: z.boolean().nullish(),
										canExport: z.boolean().nullish(),
										canViewSharedEmails: z.boolean().nullish(),
										canImport: z.boolean().nullish(),
										canMergeEntities: z.boolean().nullish(),
										canDeleteEntities: z.boolean().nullish(),
										canAssignEntities: z.boolean().nullish(),
										canAccessBilling: z.boolean().nullish(),
										canManageEmailTemplates: z.boolean().nullish(),
										canAccessCrm: z.boolean().nullish(),
										canAccessFullCampaigns: z.boolean().nullish(),
										canUsePeopleIQ: z.boolean().nullish(),
										canUseInbox: z.boolean().nullish(),
									})
									.loose()
									.nullish(),
								emails: z.array(z.string()).nullish(),
								phonecallerType: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellContactsCustomFieldAttributesInputSchema = z.object({}).strict();
const NutshellContactsCustomFieldAttributesOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
		})
		.loose(),
);

const NutshellProductCategoriesCreateInputSchema = z
	.object({
		body: z
			.object({
				productCategories: z
					.array(
						z
							.object({
								name: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellProductCategoriesCreateOutputSchema = z
	.object({
		productCategories: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellProductCategoriesListInputSchema = z.object({}).strict();
const NutshellProductCategoriesListOutputSchema = z
	.object({
		productCategories: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellProductMapsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellProductMapsGetOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		productMaps: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						relationship: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						price: z
							.object({
								formatted: z.string().nullish(),
								amount: z.string().nullish(),
								currency: z.string().nullish(),
							})
							.loose()
							.nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						unit: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						quantity: z.number().nullish(),
						productType: z.string().nullish(),
						links: z
							.object({
								product: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsStatusInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				outcomeId: z.string().optional(),
				competitorMaps: z.array(z.string()).optional(),
				productMaps: z
					.array(
						z
							.object({
								id: z.string().optional(),
								relationship: z
									.unknown() /* OpenAPI schema has no recognized type */
									.optional(),
								price: z
									.object({
										formatted: z.string().optional(),
										amount: z.string().optional(),
										currency: z.string().optional(),
									})
									.loose()
									.optional(),
								name: z
									.unknown() /* OpenAPI schema has no recognized type */
									.optional(),
								unit: z
									.unknown() /* OpenAPI schema has no recognized type */
									.optional(),
								quantity: z.number().optional(),
								productType: z.string().optional(),
								links: z
									.object({
										product: z.string().optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose()
			.optional(),
	})
	.strict();
const NutshellLeadsStatusOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellAccountTypesListInputSchema = z.object({}).strict();
const NutshellAccountTypesListOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
			name: z.string().nullish(),
			modifiedTime: z.number().int().nullish(),
		})
		.loose(),
);

const NutshellEditionsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellEditionsGetOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const NutshellProductsUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellProductsUndeleteOutputSchema = z
	.object({
		products: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						description: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.string().nullish(),
						sku: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						productType: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						prices: z
							.object({
								'1-markets': z
									.object({
										amount: z.number().nullish(),
										currency: z.string().nullish(),
										formatted: z.string().nullish(),
										currencySymbol: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						price: z
							.object({
								amount: z.number().nullish(),
								currency: z.string().nullish(),
								formatted: z.string().nullish(),
								currencySymbol: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellTagsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellTagsDeleteOutputSchema = z
	.object({
		tags: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.number().int().nullish(),
						tagType: z.string().nullish(),
						count: z.number().int().nullish(),
						colorType: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellContactsListItemsInputSchema = z
	.object({
		filter: z.object({}).catchall(z.string()).optional(),
		q: z.string().optional(),
		sort: z
			.array(
				z.enum([
					'-accountType',
					'-accounts',
					'-createdTime',
					'-industry',
					'-lastContactedTime',
					'-owner',
					'-phone',
					'-postalCode',
					'-territory',
					'accountType',
					'accounts',
					'createdTime',
					'industry',
					'lastContactedTime',
					'owner',
					'phone',
					'postalCode',
					'territory',
				]),
			)
			.optional(),
	})
	.strict();
const NutshellContactsListItemsOutputSchema = z
	.object({
		meta: z
			.intersection(
				z.intersection(
					z
						.object({
							count: z.number().int().nullish(),
						})
						.loose(),
					z
						.object({
							total: z.number().int().nullish(),
						})
						.loose(),
				),
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		listItems: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
									z
										.object({
											avatarUrl: z.string().nullish(),
											initials: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										id: z.string().nullish(),
										primaryName: z.string().nullish(),
										primaryInfo: z.string().nullish(),
										relatedName: z.string().nullish(),
										relatedInfo: z.string().nullish(),
										relatedType: z.string().nullish(),
										relatedUrl: z.string().nullish(),
										relatedUrlPath: z.string().nullish(),
										primaryContact: z.string().nullish(),
										primaryAccount: z.string().nullish(),
										latlon: z.string().nullish(),
										mapUrl: z.string().nullish(),
										isDeleted: z.boolean().nullish(),
										fields: z.array(z.object({}).loose()).nullish(),
									})
									.loose(),
							),
							z
								.object({
									description: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellProductMapsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
// The reference documents 200 with this body or 204 with none.
const NutshellProductMapsDeleteOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		productMaps: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						relationship: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						price: z
							.object({
								formatted: z.string().nullish(),
								amount: z.string().nullish(),
								currency: z.string().nullish(),
							})
							.loose()
							.nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						unit: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						quantity: z.number().nullish(),
						productType: z.string().nullish(),
						links: z
							.object({
								product: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose()
	.optional();

const NutshellLeadsInstallmentsInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsInstallmentsOutputSchema = z
	.object({
		installments: z.array(
			z
				.object({
					id: z.string().nullish(),
					dueTime: z.string().nullish(),
					description: z.string().nullish(),
					value: z
						.object({
							currency: z.string().nullish(),
							amount: z.number().nullish(),
						})
						.loose()
						.nullish(),
					failedTime: z.string().nullish(),
					isPaid: z.boolean().nullish(),
				})
				.loose(),
		),
	})
	.loose();

const NutshellLeadsCreateInputSchema = z
	.object({
		body: z
			.object({
				leads: z
					.array(
						z
							.object({
								description: z.string().optional(),
								manualValue: z.string().optional(),
								dueTime: z
									.object({
										absoluteLocalizedString: z.string().optional(),
										timestamp: z.number().optional(),
										value: z.string().optional(),
									})
									.loose()
									.optional(),
								customFields: z.object({}).catchall(z.string()).optional(),
								links: z
									.object({
										accounts: z.array(z.string()).optional(),
										contacts: z.array(z.string()).optional(),
										owner: z.string().optional(),
										sources: z.array(z.string()).optional(),
										tags: z.array(z.string()).optional(),
										productMaps: z
											.array(
												z
													.object({
														id: z.string().optional(),
														relationship: z
															.unknown() /* OpenAPI schema has no recognized type */
															.optional(),
														price: z
															.object({
																formatted: z.string().optional(),
																amount: z.string().optional(),
																currency: z.string().optional(),
															})
															.loose()
															.optional(),
														name: z
															.unknown() /* OpenAPI schema has no recognized type */
															.optional(),
														unit: z
															.unknown() /* OpenAPI schema has no recognized type */
															.optional(),
														quantity: z.number().optional(),
														productType: z.string().optional(),
														links: z
															.object({
																product: z.string().optional(),
															})
															.loose()
															.optional(),
													})
													.loose(),
											)
											.optional(),
										competitorMaps: z.array(z.string()).optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellLeadsCreateOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellNotesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellNotesGetOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			createdTime: z.string().nullish(),
			deletedTime: z.string().nullish(),
			href: z.string().nullish(),
			body: z.string().nullish(),
			bodyHtml: z.string().nullish(),
			bodyMarkup: z.string().nullish(),
			isEditable: z.boolean().nullish(),
			parentType: z.string().nullish(),
		})
		.loose(),
);

const NutshellIndustriesListInputSchema = z.object({}).strict();
const NutshellIndustriesListOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
			name: z
				.unknown() /* OpenAPI schema has no recognized type */
				.nullish(),
			modifiedTime: z.number().int().nullish(),
		})
		.loose(),
);

const NutshellFormsGetFieldIdInputSchema = z
	.object({
		fieldId: z.string().min(1),
	})
	.strict();
const NutshellFormsGetFieldIdOutputSchema = z
	.object({
		wfFields: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						label: z.string().nullish(),
						fieldName: z.string().nullish(),
						fieldType: z.string().nullish(),
						entityName: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsCustomfieldsInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsCustomfieldsOutputSchema = z.array(
	z.intersection(
		z
			.object({
				id: z.string().nullish(),
			})
			.loose(),
		z
			.object({
				value: z.string().nullish(),
				id: z.string().nullish(),
			})
			.loose(),
	),
);

const NutshellCompetitorMapsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellCompetitorMapsDeleteOutputSchema = z.undefined();

const NutshellNotesDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellNotesDeleteOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			createdTime: z.string().nullish(),
			deletedTime: z.string().nullish(),
			href: z.string().nullish(),
			body: z.string().nullish(),
			bodyHtml: z.string().nullish(),
			bodyMarkup: z.string().nullish(),
			isEditable: z.boolean().nullish(),
			parentType: z.string().nullish(),
		})
		.loose(),
);

const NutshellStageSetsListInputSchema = z.object({}).strict();
const NutshellStageSetsListOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose(),
		links: z.object({}).loose(),
		stagesets: z.array(
			z.intersection(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						default: z.boolean().nullish(),
						canAccess: z.boolean().nullish(),
						// Documented values: 1, 2, 3. Kept open for later additions.
						status: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						type: z.literal('stagesets'),
						links: z
							.object({
								stages: z.array(
									z.string().regex(new RegExp('^[0-9]+-stages$')),
								),
							})
							.loose(),
					})
					.loose(),
			),
		),
	})
	.loose();

const NutshellTagsCreateInputSchema = z
	.object({
		body: z
			.object({
				tags: z
					.array(
						z
							.object({
								name: z.string().optional(),
								colorType: z
									.enum([
										'1',
										'2',
										'3',
										'4',
										'5',
										'6',
										'7',
										'8',
										'9',
										'10',
										'11',
										'12',
										'13',
										'14',
									])
									.optional(),
								tagType: z.enum(['1', '2', '3']).optional(),
								links: z
									.object({
										entities: z.array(z.string()).optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellTagsCreateOutputSchema = z
	.object({
		tags: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.number().int().nullish(),
						tagType: z.string().nullish(),
						count: z.number().int().nullish(),
						colorType: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellContactsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellContactsGetOutputSchema = z
	.object({
		links: z.object({}).loose().nullish(),
		contacts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z.intersection(
										z
											.object({
												id: z.string().nullish(),
												name: z.string().nullish(),
												description: z.string().nullish(),
												createdTime: z.number().int().nullish(),
												deletedTime: z.number().int().nullish(),
												emails: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												addresses: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		location: z
																			.object({
																				longitude: z.number().nullish(),
																				latitude: z.number().nullish(),
																			})
																			.loose()
																			.nullish(),
																	})
																	.loose()
																	.nullish(),
																locationAccuracy: z.string().nullish(),
																address_1: z.string().nullish(),
																address_2: z.string().nullish(),
																address_3: z.string().nullish(),
																city: z.string().nullish(),
																state: z.string().nullish(),
																postalCode: z.string().nullish(),
																country: z.string().nullish(),
																timezone: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												phones: z
													.array(
														z
															.object({
																isOptedOut: z.boolean().nullish(),
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		countryCode: z.string().nullish(),
																		number: z.string().nullish(),
																		extension: z.string().nullish(),
																		numberFormatted: z.string().nullish(),
																		E164: z.string().nullish(),
																		countryCodeAndNumber: z.string().nullish(),
																	})
																	.loose()
																	.nullish(),
															})
															.loose(),
													)
													.nullish(),
												urls: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
											})
											.loose(),
										z
											.object({
												avatarUrl: z.string().nullish(),
												initials: z.string().nullish(),
											})
											.loose(),
									),
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										jobTitle: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										firstName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										lastName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										href: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							links: z.object({}).loose().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellSourcesUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellSourcesUndeleteOutputSchema = z
	.object({
		sources: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						channel: z
							.object({
								value: z.number().int().nullish(),
								display: z.string().nullish(),
							})
							.loose()
							.nullish(),
						deletedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellTasksDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellTasksDeleteOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			recurrenceRule: z
				.intersection(
					z
						.object({
							htmlUrl: z.string().nullish(),
							htmlUrlPath: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							rule: z.string().nullish(),
							// Documented values: dueDate, completion. Kept open for later additions.
							mode: z.string().nullish(),
							id: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);

const NutshellQuotesCreateInvoiceInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellQuotesCreateInvoiceOutputSchema = z
	.object({
		invoices: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							paidTime: z.string().nullish(),
							completionComment: z.string().nullable().optional(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsGetOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose(),
		links: z.object({}).loose(),
		leads: z.array(
			z.intersection(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										avatarUrl: z.string().nullish(),
										initials: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									id: z.string().nullish(),
									deletedTime: z.string().nullish(),
									name: z.string().nullish(),
									value: z
										.object({
											formatted: z.string().nullish(),
											amount: z.string().nullish(),
											currency: z.string().nullish(),
										})
										.loose()
										.nullish(),
									number: z.number().int().nullish(),
									description: z.string().nullish(),
									createdTime: z
										.object({
											absoluteLocalizedString: z.string().nullish(),
											timestamp: z.number().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
									closedTime: z.string().nullish(),
									dueTime: z.string().nullish(),
									anticipatedClosedTime: z.string().nullish(),
									ownerType: z.string().nullish(),
									status: z.string().nullish(),
									lastContactedTime: z
										.unknown() /* OpenAPI schema has no recognized type */
										.nullish(),
									pieState: z.string().nullish(),
									isOverdue: z.boolean().nullish(),
									overdueTime: z.string().nullish(),
									href: z.string().nullish(),
									confidence: z.number().int().nullish(),
									priority: z.number().int().nullish(),
									isCurrentUserWatching: z.boolean().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
				z
					.object({
						attributionTracking: z
							.object({
								gclid: z.array(z.string()),
								fbclid: z.array(z.string()),
								msclkid: z.array(z.string()),
								lifatid: z.array(z.string()),
								wbraid: z.array(z.string()),
								gbraid: z.array(z.string()),
							})
							.loose(),
					})
					.loose(),
			),
		),
	})
	.loose();

const NutshellLeadsCreateCustomFieldInputSchema = z
	.object({
		body: z
			.object({
				name: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				type: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				choices: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				isMultiple: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				id: z.string().optional(),
				title: z.string().optional(),
			})
			.loose(),
	})
	.strict();
// Nutshell does not document the created-field body; the route answers with
// the created custom field, validated around its known identifier and name.
// The reference documents a 200 without a body schema, so nothing is
// required here and an empty answer is accepted.
const NutshellLeadsCreateCustomFieldOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose()
	.optional();

const NutshellEventsListInputSchema = z
	.object({
		max_id: z.string().optional(),
		since_id: z.string().optional(),
		max_time: z.number().int().optional(),
		since_time: z.number().int().optional(),
		entity_id: z.string().optional(),
		limit: z.number().int().optional(),
		events: z
			.array(
				z.enum([
					'comments',
					'mailchimp',
					'followup',
					'constantContact',
					'emailInteraction',
					'assignments',
					'formSubmissions',
				]),
			)
			.optional(),
		'filters[payload][]': z
			.array(
				z.enum([
					'accounts',
					'activities',
					'assignments',
					'chats',
					'companyEnrichment',
					'constantContact',
					'contacts',
					'emails',
					'emailInteraction',
					'formSubmissions',
					'inbox_threads',
					'leadUpdates',
					'leads',
					'marketingEmails',
					'mcfxSessions',
					'notes',
					'queued',
					'ticketMessages',
					'undelivered',
					'unshared',
				]),
			)
			.optional(),
		'filters[creator][]': z.array(z.string()).optional(),
		'filters[emailEntityType][]': z
			.array(z.enum(['sender', 'recipient']))
			.optional(),
	})
	.strict();
const NutshellEventsListOutputSchema = z
	.object({
		meta: z
			.intersection(
				z.intersection(
					z
						.object({
							instanceId: z.string().nullish(),
							siteId: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							previous: z.string().nullish(),
						})
						.loose(),
				),
				z
					.object({
						next: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		events: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							createdTime: z.number().int().nullish(),
							actorType: z.string().nullish(),
							payloadType: z.string().nullish(),
							action: z.string().nullish(),
							changes: z
								.array(
									z
										.object({
											attribute: z.string().nullish(),
											oldValue: z
												.object({
													id: z.string().nullish(),
													type: z.string().nullish(),
													name: z.string().nullish(),
													position: z.number().int().nullish(),
												})
												.loose()
												.nullish(),
											newValue: z
												.object({
													id: z.string().nullish(),
													type: z.string().nullish(),
													name: z.string().nullish(),
													position: z.number().int().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							count: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							links: z
								.object({
									actor: z.string().nullish(),
									payloads: z.array(z.string()).nullish(),
									comments: z.array(z.string()).nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellQuotesStatusInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				status: z.enum(['READY', 'SENT', 'REVOKED', 'ACCEPTED', 'ARCHIVED']),
				acceptedName: z.string().optional(),
				acceptedEmail: z.string().optional(),
			})
			.loose(),
	})
	.strict();
const NutshellQuotesStatusOutputSchema = z
	.object({
		quotes: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							acceptedTime: z.string().nullish(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellOutcomesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellOutcomesGetOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const NutshellFiltersListInputSchema = z
	.object({
		userId: z.string().optional(),
		reportType: z
			.enum([
				'report_*',
				'entity_list_leads',
				'entity_list_contacts',
				'entity_list_accounts',
			])
			.optional(),
		filter: z.string().optional(),
	})
	.strict();
// Nutshell does not document the GET /filters body; saved filters are keyed
// under the conventional plural like every other list route, so validate that
// envelope and keep per-filter fields loose.
const NutshellFiltersListOutputSchema = z
	.object({
		// The reference gives no body schema for this route, so the key is not
		// required.
		filters: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellAccountsCreateCustomFieldInputSchema = z
	.object({
		body: z
			.object({
				name: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				type: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				choices: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				isMultiple: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				id: z.string().optional(),
				title: z.string().optional(),
			})
			.loose(),
	})
	.strict();
// Nutshell does not document the created-field body; the route answers with
// the created custom field, validated around its known identifier and name.
// The reference documents a 200 without a body schema, so nothing is
// required here and an empty answer is accepted.
const NutshellAccountsCreateCustomFieldOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose()
	.optional();

const NutshellContactsListFieldsInputSchema = z.object({}).strict();
const NutshellContactsListFieldsOutputSchema = z
	.object({
		properties: z
			.object({
				exampleProperty: z
					.object({
						type: z.string().nullish(),
						title: z.string().nullish(),
						description: z.string().nullish(),
						isFilterable: z.boolean().nullish(),
						isDisplayable: z.boolean().nullish(),
						isSortable: z.boolean().nullish(),
						isGoalable: z.boolean().nullish(),
						isAddable: z.boolean().nullish(),
						isBoardable: z.boolean().nullish(),
						isRequireable: z.boolean().nullish(),
						isAndable: z.boolean().nullish(),
						isNullable: z.boolean().nullish(),
						relationships: z.array(z.string()).nullish(),
						enum: z.array(z.string()).nullish(),
						format: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const NutshellMarketsListInputSchema = z.object({}).strict();
const NutshellMarketsListOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		currency: z.string().nullish(),
		currencySymbol: z.string().nullish(),
		isDefault: z.boolean().nullish(),
	})
	.loose();

const NutshellAudiencesCreateInputSchema = z
	.object({
		body: z
			.object({
				emAudiences: z
					.array(
						z
							.object({
								name: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellAudiencesCreateOutputSchema = z
	.object({
		emAudiences: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						type: z.string().nullish(),
						name: z.string().nullish(),
						isWebFX: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsPostStagesetInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				stageset: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.strict();
const NutshellLeadsPostStagesetOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellFormsListInputSchema = z.object({}).strict();
const NutshellFormsListOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		links: z.object({}).loose().nullish(),
		wfForms: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							name: z.string().nullish(),
							href: z.string().nullish(),
							createdTime: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							links: z
								.object({
									fields: z.array(z.string()).nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellStageSetsExportInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellStageSetsExportOutputSchema = z.string();

const NutshellActivitiesListInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().int().optional(),
		'filter[participant][]': z.array(z.string()).optional(),
		'filter[status][]': z
			.array(z.enum(['scheduled', 'logged', 'cancelled']))
			.optional(),
		'filter[leadPriority][]': z.literal('hot').optional(),
		'filter[activityType]': z.array(z.number().int()).optional(),
		'filter[flagged]': z.boolean().optional(),
		'filter[isImportant]': z.boolean().optional(),
		'filter[dateMin]': z.string().optional(),
		'filter[dateMax]': z.string().optional(),
	})
	.strict();
const NutshellActivitiesListOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			activities: z
				.array(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										id: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								id: z.string().nullish(),
							})
							.loose(),
					),
				)
				.nullish(),
			id: z.string().nullish(),
			agenda: z
				.unknown() /* OpenAPI schema has no recognized type */
				.nullish(),
			createdTime: z.number().int().nullish(),
			endTime: z.number().int().nullish(),
			deletedTime: z.number().int().nullish(),
			href: z.string().nullish(),
			isAllDay: z.boolean().nullish(),
			isEditable: z.boolean().nullish(),
			isCancelled: z.boolean().nullish(),
			isFlagged: z.boolean().nullish(),
			isLogged: z.boolean().nullish(),
			isOverdue: z.boolean().nullish(),
			loggedTime: z.number().int().nullish(),
			modifiedTime: z.number().int().nullish(),
			name: z.string().nullish(),
			startTime: z.number().int().nullish(),
			isMediaLogged: z.boolean().nullish(),
			transcription: z.string().nullish(),
		})
		.loose(),
);

const NutshellCompetitorMapsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellCompetitorMapsGetOutputSchema = z
	.object({
		competitorMaps: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						relationship: z.string().nullish(),
						name: z.string().nullish(),
						status: z
							// Documented values: potential, stole, beat. Kept open for later additions.
							.union([z.string(), z.null()])
							.nullish(),
						links: z
							.object({
								lead: z.string().nullish(),
								competitor: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		leads: z
			.array(
				z.intersection(
					z.intersection(
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							id: z.string().nullish(),
							deletedTime: z.string().nullish(),
							name: z.string().nullish(),
							value: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							number: z.number().int().nullish(),
							description: z.string().nullish(),
							createdTime: z
								.object({
									absoluteLocalizedString: z.string().nullish(),
									timestamp: z.number().nullish(),
									value: z.string().nullish(),
								})
								.loose()
								.nullish(),
							closedTime: z.string().nullish(),
							dueTime: z.string().nullish(),
							anticipatedClosedTime: z.string().nullish(),
							ownerType: z.string().nullish(),
							status: z.string().nullish(),
							lastContactedTime: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							pieState: z.string().nullish(),
							isOverdue: z.boolean().nullish(),
							overdueTime: z.string().nullish(),
							href: z.string().nullish(),
							confidence: z.number().int().nullish(),
							priority: z.number().int().nullish(),
							isCurrentUserWatching: z.boolean().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		competitors: z
			.array(
				z
					.object({
						id: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellCompetitorMapsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(NutshellJsonPatchOperationSchema),
	})
	.strict();
const NutshellCompetitorMapsUpdateOutputSchema = z.undefined();

const NutshellInvoicesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellInvoicesGetOutputSchema = z
	.object({
		invoices: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							paidTime: z.string().nullish(),
							completionComment: z.string().nullable().optional(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellCompetitorsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellCompetitorsGetOutputSchema = z
	.object({
		competitors: z
			.unknown() /* OpenAPI schema has no recognized type */
			.nullish(),
		id: z.string().nullish(),
		name: z.string().nullish(),
		modifiedTime: z.number().int().nullish(),
	})
	.loose();

const NutshellLeadsReportInputSchema = z
	.object({
		'filter[name]': z.string().optional(),
		q: z.string().optional(),
		sort: z.string().optional(),
		// pdf/png are excluded on purpose: the shared transport returns
		// non-JSON bodies as decoded text, so binary export bytes cannot be
		// represented faithfully. csv and html exports arrive as text.
		format: z.enum(['json', 'csv', 'html']).optional(),
		gap: z.enum(['d', 'w', 'm', 'y', 'q']).optional(),
		groupByField: z.string().optional(),
		pivotFacet: z.string().optional(),
		reportType: z
			.enum([
				'sales',
				'losses',
				'newleads',
				'forecast',
				'attribution',
				'custom',
			])
			.optional(),
		segmentByField: z
			.enum([
				'outcomes',
				'competitors',
				'products',
				'productCategories',
				'assignees',
				'territories',
				'sources',
				'tags',
				'channels',
			])
			.optional(),
		useConfidence: z.boolean().optional(),
	})
	.strict();
const NutshellLeadsReportJsonObjectSchema = z
	.object({
		reports: z
			.array(
				z
					.object({
						report: z
							.object({
								id: z.string().nullish(),
								key: z.string().nullish(),
								data: z
									.array(
										z
											.object({
												bucket: z
													.object({
														bucket: z.string().nullish(),
														count: z
															.object({
																formatted: z.string().nullish(),
																prefix: z.string().nullish(),
																suffix: z.string().nullish(),
																value: z.number().nullish(),
															})
															.loose()
															.nullish(),
														total: z
															.object({
																formatted: z.string().nullish(),
																prefix: z.string().nullish(),
																suffix: z.string().nullish(),
																value: z.number().nullish(),
															})
															.loose()
															.nullish(),
														bucketType: z.string().nullish(),
														bucketSubtype: z.string().nullish(),
														filters: z.array(z.string()).nullish(),
														segments: z.array(z.string()).nullish(),
													})
													.loose()
													.nullish(),
											})
											.loose(),
									)
									.nullish(),
								name: z.string().nullish(),
								prefix: z.string().nullish(),
								summary: z
									.object({
										bucket: z.string().nullish(),
										count: z
											.object({
												formatted: z.string().nullish(),
												prefix: z.string().nullish(),
												suffix: z.string().nullish(),
												value: z.number().nullish(),
											})
											.loose()
											.nullish(),
										total: z
											.object({
												formatted: z.string().nullish(),
												prefix: z.string().nullish(),
												suffix: z.string().nullish(),
												value: z.number().nullish(),
											})
											.loose()
											.nullish(),
										bucketType: z.string().nullish(),
										bucketSubtype: z.string().nullish(),
										filters: z.array(z.string()).nullish(),
										segments: z.array(z.string()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

// json reports arrive as the object above; csv/html exports arrive as text
// (the shared transport returns non-JSON bodies as strings).
const NutshellLeadsReportOutputSchema = z.union([
	NutshellLeadsReportJsonObjectSchema,
	z.string(),
]);

const NutshellContactsUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellContactsUndeleteOutputSchema = z
	.object({
		links: z.object({}).loose().nullish(),
		contacts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z.intersection(
										z
											.object({
												id: z.string().nullish(),
												name: z.string().nullish(),
												description: z.string().nullish(),
												createdTime: z.number().int().nullish(),
												deletedTime: z.number().int().nullish(),
												emails: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												addresses: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		location: z
																			.object({
																				longitude: z.number().nullish(),
																				latitude: z.number().nullish(),
																			})
																			.loose()
																			.nullish(),
																	})
																	.loose()
																	.nullish(),
																locationAccuracy: z.string().nullish(),
																address_1: z.string().nullish(),
																address_2: z.string().nullish(),
																address_3: z.string().nullish(),
																city: z.string().nullish(),
																state: z.string().nullish(),
																postalCode: z.string().nullish(),
																country: z.string().nullish(),
																timezone: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												phones: z
													.array(
														z
															.object({
																isOptedOut: z.boolean().nullish(),
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		countryCode: z.string().nullish(),
																		number: z.string().nullish(),
																		extension: z.string().nullish(),
																		numberFormatted: z.string().nullish(),
																		E164: z.string().nullish(),
																		countryCodeAndNumber: z.string().nullish(),
																	})
																	.loose()
																	.nullish(),
															})
															.loose(),
													)
													.nullish(),
												urls: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
											})
											.loose(),
										z
											.object({
												avatarUrl: z.string().nullish(),
												initials: z.string().nullish(),
											})
											.loose(),
									),
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										jobTitle: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										firstName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										lastName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										href: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							links: z.object({}).loose().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellLeadsWatchInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellLeadsWatchOutputSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(
				z
					.object({
						htmlUrl: z.string().nullish(),
						htmlUrlPath: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						avatarUrl: z.string().nullish(),
						initials: z.string().nullish(),
					})
					.loose(),
			),
			z
				.object({
					id: z.string().nullish(),
					deletedTime: z.string().nullish(),
					name: z.string().nullish(),
					value: z
						.object({
							formatted: z.string().nullish(),
							amount: z.string().nullish(),
							currency: z.string().nullish(),
						})
						.loose()
						.nullish(),
					number: z.number().int().nullish(),
					description: z.string().nullish(),
					createdTime: z
						.object({
							absoluteLocalizedString: z.string().nullish(),
							timestamp: z.number().nullish(),
							value: z.string().nullish(),
						})
						.loose()
						.nullish(),
					closedTime: z.string().nullish(),
					dueTime: z.string().nullish(),
					anticipatedClosedTime: z.string().nullish(),
					ownerType: z.string().nullish(),
					status: z.string().nullish(),
					lastContactedTime: z
						.unknown() /* OpenAPI schema has no recognized type */
						.nullish(),
					pieState: z.string().nullish(),
					isOverdue: z.boolean().nullish(),
					overdueTime: z.string().nullish(),
					href: z.string().nullish(),
					confidence: z.number().int().nullish(),
					priority: z.number().int().nullish(),
					isCurrentUserWatching: z.boolean().nullish(),
				})
				.loose(),
		),
		z
			.object({
				htmlUrl: z.string().nullish(),
				htmlUrlPath: z.string().nullish(),
			})
			.loose(),
	),
	z
		.object({
			avatarUrl: z.string().nullish(),
			initials: z.string().nullish(),
		})
		.loose(),
);

const NutshellNotesListInputSchema = z
	.object({
		'page[limit]': z.string().optional(),
		'page[page]': z.string().optional(),
	})
	.strict();
const NutshellNotesListOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			createdTime: z.string().nullish(),
			deletedTime: z.string().nullish(),
			href: z.string().nullish(),
			body: z.string().nullish(),
			bodyHtml: z.string().nullish(),
			bodyMarkup: z.string().nullish(),
			isEditable: z.boolean().nullish(),
			parentType: z.string().nullish(),
		})
		.loose(),
);

const NutshellActivitiesUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				activities: z
					.array(
						z
							.object({
								name: z.string().optional(),
								description: z.string().optional(),
								note: z.string().optional(),
								location: z.string().optional(),
								activityType: z.string().optional(),
								startTime: z.number().int().optional(),
								endTime: z.number().int().optional(),
								transcription: z.string().optional(),
								isFlagged: z.boolean().optional(),
								isLogged: z.boolean().optional(),
								isAllDay: z.boolean().optional(),
								links: z
									.object({
										participants: z.array(z.string()).optional(),
										leads: z.array(z.string()).optional(),
									})
									.loose()
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellActivitiesUpdateOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			activities: z
				.array(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										id: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								id: z.string().nullish(),
							})
							.loose(),
					),
				)
				.nullish(),
			id: z.string().nullish(),
			agenda: z
				.unknown() /* OpenAPI schema has no recognized type */
				.nullish(),
			createdTime: z.number().int().nullish(),
			endTime: z.number().int().nullish(),
			deletedTime: z.number().int().nullish(),
			href: z.string().nullish(),
			isAllDay: z.boolean().nullish(),
			isEditable: z.boolean().nullish(),
			isCancelled: z.boolean().nullish(),
			isFlagged: z.boolean().nullish(),
			isLogged: z.boolean().nullish(),
			isOverdue: z.boolean().nullish(),
			loggedTime: z.number().int().nullish(),
			modifiedTime: z.number().int().nullish(),
			name: z.string().nullish(),
			startTime: z.number().int().nullish(),
			isMediaLogged: z.boolean().nullish(),
			transcription: z.string().nullish(),
		})
		.loose(),
);

const NutshellContactsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(NutshellJsonPatchOperationSchema),
	})
	.strict();
const NutshellContactsUpdateOutputSchema = z.undefined();

const NutshellSourcesCreateInputSchema = z
	.object({
		body: z
			.object({
				sources: z
					.array(
						z
							.object({
								name: z.string().optional(),
								channel: z
									.union([
										z.literal(0),
										z.literal(1),
										z.literal(2),
										z.literal(3),
										z.literal(4),
										z.literal(5),
										z.literal(6),
										z.literal(7),
										z.literal(8),
									])
									.optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellSourcesCreateOutputSchema = z
	.object({
		sources: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						channel: z
							.object({
								value: z.number().int().nullish(),
								display: z.string().nullish(),
							})
							.loose()
							.nullish(),
						deletedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellContactsListInputSchema = z
	.object({
		email: z.string().optional(),
		q: z.string().optional(),
		sort: z
			.enum([
				'accountType',
				'-accountType',
				'accounts',
				'-accounts',
				'createdTime',
				'-createdTime',
				'email',
				'-email',
				'industry',
				'-industry',
				'lastContactedTime',
				'-lastContactedTime',
				'name',
				'-name',
				'owner',
				'-owner',
				'phone',
				'-phone',
				'postalCode',
				'-postalCode',
				'territory',
				'-territory',
			])
			.optional(),
		filter: z.object({}).catchall(z.string()).optional(),
		'page[page]': z.number().int().optional(),
		'page[limit]': z.number().int().optional(),
	})
	.strict();
const NutshellContactsListOutputSchema = z
	.object({
		links: z.object({}).loose().nullish(),
		contacts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z.intersection(
										z
											.object({
												id: z.string().nullish(),
												name: z.string().nullish(),
												description: z.string().nullish(),
												createdTime: z.number().int().nullish(),
												deletedTime: z.number().int().nullish(),
												emails: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												addresses: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		location: z
																			.object({
																				longitude: z.number().nullish(),
																				latitude: z.number().nullish(),
																			})
																			.loose()
																			.nullish(),
																	})
																	.loose()
																	.nullish(),
																locationAccuracy: z.string().nullish(),
																address_1: z.string().nullish(),
																address_2: z.string().nullish(),
																address_3: z.string().nullish(),
																city: z.string().nullish(),
																state: z.string().nullish(),
																postalCode: z.string().nullish(),
																country: z.string().nullish(),
																timezone: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
												phones: z
													.array(
														z
															.object({
																isOptedOut: z.boolean().nullish(),
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z
																	.object({
																		countryCode: z.string().nullish(),
																		number: z.string().nullish(),
																		extension: z.string().nullish(),
																		numberFormatted: z.string().nullish(),
																		E164: z.string().nullish(),
																		countryCodeAndNumber: z.string().nullish(),
																	})
																	.loose()
																	.nullish(),
															})
															.loose(),
													)
													.nullish(),
												urls: z
													.array(
														z
															.object({
																isPrimary: z.boolean().nullish(),
																name: z.string().nullish(),
																value: z.string().nullish(),
															})
															.loose(),
													)
													.nullish(),
											})
											.loose(),
										z
											.object({
												avatarUrl: z.string().nullish(),
												initials: z.string().nullish(),
											})
											.loose(),
									),
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										jobTitle: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										firstName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										lastName: z
											.unknown() /* OpenAPI schema has no recognized type */
											.nullish(),
										href: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									htmlUrl: z.string().nullish(),
									htmlUrlPath: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							links: z.object({}).loose().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellTerritoriesListInputSchema = z.object({}).strict();
const NutshellTerritoriesListOutputSchema = z.array(
	z
		.object({
			id: z.string().nullish(),
			name: z.string().nullish(),
			href: z.string().nullish(),
			modifiedTime: z.number().nullish(),
		})
		.loose(),
);

const NutshellInvoicesStatusInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				status: z.enum(['READY', 'SENT', 'REVOKED', 'ACCEPTED', 'ARCHIVED']),
				comment: z.string().optional(),
				acceptedName: z.string().optional(),
				acceptedEmail: z.string().optional(),
			})
			.loose(),
	})
	.strict();
const NutshellInvoicesStatusOutputSchema = z
	.object({
		invoices: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							displayStatus: z
								.enum([
									'DRAFT',
									'READY',
									'SENT',
									'REVOKED',
									'ACCEPTED',
									'ARCHIVED',
									'EXPIRED',
								])
								.nullish(),
							productLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											product: z.string().nullable().optional(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											sku: z.string().nullish(),
											quantity: z.number().nullish(),
											term: z.string().nullable().optional(),
											price: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
											discountUnit: z.string().nullable().optional(),
											discountNumber: z.number().nullable().optional(),
										})
										.loose(),
								)
								.nullish(),
							subtotalLineItems: z
								.array(
									z
										.object({
											id: z.string().nullish(),
											position: z.number().int().nullish(),
											label: z.string().nullish(),
											modifierUnit: z.string().nullish(),
											modifierValue: z.number().nullish(),
											// Documented values: + and -. Kept open so a value Nutshell adds later does not fail the response.
											operation: z.string().nullish(),
											total: z
												.object({
													formatted: z.string().nullish(),
													amount: z.string().nullish(),
													currency: z.string().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							recipient: z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									email: z.string().nullable().optional(),
								})
								.loose()
								.nullable()
								.optional(),
							acceptedName: z.string().nullable().optional(),
							acceptedEmail: z.string().nullable().optional(),
						})
						.loose(),
					z
						.object({
							number: z.string().nullish(),
							total: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							validThroughTime: z.string().nullish(),
							createdTime: z.string().nullish(),
							publishedTime: z.string().nullish(),
							sentTime: z.string().nullish(),
							paidTime: z.string().nullish(),
							completionComment: z.string().nullable().optional(),
							deletedTime: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellAccountsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellAccountsGetOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		accounts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z
										.object({
											id: z.string().nullish(),
											name: z.string().nullish(),
											description: z.string().nullish(),
											createdTime: z.number().int().nullish(),
											deletedTime: z.number().int().nullish(),
											emails: z
												.array(
													z
														.object({
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z.string().nullish(),
														})
														.loose(),
												)
												.nullish(),
											addresses: z
												.array(
													z
														.object({
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z
																.object({
																	location: z
																		.object({
																			longitude: z.number().nullish(),
																			latitude: z.number().nullish(),
																		})
																		.loose()
																		.nullish(),
																})
																.loose()
																.nullish(),
															locationAccuracy: z.string().nullish(),
															address_1: z.string().nullish(),
															address_2: z.string().nullish(),
															address_3: z.string().nullish(),
															city: z.string().nullish(),
															state: z.string().nullish(),
															postalCode: z.string().nullish(),
															country: z.string().nullish(),
															timezone: z.string().nullish(),
														})
														.loose(),
												)
												.nullish(),
											phones: z
												.array(
													z
														.object({
															isOptedOut: z.boolean().nullish(),
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z
																.object({
																	countryCode: z.string().nullish(),
																	number: z.string().nullish(),
																	extension: z.string().nullish(),
																	numberFormatted: z.string().nullish(),
																	E164: z.string().nullish(),
																	countryCodeAndNumber: z.string().nullish(),
																})
																.loose()
																.nullish(),
														})
														.loose(),
												)
												.nullish(),
											urls: z
												.array(
													z
														.object({
															isPrimary: z.boolean().nullish(),
															name: z.string().nullish(),
															value: z.string().nullish(),
														})
														.loose(),
												)
												.nullish(),
										})
										.loose(),
									z
										.object({
											avatarUrl: z.string().nullish(),
											initials: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									href: z.string().nullish(),
									revenue: z
										.object({
											amount: z.string().nullish(),
											formatted: z.string().nullish(),
										})
										.loose()
										.nullish(),
									employeeCount: z.number().int().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		creators: z
			.array(
				z.intersection(
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							id: z.string().nullish(),
							name: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							firstName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							modifiedTime: z.number().int().nullish(),
							isEnabled: z.boolean().nullish(),
							hasSetPassword: z.boolean().nullish(),
							isAdministrator: z.boolean().nullish(),
							isViewingRestricted: z.boolean().nullish(),
							isHiddenFromFilters: z.boolean().nullish(),
							canAccessEmailMarketing: z.boolean().nullish(),
							permissions: z
								.object({
									canAccessSetup: z.boolean().nullish(),
									canAccessMarketing: z.boolean().nullish(),
									canBulkEdit: z.boolean().nullish(),
									canExport: z.boolean().nullish(),
									canViewSharedEmails: z.boolean().nullish(),
									canImport: z.boolean().nullish(),
									canMergeEntities: z.boolean().nullish(),
									canDeleteEntities: z.boolean().nullish(),
									canAssignEntities: z.boolean().nullish(),
									canAccessBilling: z.boolean().nullish(),
									canManageEmailTemplates: z.boolean().nullish(),
									canAccessCrm: z.boolean().nullish(),
									canAccessFullCampaigns: z.boolean().nullish(),
									canUsePeopleIQ: z.boolean().nullish(),
									canUseInbox: z.boolean().nullish(),
								})
								.loose()
								.nullish(),
							emails: z.array(z.string()).nullish(),
							phonecallerType: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		owners: z
			.array(
				z.intersection(
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							id: z.string().nullish(),
							name: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							firstName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							modifiedTime: z.number().int().nullish(),
							isEnabled: z.boolean().nullish(),
							hasSetPassword: z.boolean().nullish(),
							isAdministrator: z.boolean().nullish(),
							isViewingRestricted: z.boolean().nullish(),
							isHiddenFromFilters: z.boolean().nullish(),
							canAccessEmailMarketing: z.boolean().nullish(),
							permissions: z
								.object({
									canAccessSetup: z.boolean().nullish(),
									canAccessMarketing: z.boolean().nullish(),
									canBulkEdit: z.boolean().nullish(),
									canExport: z.boolean().nullish(),
									canViewSharedEmails: z.boolean().nullish(),
									canImport: z.boolean().nullish(),
									canMergeEntities: z.boolean().nullish(),
									canDeleteEntities: z.boolean().nullish(),
									canAssignEntities: z.boolean().nullish(),
									canAccessBilling: z.boolean().nullish(),
									canManageEmailTemplates: z.boolean().nullish(),
									canAccessCrm: z.boolean().nullish(),
									canAccessFullCampaigns: z.boolean().nullish(),
									canUsePeopleIQ: z.boolean().nullish(),
									canUseInbox: z.boolean().nullish(),
								})
								.loose()
								.nullish(),
							emails: z.array(z.string()).nullish(),
							phonecallerType: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		origins: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z
									.object({
										avatarUrl: z.string().nullish(),
										initials: z.string().nullish(),
									})
									.loose(),
								z
									.object({
										htmlUrl: z.string().nullish(),
										htmlUrlPath: z.string().nullish(),
									})
									.loose(),
							),
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									modifiedTime: z.number().int().nullish(),
									lastseenTime: z.number().int().nullish(),
									originType: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		contacts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									description: z.string().nullish(),
									createdTime: z.number().int().nullish(),
									deletedTime: z.number().int().nullish(),
									emails: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
									addresses: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z
														.object({
															location: z
																.object({
																	longitude: z.number().nullish(),
																	latitude: z.number().nullish(),
																})
																.loose()
																.nullish(),
														})
														.loose()
														.nullish(),
													locationAccuracy: z.string().nullish(),
													address_1: z.string().nullish(),
													address_2: z.string().nullish(),
													address_3: z.string().nullish(),
													city: z.string().nullish(),
													state: z.string().nullish(),
													postalCode: z.string().nullish(),
													country: z.string().nullish(),
													timezone: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
									phones: z
										.array(
											z
												.object({
													isOptedOut: z.boolean().nullish(),
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z
														.object({
															countryCode: z.string().nullish(),
															number: z.string().nullish(),
															extension: z.string().nullish(),
															numberFormatted: z.string().nullish(),
															E164: z.string().nullish(),
															countryCodeAndNumber: z.string().nullish(),
														})
														.loose()
														.nullish(),
												})
												.loose(),
										)
										.nullish(),
									urls: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
								})
								.loose(),
							z
								.object({
									avatarUrl: z.string().nullish(),
									initials: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							jobTitle: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							firstName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							lastName: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							href: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		accountTypes: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
		industries: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellNotesCreateInputSchema = z
	.object({
		body: z
			.object({
				data: z
					.object({
						body: z
							.unknown() /* OpenAPI schema has no recognized type */
							.optional(),
						links: z
							.object({
								parent: z.string().optional(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
	})
	.strict();
const NutshellNotesCreateOutputSchema = z.intersection(
	z
		.object({
			htmlUrl: z.string().nullish(),
			htmlUrlPath: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			id: z.string().nullish(),
			createdTime: z.string().nullish(),
			deletedTime: z.string().nullish(),
			href: z.string().nullish(),
			body: z.string().nullish(),
			bodyHtml: z.string().nullish(),
			bodyMarkup: z.string().nullish(),
			isEditable: z.boolean().nullish(),
			parentType: z.string().nullish(),
		})
		.loose(),
);

const NutshellActivityTypesListInputSchema = z.object({}).strict();
const NutshellActivityTypesListOutputSchema = z
	.object({
		meta: z
			.object({
				instanceId: z.string().nullish(),
				siteId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		activityTypes: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						isBenchmarkable: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellUsersListInputSchema = z.object({}).strict();
const NutshellUsersListOutputSchema = z
	.object({
		meta: z
			.intersection(
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
				z
					.object({
						next: z.string().nullish(),
						previous: z.string().nullish(),
						total: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
		users: z
			.array(
				z.intersection(
					z.intersection(
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
						z
							.object({
								id: z.string().nullish(),
								name: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
								firstName: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
								modifiedTime: z.number().int().nullish(),
								isEnabled: z.boolean().nullish(),
								hasSetPassword: z.boolean().nullish(),
								isAdministrator: z.boolean().nullish(),
								isViewingRestricted: z.boolean().nullish(),
								isHiddenFromFilters: z.boolean().nullish(),
								canAccessEmailMarketing: z.boolean().nullish(),
								permissions: z
									.object({
										canAccessSetup: z.boolean().nullish(),
										canAccessMarketing: z.boolean().nullish(),
										canBulkEdit: z.boolean().nullish(),
										canExport: z.boolean().nullish(),
										canViewSharedEmails: z.boolean().nullish(),
										canImport: z.boolean().nullish(),
										canMergeEntities: z.boolean().nullish(),
										canDeleteEntities: z.boolean().nullish(),
										canAssignEntities: z.boolean().nullish(),
										canAccessBilling: z.boolean().nullish(),
										canManageEmailTemplates: z.boolean().nullish(),
										canAccessCrm: z.boolean().nullish(),
										canAccessFullCampaigns: z.boolean().nullish(),
										canUsePeopleIQ: z.boolean().nullish(),
										canUseInbox: z.boolean().nullish(),
									})
									.loose()
									.nullish(),
								emails: z.array(z.string()).nullish(),
								phonecallerType: z
									.unknown() /* OpenAPI schema has no recognized type */
									.nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellFormsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellFormsGetOutputSchema = z.intersection(
	z
		.object({
			meta: z
				.object({
					instanceId: z.string().nullish(),
					siteId: z.string().nullish(),
				})
				.loose()
				.nullish(),
			links: z.object({}).loose().nullish(),
			wfForms: z
				.array(
					z.intersection(
						z
							.object({
								id: z.string().nullish(),
								name: z.string().nullish(),
								href: z.string().nullish(),
								createdTime: z.string().nullish(),
							})
							.loose(),
						z
							.object({
								links: z
									.object({
										fields: z.array(z.string()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose(),
					),
				)
				.nullish(),
		})
		.loose(),
	z
		.object({
			wfFields: z
				.array(
					z
						.object({
							id: z.string().nullish(),
							label: z.string().nullish(),
							fieldName: z.string().nullish(),
							fieldType: z.string().nullish(),
							entityName: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);

const NutshellContactsCreateCustomFieldInputSchema = z
	.object({
		body: z
			.object({
				name: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				type: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				choices: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				isMultiple: z
					.unknown() /* OpenAPI schema has no recognized type */
					.optional(),
				id: z.string().optional(),
				title: z.string().optional(),
			})
			.loose(),
	})
	.strict();
// Nutshell does not document the created-field body; the route answers with
// the created custom field, validated around its known identifier and name.
// The reference documents a 200 without a body schema, so nothing is
// required here and an empty answer is accepted.
const NutshellContactsCreateCustomFieldOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose()
	.optional();

const NutshellProductCategoriesGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellProductCategoriesGetOutputSchema = z
	.object({
		productCategories: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellProductsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellProductsGetOutputSchema = z
	.object({
		products: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						href: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						description: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.string().nullish(),
						sku: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						productType: z
							.unknown() /* OpenAPI schema has no recognized type */
							.nullish(),
						prices: z
							.object({
								'1-markets': z
									.object({
										amount: z.number().nullish(),
										currency: z.string().nullish(),
										formatted: z.string().nullish(),
										currencySymbol: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						price: z
							.object({
								amount: z.number().nullish(),
								currency: z.string().nullish(),
								formatted: z.string().nullish(),
								currencySymbol: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellEventsDeletedInputSchema = z
	.object({
		'filter[types]': z
			.enum([
				'accounts',
				'activities',
				'assignments',
				'chats',
				'companyEnrichment',
				'constantContact',
				'contacts',
				'emails',
				'emailInteraction',
				'formSubmissions',
				'inbox_threads',
				'leadUpdates',
				'leads',
				'marketingEmails',
				'mcfxSessions',
				'notes',
				'queued',
				'ticketMessages',
				'undelivered',
				'unshared',
			])
			.optional(),
		sort: z.literal('-change_time').optional(),
	})
	.strict();
const NutshellEventsDeletedOutputSchema = z
	.object({
		meta: z
			.intersection(
				z.intersection(
					z
						.object({
							instanceId: z.string().nullish(),
							siteId: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							previous: z.string().nullish(),
						})
						.loose(),
				),
				z
					.object({
						next: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		events: z
			.array(
				z.intersection(
					z
						.object({
							id: z.string().nullish(),
							createdTime: z.number().int().nullish(),
							actorType: z.string().nullish(),
							payloadType: z.string().nullish(),
							action: z.string().nullish(),
							changes: z
								.array(
									z
										.object({
											attribute: z.string().nullish(),
											oldValue: z
												.object({
													id: z.string().nullish(),
													type: z.string().nullish(),
													name: z.string().nullish(),
													position: z.number().int().nullish(),
												})
												.loose()
												.nullish(),
											newValue: z
												.object({
													id: z.string().nullish(),
													type: z.string().nullish(),
													name: z.string().nullish(),
													position: z.number().int().nullish(),
												})
												.loose()
												.nullish(),
										})
										.loose(),
								)
								.nullish(),
							count: z.string().nullish(),
						})
						.loose(),
					z
						.object({
							links: z
								.object({
									actor: z.string().nullish(),
									payloads: z.array(z.string()).nullish(),
									comments: z.array(z.string()).nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellCompetitorMapsListInputSchema = z.object({}).strict();
const NutshellCompetitorMapsListOutputSchema = z
	.object({
		competitorMaps: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						relationship: z.string().nullish(),
						name: z.string().nullish(),
						status: z
							// Documented values: potential, stole, beat. Kept open for later additions.
							.union([z.string(), z.null()])
							.nullish(),
						links: z
							.object({
								lead: z.string().nullish(),
								competitor: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		leads: z
			.array(
				z.intersection(
					z.intersection(
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
						z
							.object({
								avatarUrl: z.string().nullish(),
								initials: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							id: z.string().nullish(),
							deletedTime: z.string().nullish(),
							name: z.string().nullish(),
							value: z
								.object({
									formatted: z.string().nullish(),
									amount: z.string().nullish(),
									currency: z.string().nullish(),
								})
								.loose()
								.nullish(),
							number: z.number().int().nullish(),
							description: z.string().nullish(),
							createdTime: z
								.object({
									absoluteLocalizedString: z.string().nullish(),
									timestamp: z.number().nullish(),
									value: z.string().nullish(),
								})
								.loose()
								.nullish(),
							closedTime: z.string().nullish(),
							dueTime: z.string().nullish(),
							anticipatedClosedTime: z.string().nullish(),
							ownerType: z.string().nullish(),
							status: z.string().nullish(),
							lastContactedTime: z
								.unknown() /* OpenAPI schema has no recognized type */
								.nullish(),
							pieState: z.string().nullish(),
							isOverdue: z.boolean().nullish(),
							overdueTime: z.string().nullish(),
							href: z.string().nullish(),
							confidence: z.number().int().nullish(),
							priority: z.number().int().nullish(),
							isCurrentUserWatching: z.boolean().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
		competitors: z
			.array(
				z
					.object({
						id: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellTagsUndeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
const NutshellTagsUndeleteOutputSchema = z
	.object({
		tags: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						href: z.string().nullish(),
						modifiedTime: z.number().int().nullish(),
						deletedTime: z.number().int().nullish(),
						tagType: z.string().nullish(),
						count: z.number().int().nullish(),
						colorType: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const NutshellTasksUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z.array(NutshellJsonPatchOperationSchema),
	})
	.strict();
const NutshellTasksUpdateOutputSchema = z.undefined();

const NutshellAccountsListInputSchema = z
	.object({
		email: z.string().optional(),
		q: z.string().optional(),
		filter: z.object({}).catchall(z.string()).optional(),
		sort: z
			.array(
				z.enum([
					'-accountType',
					'-createdTime',
					'-industry',
					'-lastContactedTime',
					'-name',
					'-numberOfContacts',
					'-owner',
					'-phone',
					'-postalCode',
					'-territory',
					'accountType',
					'createdTime',
					'industry',
					'lastContactedTime',
					'name',
					'numberOfContacts',
					'owner',
					'phone',
					'postalCode',
					'territory',
				]),
			)
			.optional(),
		'page[limit]': z.string().optional(),
		'page[page]': z.string().optional(),
	})
	.strict();
const NutshellAccountsListOutputSchema = z
	.object({
		meta: z
			.intersection(
				z.intersection(
					z.intersection(
						z
							.object({
								count: z.number().int().nullish(),
							})
							.loose(),
						z
							.object({
								total: z.number().int().nullish(),
							})
							.loose(),
					),
					z
						.object({
							facets: z
								.object({
									AccountType: z
										.object({
											'n-accountTypes': z.number().int().nullish(),
										})
										.loose()
										.nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				),
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		accounts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
									description: z.string().nullish(),
									createdTime: z.number().int().nullish(),
									deletedTime: z.number().int().nullish(),
									emails: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
									addresses: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z
														.object({
															location: z
																.object({
																	longitude: z.number().nullish(),
																	latitude: z.number().nullish(),
																})
																.loose()
																.nullish(),
														})
														.loose()
														.nullish(),
													locationAccuracy: z.string().nullish(),
													address_1: z.string().nullish(),
													address_2: z.string().nullish(),
													address_3: z.string().nullish(),
													city: z.string().nullish(),
													state: z.string().nullish(),
													postalCode: z.string().nullish(),
													country: z.string().nullish(),
													timezone: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
									phones: z
										.array(
											z
												.object({
													isOptedOut: z.boolean().nullish(),
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z
														.object({
															countryCode: z.string().nullish(),
															number: z.string().nullish(),
															extension: z.string().nullish(),
															numberFormatted: z.string().nullish(),
															E164: z.string().nullish(),
															countryCodeAndNumber: z.string().nullish(),
														})
														.loose()
														.nullish(),
												})
												.loose(),
										)
										.nullish(),
									urls: z
										.array(
											z
												.object({
													isPrimary: z.boolean().nullish(),
													name: z.string().nullish(),
													value: z.string().nullish(),
												})
												.loose(),
										)
										.nullish(),
								})
								.loose(),
							z
								.object({
									avatarUrl: z.string().nullish(),
									initials: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							href: z.string().nullish(),
							revenue: z
								.object({
									amount: z.string().nullish(),
									formatted: z.string().nullish(),
								})
								.loose()
								.nullish(),
							employeeCount: z.number().int().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

const NutshellAccountsListItemsInputSchema = z
	.object({
		filter: z.object({}).catchall(z.string()).optional(),
		q: z.string().optional(),
		sort: z
			.array(
				z.enum([
					'-accountType',
					'-createdTime',
					'-industry',
					'-lastContactedTime',
					'-name',
					'-numberOfContacts',
					'-owner',
					'-phone',
					'-postalCode',
					'-territory',
					'accountType',
					'createdTime',
					'industry',
					'lastContactedTime',
					'name',
					'numberOfContacts',
					'owner',
					'phone',
					'postalCode',
					'territory',
				]),
			)
			.optional(),
	})
	.strict();
const NutshellAccountsListItemsOutputSchema = z
	.object({
		meta: z
			.intersection(
				z.intersection(
					z.intersection(
						z
							.object({
								count: z.number().int().nullish(),
							})
							.loose(),
						z
							.object({
								total: z.number().int().nullish(),
							})
							.loose(),
					),
					z
						.object({
							facets: z
								.object({
									AccountType: z
										.object({
											'n-accountTypes': z.number().int().nullish(),
										})
										.loose()
										.nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				),
				z
					.object({
						instanceId: z.string().nullish(),
						siteId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		listItems: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(
							z.intersection(
								z.intersection(
									z
										.object({
											htmlUrl: z.string().nullish(),
											htmlUrlPath: z.string().nullish(),
										})
										.loose(),
									z
										.object({
											avatarUrl: z.string().nullish(),
											initials: z.string().nullish(),
										})
										.loose(),
								),
								z
									.object({
										id: z.string().nullish(),
										primaryName: z.string().nullish(),
										primaryInfo: z.string().nullish(),
										relatedName: z.string().nullish(),
										relatedInfo: z.string().nullish(),
										relatedType: z.string().nullish(),
										relatedUrl: z.string().nullish(),
										relatedUrlPath: z.string().nullish(),
										primaryContact: z.string().nullish(),
										primaryAccount: z.string().nullish(),
										latlon: z.string().nullish(),
										mapUrl: z.string().nullish(),
										isDeleted: z.boolean().nullish(),
										fields: z.array(z.object({}).loose()).nullish(),
									})
									.loose(),
							),
							z
								.object({
									description: z.string().nullish(),
								})
								.loose(),
						),
						z
							.object({
								htmlUrl: z.string().nullish(),
								htmlUrlPath: z.string().nullish(),
							})
							.loose(),
					),
					z
						.object({
							avatarUrl: z.string().nullish(),
							initials: z.string().nullish(),
						})
						.loose(),
				),
			)
			.nullish(),
	})
	.loose();

export const NutshellEndpointInputSchemas = {
	'stages.list': NutshellStagesListInputSchema,
	'audiences.list': NutshellAudiencesListInputSchema,
	'leads.list': NutshellLeadsListInputSchema,
	'quotes.list': NutshellQuotesListInputSchema,
	'accounts.customFieldAttributes':
		NutshellAccountsCustomFieldAttributesInputSchema,
	'outcomes.list': NutshellOutcomesListInputSchema,
	'tasks.get': NutshellTasksGetInputSchema,
	'leads.reopen': NutshellLeadsReopenInputSchema,
	'markets.get': NutshellMarketsGetInputSchema,
	'products.list': NutshellProductsListInputSchema,
	'leads.listFields': NutshellLeadsListFieldsInputSchema,
	'accounts.create': NutshellAccountsCreateInputSchema,
	'accounts.undelete': NutshellAccountsUndeleteInputSchema,
	'products.delete': NutshellProductsDeleteInputSchema,
	'activities.create': NutshellActivitiesCreateInputSchema,
	'leads.delete': NutshellLeadsDeleteInputSchema,
	'sources.list': NutshellSourcesListInputSchema,
	'competitors.list': NutshellCompetitorsListInputSchema,
	'accounts.delete': NutshellAccountsDeleteInputSchema,
	'leads.updateInstallments': NutshellLeadsUpdateInstallmentsInputSchema,
	'tasks.list': NutshellTasksListInputSchema,
	'contacts.create': NutshellContactsCreateInputSchema,
	'accounts.customfields': NutshellAccountsCustomfieldsInputSchema,
	'activities.get': NutshellActivitiesGetInputSchema,
	'leads.stages': NutshellLeadsStagesInputSchema,
	'leads.listItems': NutshellLeadsListItemsInputSchema,
	'productMaps.update': NutshellProductMapsUpdateInputSchema,
	'leads.undelete': NutshellLeadsUndeleteInputSchema,
	'invoices.list': NutshellInvoicesListInputSchema,
	'industries.get': NutshellIndustriesGetInputSchema,
	'tags.list': NutshellTagsListInputSchema,
	'emails.get': NutshellEmailsGetInputSchema,
	'dashboards.listFields': NutshellDashboardsListFieldsInputSchema,
	'accounts.update': NutshellAccountsUpdateInputSchema,
	'editions.list': NutshellEditionsListInputSchema,
	'productMaps.list': NutshellProductMapsListInputSchema,
	'contacts.delete': NutshellContactsDeleteInputSchema,
	'accounts.listFields': NutshellAccountsListFieldsInputSchema,
	'sources.delete': NutshellSourcesDeleteInputSchema,
	'notes.undelete': NutshellNotesUndeleteInputSchema,
	'leads.update': NutshellLeadsUpdateInputSchema,
	'quotes.get': NutshellQuotesGetInputSchema,
	'leads.customFieldAttributes': NutshellLeadsCustomFieldAttributesInputSchema,
	'contacts.customfields': NutshellContactsCustomfieldsInputSchema,
	'tasks.create': NutshellTasksCreateInputSchema,
	'todos.list': NutshellTodosListInputSchema,
	'users.get': NutshellUsersGetInputSchema,
	'contacts.customFieldAttributes':
		NutshellContactsCustomFieldAttributesInputSchema,
	'productCategories.create': NutshellProductCategoriesCreateInputSchema,
	'productCategories.list': NutshellProductCategoriesListInputSchema,
	'productMaps.get': NutshellProductMapsGetInputSchema,
	'leads.status': NutshellLeadsStatusInputSchema,
	'accountTypes.list': NutshellAccountTypesListInputSchema,
	'editions.get': NutshellEditionsGetInputSchema,
	'products.undelete': NutshellProductsUndeleteInputSchema,
	'tags.delete': NutshellTagsDeleteInputSchema,
	'contacts.listItems': NutshellContactsListItemsInputSchema,
	'productMaps.delete': NutshellProductMapsDeleteInputSchema,
	'leads.installments': NutshellLeadsInstallmentsInputSchema,
	'leads.create': NutshellLeadsCreateInputSchema,
	'notes.get': NutshellNotesGetInputSchema,
	'industries.list': NutshellIndustriesListInputSchema,
	'forms.getFieldId': NutshellFormsGetFieldIdInputSchema,
	'leads.customfields': NutshellLeadsCustomfieldsInputSchema,
	'competitorMaps.delete': NutshellCompetitorMapsDeleteInputSchema,
	'notes.delete': NutshellNotesDeleteInputSchema,
	'stageSets.list': NutshellStageSetsListInputSchema,
	'tags.create': NutshellTagsCreateInputSchema,
	'contacts.get': NutshellContactsGetInputSchema,
	'sources.undelete': NutshellSourcesUndeleteInputSchema,
	'tasks.delete': NutshellTasksDeleteInputSchema,
	'quotes.createInvoice': NutshellQuotesCreateInvoiceInputSchema,
	'leads.get': NutshellLeadsGetInputSchema,
	'leads.createCustomField': NutshellLeadsCreateCustomFieldInputSchema,
	'events.list': NutshellEventsListInputSchema,
	'quotes.status': NutshellQuotesStatusInputSchema,
	'outcomes.get': NutshellOutcomesGetInputSchema,
	'filters.list': NutshellFiltersListInputSchema,
	'accounts.createCustomField': NutshellAccountsCreateCustomFieldInputSchema,
	'contacts.listFields': NutshellContactsListFieldsInputSchema,
	'markets.list': NutshellMarketsListInputSchema,
	'audiences.create': NutshellAudiencesCreateInputSchema,
	'leads.postStageset': NutshellLeadsPostStagesetInputSchema,
	'forms.list': NutshellFormsListInputSchema,
	'stageSets.export': NutshellStageSetsExportInputSchema,
	'activities.list': NutshellActivitiesListInputSchema,
	'competitorMaps.get': NutshellCompetitorMapsGetInputSchema,
	'competitorMaps.update': NutshellCompetitorMapsUpdateInputSchema,
	'invoices.get': NutshellInvoicesGetInputSchema,
	'competitors.get': NutshellCompetitorsGetInputSchema,
	'leads.report': NutshellLeadsReportInputSchema,
	'contacts.undelete': NutshellContactsUndeleteInputSchema,
	'leads.watch': NutshellLeadsWatchInputSchema,
	'notes.list': NutshellNotesListInputSchema,
	'activities.update': NutshellActivitiesUpdateInputSchema,
	'contacts.update': NutshellContactsUpdateInputSchema,
	'sources.create': NutshellSourcesCreateInputSchema,
	'contacts.list': NutshellContactsListInputSchema,
	'territories.list': NutshellTerritoriesListInputSchema,
	'invoices.status': NutshellInvoicesStatusInputSchema,
	'accounts.get': NutshellAccountsGetInputSchema,
	'notes.create': NutshellNotesCreateInputSchema,
	'activityTypes.list': NutshellActivityTypesListInputSchema,
	'users.list': NutshellUsersListInputSchema,
	'forms.get': NutshellFormsGetInputSchema,
	'contacts.createCustomField': NutshellContactsCreateCustomFieldInputSchema,
	'productCategories.get': NutshellProductCategoriesGetInputSchema,
	'products.get': NutshellProductsGetInputSchema,
	'events.deleted': NutshellEventsDeletedInputSchema,
	'competitorMaps.list': NutshellCompetitorMapsListInputSchema,
	'tags.undelete': NutshellTagsUndeleteInputSchema,
	'tasks.update': NutshellTasksUpdateInputSchema,
	'accounts.list': NutshellAccountsListInputSchema,
	'accounts.listItems': NutshellAccountsListItemsInputSchema,
} as const;

export const NutshellEndpointOutputSchemas = {
	'stages.list': NutshellStagesListOutputSchema,
	'audiences.list': NutshellAudiencesListOutputSchema,
	'leads.list': NutshellLeadsListOutputSchema,
	'quotes.list': NutshellQuotesListOutputSchema,
	'accounts.customFieldAttributes':
		NutshellAccountsCustomFieldAttributesOutputSchema,
	'outcomes.list': NutshellOutcomesListOutputSchema,
	'tasks.get': NutshellTasksGetOutputSchema,
	'leads.reopen': NutshellLeadsReopenOutputSchema,
	'markets.get': NutshellMarketsGetOutputSchema,
	'products.list': NutshellProductsListOutputSchema,
	'leads.listFields': NutshellLeadsListFieldsOutputSchema,
	'accounts.create': NutshellAccountsCreateOutputSchema,
	'accounts.undelete': NutshellAccountsUndeleteOutputSchema,
	'products.delete': NutshellProductsDeleteOutputSchema,
	'activities.create': NutshellActivitiesCreateOutputSchema,
	'leads.delete': NutshellLeadsDeleteOutputSchema,
	'sources.list': NutshellSourcesListOutputSchema,
	'competitors.list': NutshellCompetitorsListOutputSchema,
	'accounts.delete': NutshellAccountsDeleteOutputSchema,
	'leads.updateInstallments': NutshellLeadsUpdateInstallmentsOutputSchema,
	'tasks.list': NutshellTasksListOutputSchema,
	'contacts.create': NutshellContactsCreateOutputSchema,
	'accounts.customfields': NutshellAccountsCustomfieldsOutputSchema,
	'activities.get': NutshellActivitiesGetOutputSchema,
	'leads.stages': NutshellLeadsStagesOutputSchema,
	'leads.listItems': NutshellLeadsListItemsOutputSchema,
	'productMaps.update': NutshellProductMapsUpdateOutputSchema,
	'leads.undelete': NutshellLeadsUndeleteOutputSchema,
	'invoices.list': NutshellInvoicesListOutputSchema,
	'industries.get': NutshellIndustriesGetOutputSchema,
	'tags.list': NutshellTagsListOutputSchema,
	'emails.get': NutshellEmailsGetOutputSchema,
	'dashboards.listFields': NutshellDashboardsListFieldsOutputSchema,
	'accounts.update': NutshellAccountsUpdateOutputSchema,
	'editions.list': NutshellEditionsListOutputSchema,
	'productMaps.list': NutshellProductMapsListOutputSchema,
	'contacts.delete': NutshellContactsDeleteOutputSchema,
	'accounts.listFields': NutshellAccountsListFieldsOutputSchema,
	'sources.delete': NutshellSourcesDeleteOutputSchema,
	'notes.undelete': NutshellNotesUndeleteOutputSchema,
	'leads.update': NutshellLeadsUpdateOutputSchema,
	'quotes.get': NutshellQuotesGetOutputSchema,
	'leads.customFieldAttributes': NutshellLeadsCustomFieldAttributesOutputSchema,
	'contacts.customfields': NutshellContactsCustomfieldsOutputSchema,
	'tasks.create': NutshellTasksCreateOutputSchema,
	'todos.list': NutshellTodosListOutputSchema,
	'users.get': NutshellUsersGetOutputSchema,
	'contacts.customFieldAttributes':
		NutshellContactsCustomFieldAttributesOutputSchema,
	'productCategories.create': NutshellProductCategoriesCreateOutputSchema,
	'productCategories.list': NutshellProductCategoriesListOutputSchema,
	'productMaps.get': NutshellProductMapsGetOutputSchema,
	'leads.status': NutshellLeadsStatusOutputSchema,
	'accountTypes.list': NutshellAccountTypesListOutputSchema,
	'editions.get': NutshellEditionsGetOutputSchema,
	'products.undelete': NutshellProductsUndeleteOutputSchema,
	'tags.delete': NutshellTagsDeleteOutputSchema,
	'contacts.listItems': NutshellContactsListItemsOutputSchema,
	'productMaps.delete': NutshellProductMapsDeleteOutputSchema,
	'leads.installments': NutshellLeadsInstallmentsOutputSchema,
	'leads.create': NutshellLeadsCreateOutputSchema,
	'notes.get': NutshellNotesGetOutputSchema,
	'industries.list': NutshellIndustriesListOutputSchema,
	'forms.getFieldId': NutshellFormsGetFieldIdOutputSchema,
	'leads.customfields': NutshellLeadsCustomfieldsOutputSchema,
	'competitorMaps.delete': NutshellCompetitorMapsDeleteOutputSchema,
	'notes.delete': NutshellNotesDeleteOutputSchema,
	'stageSets.list': NutshellStageSetsListOutputSchema,
	'tags.create': NutshellTagsCreateOutputSchema,
	'contacts.get': NutshellContactsGetOutputSchema,
	'sources.undelete': NutshellSourcesUndeleteOutputSchema,
	'tasks.delete': NutshellTasksDeleteOutputSchema,
	'quotes.createInvoice': NutshellQuotesCreateInvoiceOutputSchema,
	'leads.get': NutshellLeadsGetOutputSchema,
	'leads.createCustomField': NutshellLeadsCreateCustomFieldOutputSchema,
	'events.list': NutshellEventsListOutputSchema,
	'quotes.status': NutshellQuotesStatusOutputSchema,
	'outcomes.get': NutshellOutcomesGetOutputSchema,
	'filters.list': NutshellFiltersListOutputSchema,
	'accounts.createCustomField': NutshellAccountsCreateCustomFieldOutputSchema,
	'contacts.listFields': NutshellContactsListFieldsOutputSchema,
	'markets.list': NutshellMarketsListOutputSchema,
	'audiences.create': NutshellAudiencesCreateOutputSchema,
	'leads.postStageset': NutshellLeadsPostStagesetOutputSchema,
	'forms.list': NutshellFormsListOutputSchema,
	'stageSets.export': NutshellStageSetsExportOutputSchema,
	'activities.list': NutshellActivitiesListOutputSchema,
	'competitorMaps.get': NutshellCompetitorMapsGetOutputSchema,
	'competitorMaps.update': NutshellCompetitorMapsUpdateOutputSchema,
	'invoices.get': NutshellInvoicesGetOutputSchema,
	'competitors.get': NutshellCompetitorsGetOutputSchema,
	'leads.report': NutshellLeadsReportOutputSchema,
	'contacts.undelete': NutshellContactsUndeleteOutputSchema,
	'leads.watch': NutshellLeadsWatchOutputSchema,
	'notes.list': NutshellNotesListOutputSchema,
	'activities.update': NutshellActivitiesUpdateOutputSchema,
	'contacts.update': NutshellContactsUpdateOutputSchema,
	'sources.create': NutshellSourcesCreateOutputSchema,
	'contacts.list': NutshellContactsListOutputSchema,
	'territories.list': NutshellTerritoriesListOutputSchema,
	'invoices.status': NutshellInvoicesStatusOutputSchema,
	'accounts.get': NutshellAccountsGetOutputSchema,
	'notes.create': NutshellNotesCreateOutputSchema,
	'activityTypes.list': NutshellActivityTypesListOutputSchema,
	'users.list': NutshellUsersListOutputSchema,
	'forms.get': NutshellFormsGetOutputSchema,
	'contacts.createCustomField': NutshellContactsCreateCustomFieldOutputSchema,
	'productCategories.get': NutshellProductCategoriesGetOutputSchema,
	'products.get': NutshellProductsGetOutputSchema,
	'events.deleted': NutshellEventsDeletedOutputSchema,
	'competitorMaps.list': NutshellCompetitorMapsListOutputSchema,
	'tags.undelete': NutshellTagsUndeleteOutputSchema,
	'tasks.update': NutshellTasksUpdateOutputSchema,
	'accounts.list': NutshellAccountsListOutputSchema,
	'accounts.listItems': NutshellAccountsListItemsOutputSchema,
} as const;

export const NutshellOperationSchemas = {
	'stages.list': {
		input: NutshellStagesListInputSchema,
		output: NutshellStagesListOutputSchema,
	},
	'audiences.list': {
		input: NutshellAudiencesListInputSchema,
		output: NutshellAudiencesListOutputSchema,
	},
	'leads.list': {
		input: NutshellLeadsListInputSchema,
		output: NutshellLeadsListOutputSchema,
	},
	'quotes.list': {
		input: NutshellQuotesListInputSchema,
		output: NutshellQuotesListOutputSchema,
	},
	'accounts.customFieldAttributes': {
		input: NutshellAccountsCustomFieldAttributesInputSchema,
		output: NutshellAccountsCustomFieldAttributesOutputSchema,
	},
	'outcomes.list': {
		input: NutshellOutcomesListInputSchema,
		output: NutshellOutcomesListOutputSchema,
	},
	'tasks.get': {
		input: NutshellTasksGetInputSchema,
		output: NutshellTasksGetOutputSchema,
	},
	'leads.reopen': {
		input: NutshellLeadsReopenInputSchema,
		output: NutshellLeadsReopenOutputSchema,
	},
	'markets.get': {
		input: NutshellMarketsGetInputSchema,
		output: NutshellMarketsGetOutputSchema,
	},
	'products.list': {
		input: NutshellProductsListInputSchema,
		output: NutshellProductsListOutputSchema,
	},
	'leads.listFields': {
		input: NutshellLeadsListFieldsInputSchema,
		output: NutshellLeadsListFieldsOutputSchema,
	},
	'accounts.create': {
		input: NutshellAccountsCreateInputSchema,
		output: NutshellAccountsCreateOutputSchema,
	},
	'accounts.undelete': {
		input: NutshellAccountsUndeleteInputSchema,
		output: NutshellAccountsUndeleteOutputSchema,
	},
	'products.delete': {
		input: NutshellProductsDeleteInputSchema,
		output: NutshellProductsDeleteOutputSchema,
	},
	'activities.create': {
		input: NutshellActivitiesCreateInputSchema,
		output: NutshellActivitiesCreateOutputSchema,
	},
	'leads.delete': {
		input: NutshellLeadsDeleteInputSchema,
		output: NutshellLeadsDeleteOutputSchema,
	},
	'sources.list': {
		input: NutshellSourcesListInputSchema,
		output: NutshellSourcesListOutputSchema,
	},
	'competitors.list': {
		input: NutshellCompetitorsListInputSchema,
		output: NutshellCompetitorsListOutputSchema,
	},
	'accounts.delete': {
		input: NutshellAccountsDeleteInputSchema,
		output: NutshellAccountsDeleteOutputSchema,
	},
	'leads.updateInstallments': {
		input: NutshellLeadsUpdateInstallmentsInputSchema,
		output: NutshellLeadsUpdateInstallmentsOutputSchema,
	},
	'tasks.list': {
		input: NutshellTasksListInputSchema,
		output: NutshellTasksListOutputSchema,
	},
	'contacts.create': {
		input: NutshellContactsCreateInputSchema,
		output: NutshellContactsCreateOutputSchema,
	},
	'accounts.customfields': {
		input: NutshellAccountsCustomfieldsInputSchema,
		output: NutshellAccountsCustomfieldsOutputSchema,
	},
	'activities.get': {
		input: NutshellActivitiesGetInputSchema,
		output: NutshellActivitiesGetOutputSchema,
	},
	'leads.stages': {
		input: NutshellLeadsStagesInputSchema,
		output: NutshellLeadsStagesOutputSchema,
	},
	'leads.listItems': {
		input: NutshellLeadsListItemsInputSchema,
		output: NutshellLeadsListItemsOutputSchema,
	},
	'productMaps.update': {
		input: NutshellProductMapsUpdateInputSchema,
		output: NutshellProductMapsUpdateOutputSchema,
	},
	'leads.undelete': {
		input: NutshellLeadsUndeleteInputSchema,
		output: NutshellLeadsUndeleteOutputSchema,
	},
	'invoices.list': {
		input: NutshellInvoicesListInputSchema,
		output: NutshellInvoicesListOutputSchema,
	},
	'industries.get': {
		input: NutshellIndustriesGetInputSchema,
		output: NutshellIndustriesGetOutputSchema,
	},
	'tags.list': {
		input: NutshellTagsListInputSchema,
		output: NutshellTagsListOutputSchema,
	},
	'emails.get': {
		input: NutshellEmailsGetInputSchema,
		output: NutshellEmailsGetOutputSchema,
	},
	'dashboards.listFields': {
		input: NutshellDashboardsListFieldsInputSchema,
		output: NutshellDashboardsListFieldsOutputSchema,
	},
	'accounts.update': {
		input: NutshellAccountsUpdateInputSchema,
		output: NutshellAccountsUpdateOutputSchema,
	},
	'editions.list': {
		input: NutshellEditionsListInputSchema,
		output: NutshellEditionsListOutputSchema,
	},
	'productMaps.list': {
		input: NutshellProductMapsListInputSchema,
		output: NutshellProductMapsListOutputSchema,
	},
	'contacts.delete': {
		input: NutshellContactsDeleteInputSchema,
		output: NutshellContactsDeleteOutputSchema,
	},
	'accounts.listFields': {
		input: NutshellAccountsListFieldsInputSchema,
		output: NutshellAccountsListFieldsOutputSchema,
	},
	'sources.delete': {
		input: NutshellSourcesDeleteInputSchema,
		output: NutshellSourcesDeleteOutputSchema,
	},
	'notes.undelete': {
		input: NutshellNotesUndeleteInputSchema,
		output: NutshellNotesUndeleteOutputSchema,
	},
	'leads.update': {
		input: NutshellLeadsUpdateInputSchema,
		output: NutshellLeadsUpdateOutputSchema,
	},
	'quotes.get': {
		input: NutshellQuotesGetInputSchema,
		output: NutshellQuotesGetOutputSchema,
	},
	'leads.customFieldAttributes': {
		input: NutshellLeadsCustomFieldAttributesInputSchema,
		output: NutshellLeadsCustomFieldAttributesOutputSchema,
	},
	'contacts.customfields': {
		input: NutshellContactsCustomfieldsInputSchema,
		output: NutshellContactsCustomfieldsOutputSchema,
	},
	'tasks.create': {
		input: NutshellTasksCreateInputSchema,
		output: NutshellTasksCreateOutputSchema,
	},
	'todos.list': {
		input: NutshellTodosListInputSchema,
		output: NutshellTodosListOutputSchema,
	},
	'users.get': {
		input: NutshellUsersGetInputSchema,
		output: NutshellUsersGetOutputSchema,
	},
	'contacts.customFieldAttributes': {
		input: NutshellContactsCustomFieldAttributesInputSchema,
		output: NutshellContactsCustomFieldAttributesOutputSchema,
	},
	'productCategories.create': {
		input: NutshellProductCategoriesCreateInputSchema,
		output: NutshellProductCategoriesCreateOutputSchema,
	},
	'productCategories.list': {
		input: NutshellProductCategoriesListInputSchema,
		output: NutshellProductCategoriesListOutputSchema,
	},
	'productMaps.get': {
		input: NutshellProductMapsGetInputSchema,
		output: NutshellProductMapsGetOutputSchema,
	},
	'leads.status': {
		input: NutshellLeadsStatusInputSchema,
		output: NutshellLeadsStatusOutputSchema,
	},
	'accountTypes.list': {
		input: NutshellAccountTypesListInputSchema,
		output: NutshellAccountTypesListOutputSchema,
	},
	'editions.get': {
		input: NutshellEditionsGetInputSchema,
		output: NutshellEditionsGetOutputSchema,
	},
	'products.undelete': {
		input: NutshellProductsUndeleteInputSchema,
		output: NutshellProductsUndeleteOutputSchema,
	},
	'tags.delete': {
		input: NutshellTagsDeleteInputSchema,
		output: NutshellTagsDeleteOutputSchema,
	},
	'contacts.listItems': {
		input: NutshellContactsListItemsInputSchema,
		output: NutshellContactsListItemsOutputSchema,
	},
	'productMaps.delete': {
		input: NutshellProductMapsDeleteInputSchema,
		output: NutshellProductMapsDeleteOutputSchema,
	},
	'leads.installments': {
		input: NutshellLeadsInstallmentsInputSchema,
		output: NutshellLeadsInstallmentsOutputSchema,
	},
	'leads.create': {
		input: NutshellLeadsCreateInputSchema,
		output: NutshellLeadsCreateOutputSchema,
	},
	'notes.get': {
		input: NutshellNotesGetInputSchema,
		output: NutshellNotesGetOutputSchema,
	},
	'industries.list': {
		input: NutshellIndustriesListInputSchema,
		output: NutshellIndustriesListOutputSchema,
	},
	'forms.getFieldId': {
		input: NutshellFormsGetFieldIdInputSchema,
		output: NutshellFormsGetFieldIdOutputSchema,
	},
	'leads.customfields': {
		input: NutshellLeadsCustomfieldsInputSchema,
		output: NutshellLeadsCustomfieldsOutputSchema,
	},
	'competitorMaps.delete': {
		input: NutshellCompetitorMapsDeleteInputSchema,
		output: NutshellCompetitorMapsDeleteOutputSchema,
	},
	'notes.delete': {
		input: NutshellNotesDeleteInputSchema,
		output: NutshellNotesDeleteOutputSchema,
	},
	'stageSets.list': {
		input: NutshellStageSetsListInputSchema,
		output: NutshellStageSetsListOutputSchema,
	},
	'tags.create': {
		input: NutshellTagsCreateInputSchema,
		output: NutshellTagsCreateOutputSchema,
	},
	'contacts.get': {
		input: NutshellContactsGetInputSchema,
		output: NutshellContactsGetOutputSchema,
	},
	'sources.undelete': {
		input: NutshellSourcesUndeleteInputSchema,
		output: NutshellSourcesUndeleteOutputSchema,
	},
	'tasks.delete': {
		input: NutshellTasksDeleteInputSchema,
		output: NutshellTasksDeleteOutputSchema,
	},
	'quotes.createInvoice': {
		input: NutshellQuotesCreateInvoiceInputSchema,
		output: NutshellQuotesCreateInvoiceOutputSchema,
	},
	'leads.get': {
		input: NutshellLeadsGetInputSchema,
		output: NutshellLeadsGetOutputSchema,
	},
	'leads.createCustomField': {
		input: NutshellLeadsCreateCustomFieldInputSchema,
		output: NutshellLeadsCreateCustomFieldOutputSchema,
	},
	'events.list': {
		input: NutshellEventsListInputSchema,
		output: NutshellEventsListOutputSchema,
	},
	'quotes.status': {
		input: NutshellQuotesStatusInputSchema,
		output: NutshellQuotesStatusOutputSchema,
	},
	'outcomes.get': {
		input: NutshellOutcomesGetInputSchema,
		output: NutshellOutcomesGetOutputSchema,
	},
	'filters.list': {
		input: NutshellFiltersListInputSchema,
		output: NutshellFiltersListOutputSchema,
	},
	'accounts.createCustomField': {
		input: NutshellAccountsCreateCustomFieldInputSchema,
		output: NutshellAccountsCreateCustomFieldOutputSchema,
	},
	'contacts.listFields': {
		input: NutshellContactsListFieldsInputSchema,
		output: NutshellContactsListFieldsOutputSchema,
	},
	'markets.list': {
		input: NutshellMarketsListInputSchema,
		output: NutshellMarketsListOutputSchema,
	},
	'audiences.create': {
		input: NutshellAudiencesCreateInputSchema,
		output: NutshellAudiencesCreateOutputSchema,
	},
	'leads.postStageset': {
		input: NutshellLeadsPostStagesetInputSchema,
		output: NutshellLeadsPostStagesetOutputSchema,
	},
	'forms.list': {
		input: NutshellFormsListInputSchema,
		output: NutshellFormsListOutputSchema,
	},
	'stageSets.export': {
		input: NutshellStageSetsExportInputSchema,
		output: NutshellStageSetsExportOutputSchema,
	},
	'activities.list': {
		input: NutshellActivitiesListInputSchema,
		output: NutshellActivitiesListOutputSchema,
	},
	'competitorMaps.get': {
		input: NutshellCompetitorMapsGetInputSchema,
		output: NutshellCompetitorMapsGetOutputSchema,
	},
	'competitorMaps.update': {
		input: NutshellCompetitorMapsUpdateInputSchema,
		output: NutshellCompetitorMapsUpdateOutputSchema,
	},
	'invoices.get': {
		input: NutshellInvoicesGetInputSchema,
		output: NutshellInvoicesGetOutputSchema,
	},
	'competitors.get': {
		input: NutshellCompetitorsGetInputSchema,
		output: NutshellCompetitorsGetOutputSchema,
	},
	'leads.report': {
		input: NutshellLeadsReportInputSchema,
		output: NutshellLeadsReportOutputSchema,
	},
	'contacts.undelete': {
		input: NutshellContactsUndeleteInputSchema,
		output: NutshellContactsUndeleteOutputSchema,
	},
	'leads.watch': {
		input: NutshellLeadsWatchInputSchema,
		output: NutshellLeadsWatchOutputSchema,
	},
	'notes.list': {
		input: NutshellNotesListInputSchema,
		output: NutshellNotesListOutputSchema,
	},
	'activities.update': {
		input: NutshellActivitiesUpdateInputSchema,
		output: NutshellActivitiesUpdateOutputSchema,
	},
	'contacts.update': {
		input: NutshellContactsUpdateInputSchema,
		output: NutshellContactsUpdateOutputSchema,
	},
	'sources.create': {
		input: NutshellSourcesCreateInputSchema,
		output: NutshellSourcesCreateOutputSchema,
	},
	'contacts.list': {
		input: NutshellContactsListInputSchema,
		output: NutshellContactsListOutputSchema,
	},
	'territories.list': {
		input: NutshellTerritoriesListInputSchema,
		output: NutshellTerritoriesListOutputSchema,
	},
	'invoices.status': {
		input: NutshellInvoicesStatusInputSchema,
		output: NutshellInvoicesStatusOutputSchema,
	},
	'accounts.get': {
		input: NutshellAccountsGetInputSchema,
		output: NutshellAccountsGetOutputSchema,
	},
	'notes.create': {
		input: NutshellNotesCreateInputSchema,
		output: NutshellNotesCreateOutputSchema,
	},
	'activityTypes.list': {
		input: NutshellActivityTypesListInputSchema,
		output: NutshellActivityTypesListOutputSchema,
	},
	'users.list': {
		input: NutshellUsersListInputSchema,
		output: NutshellUsersListOutputSchema,
	},
	'forms.get': {
		input: NutshellFormsGetInputSchema,
		output: NutshellFormsGetOutputSchema,
	},
	'contacts.createCustomField': {
		input: NutshellContactsCreateCustomFieldInputSchema,
		output: NutshellContactsCreateCustomFieldOutputSchema,
	},
	'productCategories.get': {
		input: NutshellProductCategoriesGetInputSchema,
		output: NutshellProductCategoriesGetOutputSchema,
	},
	'products.get': {
		input: NutshellProductsGetInputSchema,
		output: NutshellProductsGetOutputSchema,
	},
	'events.deleted': {
		input: NutshellEventsDeletedInputSchema,
		output: NutshellEventsDeletedOutputSchema,
	},
	'competitorMaps.list': {
		input: NutshellCompetitorMapsListInputSchema,
		output: NutshellCompetitorMapsListOutputSchema,
	},
	'tags.undelete': {
		input: NutshellTagsUndeleteInputSchema,
		output: NutshellTagsUndeleteOutputSchema,
	},
	'tasks.update': {
		input: NutshellTasksUpdateInputSchema,
		output: NutshellTasksUpdateOutputSchema,
	},
	'accounts.list': {
		input: NutshellAccountsListInputSchema,
		output: NutshellAccountsListOutputSchema,
	},
	'accounts.listItems': {
		input: NutshellAccountsListItemsInputSchema,
		output: NutshellAccountsListItemsOutputSchema,
	},
} as const satisfies Record<
	NutshellOperationKey,
	{ input: z.ZodType; output: z.ZodType }
>;

export type NutshellEndpointInputs = {
	[K in NutshellOperationKey]: z.infer<
		(typeof NutshellOperationSchemas)[K]['input']
	>;
};
export type NutshellEndpointOutputs = {
	[K in NutshellOperationKey]: z.infer<
		(typeof NutshellOperationSchemas)[K]['output']
	>;
};

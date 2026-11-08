// Generated from the Nutshell OpenAPI component schemas at
// https://developers.nutshell.com. Every object is `.loose()` because the
// documented components are partial views of the live payload.
import { z } from 'zod';

export const NutshellEmailsSchema = z.array(
	z
		.object({
			isPrimary: z.boolean().optional(),
			name: z.string().optional(),
			value: z.string().optional(),
		})
		.loose(),
);

export const NutshellAddressesSchema = z.array(
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
);

export const NutshellPhonesSchema = z.array(
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
);

export const NutshellUrlsSchema = z.array(
	z
		.object({
			isPrimary: z.boolean().optional(),
			name: z.string().optional(),
			value: z.string().optional(),
		})
		.loose(),
);

export const NutshellPeepSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		createdTime: z.number().int().optional(),
		deletedTime: z.number().int().optional(),
		emails: NutshellEmailsSchema.optional(),
		addresses: NutshellAddressesSchema.optional(),
		phones: NutshellPhonesSchema.optional(),
		urls: NutshellUrlsSchema.optional(),
	})
	.loose();

export const NutshellAvatarableSchema = z
	.object({
		avatarUrl: z.string().optional(),
		initials: z.string().optional(),
	})
	.loose();

export const NutshellHtmlLinkableSchema = z
	.object({
		htmlUrl: z.string().optional(),
		htmlUrlPath: z.string().optional(),
	})
	.loose();

export const NutshellAccountSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(NutshellPeepSchema, NutshellAvatarableSchema),
			NutshellHtmlLinkableSchema,
		),
		z
			.object({
				href: z.string().optional(),
				revenue: z
					.object({
						amount: z.string().optional(),
						formatted: z.string().optional(),
					})
					.loose()
					.optional(),
				employeeCount: z.number().int().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellAccountTypeSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		modifiedTime: z.number().int().optional(),
	})
	.loose();

export const NutshellActivitySchema = z.intersection(
	z.intersection(
		NutshellHtmlLinkableSchema,
		z
			.object({
				id: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellFullActivitySchema = z.intersection(
	z.intersection(
		z.intersection(NutshellActivitySchema, NutshellHtmlLinkableSchema),
		z
			.object({
				id: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellActivityResponseSchema = z.intersection(
	z.intersection(
		NutshellHtmlLinkableSchema,
		z
			.object({
				activities: z.array(NutshellFullActivitySchema).optional(),
				id: z.string().optional(),
				agenda: z.string().optional(),
				createdTime: z.number().int().optional(),
				endTime: z.number().int().optional(),
				deletedTime: z.number().int().optional(),
				href: z.string().optional(),
				isAllDay: z.boolean().optional(),
				isEditable: z.boolean().optional(),
				isCancelled: z.boolean().optional(),
				isFlagged: z.boolean().optional(),
				isLogged: z.boolean().optional(),
				isOverdue: z.boolean().optional(),
				loggedTime: z.number().int().optional(),
				modifiedTime: z.number().int().optional(),
				name: z.string().optional(),
				startTime: z.number().int().optional(),
				isMediaLogged: z.boolean().optional(),
				transcription: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellMetaSchema = z
	.object({
		instanceId: z.string().optional(),
		siteId: z.string().optional(),
	})
	.loose();

export const NutshellActivityTypeSchema = z
	.object({
		id: z.string().optional(),
		name: z.unknown().optional(),
		modifiedTime: z.number().int().optional(),
		isBenchmarkable: z.boolean().optional(),
	})
	.loose();

export const NutshellActivityTypeResponseSchema = z
	.object({
		meta: NutshellMetaSchema.optional(),
		activityTypes: z.array(NutshellActivityTypeSchema).optional(),
	})
	.loose();

export const NutshellContactSchema = z.intersection(
	z.intersection(
		z.intersection(
			z.intersection(NutshellPeepSchema, NutshellAvatarableSchema),
			NutshellHtmlLinkableSchema,
		),
		z
			.object({
				jobTitle: z.string().optional(),
				firstName: z.string().optional(),
				lastName: z.string().optional(),
				href: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellFullContactSchema = z.intersection(
	z.intersection(
		z.intersection(NutshellContactSchema, NutshellHtmlLinkableSchema),
		NutshellAvatarableSchema,
	),
	z
		.object({
			links: z.object({}).loose().optional(),
		})
		.loose(),
);

export const NutshellContactResponseSchema = z
	.object({
		links: z.object({}).loose().optional(),
		contacts: z.array(NutshellFullContactSchema).optional(),
	})
	.loose();

export const NutshellCustomFieldSchema = z
	.object({
		id: z.string().optional(),
	})
	.loose();

export const NutshellCustomFieldCreateInputSchema = z
	.object({
		name: z.unknown().optional(),
		type: z.unknown().optional(),
		choices: z.unknown().optional(),
		isMultiple: z.unknown().optional(),
		id: z.string().optional(),
		title: z.string().optional(),
	})
	.loose();

export const NutshellCustomFieldInputSchema = z
	.object({
		id: z.string().optional(),
	})
	.loose();

export const NutshellFieldsResponseSchema = z
	.object({
		properties: z
			.object({
				exampleProperty: z
					.object({
						type: z.string().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						isFilterable: z.boolean().optional(),
						isDisplayable: z.boolean().optional(),
						isSortable: z.boolean().optional(),
						isGoalable: z.boolean().optional(),
						isAddable: z.boolean().optional(),
						isBoardable: z.boolean().optional(),
						isRequireable: z.boolean().optional(),
						isAndable: z.boolean().optional(),
						isNullable: z.boolean().optional(),
						relationships: z.array(z.string()).optional(),
						enum: z.array(z.string()).optional(),
						format: z.string().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const NutshellFullCustomFieldSchema = z.intersection(
	z.intersection(
		NutshellCustomFieldSchema,
		z
			.object({
				value: z.string().optional(),
				id: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellListItemSchema = z.intersection(
	z.intersection(
		z.intersection(NutshellHtmlLinkableSchema, NutshellAvatarableSchema),
		z
			.object({
				id: z.string().optional(),
				primaryName: z.string().optional(),
				primaryInfo: z.string().optional(),
				relatedName: z.string().optional(),
				relatedInfo: z.string().optional(),
				relatedType: z.string().optional(),
				relatedUrl: z.string().optional(),
				relatedUrlPath: z.string().optional(),
				primaryContact: z.string().optional(),
				primaryAccount: z.string().optional(),
				latlon: z.string().optional(),
				mapUrl: z.string().optional(),
				isDeleted: z.boolean().optional(),
				fields: z.array(z.object({}).loose()).optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellListItemAccountSchema = z.intersection(
	z.intersection(
		NutshellListItemSchema,
		z
			.object({
				description: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellListItemContactSchema = z.intersection(
	z.intersection(
		NutshellListItemSchema,
		z
			.object({
				description: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellNoteSchema = z.intersection(
	z.intersection(
		NutshellHtmlLinkableSchema,
		z
			.object({
				id: z.string().optional(),
				createdTime: z.string().optional(),
				deletedTime: z.string().optional(),
				href: z.string().optional(),
				body: z.string().optional(),
				bodyHtml: z.string().optional(),
				bodyMarkup: z.string().optional(),
				isEditable: z.boolean().optional(),
				parentType: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellRecurrenceRuleSchema = z.intersection(
	z.intersection(
		NutshellHtmlLinkableSchema,
		z
			.object({
				rule: z.string().optional(),
				mode: z.enum(['dueDate', 'completion']).optional(),
				id: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellTaskSchema = z.intersection(
	z.intersection(
		NutshellHtmlLinkableSchema,
		z
			.object({
				id: z.string().optional(),
				recurrenceRule: NutshellRecurrenceRuleSchema.nullable().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellPermissionsSchema = z
	.object({
		canAccessSetup: z.boolean().optional(),
		canAccessMarketing: z.boolean().optional(),
		canBulkEdit: z.boolean().optional(),
		canExport: z.boolean().optional(),
		canViewSharedEmails: z.boolean().optional(),
		canImport: z.boolean().optional(),
		canMergeEntities: z.boolean().optional(),
		canDeleteEntities: z.boolean().optional(),
		canAssignEntities: z.boolean().optional(),
		canAccessBilling: z.boolean().optional(),
		canManageEmailTemplates: z.boolean().optional(),
		canAccessCrm: z.boolean().optional(),
		canAccessFullCampaigns: z.boolean().optional(),
		canUsePeopleIQ: z.boolean().optional(),
		canUseInbox: z.boolean().optional(),
	})
	.loose();

export const NutshellUserSchema = z.intersection(
	z.intersection(
		NutshellAvatarableSchema,
		z
			.object({
				id: z.string().optional(),
				name: z.unknown().optional(),
				firstName: z.unknown().optional(),
				modifiedTime: z.number().int().optional(),
				isEnabled: z.boolean().optional(),
				hasSetPassword: z.boolean().optional(),
				isAdministrator: z.boolean().optional(),
				isViewingRestricted: z.boolean().optional(),
				isHiddenFromFilters: z.boolean().optional(),
				canAccessEmailMarketing: z.boolean().optional(),
				permissions: NutshellPermissionsSchema.optional(),
				emails: z.array(z.string()).optional(),
				phonecallerType: z.unknown().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellOriginSchema = z.intersection(
	z.intersection(
		z.intersection(NutshellAvatarableSchema, NutshellHtmlLinkableSchema),
		z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
				modifiedTime: z.number().int().optional(),
				lastseenTime: z.number().int().optional(),
				originType: z.string().optional(),
			})
			.loose(),
	),
	z.object({}).loose(),
);

export const NutshellIndustrySchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		modifiedTime: z.number().int().optional(),
	})
	.loose();

export const NutshellAccountResponseSchema = z
	.object({
		meta: NutshellMetaSchema.optional(),
		accounts: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(NutshellAccountSchema, NutshellHtmlLinkableSchema),
						NutshellAvatarableSchema,
					),
					z.object({}).loose(),
				),
			)
			.optional(),
		creators: z.array(NutshellUserSchema).optional(),
		owners: z.array(NutshellUserSchema).optional(),
		origins: z
			.array(
				z.intersection(
					z.intersection(
						z.intersection(NutshellOriginSchema, NutshellHtmlLinkableSchema),
						NutshellAvatarableSchema,
					),
					z.object({}).loose(),
				),
			)
			.optional(),
		contacts: z.array(NutshellContactSchema).optional(),
		accountTypes: z.array(NutshellAccountTypeSchema).optional(),
		industries: z.array(NutshellIndustrySchema).optional(),
	})
	.loose();

export const NutshellActivityPostInputSchema = z
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
	.loose();

export const NutshellContactPostInputSchema = z
	.object({
		contacts: z
			.array(
				z
					.object({
						name: z.string().optional(),
						description: z.string().optional(),
						phones: NutshellPhonesSchema.optional(),
						emails: NutshellEmailsSchema.optional(),
						urls: NutshellUrlsSchema.optional(),
						addresses: NutshellAddressesSchema.optional(),
						customFields: z
							.object({})
							.catchall(NutshellCustomFieldInputSchema)
							.optional(),
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
	.loose();

export const NutshellNotePostInputSchema = z
	.object({
		data: z
			.object({
				body: z.string().optional(),
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
	.loose();

export const NutshellPatchInputSchema = z.array(
	z
		.object({
			op: z.enum(['add', 'remove', 'replace', 'move', 'copy']).optional(),
			path: z.string().optional(),
			value: z.string().optional(),
		})
		.loose(),
);

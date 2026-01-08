import { z } from 'zod';

// Common schemas
export const TokenOverridableSchema = z.object({
	token: z.string().optional(),
});

export const PaginationSchema = z.object({
	limit: z.number().optional(),
	after: z.string().optional(),
});

export const PropertiesSchema = z.record(z.string(), z.any()).optional();

// Contact schemas
export const GetContactArgsSchema = z
	.object({
		contactId: z.string(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
		idProperty: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetContactArgs = z.infer<typeof GetContactArgsSchema>;

export const ContactResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.string(), z.any()),
	createdAt: z.string(),
	updatedAt: z.string(),
	archived: z.boolean().optional(),
});
export type ContactResponse = z.infer<typeof ContactResponseSchema>;

export const GetContactResponseSchema = ContactResponseSchema;
export type GetContactResponse = z.infer<typeof GetContactResponseSchema>;

export const GetManyContactsArgsSchema = z
	.object({
		limit: z.number().optional(),
		after: z.string().optional(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetManyContactsArgs = z.infer<typeof GetManyContactsArgsSchema>;

export const GetManyContactsResponseSchema = z.object({
	results: z.array(ContactResponseSchema),
	paging: z
		.object({
			next: z
				.object({
					after: z.string(),
				})
				.optional(),
			prev: z
				.object({
					before: z.string(),
				})
				.optional(),
		})
		.optional(),
});
export type GetManyContactsResponse = z.infer<
	typeof GetManyContactsResponseSchema
>;

export const CreateOrUpdateContactArgsSchema = z
	.object({
		properties: PropertiesSchema,
		associations: z
			.array(
				z.object({
					to: z.object({
						id: z.string(),
					}),
					types: z.array(
						z.object({
							associationCategory: z.string(),
							associationTypeId: z.number(),
						}),
					),
				}),
			)
			.optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateOrUpdateContactArgs = z.infer<
	typeof CreateOrUpdateContactArgsSchema
>;

export const CreateOrUpdateContactResponseSchema = ContactResponseSchema;
export type CreateOrUpdateContactResponse = z.infer<
	typeof CreateOrUpdateContactResponseSchema
>;

export const DeleteContactArgsSchema = z
	.object({
		contactId: z.string(),
	})
	.merge(TokenOverridableSchema);
export type DeleteContactArgs = z.infer<typeof DeleteContactArgsSchema>;

export const GetRecentlyCreatedContactsArgsSchema = z
	.object({
		count: z.number().optional(),
		after: z.string().optional(),
		since: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetRecentlyCreatedContactsArgs = z.infer<
	typeof GetRecentlyCreatedContactsArgsSchema
>;

export const GetRecentlyCreatedContactsResponseSchema =
	GetManyContactsResponseSchema;
export type GetRecentlyCreatedContactsResponse = z.infer<
	typeof GetRecentlyCreatedContactsResponseSchema
>;

export const GetRecentlyUpdatedContactsArgsSchema =
	GetRecentlyCreatedContactsArgsSchema;
export type GetRecentlyUpdatedContactsArgs = z.infer<
	typeof GetRecentlyUpdatedContactsArgsSchema
>;

export const GetRecentlyUpdatedContactsResponseSchema =
	GetManyContactsResponseSchema;
export type GetRecentlyUpdatedContactsResponse = z.infer<
	typeof GetRecentlyUpdatedContactsResponseSchema
>;

export const SearchContactsArgsSchema = z
	.object({
		query: z.string().optional(),
		limit: z.number().optional(),
		after: z.string().optional(),
		sorts: z.array(z.string()).optional(),
		properties: z.array(z.string()).optional(),
		filterGroups: z.array(z.any()).optional(),
	})
	.merge(TokenOverridableSchema);
export type SearchContactsArgs = z.infer<typeof SearchContactsArgsSchema>;

export const SearchContactsResponseSchema = GetManyContactsResponseSchema;
export type SearchContactsResponse = z.infer<
	typeof SearchContactsResponseSchema
>;

// Company schemas
export const GetCompanyArgsSchema = z
	.object({
		companyId: z.string(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
		idProperty: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetCompanyArgs = z.infer<typeof GetCompanyArgsSchema>;

export const CompanyResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.string(), z.any()),
	createdAt: z.string(),
	updatedAt: z.string(),
	archived: z.boolean().optional(),
});
export type CompanyResponse = z.infer<typeof CompanyResponseSchema>;

export const GetCompanyResponseSchema = CompanyResponseSchema;
export type GetCompanyResponse = z.infer<typeof GetCompanyResponseSchema>;

export const GetManyCompaniesArgsSchema = z
	.object({
		limit: z.number().optional(),
		after: z.string().optional(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetManyCompaniesArgs = z.infer<typeof GetManyCompaniesArgsSchema>;

export const GetManyCompaniesResponseSchema = z.object({
	results: z.array(CompanyResponseSchema),
	paging: z
		.object({
			next: z
				.object({
					after: z.string(),
				})
				.optional(),
			prev: z
				.object({
					before: z.string(),
				})
				.optional(),
		})
		.optional(),
});
export type GetManyCompaniesResponse = z.infer<
	typeof GetManyCompaniesResponseSchema
>;

export const CreateCompanyArgsSchema = z
	.object({
		properties: PropertiesSchema,
		associations: z
			.array(
				z.object({
					to: z.object({
						id: z.string(),
					}),
					types: z.array(
						z.object({
							associationCategory: z.string(),
							associationTypeId: z.number(),
						}),
					),
				}),
			)
			.optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateCompanyArgs = z.infer<typeof CreateCompanyArgsSchema>;

export const CreateCompanyResponseSchema = CompanyResponseSchema;
export type CreateCompanyResponse = z.infer<typeof CreateCompanyResponseSchema>;

export const UpdateCompanyArgsSchema = z
	.object({
		companyId: z.string(),
		properties: PropertiesSchema,
	})
	.merge(TokenOverridableSchema);
export type UpdateCompanyArgs = z.infer<typeof UpdateCompanyArgsSchema>;

export const UpdateCompanyResponseSchema = CompanyResponseSchema;
export type UpdateCompanyResponse = z.infer<typeof UpdateCompanyResponseSchema>;

export const DeleteCompanyArgsSchema = z
	.object({
		companyId: z.string(),
	})
	.merge(TokenOverridableSchema);
export type DeleteCompanyArgs = z.infer<typeof DeleteCompanyArgsSchema>;

export const GetRecentlyCreatedCompaniesArgsSchema = z
	.object({
		count: z.number().optional(),
		after: z.string().optional(),
		since: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetRecentlyCreatedCompaniesArgs = z.infer<
	typeof GetRecentlyCreatedCompaniesArgsSchema
>;

export const GetRecentlyCreatedCompaniesResponseSchema =
	GetManyCompaniesResponseSchema;
export type GetRecentlyCreatedCompaniesResponse = z.infer<
	typeof GetRecentlyCreatedCompaniesResponseSchema
>;

export const GetRecentlyUpdatedCompaniesArgsSchema =
	GetRecentlyCreatedCompaniesArgsSchema;
export type GetRecentlyUpdatedCompaniesArgs = z.infer<
	typeof GetRecentlyUpdatedCompaniesArgsSchema
>;

export const GetRecentlyUpdatedCompaniesResponseSchema =
	GetManyCompaniesResponseSchema;
export type GetRecentlyUpdatedCompaniesResponse = z.infer<
	typeof GetRecentlyUpdatedCompaniesResponseSchema
>;

export const SearchCompanyByDomainArgsSchema = z
	.object({
		domain: z.string(),
		properties: z.array(z.string()).optional(),
	})
	.merge(TokenOverridableSchema);
export type SearchCompanyByDomainArgs = z.infer<
	typeof SearchCompanyByDomainArgsSchema
>;

export const SearchCompanyByDomainResponseSchema = z.object({
	results: z.array(CompanyResponseSchema),
});
export type SearchCompanyByDomainResponse = z.infer<
	typeof SearchCompanyByDomainResponseSchema
>;

// Deal schemas
export const GetDealArgsSchema = z
	.object({
		dealId: z.string(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
		idProperty: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetDealArgs = z.infer<typeof GetDealArgsSchema>;

export const DealResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.string(), z.any()),
	createdAt: z.string(),
	updatedAt: z.string(),
	archived: z.boolean().optional(),
});
export type DealResponse = z.infer<typeof DealResponseSchema>;

export const GetDealResponseSchema = DealResponseSchema;
export type GetDealResponse = z.infer<typeof GetDealResponseSchema>;

export const GetManyDealsArgsSchema = z
	.object({
		limit: z.number().optional(),
		after: z.string().optional(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetManyDealsArgs = z.infer<typeof GetManyDealsArgsSchema>;

export const GetManyDealsResponseSchema = z.object({
	results: z.array(DealResponseSchema),
	paging: z
		.object({
			next: z
				.object({
					after: z.string(),
				})
				.optional(),
			prev: z
				.object({
					before: z.string(),
				})
				.optional(),
		})
		.optional(),
});
export type GetManyDealsResponse = z.infer<typeof GetManyDealsResponseSchema>;

export const CreateDealArgsSchema = z
	.object({
		properties: PropertiesSchema,
		associations: z
			.array(
				z.object({
					to: z.object({
						id: z.string(),
					}),
					types: z.array(
						z.object({
							associationCategory: z.string(),
							associationTypeId: z.number(),
						}),
					),
				}),
			)
			.optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateDealArgs = z.infer<typeof CreateDealArgsSchema>;

export const CreateDealResponseSchema = DealResponseSchema;
export type CreateDealResponse = z.infer<typeof CreateDealResponseSchema>;

export const UpdateDealArgsSchema = z
	.object({
		dealId: z.string(),
		properties: PropertiesSchema,
	})
	.merge(TokenOverridableSchema);
export type UpdateDealArgs = z.infer<typeof UpdateDealArgsSchema>;

export const UpdateDealResponseSchema = DealResponseSchema;
export type UpdateDealResponse = z.infer<typeof UpdateDealResponseSchema>;

export const DeleteDealArgsSchema = z
	.object({
		dealId: z.string(),
	})
	.merge(TokenOverridableSchema);
export type DeleteDealArgs = z.infer<typeof DeleteDealArgsSchema>;

export const GetRecentlyCreatedDealsArgsSchema = z
	.object({
		count: z.number().optional(),
		after: z.string().optional(),
		since: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetRecentlyCreatedDealsArgs = z.infer<
	typeof GetRecentlyCreatedDealsArgsSchema
>;

export const GetRecentlyCreatedDealsResponseSchema =
	GetManyDealsResponseSchema;
export type GetRecentlyCreatedDealsResponse = z.infer<
	typeof GetRecentlyCreatedDealsResponseSchema
>;

export const GetRecentlyUpdatedDealsArgsSchema =
	GetRecentlyCreatedDealsArgsSchema;
export type GetRecentlyUpdatedDealsArgs = z.infer<
	typeof GetRecentlyUpdatedDealsArgsSchema
>;

export const GetRecentlyUpdatedDealsResponseSchema = GetManyDealsResponseSchema;
export type GetRecentlyUpdatedDealsResponse = z.infer<
	typeof GetRecentlyUpdatedDealsResponseSchema
>;

export const SearchDealsArgsSchema = z
	.object({
		query: z.string().optional(),
		limit: z.number().optional(),
		after: z.string().optional(),
		sorts: z.array(z.string()).optional(),
		properties: z.array(z.string()).optional(),
		filterGroups: z.array(z.any()).optional(),
	})
	.merge(TokenOverridableSchema);
export type SearchDealsArgs = z.infer<typeof SearchDealsArgsSchema>;

export const SearchDealsResponseSchema = GetManyDealsResponseSchema;
export type SearchDealsResponse = z.infer<typeof SearchDealsResponseSchema>;

// Ticket schemas
export const GetTicketArgsSchema = z
	.object({
		ticketId: z.string(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
		idProperty: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetTicketArgs = z.infer<typeof GetTicketArgsSchema>;

export const TicketResponseSchema = z.object({
	id: z.string(),
	properties: z.record(z.string(), z.any()),
	createdAt: z.string(),
	updatedAt: z.string(),
	archived: z.boolean().optional(),
});
export type TicketResponse = z.infer<typeof TicketResponseSchema>;

export const GetTicketResponseSchema = TicketResponseSchema;
export type GetTicketResponse = z.infer<typeof GetTicketResponseSchema>;

export const GetManyTicketsArgsSchema = z
	.object({
		limit: z.number().optional(),
		after: z.string().optional(),
		properties: z.array(z.string()).optional(),
		propertiesWithHistory: z.array(z.string()).optional(),
		associations: z.array(z.string()).optional(),
		archived: z.boolean().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetManyTicketsArgs = z.infer<typeof GetManyTicketsArgsSchema>;

export const GetManyTicketsResponseSchema = z.object({
	results: z.array(TicketResponseSchema),
	paging: z
		.object({
			next: z
				.object({
					after: z.string(),
				})
				.optional(),
			prev: z
				.object({
					before: z.string(),
				})
				.optional(),
		})
		.optional(),
});
export type GetManyTicketsResponse = z.infer<
	typeof GetManyTicketsResponseSchema
>;

export const CreateTicketArgsSchema = z
	.object({
		properties: PropertiesSchema,
		associations: z
			.array(
				z.object({
					to: z.object({
						id: z.string(),
					}),
					types: z.array(
						z.object({
							associationCategory: z.string(),
							associationTypeId: z.number(),
						}),
					),
				}),
			)
			.optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateTicketArgs = z.infer<typeof CreateTicketArgsSchema>;

export const CreateTicketResponseSchema = TicketResponseSchema;
export type CreateTicketResponse = z.infer<typeof CreateTicketResponseSchema>;

export const UpdateTicketArgsSchema = z
	.object({
		ticketId: z.string(),
		properties: PropertiesSchema,
	})
	.merge(TokenOverridableSchema);
export type UpdateTicketArgs = z.infer<typeof UpdateTicketArgsSchema>;

export const UpdateTicketResponseSchema = TicketResponseSchema;
export type UpdateTicketResponse = z.infer<typeof UpdateTicketResponseSchema>;

export const DeleteTicketArgsSchema = z
	.object({
		ticketId: z.string(),
	})
	.merge(TokenOverridableSchema);
export type DeleteTicketArgs = z.infer<typeof DeleteTicketArgsSchema>;

// Engagement schemas
export const GetEngagementArgsSchema = z
	.object({
		engagementId: z.string(),
	})
	.merge(TokenOverridableSchema);
export type GetEngagementArgs = z.infer<typeof GetEngagementArgsSchema>;

export const EngagementResponseSchema = z.object({
	id: z.string(),
	engagement: z.object({
		id: z.number(),
		portalId: z.number(),
		active: z.boolean().optional(),
		createdAt: z.number().optional(),
		lastUpdated: z.number().optional(),
		createdBy: z.number().optional(),
		modifiedBy: z.number().optional(),
		ownerId: z.number().optional(),
		type: z.string().optional(),
		timestamp: z.number().optional(),
	}),
	associations: z.record(z.string(), z.any()).optional(),
	metadata: z.record(z.string(), z.any()).optional(),
});
export type EngagementResponse = z.infer<typeof EngagementResponseSchema>;

export const GetEngagementResponseSchema = EngagementResponseSchema;
export type GetEngagementResponse = z.infer<typeof GetEngagementResponseSchema>;

export const GetManyEngagementsArgsSchema = z
	.object({
		limit: z.number().optional(),
		after: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type GetManyEngagementsArgs = z.infer<
	typeof GetManyEngagementsArgsSchema
>;

export const GetManyEngagementsResponseSchema = z.object({
	results: z.array(EngagementResponseSchema),
	paging: z
		.object({
			next: z
				.object({
					after: z.string(),
				})
				.optional(),
		})
		.optional(),
});
export type GetManyEngagementsResponse = z.infer<
	typeof GetManyEngagementsResponseSchema
>;

export const CreateEngagementArgsSchema = z
	.object({
		engagement: z.object({
			active: z.boolean().optional(),
			type: z.string(),
			timestamp: z.number().optional(),
		}),
		associations: z
			.object({
				contactIds: z.array(z.number()).optional(),
				companyIds: z.array(z.number()).optional(),
				dealIds: z.array(z.number()).optional(),
				ownerIds: z.array(z.number()).optional(),
			})
			.optional(),
		metadata: z.record(z.string(), z.any()).optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateEngagementArgs = z.infer<typeof CreateEngagementArgsSchema>;

export const CreateEngagementResponseSchema = EngagementResponseSchema;
export type CreateEngagementResponse = z.infer<
	typeof CreateEngagementResponseSchema
>;

export const DeleteEngagementArgsSchema = z
	.object({
		engagementId: z.string(),
	})
	.merge(TokenOverridableSchema);
export type DeleteEngagementArgs = z.infer<typeof DeleteEngagementArgsSchema>;

// Contact List schemas
export const AddContactToListArgsSchema = z
	.object({
		listId: z.string(),
		emails: z.array(z.string()).optional(),
		vids: z.array(z.number()).optional(),
	})
	.merge(TokenOverridableSchema);
export type AddContactToListArgs = z.infer<typeof AddContactToListArgsSchema>;

export const AddContactToListResponseSchema = z.object({
	updated: z.array(z.number()).optional(),
	discarded: z.array(z.number()).optional(),
	invalidVids: z.array(z.number()).optional(),
	invalidEmails: z.array(z.string()).optional(),
});
export type AddContactToListResponse = z.infer<
	typeof AddContactToListResponseSchema
>;

export const RemoveContactFromListArgsSchema = z
	.object({
		listId: z.string(),
		emails: z.array(z.string()).optional(),
		vids: z.array(z.number()).optional(),
	})
	.merge(TokenOverridableSchema);
export type RemoveContactFromListArgs = z.infer<
	typeof RemoveContactFromListArgsSchema
>;

export const RemoveContactFromListResponseSchema =
	AddContactToListResponseSchema;
export type RemoveContactFromListResponse = z.infer<
	typeof RemoveContactFromListResponseSchema
>;


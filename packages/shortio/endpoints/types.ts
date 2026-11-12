import { z } from 'zod';

// These schemas follow the per-operation OpenAPI definitions at developers.short.io.
const segment = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"'?#]/.test(value),
		'Unsafe path segment',
	);
const linkId = segment.regex(/lnk_\w+|\d+/);
const deleteLinkId = segment.regex(/^lnk_(.*)_(.*)$/);
const timestamp = z.union([z.string(), z.number().int()]).nullable();
const linkFields = {
	cloaking: z.boolean().optional(),
	password: z.string().optional(),
	expiresAt: timestamp.optional(),
	expiredURL: z.string().nullable().optional(),
	title: z.string().optional(),
	tags: z.array(z.string()).optional(),
	utmSource: z.string().optional(),
	utmMedium: z.string().optional(),
	utmCampaign: z.string().optional(),
	utmTerm: z.string().optional(),
	utmContent: z.string().optional(),
	ttl: timestamp.optional(),
	path: z.string().nullable().optional(),
	androidURL: z.string().nullable().optional(),
	iphoneURL: z.string().nullable().optional(),
	createdAt: timestamp.optional(),
	clicksLimit: z.number().int().min(1).nullable().optional(),
	passwordContact: z.boolean().nullable().optional(),
	skipQS: z.boolean().optional(),
	archived: z.boolean().optional(),
	splitURL: z.string().nullable().optional(),
	splitPercent: z.number().int().min(1).max(100).nullable().optional(),
	integrationAdroll: z.string().nullable().optional(),
	integrationFB: z.string().nullable().optional(),
	integrationGA: z.string().nullable().optional(),
	integrationGTM: z.string().nullable().optional(),
};
const writeFields = {
	...linkFields,
	redirectType: z
		.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)])
		.nullable()
		.optional(),
};
export const ShortioLinkSchema = z
	.object({
		...linkFields,
		originalURL: z.string(),
		path: z.string().nullable(),
		idString: z.string(),
		id: z.string(),
		shortURL: z.string(),
		secureShortURL: z.string(),
		redirectType: z.enum(['301', '302', '307', '308']).optional(),
		FolderId: z.string().nullable().optional(),
		DomainId: z.number().int().optional(),
		OwnerId: z.number().int().optional(),
		hasPassword: z.boolean().optional(),
		User: z
			.object({
				id: z.number().int(),
				name: z.string().nullable(),
				email: z.string(),
				photoURL: z.string().nullable(),
			})
			.loose()
			.optional(),
	})
	.loose();
const domainBase = z
	.object({
		id: z.number().int().min(1),
		hostname: z.string(),
		unicodeHostname: z.string(),
		state: z.enum([
			'extra_records',
			'not_registered',
			'configured',
			'not_configured',
			'registration_pending',
			'not_verified',
		]),
		createdAt: z.string(),
		updatedAt: z.string(),
		TeamId: z.number().int().nullable().optional(),
		hasFavicon: z.boolean(),
		segmentKey: z.string().optional(),
		hideReferer: z.boolean(),
		linkType: z.enum([
			'increment',
			'random',
			'secure',
			'four-char',
			'eight-char',
			'ten-char',
		]),
		cloaking: z.boolean(),
		hideVisitorIp: z.boolean(),
		enableAI: z.boolean(),
		httpsLevel: z.enum(['none', 'redirect', 'hsts']),
		httpsLinks: z.boolean().nullable(),
		redirect404: z.string().optional(),
		webhookURL: z.string().optional(),
		integrationGA: z.string().optional(),
		integrationFB: z.string().optional(),
		integrationAdroll: z.string().optional(),
		integrationGTM: z.string().optional(),
		// Short.io specifies arbitrary values in clientStorage, not a fixed structure.
		clientStorage: z.record(z.string(), z.unknown()),
		caseSensitive: z.boolean(),
		incrementCounter: z.string(),
		robots: z.enum(['allow', 'disallow', 'noindex']),
		sslCertExpirationDate: z.string().optional(),
		sslCertInstalledSuccess: z.boolean().optional(),
		domainRegistrationId: z.number().int().optional(),
		UserId: z.number().int().optional(),
		exportEnabled: z.boolean(),
	})
	.loose();
export const ShortioDomainListItemSchema = domainBase.extend({
	isFavorite: z.boolean(),
});
export const ShortioDomainSchema = domainBase.extend({
	ipExclusions: z.array(z.string()),
	userPlan: z.enum(['tiny', 'hobby', 'small', 'standard', 'large']),
});
const success = z
	.object({ success: z.boolean(), error: z.string().optional() })
	.loose();
const bulk = z.object({
	link_ids: z.array(z.string()).max(150),
	domain_id: z.string().optional(),
});

export const ShortioEndpointInputSchemas = {
	linksList: z.object({
		domain_id: z.number().int().min(1),
		limit: z.number().int().min(1).max(150).nullable().optional(),
		idString: z.string().optional(),
		createdAt: z.string().optional(),
		beforeDate: z.string().optional(),
		afterDate: z.string().optional(),
		dateSortOrder: z.enum(['asc', 'desc']).optional(),
		pageToken: z.string().optional(),
		folderId: z.string().optional(),
	}),
	linksGet: z.object({ linkId, domainId: z.string().optional() }),
	linksExpand: z.object({ domain: z.string(), path: z.string() }),
	linksCreate: z.object({
		...writeFields,
		originalURL: z.string(),
		domain: z.string(),
		allowDuplicates: z.boolean().optional(),
		folderId: z.string().optional(),
	}),
	linksUpdate: z.object({
		linkId,
		domain_id: z.string().optional(),
		body: z
			.object({ ...writeFields, originalURL: z.string().optional() })
			.optional(),
	}),
	linksDelete: z.object({ link_id: deleteLinkId }),
	linksArchive: z.object({
		link_id: z.string(),
		domain_id: z.string().optional(),
	}),
	linksUnarchive: z.object({
		link_id: z.string(),
		domain_id: z.string().optional(),
	}),
	linksArchiveBulk: bulk,
	linksUnarchiveBulk: bulk,
	linksDeleteBulk: bulk.omit({ domain_id: true }),
	domainsList: z.object({
		limit: z.number().int().min(1).max(300).optional(),
		offset: z.number().int().min(0).optional(),
		noTeamId: z.boolean().optional(),
		pattern: z.string().optional(),
		teamId: z.number().optional(),
	}),
	domainsGet: z.object({ domainId: z.number().int().min(1) }),
} as const;

export const ShortioEndpointOutputSchemas = {
	linksList: z
		.object({
			count: z.number().int(),
			links: z.array(ShortioLinkSchema),
			nextPageToken: z.string().nullable().optional(),
		})
		.loose(),
	linksGet: ShortioLinkSchema,
	linksExpand: ShortioLinkSchema,
	linksCreate: ShortioLinkSchema.extend({
		success: z.boolean().optional(),
		duplicate: z.boolean().optional(),
	}),
	linksUpdate: ShortioLinkSchema,
	linksDelete: success.extend({ idString: z.string().optional() }),
	linksArchive: success,
	linksUnarchive: success,
	linksArchiveBulk: success,
	linksUnarchiveBulk: success,
	linksDeleteBulk: success,
	domainsList: z.array(ShortioDomainListItemSchema),
	domainsGet: ShortioDomainSchema,
} as const;

export type ShortioEndpointInputs = {
	[K in keyof typeof ShortioEndpointInputSchemas]: z.infer<
		(typeof ShortioEndpointInputSchemas)[K]
	>;
};
export type ShortioEndpointOutputs = {
	[K in keyof typeof ShortioEndpointOutputSchemas]: z.infer<
		(typeof ShortioEndpointOutputSchemas)[K]
	>;
};

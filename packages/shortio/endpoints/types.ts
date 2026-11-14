import { z } from 'zod';

// These schemas follow the per-operation OpenAPI definitions at developers.short.io.
const segment = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"'?#]/.test(value),
		'Unsafe path segment',
	);
const linkId = segment.regex(/^(?:lnk_\w+|\d+)$/);
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
// Responses are parsed loosely: Short.io leaves unset fields null and may add
// enum values later, and one unexpected field should not fail a whole read.
// Inputs above stay strict.
const respString = z.string().nullish();
const respBool = z.boolean().nullish();
const respNumber = z.number().nullish();
const respTimestamp = z.union([z.string(), z.number()]).nullish();
function openEnum<const T extends readonly [string, ...string[]]>(values: T) {
	return z.union([z.enum(values), z.string()]).nullish();
}
export const ShortioLinkSchema = z
	.object({
		originalURL: z.string(),
		path: z.string().nullable(),
		idString: z.string(),
		id: z.union([z.string(), z.number()]),
		shortURL: z.string(),
		secureShortURL: z.string(),
		cloaking: respBool,
		password: respString,
		expiresAt: respTimestamp,
		expiredURL: respString,
		title: respString,
		tags: z.array(z.string()).nullish(),
		utmSource: respString,
		utmMedium: respString,
		utmCampaign: respString,
		utmTerm: respString,
		utmContent: respString,
		ttl: respTimestamp,
		androidURL: respString,
		iphoneURL: respString,
		createdAt: respTimestamp,
		clicksLimit: respNumber,
		passwordContact: respBool,
		skipQS: respBool,
		archived: respBool,
		splitURL: respString,
		splitPercent: respNumber,
		integrationAdroll: respString,
		integrationFB: respString,
		integrationGA: respString,
		integrationGTM: respString,
		redirectType: z.union([z.string(), z.number()]).nullish(),
		FolderId: respString,
		DomainId: respNumber,
		OwnerId: respNumber,
		hasPassword: respBool,
		User: z
			.object({
				id: respNumber,
				name: respString,
				email: respString,
				photoURL: respString,
			})
			.loose()
			.nullish(),
	})
	.loose();
const domainBase = z
	.object({
		id: z.number().int(),
		hostname: z.string(),
		unicodeHostname: respString,
		state: openEnum([
			'extra_records',
			'not_registered',
			'configured',
			'not_configured',
			'registration_pending',
			'not_verified',
		]),
		createdAt: respString,
		updatedAt: respString,
		TeamId: respNumber,
		hasFavicon: respBool,
		segmentKey: respString,
		hideReferer: respBool,
		linkType: openEnum([
			'increment',
			'random',
			'secure',
			'four-char',
			'eight-char',
			'ten-char',
		]),
		cloaking: respBool,
		hideVisitorIp: respBool,
		enableAI: respBool,
		httpsLevel: openEnum(['none', 'redirect', 'hsts']),
		httpsLinks: respBool,
		redirect404: respString,
		webhookURL: respString,
		integrationGA: respString,
		integrationFB: respString,
		integrationAdroll: respString,
		integrationGTM: respString,
		// Short.io specifies arbitrary values in clientStorage, not a fixed structure.
		clientStorage: z.record(z.string(), z.unknown()).nullish(),
		caseSensitive: respBool,
		incrementCounter: z.union([z.string(), z.number()]).nullish(),
		robots: openEnum(['allow', 'disallow', 'noindex']),
		sslCertExpirationDate: respString,
		sslCertInstalledSuccess: respBool,
		domainRegistrationId: respNumber,
		UserId: respNumber,
		exportEnabled: respBool,
	})
	.loose();
export const ShortioDomainListItemSchema = domainBase.extend({
	isFavorite: respBool,
});
// The stored entity holds fields from both the list and the detail response.
export const ShortioDomainSchema = domainBase.extend({
	isFavorite: respBool,
	ipExclusions: z.array(z.string()).nullish(),
	userPlan: openEnum(['tiny', 'hobby', 'small', 'standard', 'large']),
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

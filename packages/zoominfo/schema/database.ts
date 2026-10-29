import { z } from 'zod';

// Entities mirror what the search and enrich endpoints return, using ZoomInfo's
// own field names from /lookup/outputfields/<resource>. Ids are ZoomInfo's, so
// a record can be re-fetched or re-enriched later from the id alone.
//
// The contact entity follows the *search* response on purpose: ZoomInfo returns
// hasEmail / hasDirectPhone / hasMobilePhone as booleans there and keeps the
// values behind the credit-charging enrich call. Persisting the search shape
// therefore records reachability without copying personal contact details into
// the host database.

const ZoominfoCompanyRef = z.object({
	id: z.number().nullable().optional(),
	name: z.string().nullable().optional(),
});

export const ZoominfoCompany = z.object({
	/** ZoomInfo company id. */
	id: z.union([z.string(), z.number()]),
	name: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	ticker: z.string().nullable().optional(),
	/** Yearly revenue in thousands of USD, per the output-field docs. */
	revenue: z.number().nullable().optional(),
	employeeCount: z.number().nullable().optional(),
	numberOfContactsInZoomInfo: z.number().nullable().optional(),
	phone: z.string().nullable().optional(),
	street: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	companyStatus: z.string().nullable().optional(),
	foundedYear: z.union([z.string(), z.number()]).nullable().optional(),
	logo: z.string().nullable().optional(),
	socialMediaUrls: z.array(z.unknown()).nullable().optional(),
	domainList: z.array(z.string()).nullable().optional(),
	sicCodes: z.array(z.unknown()).nullable().optional(),
	naicsCodes: z.array(z.unknown()).nullable().optional(),
});
export type ZoominfoCompany = z.infer<typeof ZoominfoCompany>;

export const ZoominfoContact = z.object({
	/** ZoomInfo contact id. */
	id: z.union([z.string(), z.number()]),
	firstName: z.string().nullable().optional(),
	middleName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	jobTitle: z.string().nullable().optional(),
	/** Likelihood the contact is reachable and still employed there. */
	contactAccuracyScore: z.number().nullable().optional(),
	hasEmail: z.boolean().nullable().optional(),
	hasSupplementalEmail: z.boolean().nullable().optional(),
	hasDirectPhone: z.boolean().nullable().optional(),
	hasMobilePhone: z.boolean().nullable().optional(),
	validDate: z.coerce.date().nullable().optional(),
	lastUpdatedDate: z.coerce.date().nullable().optional(),
	company: ZoominfoCompanyRef.nullable().optional(),
});
export type ZoominfoContact = z.infer<typeof ZoominfoContact>;

export const ZoominfoIntentSignal = z.object({
	/** ZoomInfo returns a uuid for intent signals rather than a numeric id. */
	id: z.string(),
	category: z.string().nullable().optional(),
	topic: z.string().nullable().optional(),
	/** 60-100. */
	signalScore: z.number().nullable().optional(),
	/** A through E, A being strongest. */
	audienceStrength: z.string().nullable().optional(),
	newSignal: z.boolean().nullable().optional(),
	signalDate: z.coerce.date().nullable().optional(),
	trend: z.number().nullable().optional(),
	company: ZoominfoCompanyRef.nullable().optional(),
});
export type ZoominfoIntentSignal = z.infer<typeof ZoominfoIntentSignal>;

export const ZoominfoNewsArticle = z.object({
	/** News has no ZoomInfo id; the article url is the stable key. */
	id: z.string(),
	url: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	domain: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	pageDate: z.coerce.date().nullable().optional(),
	categories: z.array(z.string()).nullable().optional(),
	/** An article can reference more than one company. */
	companies: z.array(ZoominfoCompanyRef).nullable().optional(),
});
export type ZoominfoNewsArticle = z.infer<typeof ZoominfoNewsArticle>;

export const ZoominfoScoop = z.object({
	/** ZoomInfo scoop id. */
	id: z.union([z.string(), z.number()]),
	description: z.string().nullable().optional(),
	link: z.string().nullable().optional(),
	linkText: z.string().nullable().optional(),
	updateText: z.string().nullable().optional(),
	publishedDate: z.coerce.date().nullable().optional(),
	originalPublishedDate: z.coerce.date().nullable().optional(),
	topics: z.array(z.unknown()).nullable().optional(),
	types: z.array(z.unknown()).nullable().optional(),
	company: ZoominfoCompanyRef.nullable().optional(),
});
export type ZoominfoScoop = z.infer<typeof ZoominfoScoop>;

export const ZoominfoTechnology = z.object({
	/** ZoomInfo technology tag. */
	id: z.string(),
	vendor: z.string().nullable().optional(),
	product: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	categoryParent: z.string().nullable().optional(),
	/** Dotted tag used by the techAttributeTagList search filter. */
	attribute: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	domain: z.string().nullable().optional(),
	logo: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
});
export type ZoominfoTechnology = z.infer<typeof ZoominfoTechnology>;

export const ZoominfoLocation = z.object({
	/** Location rows are keyed by the company id plus the street address. */
	id: z.string(),
	street: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	fax: z.string().nullable().optional(),
	addressStatus: z.string().nullable().optional(),
	subUnitType: z.string().nullable().optional(),
	locationName: z.string().nullable().optional(),
	locationEmployeeCount: z.number().nullable().optional(),
	company: ZoominfoCompanyRef.nullable().optional(),
});
export type ZoominfoLocation = z.infer<typeof ZoominfoLocation>;

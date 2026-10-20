import { z } from 'zod';

// Source: organization object in the Organization Enrichment and Organization
// Search responses, https://docs.apollo.io/openapi/apollo-rest-api.json
export const ApolloOrganization = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	primaryDomain: z.string().nullable().optional(),
	websiteUrl: z.string().nullable().optional(),
	linkedinUrl: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
	estimatedNumEmployees: z.number().nullable().optional(),
	foundedYear: z.number().nullable().optional(),
	country: z.string().nullable().optional(),
	updatedAt: z.coerce.date(),
});

export type ApolloOrganization = z.infer<typeof ApolloOrganization>;

// Source: person object in the People Enrichment and Get Complete Person Info
// responses, https://docs.apollo.io/openapi/apollo-rest-api.json
export const ApolloPerson = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	linkedinUrl: z.string().nullable().optional(),
	organizationId: z.string().nullable().optional(),
	seniority: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	updatedAt: z.coerce.date(),
});

export type ApolloPerson = z.infer<typeof ApolloPerson>;

// Source: news_articles items in the News Articles Search response,
// https://docs.apollo.io/openapi/apollo-rest-api.json
export const ApolloNewsArticle = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	domain: z.string().nullable().optional(),
	organizationIds: z.array(z.string()),
	publishedAt: z.coerce.date().nullable().optional(),
});

export type ApolloNewsArticle = z.infer<typeof ApolloNewsArticle>;

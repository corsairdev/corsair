import type { ApolloContext } from '..';
import type { NewsArticle, Organization, Person } from './types';

// Search results carry fewer fields than enrichment and use null for unknown
// values, so only known values overwrite what an earlier call saved.
function known<T extends object>(fields: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value != null),
	) as Partial<T>;
}

export async function saveOrganizations(
	ctx: ApolloContext,
	organizations: readonly Organization[],
) {
	if (!ctx.db.organizations) return;
	for (const org of organizations) {
		try {
			const existing = await ctx.db.organizations.findByEntityId(org.id);
			await ctx.db.organizations.upsertByEntityId(org.id, {
				...existing?.data,
				...known({
					name: org.name,
					primaryDomain: org.primary_domain,
					websiteUrl: org.website_url,
					linkedinUrl: org.linkedin_url,
					industry: org.industry,
					estimatedNumEmployees: org.estimated_num_employees,
					foundedYear: org.founded_year,
					country: org.country,
				}),
				id: org.id,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save Apollo organization to database:', error);
		}
	}
}

export async function savePerson(ctx: ApolloContext, person: Person) {
	if (ctx.db.people) {
		try {
			const existing = await ctx.db.people.findByEntityId(person.id);
			await ctx.db.people.upsertByEntityId(person.id, {
				...existing?.data,
				...known({
					name: person.name,
					title: person.title,
					linkedinUrl: person.linkedin_url,
					organizationId: person.organization_id,
					seniority: person.seniority,
					city: person.city,
					country: person.country,
				}),
				id: person.id,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save Apollo person to database:', error);
		}
	}
	if (person.organization) {
		await saveOrganizations(ctx, [person.organization]);
	}
}

export async function saveNews(
	ctx: ApolloContext,
	articles: readonly NewsArticle[],
) {
	if (!ctx.db.newsArticles) return;
	for (const article of articles) {
		try {
			await ctx.db.newsArticles.upsertByEntityId(article.id, {
				id: article.id,
				title: article.title,
				url: article.url,
				domain: article.domain,
				organizationIds: article.organization_ids ?? [],
				publishedAt: article.published_at,
			});
		} catch (error) {
			console.warn('Failed to save Apollo news article to database:', error);
		}
	}
}

import type { ApolloContext } from '..';
import type { NewsArticle, Organization, Person } from './types';

export async function saveOrganizations(
	ctx: ApolloContext,
	organizations: readonly Organization[],
) {
	if (!ctx.db.organizations) return;
	try {
		for (const org of organizations) {
			await ctx.db.organizations.upsertByEntityId(org.id, {
				id: org.id,
				name: org.name,
				primaryDomain: org.primary_domain,
				websiteUrl: org.website_url,
				linkedinUrl: org.linkedin_url,
				industry: org.industry,
				estimatedNumEmployees: org.estimated_num_employees,
				foundedYear: org.founded_year,
				country: org.country,
				updatedAt: new Date(),
			});
		}
	} catch (error) {
		console.warn('Failed to save Apollo organizations to database:', error);
	}
}

export async function savePerson(ctx: ApolloContext, person: Person) {
	if (!ctx.db.people) return;
	try {
		await ctx.db.people.upsertByEntityId(person.id, {
			id: person.id,
			name: person.name,
			title: person.title,
			linkedinUrl: person.linkedin_url,
			organizationId: person.organization_id,
			seniority: person.seniority,
			city: person.city,
			country: person.country,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save Apollo person to database:', error);
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
	try {
		for (const article of articles) {
			await ctx.db.newsArticles.upsertByEntityId(article.id, {
				id: article.id,
				title: article.title,
				url: article.url,
				domain: article.domain,
				organizationIds: article.organization_ids ?? [],
				publishedAt: article.published_at,
			});
		}
	} catch (error) {
		console.warn('Failed to save Apollo news to database:', error);
	}
}

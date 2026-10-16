import type { ContextDevEndpoints } from '..';
import { call } from './call';

export const search: ContextDevEndpoints['newsSearch'] = async (ctx, input) => {
	const result = await call(
		ctx,
		'newsSearch',
		'news.search',
		'POST',
		'news/search',
		input,
	);

	if (ctx.db.newsArticles) {
		try {
			for (const article of result.data) {
				await ctx.db.newsArticles.upsertByEntityId(article.id, {
					id: article.id,
					storyId: article.story_id,
					url: article.url,
					title: article.title,
					description: article.description,
					sourceDomain: article.source.domain,
					type: article.type,
					publishedAt: article.published_at,
				});
			}
		} catch (error) {
			console.warn('Failed to save Context.dev news to database:', error);
		}
	}
	return result;
};
